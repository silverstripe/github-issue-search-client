<template>
  <Results
    v-bind:loading="loading"
    v-bind:results="[]"
    v-bind:error="error"
    v-bind:totalCount="totalCount"
    v-bind:searchType="'TBD'"
    v-bind:hasMore="false"
    v-bind:getMoreResults="() => {}"
    v-bind:setQuery="setQuery" />
</template>

<script>
import Results from "./Results";
import repoGroups from '../repos.json';

export default {
  props: {
    formData: Object,
    setQuery: Function
  },
  data() {
    return {
      loading: false,
      totalCount: 0,
      allResults: {},
      error: null,
      repoGroups,
    };
  },

  components: {
    Results
  },

  computed: {

  },

  methods: {

  },
};
</script>

<style scoped>

</style>
