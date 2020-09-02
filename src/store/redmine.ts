import { createModule } from 'vuex-class-component';

export interface RedmineState {
  cookieValue: string;
  apiKey: string;
  baseURL: string;
  partition: string;
  cookieName: string;
}

const VuexModule = createModule({
  namespaced: 'redmine',
  strict: false
});

export class RedmineStore extends VuexModule implements RedmineState {
  // state
  // proxy auto create getter, mutation and action
  apiKey = '';
  cookieValue = '';
  baseURL = 'http://redmine';

  get partition(): string {
    return 'persist:redmine';
  }
  get cookieName(): string {
    return '_redmine_session';
  }
}
