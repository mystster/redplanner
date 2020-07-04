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
      <!-- <HelloWorld /> -->
      <div>
        <div class="etabs-tabgroup">
          <div class="etabs-tabs"></div>
          <div class="etabs-buttons"></div>
        </div>
        <div class="etabs-views"></div>
      </div>
    </v-main>
  </v-app>
</template>
<style src="electron-tabs/electron-tabs.css"></style>
<style scoped>
.etabs-view {
  border: 2px;
}
</style>
<script lang="ts">
import HelloWorld from './components/HelloWorld.vue';
import TabGroup from 'electron-tabs';
import { vmx } from '@/store';
import { remote } from 'electron';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
    // HelloWorld
  }
})
export default class App extends Vue {
  tabGroup = new TabGroup();

  async mounted() {
    const tabGroup = new TabGroup();
    tabGroup.addTab({
      title: 'Hello',
      src: 'https://www.google.co.jp',
      visible: true
    });
    tabGroup.addTab({
      title: 'Hello',
      src: './test.html',
      visible: true
    });
    const redmineTab = tabGroup.addTab({
      title: 'Redmine1',
      // src: 'http://redmine',
      visible: true,
      webviewAttributes: {
        partition: 'persist:redmine'
      },
      active: true
    });

    const setCookeiToRedmineTab = async () => {
      console.log('webviews dom-ready event is fired');
      await remote.session
        .fromPartition('persist:redmine')
        .cookies.remove('http://redmine/', '_redmine_session');
      await remote.session.fromPartition('persist:redmine').cookies.set({
        url: 'http://redmine/',
        name: '_redmine_session',
        value: vmx.redmine.cookie
      });
      await redmineTab.webview.loadURL('http://redmine/');
      redmineTab.webview.openDevTools();
      console.log(`Cookie:${vmx.redmine.cookie}`);
      redmineTab.webview.removeEventListener(
        'dom-ready',
        setCookeiToRedmineTab
      );
    };
    redmineTab.webview.addEventListener('dom-ready', setCookeiToRedmineTab);

    window.addEventListener('beforeunload', async () => {
      console.log('beforeunload!');
      const cookies = remote.session.fromPartition('persist:redmine').cookies;
      const redmineCookie = await cookies.get({
        url: 'http://redmine/',
        name: '_redmine_session'
      });
      console.dir(remote);
      console.dir(redmineCookie);
      if (redmineCookie.length === 1) {
        vmx.redmine.cookie = redmineCookie[0].value;
      }
    });
  }
}
</script>
