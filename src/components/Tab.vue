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
        :label="getTitle(item)"
        :name="item.id"
      >
        <div style="height: calc(100vh - 75px)" :id="item.id">
          {{ item.id }}
          {{ item.type }}
          <issue-component />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { vmx } from '@/store';
import 'vue-class-component/hooks';
import { ElTabPane } from 'element-ui/types/tab-pane';
import IssueComponent from '../components/IssueComponent.vue';
import { TabInfo } from '@/store/tab';

@Component({
  components: {
    IssueComponent
  }
})
export default class Tab extends Vue {
  tabs = vmx.tab;

  handleTabsEdit(name: string | null, action: string | null): void {
    switch (action) {
      case 'add': {
        if (this.tabs.Tabs.length % 2 === 0) {
          this.tabs.AddorUpdateTab('http://redmine/issue/1');
        } else {
          this.tabs.AddorUpdateTab('http://www.google.co.jp');
        }
        break;
      }
      case 'remove': {
        console.log(`${name}, ${action}`);
        if (name != null) this.tabs.RemoveTab(name);
        break;
      }
    }
  }

  handleClick(tab: ElTabPane): void {
    console.dir(tab);
    console.log(`current tab is: ${tab.name}`);
  }

  getTitle(data: TabInfo): string {
    if (data.type === 'issue') {
      return `${data.issue?.id} ${data.issue?.subject}`;
    } else {
      return 'web';
    }
  }
}
</script>
