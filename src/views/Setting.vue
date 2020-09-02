<template>
  <div>
    <el-form ref="redmine" :model="redmine" label-width="120px">
      <el-form-item label="baseURL">
        <el-input v-model="redmine.baseURL"></el-input>
      </el-form-item>
      <el-form-item label="apiKey">
        <el-input v-model="redmine.apiKey"></el-input>
      </el-form-item>
      <el-form-item label="Partition">
        <el-input v-model="redmine.partition"></el-input>
      </el-form-item>
      <el-button @click="clearCookie">Clear Cookie</el-button>
    </el-form>
    <el-form ref="setting" :model="setting">
      <el-checkbox v-model="setting.openNewTabWhenMiddleOrCtrlRight">
        oepnNewTab when middle or ctrl+right click
      </el-checkbox>
    </el-form>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { vmx } from '@/store';

@Component
export default class Setting extends Vue {
  redmine = vmx.redmine;
  setting = vmx.setting;

  async clearCookie(): Promise<void> {
    vmx.redmine.cookieValue = '';
    await window.setCookie(
      vmx.redmine.partition,
      vmx.redmine.baseURL,
      vmx.redmine.cookieName,
      vmx.redmine.cookieValue
    );
  }
}
</script>
