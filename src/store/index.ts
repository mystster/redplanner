import Vue from 'vue';
import Vuex from 'vuex';
import { extractVuexModule, createProxy } from 'vuex-class-component';
import VuexPersistence from 'vuex-persist';
import { RedmineStore, RedmineState } from '@/store/redmine';
import { SettingStore, SettingState } from '@/store/setting';
import { TabStore, TabState } from '@/store/tab';
Vue.use(Vuex);

export interface State {
  redmine: RedmineState;
  setting: SettingState;
  tab: TabState;
}

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
});

export const store = new Vuex.Store<State>({
  modules: {
    ...extractVuexModule(RedmineStore),
    ...extractVuexModule(SettingStore),
    ...extractVuexModule(TabStore)
  },
  plugins: [vuexLocal.plugin]
});

export const vmx = {
  redmine: createProxy(store, RedmineStore),
  setting: createProxy(store, SettingStore),
  tab: createProxy(store, TabStore)
};
