import { createModule, mutation, action } from 'vuex-class-component';

export interface RedmineState {
  cookie: string;
}

const VuexModule = createModule({
  namespaced: 'redmine',
  strict: false
});

export class RedmineStore extends VuexModule implements RedmineState {
  // state
  // proxy auto create getter, mutation and action
  cookie = '';
  baseURL = 'http://redmine';

  get partition(): string { return 'persist:redmine'; }
  get cookieSession(): string { return '_redmine_session';}
  // mutation
  @mutation
  private setCookieMutation(value: string) {
    this.cookie = value;
  }

  @action
  public async SetCookie(Value: string) {
    this.setCookieMutation(Value);
  }
}
