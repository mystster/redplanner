import { action, createModule, mutation } from 'vuex-class-component';
import { nanoid } from 'nanoid';
import { Issue } from '@/lib/issues';
import { RedmineClient } from '@/lib/redmineClient';
import { vmx } from '@/store';
import Axios from 'axios';

export type IssueInfo = {
  id: string;
  type: 'issue';
  issueID: number;
  issue?: Issue;
};

export type WebInfo = {
  id: string;
  type: 'web';
  url: string;
  title?: string;
};

export type TabInfo = IssueInfo | WebInfo;

export interface TabState {
  Tabs: TabInfo[];
  ActiveTabID: string;
}

const VuexModule = createModule({
  namespaced: 'tab',
  strict: false,
  enableLocalWatchers: true
});

export class TabStore extends VuexModule implements TabState {
  private _activeTabID = '';
  private _tabs = new Array<TabInfo>();

  get ActiveTabID(): string {
    return this._activeTabID;
  }
  set ActiveTabID(id: string) {
    if (id !== this._activeTabID) {
      console.log(`old is ${this._activeTabID}, active tab is ${id}`);
      this._activeTabID = id;
    }
  }
  @action async AddorUpdateTab(payload: TabInfo | string): Promise<void> {
    if (typeof payload === 'string') {
      console.log('Add Tab');
      const isIssue = payload.match(
        `${vmx.redmine.baseURL}/?.*/issue/([0-9]+)(/.*)?`
      );
      let t: TabInfo;
      if (isIssue) {
        // IssueInfo
        t = {
          id: nanoid(8),
          type: 'issue',
          issueID: Number.parseInt(isIssue[1])
        };
      } else {
        t = {
          id: nanoid(8),
          type: 'web',
          url: payload
        };
      }
      // load issue
      await this.loadTabInfo(t);

      const index = this._tabs.findIndex((x) => x.id === this._activeTabID);
      index !== -1 ? this._tabs.splice(index + 1, 0, t) : this._tabs.push(t);
      this._activeTabID = t.id;
    } else {
      console.log('Update Tab');
      const index = this._tabs.findIndex((x) => x.id === payload.id);
      if (index !== -1) {
        if (this._tabs.length > 1) {
          this._activeTabID =
            index < this._tabs.length - 1
              ? this._tabs[index + 1].id
              : this._tabs[index - 1].id;
        } else {
          this._activeTabID = '';
        }
        this._tabs.splice(index, 1, payload);
        await this.loadTabInfo(payload);
      }
    }
  }
  @mutation RemoveTab(id: string): void {
    console.log('Remove Tab');

    const index = this._tabs.findIndex((x) => x.id === id);
    if (index !== -1) this._tabs.splice(index, 1);
  }

  get Tabs(): TabInfo[] {
    return this._tabs;
  }

  @action async loadTabInfo(data: TabInfo): Promise<void> {
    if (data.type === 'issue') {
      const client = new RedmineClient();
      const issues = await client.getIssues({ issue_id: data.issueID });
      console.dir(issues);
      data.issue = issues?.issues[0];
    } else {
      const result = await Axios.get(data.url);
      console.dir(result);
    }
  }
}
