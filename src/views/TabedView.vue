<template>
  <Tab />
</template>
<script lang="ts">
import Tab from '../components/Tab.vue';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
    Tab
  }
})
export default class TabedView extends Vue {}
</script>
<style></style>
