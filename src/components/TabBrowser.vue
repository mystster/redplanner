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
export default class TabBrowser extends Vue {
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
      visible: true,
      src: vmx.redmine.baseURL,
      webviewAttributes: {
        partition: vmx.redmine.partition
      },
      active: true
    });
    const setCookieToRedmineTab = async () => {
      console.log('webviews dom-ready event is fired');
      await remote.session
        .fromPartition(vmx.redmine.partition)
        .cookies.remove(vmx.redmine.baseURL, vmx.redmine.cookieSession);
      await remote.session.fromPartition(vmx.redmine.partition).cookies.set({
        url: vmx.redmine.baseURL,
        name: vmx.redmine.cookieSession,
        value: vmx.redmine.cookie
      });
      await redmineTab.webview.loadURL(vmx.redmine.baseURL);
      redmineTab.webview.openDevTools();
      console.log(`Cookie:${vmx.redmine.cookie}`);
      redmineTab.webview.removeEventListener(
        'dom-ready',
        setCookieToRedmineTab
      );
    };
    redmineTab.webview.addEventListener('dom-ready', setCookieToRedmineTab);

    window.addEventListener('beforeunload', async () => {
      console.log('beforeunload!');
      const cookies = remote.session.fromPartition(vmx.redmine.partition)
        .cookies;
      const redmineCookie = await cookies.get({
        url: vmx.redmine.baseURL,
        name: vmx.redmine.cookieSession
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
