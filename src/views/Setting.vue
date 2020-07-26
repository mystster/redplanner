<template>
  <div>
    <section class="section">
      <div class="subtitle">Redmine Setting</div>
      <b-field label="baseURL" label-position="on-border">
        <b-input v-model="redmine.baseURL"></b-input>
      </b-field>
      <b-field label="Partition" label-position="on-border">
        <b-input v-model="redmine.partition"></b-input>
      </b-field>
      <b-button type="is-warning" @click="clearCookie">Clear Cookie</b-button>
    </section>
    <section class="section">
      <div class="subtitle">General Setting</div>
      <b-checkbox v-model="setting.openNewTabWhenMiddleOrCtrlRight">
        oepnNewTab when middle or ctrl+right click
      </b-checkbox>
    </section>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { vmx } from '@/store';

@Component
export default class Setting extends Vue {
  redmine = vmx.redmine;
  setting = vmx.setting;

  async clearCookie() {
    vmx.redmine.cookieValue = '';
    window.setCookie(
      vmx.redmine.partition,
      vmx.redmine.baseURL,
      vmx.redmine.cookieName,
      vmx.redmine.cookieValue
    );
    this.setting.openNewTabWhenMiddleOrCtrlRight;
  }

  //TODO: すべてのクッキーを消す
}
</script>
