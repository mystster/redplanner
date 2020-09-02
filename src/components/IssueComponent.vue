<template>
  <div v-if="issue">{{ issue.subject }}</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import 'vue-class-component/hooks';
import { RedmineClient } from '@/lib/redmineClient';
import { Issue } from '@/lib/issues';

@Component
export default class IssueComponent extends Vue {
  issue: Issue | null = null;

  async created(): Promise<void> {
    const client = new RedmineClient();
    const issues = await client.getIssues({ issue_id: 1 });
    console.dir(issues);
    this.issue = issues?.issues[0] ?? null;
    console.dir(this.issue);
  }
}
</script>
