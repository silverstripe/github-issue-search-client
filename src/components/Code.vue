<template>
  <result-card :title="entry.path" :url="entry.html_url">
    <repo v-bind="entry.repository" />
    <code>
      {{ fragments }}
    </code>
  </result-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ResultCard from './ResultCard.vue';
import Repo from './Repo.vue';

export default defineComponent({
  props: {
    entry: {
      type: Object,
      required: true
    }
  },

  data() {
    return {};
  },

  components: {
    ResultCard,
    Repo,
  },

  computed: {
    fragments() {
      if (this.entry.text_matches) {
        return this.entry.text_matches
          .filter(({property}: {property: string}) => property !== 'path')
          .map( ({fragment}: {fragment: string}) => fragment).join("\n");
      }
      return '';
    }
  }
});
</script>

<style scoped>
  code {
    display: block;
  }
</style>
