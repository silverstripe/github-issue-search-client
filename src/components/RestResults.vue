<template>
  <Results
    v-bind:loading="loading"
    v-bind:results="allResults"
    v-bind:error="error"
    v-bind:totalCount="totalCount"
    v-bind:searchType="this.formData.issueType === 'commits' ? 'commit' : 'file'"
    v-bind:hasMore="false"
    v-bind:getMoreResults="() => {}"
    v-bind:setQuery="setQuery">
    <Commit v-for="entry in allResults" :key="entry.sha" :entry="entry" @labelClicked="setQuery" />
  </Results>
</template>

<script>
import Results from "./Results";
import Commit from "./Commit";
import repoGroups from '../repos.json';
import { Octokit } from "@octokit/rest";
import debounce from "lodash.debounce";

export default {
  props: {
    formData: Object,
    setQuery: Function
  },
  data() {
    return {
      loading: false,
      totalCount: 0,
      allResults: [],
      error: null,
      repoGroups,
      octokit: null,
    };
  },

  components: {
    Results,
    Commit
  },

  computed: {
    repoQuery() {
      if (!this.repoGroups) {
        // eslint-disable-next-line
        console.error('Repository groups were not defined!');
      }

      // See README for "product team mode" explanation.
      // Note that core issues are filtered out from supportedGroups in product team mode,
      // in order to avoid cross-team noise in issue workflows.
      const coreGroups = this.formData.productTeamMode ? ['core-product-team'] : ['core'];
      const supportedGroups = this.formData.productTeamMode ? ['supported-product-team'] : ['core', 'supported'];

      // TODO Pass this through main.js as props
      const ids = this.formData.includeSupported ? supportedGroups : coreGroups;

      const repos = this.formData.customRepos.length ?
        // Pass in custom list of repos through the URL.
        // This allows repos which aren't in any repo group, so could technically  be used
        // for topics other than Silverstripe modules.
        this.formData.customRepos :
        // Or determine it based on the UI SELECTIONS
        this.repoGroups
          .filter(repoGroup => ids.includes(repoGroup.id))
          .reduce((repos, repoGroup) => repos.concat(repoGroup.repos), []);
      const uniqueRepos = [...new Set(repos)]; // filter out duplicates

      return uniqueRepos.map(repo => `repo:${repo}`).join(' ');
    },
  },

  watch: {
    formData: {
      deep: true,
      handler() {
        this.debounceSearch()
      }
    }
  },

  methods: {
    doSearch() {
      this.loading = false;
      this.totalCount = 0;
      this.allResults = [];
      this.error = null;

      const {query} = this.formData;
      if (query.trim() === '') {
        return;
      }

      this.loading = true;
      this.octokit.rest.search.commits({q: `${query} ${this.repoQuery} merge:false`})
        .then(this.process)
        .catch(this.errorHandler)
    },

    process({data}) {
      console.dir(data.items);
      this.totalCount = data.total_count;
      this.allResults=data.items;
      this.loading = false;
    },

    errorHandler(error) {
      console.error(error);
      this.error = error;
      this.loading = false;
    }
  },

  created() {
    this.octokit = new Octokit();
    this.debounceSearch = debounce(this.doSearch, 500);
  },

  mounted() {
    this.debounceSearch();
  }
};
</script>

<style scoped>

</style>
