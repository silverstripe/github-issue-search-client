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
    <Issue v-for="entry in (allResults.edges || [])" :key="entry.id" :issue-data="entry" @labelClicked="setQuery" />
  </Results>

</template>

<script>
import Results from "./Results";
import Issue from "./Issue";
import SearchQuery from "../graphql/Search.gql";
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
    Results,
    Issue
  },

  computed: {
    modeQuery() {
      const queryModes = {
        ux: 'label:type/ux',
        rfc: 'RFC', // search term
        easy: 'label:effort/easy',
        bugs: 'label:type/bug',
        untriaged: 'is:open is:issue -label:Epic -label:type/docs -label:type/ux -label:type/bug -label:type/enhancement -label:effort/easy -label:effort/medium -label:effort/hard -label:impact/critical -label:impact/high -label:impact/medium -label:impact/low -label:rfc/draft -label:rfc/accepted -label:feedback-required/author',
      };

      return queryModes[this.formData.mode] || '';
    },

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
      };

      return queryParts[this.formData.issueType] || queryParts.issue;
    },

    compositeQuery() {
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
};
</script>

<style scoped>

</style>
