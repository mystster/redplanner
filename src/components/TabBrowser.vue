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
<style lang="scss">
.etabs-tabgroup {
  width: 100%;
  height: 32px;
  background-color: #ccc;
  cursor: default;
  font: caption;
  font-size: 14px;
  -webkit-user-select: none;
  user-select: none;
  display: none;
}

.etabs-tabgroup.visible {
  display: block;
}

.etabs-tabs {
}

.etabs-tab {
  display: none;
  position: relative;
  color: #333;
  height: 22px;
  padding: 6px 8px 4px;
  border: 1px solid #aaa;
  border-bottom: none;
  border-left: none;
  background: linear-gradient(
    to bottom,
    rgba(234, 234, 234, 1) 0%,
    rgba(204, 204, 204, 1) 100%
  );
  font: caption;
  font-size: 14px;
  background-color: #ccc;
  cursor: default;
}

/* Dragula */
.etabs-tab.gu-mirror {
  padding-bottom: 0;
}

.etabs-tab:first-child {
  border-left: none;
}

.etabs-tab.visible {
  display: inline-block;
  float: left;
}

.etabs-tab.active {
  background: #fff;
}

.etabs-tab.flash {
  background: linear-gradient(
    to bottom,
    rgba(255, 243, 170, 1) 0%,
    rgba(255, 227, 37, 1) 100%
  );
}

.etabs-buttons {
  float: left;
}

.etabs-buttons button {
  float: left;
  color: #333;
  background: none;
  border: none;
  font-size: 12px;
  margin-top: 6px;
  border-radius: 2px;
  margin-left: 4px;
  width: 20px;
  text-align: center;
  padding: 4px 0;
}

.etabs-buttons button:hover {
  color: #eee;
  background-color: #aaa;
}

.etabs-tab-badge {
  position: absolute;
  right: 0;
  top: -7px;
  background: red;
  border-radius: 100%;
  text-align: center;
  font-size: 10px;
  padding: 0 5px;
}

.etabs-tab-badge.hidden {
  display: none;
}

.etabs-tab-icon {
  display: inline-block;
  height: 16px;
}

.etabs-tab-icon img {
  max-width: 16px;
  max-height: 16px;
}

.etabs-tab-title {
  display: inline-block;
  margin-left: 10px;
}

.etabs-tab-buttons {
  display: inline-block;
  margin-left: 10px;
}

.etabs-tab-buttons button {
  display: inline-block;
  color: #333;
  background: none;
  border: none;
  width: 20px;
  text-align: center;
  border-radius: 2px;
}

.etabs-tab-buttons button:hover {
  color: #eee;
  background-color: #aaa;
}

.etabs-views {
  position: relative;
  border-top: 1px solid #aaa;
  height: calc(100vh - 33px);
}

.etab-view {
  position: relative;
}
</style>
