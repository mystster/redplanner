<template>
  <div class="tabBrowser" id="tabBrowserPlaceholder">
    <div class="etabs-tabgroup">
      <div class="etabs-tabs"></div>
      <div class="etabs-buttons"></div>
    </div>
    <div class="etabs-views"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import TabGroup from 'electron-tabs';
import { vmx } from '@/store';
import { remote } from 'electron';

@Component
export default class WeatherNow extends Vue {
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped></style>
