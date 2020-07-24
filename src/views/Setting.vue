<template>
  <div>
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            設定
          </h1>
          <h2 class="subtitle">
            xxxxxx
          </h2>
        </div>
      </div>
    </section>
    <section class="is-boader">
      aaaa
    </section>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { vmx } from '@/store';

@Component
export default class Setting extends Vue {
  redmine = vmx.redmine;

  async clearCoookie() {
    vmx.redmine.cookieValue = '';
    window.api.setCookie(
      vmx.redmine.partition,
      vmx.redmine.baseURL,
      vmx.redmine.cookieName,
      vmx.redmine.cookieValue
    );
  }

  //TODO: すべてのクッキーを消す
}
</script>
