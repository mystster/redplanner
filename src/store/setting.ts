import { createModule } from 'vuex-class-component';

export interface SettingState {
  openNewTabWhenMiddleOrCtrlRight: boolean;
}

const VuexModule = createModule({
  namespaced: 'setting',
  strict: false
});

export class SettingStore extends VuexModule implements SettingState {
  openNewTabWhenMiddleOrCtrlRight = true;
}
