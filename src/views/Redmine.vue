<template>
  <TabBrowser />
</template>
<script lang="ts">
import TabBrowser from '../components/TabBrowser.vue';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
    TabBrowser
  }
})
export default class Redmine extends Vue {}
</script>
<style></style>
