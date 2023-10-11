<template>
  <Results
    v-bind:loading="$apollo.loading"
    v-bind:results="allResults.edges || []"
    v-bind:error="error"
    v-bind:totalCount="totalCount"
    v-bind:searchType="formData.issueType === 'pr' ? 'pull request' : 'issue'"
    v-bind:hasMore="showShowMore"
    v-bind:getMoreResults="getMoreResults"
    v-bind:setQuery="setQuery">
    <Issue v-for="entry in (allResults.edges || [])" :key="entry?.node?.id" :issue-data="entry?.node" @labelClicked="setQuery" />
  </Results>

</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { SearchResultItemConnection } from "@octokit/graphql-schema";

import Results from "./Results.vue";
import Issue from "./Issue.vue";
import SearchQuery from "../graphql/Search.js";
import { FormData, RepoGroups } from "../types";
import repoGroups from '../repos.json';

type Data = {
  loading: boolean,
  totalCount: number,
  allResults: SearchResultItemConnection,
  error: Error | undefined,
  repoGroups: RepoGroups,
};

export default defineComponent({
  props: {
    formData: {
      type: Object as PropType<FormData>,
      required: true
    },
    setQuery: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      totalCount: 0,
      allResults: {},
      error: undefined,
      repoGroups,
    } as Data;
  },

  components: {
    Results,
    Issue
  },

  computed: {
    modeQuery() {
      const queryModes = {
        ux: 'label:type/ux',
        rfc: 'RFC', // search term
        easy: 'label:complexity/low',
        bugs: 'label:type/bug',
        untriaged: 'is:open is:issue no:label',
      };

      return this.formData.mode ? queryModes[this.formData.mode] : '';
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

    sortQuery() {
        return this.formData.sort ? `sort:${this.formData.sort}` : '';
    },

    /**
     * Returns a query component for filtering issues by their open/closed status. Defaults to
     * only including open issues.
     */
    statusQuery() {
      const queryParts = {
        open: 'is:open',
        closed: 'is:closed',
        all: '',
        '': ''
      };

      return queryParts[this.formData.issueStatus] || queryParts.open;
    },

    /**
     * Returns a query component for filtering issues by their issue/pr state. Defaults to
     * only including open issues.
     */
    typeQuery() {
      const queryParts = {
        issue: 'is:issue',
        pr: 'is:pr',
        code: '',
        commits: '',
        '': '',
      };

      return queryParts[this.formData.issueType] || queryParts.issue;
    },

    compositeQuery(): string {
      return [
        this.formData.query,
        this.modeQuery,
        this.statusQuery,
        this.typeQuery,
        this.repoQuery,
        this.sortQuery
      ].join(' ');
    },

    showShowMore() {
      return this.allResults.pageInfo && this.allResults.pageInfo['hasNextPage'];
    }
  },

  methods: {
    getMoreResults() {
      this.$apollo.queries.allResults.fetchMore({
        variables: {
          query: this.compositeQuery,
          pageCursor: this.allResults.pageInfo['endCursor'],
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const search = {
            search: {
              pageInfo: { ...fetchMoreResult.search.pageInfo },
              issueCount: fetchMoreResult.search.issueCount,
              edges: [...previousResult.search.edges, ...fetchMoreResult.search.edges],
              __typename: previousResult.search.__typename
            }
          };
          return search;
        }
      })
    },
  },

  apollo: {
    allResults: {
      query: SearchQuery,
      variables() {
        return {
          // TODO I believe this is an issue with the VueJS Typescript integration
          // @ts-ignore
          query: this.compositeQuery
        }
      },

      // Bind query loading to component property
      loadingKey: 'loading',

      // When data is returned from query, define which data to assign to allResults
      update(data) {
        return data.search;
      },

      result({ data }) {
        this.totalCount = data ? data.search.issueCount : 0;
      }
    }
  }
});
</script>

<style scoped>

</style>
