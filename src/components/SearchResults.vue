<template>
  <div class="apollo-example">
    <SearchForm v-model="this.formData" @doSearch="setFormData" />

    <!-- Loading -->
    <div v-if="loading && !allResults.edges" class="btn loading apollo">Loading...</div>

    <!-- Error -->
    <div v-else-if="error" class="error apollo">An error occurred.</div>

    <!-- Result -->
    <div v-else-if="['code', 'commits'].indexOf(formData.issueType) === -1 && allResults.edges.length > 0" class="results apollo">
      <h3 class="results__title">
        Search results
        ({{totalCount}}
        {{formData.issueType === 'pr' ? 'pull request' : 'issue'}}{{totalCount > 1 ? 's' : ''}}
        found)
      </h3>
      <ul class="results__list">
        <SearchResult v-for="issue in allResults.edges" :key="issue.id" :issue-data="issue" @labelClicked="setQuery" />
      </ul>
      <div class="results__footer">
        <p class="results__count">Showing {{allResults.edges.length}} of {{totalCount}}</p>
        <button v-if="showShowMore" class="btn" v-bind:disabled="loading == 1" @click="getMoreResults">
          <template v-if="loading == 0">Show More</template>
          <template v-else>Loading More</template>
        </button>
      </div>
    </div>

    <!-- No result -->
    <div v-else class="no-result apollo">No matching results.</div>

  </div>
</template>

<script>
import SearchForm from "./SearchForm";
import SearchResult from "./SearchResult";
import SearchQuery from "../graphql/Search.gql";
import 'url-search-params-polyfill';
import repoGroups from '../repos.json';

export default {
  data() {

    const searchParams = this.getSearchParams();

    return {
      formData: {
        query: searchParams.get('query') || '',
        mode: searchParams.get('mode') || '',
        customRepos: searchParams.get('customRepos') ? searchParams.get('customRepos').split(',') : [],
        includeSupported: searchParams.get('includeSupported') !== '0',
        productTeamMode: searchParams.get('productTeamMode') === '1',
        issueStatus: searchParams.get('issueStatus') || 'open',
        issueType: searchParams.get('issueType') || 'issue',
        sort: searchParams.get('sort') || '',
      },
      loading: 0,
      totalCount: 0,
      allResults: [],
      error: null,
      repoGroups,
      restResults: []
    };
  },

  components: {
    SearchResult,
    SearchForm
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
    setFormData(formData) {
      this.formData = formData
      this.updateURLWithParam()
    },
    setQuery(query) {
      this.formData.query = query
      this.updateURLWithParam()
    },
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
    /**
     * Gets the current URL search params in a structured object
     *
     * @returns {URLSearchParams}
     */
    getSearchParams() {
      return new URLSearchParams(window.location.search);
    },
    /**
     * Update the current URL state to include entered filters and search queries
     */
    updateURLWithParam() {
      let searchParams = this.getSearchParams();
      for (let key in this.formData) {
        const value = this.formData[key];
        if (value === undefined || !value.length) {
          searchParams.delete(key);
        } else {
          searchParams.set(key, value);
        }
      }

      window.history.replaceState({}, '', `${location.pathname}?${searchParams}`);
    }
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
        this.totalCount = data.search.issueCount;
      }
    }
  }
};
</script>

<style scoped>


  .loading {
    background: #efefef;
    max-width: 100px;
    margin: 0 auto;
    text-align: center;
  }

  .error {
    color: red;
  }

  .results__title {
    border-bottom: 1px solid #E1E5ED;
    color: #43536D;
    font-size: 22px;
    margin-bottom: 20px;
    padding-bottom: 15px;
  }

  .results__list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .results__footer {
    margin-bottom: 60px;
    text-align: center;
  }

  .no-result {
    text-align: center;
  }


</style>
