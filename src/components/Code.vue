<template>
  <result-card :title="entry.path" :url="entry.html_url">
    <repo v-bind="entry.repository" />
    <code>
      {{ fragments }}
    </code>
  </result-card>
</template>

<script>
import ResultCard from './ResultCard.vue';
import Repo from './Repo.vue';

export default {
  props: {
    entry: {
      type: Object
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
          .filter(({property}) => property !== 'path')
          .map( ({fragment}) => fragment).join("\n");
      }
      return '';
    }
  }
};
</script>

<style scoped>
  code {
    display: block;
  }
</style>
