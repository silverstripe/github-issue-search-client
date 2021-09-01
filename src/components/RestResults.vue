<template>
  <Results
    v-bind:loading="loading"
    v-bind:results="allResults"
    v-bind:error="error"
    v-bind:totalCount="totalCount"
    v-bind:searchType="formData.issueType === 'commits' ? 'commit' : 'file'"
    v-bind:hasMore="hasMore"
    v-bind:getMoreResults="nextPage"
    v-bind:setQuery="setQuery">
    <component :is="resultComponent" v-for="entry in allResults" :key="entry.sha" :entry="entry" />
  </Results>
</template>

<script>
import Results from "./Results";
import Commit from "./Commit";
import Code from "./Code";
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
      page: 1,
      hasMore: false
    };
  },

  components: {
    Results
  },

  computed: {

    resultComponent() {
      return this.formData.issueType === 'commits' ? Commit : Code;
    },

    repoQuery() {
      if (!this.repoGroups) {
        // eslint-disable-next-line
        console.error('Repository groups were not defined!');
      }

      // See README for "product team mode" explaination.
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

    codeOrgQuery() {
      if (!this.repoGroups) {
        // eslint-disable-next-line
        console.error('Repository groups were not defined!');
      }

      // See README for "product team mode" explaination.
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
          .reduce((repos, repoGroup) => repos.concat(repoGroup.repos), [])
          .map(repo => repo.replace(/\/.*/, ''));
      const uniqueOrgs = [...new Set(repos)]; // filter out duplicates

      return uniqueOrgs.map(org => `org:${org}`).join(' ');
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
    initSearch() {
      this.totalCount = 0;
      this.allResults = [];
      this.error = null;
      this.page = 1;
      this.doSearch()
    },

    nextPage() {
      this.page++;
      this.doSearch();
    },

    doSearch() {
      this.loading = false;
      this.error = null;

      const {query} = this.formData;
      if (query.trim() === '') {
        return;
      }

      this.loading = true;

      const request = this.formData.issueType === 'commits' ? this.commitSearch(query) : this.codeSearch(query);
      request.then(this.process).catch(this.errorHandler);
    },

    commitSearch(query) {
      let sort = {};
      if (this.formData.sort === 'created') {
        sort = { sort: 'committer-date' };
      } else if (this.formData.sort === 'created-asc') {
        sort = { sort: 'committer-date',  order: 'asc'};
      }

      return this.octokit.rest.search.commits({
        q: `${query} ${this.repoQuery} merge:false`,
        ...sort,
        page: this.page
      })
    },

    codeSearch(query) {
      const fullQuery = [query, this.codeOrgQuery];
      const {codeIn, language} = this.formData;
      if (codeIn) {
        fullQuery.push(`in:${codeIn}`);
      }

      if (language) {
        fullQuery.push(`language:${language}`);
      }

      return this.octokit.rest.search.code({
        q: fullQuery.join(' '),
        page: this.page,
        headers: {
          Accept: 'application/vnd.github.v3.text-match+json'
        },
      })
    },

    process({data}) {
      this.totalCount = data.total_count;
      this.allResults = this.allResults.concat(data.items);
      this.loading = false;
      this.hasMore = this.totalCount > this.allResults.length;
    },

    errorHandler(error) {
      this.error = error;
      this.loading = false;
    }
  },

  created() {
    this.octokit = new Octokit();
    this.debounceSearch = debounce(this.initSearch, 500);
  },

  mounted() {
    this.debounceSearch();
  }
};
</script>

<style scoped>

</style>
