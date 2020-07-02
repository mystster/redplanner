import Vue from 'vue';
import Vuex from 'vuex';
import { extractVuexModule, createProxy } from 'vuex-class-component';
import VuexPersistence from 'vuex-persist';
import { RedmineStore, RedmineState } from '@/store/redmine';
Vue.use(Vuex);

export interface State {
  redmine: RedmineState;
}

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
});

export const store = new Vuex.Store<State>({
  modules: {
    ...extractVuexModule(RedmineStore)
  },
  plugins: [vuexLocal.plugin]
});

export const vmx = {
  redmine: createProxy(store, RedmineStore)
};
