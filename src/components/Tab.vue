<template>
  <div>
    <el-tabs
      v-model="tabs.ActiveTabID"
      editable=""
      @edit="handleTabsEdit"
      @tab-click="handleClick"
      type="border-card"
    >
      <el-tab-pane
        v-for="item in tabs.Tabs"
        :key="item.id"
        :label="item.title"
        :name="item.id"
      >
        <div style="height: calc(100vh - 75px);" :id="item.id">
          {{ item.id }}
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { vmx } from '@/store';
import 'vue-class-component/hooks';
import { PartialIDTabInfo } from '@/store/tab';
import { ElTabPane } from 'element-ui/types/tab-pane';

@Component
export default class Tab extends Vue {
  tabs = vmx.tab;

  async handleTabsEdit(
    name: string | null,
    action: string | null
  ): Promise<void> {
    switch (action) {
      case 'add': {
        const t: PartialIDTabInfo = {
          url: 'aaaa',
          type: 'issue',
          title: 'abc',
          issueID: 122
        };
        await this.tabs.AddorUpdateTab(t);
        break;
      }
      case 'remove': {
        console.log(`${name}, ${action}`);
        if (name != null) await this.tabs.RemoveTab(name);
        break;
      }
    }
  }

  handleClick(tab: ElTabPane): void {
    console.dir(tab);
    console.log(`current tab is: ${tab.name}`);
  }
}
</script>
