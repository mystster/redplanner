import { Issues, Issue } from './issues';
import { User } from './redmineUser';
import axios, { AxiosInstance } from 'axios';
import { vmx } from '../store';

export class RedmineClient {
  private service: AxiosInstance;
  perPageItemNumber: number;
  constructor() {
    this.perPageItemNumber = 25;
    this.service = axios.create({
      baseURL: vmx.redmine.baseURL,
      timeout: 5000
    });
    this.service.interceptors.request.use((config) => {
      if (config.data) {
        config.headers['Content-Type'] = 'application/json';
        // config.data = {};
      }
      if (vmx.redmine.apiKey) {
        config.headers['X-Redmine-API-Key'] = vmx.redmine.apiKey;
      }
      return config;
    });
    this.service.interceptors.response.use((res) => {
      if (res.status !== 200) {
        // error
        console.dir(res);
      }
      return res;
    });
  }
  public async getLoginUser(): Promise<User> {
    return new User((await this.service.get('/users/current.json')).data);
  }
  /**
   * 指定した条件でIssueを検索する。Open中とClose中の両方を検索。
   * @param option 絞り込みや追加オプション
   */
  public async getIssues(
    option?: string | { [index: string]: any }
  ): Promise<Issues | null> {
    if (!option) {
      option = `status_id=*`;
    } else if (typeof option === 'string') {
      if (option === '') {
        option = `status_id=*`;
      } else {
        // もともとの引数にstatus_idがない場合のみ追記する
        if (!/status_id=/.test(option)) {
          option = option + `&status_id=*`;
        }
      }
    } else {
      // もともとの引数にstatus_idがない場合のみ追記する
      if (option.status_id === undefined) {
        option.status_id = '*';
      }
    }
    const originalOption = option;
    const result: Issues = new Issues(
      (await this.service.get('/issues.json', { params: option })).data
    );
    // 初期limit（25）以上の項目がある場合はページング実施
    // リクエストは非同期で投げるようにすることで、高速化
    if (result.limit < result.total_count) {
      const issueRequested = [];
      for (
        let offset = result.limit;
        offset < result.total_count;
        offset = offset + this.perPageItemNumber
      ) {
        if (typeof option === 'string') {
          option =
            originalOption +
            `&offset=${offset}&limit=${this.perPageItemNumber}`;
        } else {
          option.offset = offset;
          option.limit = this.perPageItemNumber;
        }
        issueRequested.push(
          this.service.get('/issues.json', { params: option })
        );
      }
      (await Promise.all(issueRequested)).forEach(
        (x) => (result.issues = result.issues.concat(new Issues(x.data).issues))
      );
      result.total_count = result.issues.length;
    }
    return result;
  }

  /**
   * チケット情報を更新する
   * @param issue 更新するチケット
   */
  public async updateIssue(issue: Issue): Promise<void> {
    const data = `{"issue":${JSON.stringify(issue).replace(
      /T[0-9:.+]+/g,
      ''
    )}}`;
    await this.service.put(`/issues/${issue.id}.json`, data);
  }

  /**
   * 関連付けられているチケット一覧情報を取得する
   * @param issue 関連付けを取得する元のチケット
   * @param list チケットのキャッシュ
   */
  public async getRelationIssues(
    issue: Issue,
    list?: { [index: number]: Issue }
  ): Promise<Issues | null> {
    if (!issue.relations) {
      // リレーション情報がなければ、念のためチケットを取得して確認
      const ticket = await this.getIssues({ issue_id: issue.id });
      if (!ticket) return null;
      if (!ticket.issues[0].relations) {
        return null;
      } else {
        issue.relations = ticket.issues[0].relations;
      }
    }
    const relationIds = issue.relations.map((v) =>
      v.issue_id !== issue.id ? v.issue_id : v.issue_to_id
    );
    if (!relationIds || relationIds.length === 0) {
      return null;
    } else {
      if (list) {
        const result: Issues = new Issues(null);
        result.issues = [];
        relationIds.forEach((x) => result.issues.push(list[x]));
        result.total_count = result.issues.length;
        return result;
      } else {
        return await this.getIssues({ issue_id: relationIds.join(',') });
      }
    }
  }
}
