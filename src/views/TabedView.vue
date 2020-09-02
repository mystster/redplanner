<template>
  <div>
    <IssueComponent />
    <Tab />
  </div>
</template>
<script lang="ts">
import Tab from '../components/Tab.vue';
import IssueComponent from '../components/IssueComponent.vue';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
    Tab,
    IssueComponent
  }
})
export default class TabedView extends Vue {}
</script>
<style></style>
