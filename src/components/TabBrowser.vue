<template>
  <div class="tabBrowser container" id="tabBrowserPlaceholder">
    <div class="etabs-tabgroup">
      <div class="etabs-tabs"></div>
      <b-button type="is-light" icon-left="plus" @click="addTab()"> </b-button>
      <div class="etabs-buttons"></div>
    </div>
    <div class="etabs-views"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import TabGroup, { Tab } from 'electron-tabs';
import { vmx } from '@/store';

@Component
export default class TabBrowser extends Vue {
  private tabGroup: null | TabGroup = null;
  async created() {
    console.log('Vue instance created. load cookie');
    if (vmx.redmine.cookieValue !== '') {
      await window.api.setCookie(
        vmx.redmine.partition,
        vmx.redmine.baseURL,
        vmx.redmine.cookieName,
        vmx.redmine.cookieValue
      );
    }
    window.addEventListener('beforeunload', async () => {
      console.log('beforeunload! Save cookie');
      const redmineCookies = await window.api.getCookies(
        vmx.redmine.partition,
        vmx.redmine.baseURL,
        vmx.redmine.cookieName
      );
      console.dir(redmineCookies);
      if (redmineCookies.length === 1) {
        vmx.redmine.cookieValue = redmineCookies[0].value;
      }
    });
  }
  async mounted() {
    this.tabGroup = new TabGroup();
    this.tabGroup.addTab({
      title: 'Hello',
      src: 'https://www.google.co.jp',
      visible: true
    });
    this.tabGroup.addTab({
      title: 'Hello',
      src: './test.html',
      visible: true
    });
  }

  async addTab(url: string = vmx.redmine.baseURL) {
    if (this.tabGroup === null) return;
    const p = require('path').join(
      'file://',
      await window.api.getMainProcessDir(),
      'tabBrowserPreload.js'
    );
    console.log(p);
    const tab = this.tabGroup.addTab({
      title: url,
      visible: true,
      src: url,
      webviewAttributes: {
        partition: vmx.redmine.partition,
        preload: p
      },
      active: true
    });

    tab.once('webview-dom-ready', (t: Tab) => {
      t.webview.openDevTools();
    });

    tab.webview.addEventListener('ipc-message', (event) => {
      switch (event.channel) {
        case 'open-newtab': {
          console.log(`open new tab with ${event.args[0]}`);
          this.addTab(event.args[0]);
        }
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
