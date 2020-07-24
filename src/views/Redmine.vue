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
export default class App extends Vue {}
</script>
<style>
.etabs-views {
  max-height: calc(100vh - 3.25rem - 33px);
}
</style>
