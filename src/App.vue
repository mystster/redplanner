<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <HelloWorld />
    </v-main>
    <div>
      <div class="etabs-tabgroup">
        <div class="etabs-tabs"></div>
        <div class="etabs-buttons"></div>
      </div>
      <div class="etabs-views"></div>
    </div>
  </v-app>
</template>
<style src="electron-tabs/electron-tabs.css"></style>
<style scoped>
.etabs-view {
  border: 2px;
}
</style>
<script lang="ts">
import Vue from 'vue';
import HelloWorld from './components/HelloWorld.vue';
import TabGroup from 'electron-tabs';
import { vmx } from '@/store';

export default Vue.extend({
  name: 'App',

  components: {
    HelloWorld
  },

  data: () => ({
    //
  }),
  mounted: () => {
    const tabGroup = new TabGroup();
    tabGroup.addTab({
      title: 'Hello',
      src: 'https://www.google.co.jp',
      visible: true,
      active: true
    });
    tabGroup.addTab({
      title: 'Hello',
      src: './test.html',
      visible: true
    });
    tabGroup.addTab({
      title: 'Redmine1',
      src: 'http://redmine',
      visible: true
    });
    tabGroup.addTab({
      title: 'Redmine2',
      src: 'http://redmine',
      visible: true
    });
    console.log(`Cookie:${vmx.redmine.cookie}`);
    vmx.redmine.cookie = 'aaaaa';
  }
});
</script>
