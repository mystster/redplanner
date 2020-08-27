import { createModule, action, mutation } from 'vuex-class-component';
import { nanoid } from 'nanoid';

export type TabInfo = {
  id: string;
  url: string;
  type: 'issue' | 'other';
  title?: string;
  issueID?: number;
};
export interface TabState {
  Tabs: TabInfo[];
  ActiveTabID: string;
}

const VuexModule = createModule({
  namespaced: 'tab',
  strict: false,
  enableLocalWatchers: true
});

type PartialOption<O, K extends keyof O> = {
  [P in K]?: O[P];
} &
  Omit<O, K>;

export type PartialIDTabInfo = PartialOption<TabInfo, 'id'>;

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
  @mutation AddorUpdateTab(payload: PartialIDTabInfo): void {
    if (payload.id != undefined) {
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
        this._tabs.splice(index, 1, payload as TabInfo);
      }
    } else {
      console.log('Add Tab');
      const t: TabInfo = {
        id: nanoid(8),
        ...payload
      };
      const index = this._tabs.findIndex((x) => x.id === this._activeTabID);
      index !== -1 ? this._tabs.splice(index, 0, t) : this._tabs.push(t);
      this._activeTabID = t.id;
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
}
