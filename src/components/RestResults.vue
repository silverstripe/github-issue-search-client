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

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { FormData, RepoGroups } from '@/types';
import Results from "./Results.vue";
import Commit from "./Commit.vue";
import Code from "./Code.vue";
import repoGroups from '../repos.json';
import { Octokit } from "@octokit/rest";
import type {
  GetResponseDataTypeFromEndpointMethod,
} from "@octokit/types";
import debounce from "lodash.debounce";

const octokit = new Octokit()
type CommitSearchResponseDataType = GetResponseDataTypeFromEndpointMethod<
  typeof octokit.rest.search.commits
>;
type CodeSearchResponseDataType = GetResponseDataTypeFromEndpointMethod<
  typeof octokit.rest.search.code
>;

interface Data {
  loading: boolean,
  totalCount: number,
  allResults: (CodeSearchResponseDataType['items'] | CommitSearchResponseDataType['items']),
  error: Error | undefined
  repoGroups: RepoGroups,
  page: number,
  hasMore: boolean,
  debounceSearch: Function,
}

export default defineComponent({
  props: {
    formData: {
      type: Object as PropType<FormData>,
      required: true
    },
    setQuery: Function
  },
  data() {
    return {
      loading: false,
      totalCount: 0,
      allResults: [],
      error: undefined,
      repoGroups,
      page: 1,
      hasMore: false,
      debounceSearch: () => {},
    } as Data;
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

      // TODO Pass this through main.js as props
      const ids = ['core'];
      if (this.formData.includeSupported) {
        ids.push('supported');
      }
      if (this.formData.includeOther) {
        ids.push('other');
      }

      const repos = this.formData.customRepos.length ?
        // Pass in custom list of repos through the URL.
        // This allows repos which aren't in any repo group, so could technically  be used
        // for topics other than Silverstripe modules.
        this.formData.customRepos :
        // Or determine it based on the UI SELECTIONS
        this.repoGroups
          .filter(repoGroup => ids.includes(repoGroup.id))
          .reduce<string[]>((repos, repoGroup) => repos.concat(repoGroup.repos), []);
      const uniqueRepos = [...new Set(repos)]; // filter out duplicates

      return uniqueRepos.map(repo => `repo:${repo}`).join(' ');
    },

    codeOrgQuery() {
      if (!this.repoGroups) {
        // eslint-disable-next-line
        console.error('Repository groups were not defined!');
      }

      // TODO Pass this through main.js as props
      const ids = ['core'];
      if (this.formData.includeSupported) {
        ids.push('supported');
      }
      if (this.formData.includeOther) {
        ids.push('other');
      }

      const repos = this.formData.customRepos.length ?
        // Pass in custom list of repos through the URL.
        // This allows repos which aren't in any repo group, so could technically  be used
        // for topics other than Silverstripe modules.
        this.formData.customRepos :
        // Or determine it based on the UI SELECTIONS
        this.repoGroups
          .filter(repoGroup => ids.includes(repoGroup.id))
          .reduce<string[]>((repos, repoGroup) => repos.concat(repoGroup.repos), [])
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
      this.error = undefined;
      this.page = 1;
      this.doSearch()
    },

    nextPage() {
      this.page++;
      this.doSearch();
    },

    async doSearch() {
      this.loading = false;
      this.error = undefined;

      const {query} = this.formData;
      if (query.trim() === '') {
        return;
      }

      this.loading = true;

      try {
        const response = this.formData.issueType === 'commits' ? await this.commitSearch(query) : await this.codeSearch(query);
        this.process(response);
      } catch (error:any) {
        this.errorHandler(error);
      }
    },

    async commitSearch(query: string) {
      let sort = {};
      if (this.formData.sort === 'created') {
        sort = { sort: 'committer-date' };
      } else if (this.formData.sort === 'created-asc') {
        sort = { sort: 'committer-date',  order: 'asc'};
      }

      return octokit.rest.search.commits({
        q: `${query} ${this.repoQuery} merge:false`,
        ...sort,
        page: this.page
      })
    },

    async codeSearch(query: string) {
      const fullQuery = [query, this.codeOrgQuery];
      const {codeIn, language} = this.formData;
      if (codeIn) {
        fullQuery.push(`in:${codeIn}`);
      }

      if (language) {
        fullQuery.push(`language:${language}`);
      }

      return octokit.rest.search.code({
        q: fullQuery.join(' '),
        page: this.page,
        headers: {
          Accept: 'application/vnd.github.v3.text-match+json'
        },
      })
    },

    process({data}:{data: CommitSearchResponseDataType|CodeSearchResponseDataType}) {
      this.totalCount = data.total_count;
      // TODO No idea what's going on here, the union of two array types should allow concat()
      this.allResults = (this.allResults as []).concat(data.items as []);
      this.loading = false;
      this.hasMore = this.totalCount > this.allResults.length;
    },

    errorHandler(error:Error) {
      this.error = error;
      this.loading = false;
    }
  },

  created() {
    this.debounceSearch = debounce(this.initSearch, 500);
  },

  mounted() {
    this.debounceSearch();
  }
});
</script>

<style scoped>

</style>
