<template>
  <div class="apollo-example">
    <!-- Cute tiny form -->
    <div class="form">
      <form>
        <div class="searchbar">
          <input
            v-model="query"
            placeholder="Search for issue"
            class="input input__query"
          >
          <input type="submit" class="submit" @click.prevent="onClick" value="Search" />
        </div>
        <div class="options">
          <label class="option-filter">
            <input type="checkbox" id="supported-modules" v-model="includeSupported" @change="setSupportedModules()">
            <span v-if="productTeamMode">
              Only <a href="https://www.silverstripe.org/software/addons/silverstripe-commercially-supported-module-list/" target="_blank" rel="noopener">supported modules</a>
            </span>
            <span v-else>
              Include <a href="https://www.silverstripe.org/software/addons/silverstripe-commercially-supported-module-list/" target="_blank" rel="noopener">supported modules</a>
            </span>
          </label>
          <select id="issue-status" v-model="issueStatus" aria-label="Issue status" class="option-filter" @change="setIssueStatus()">
            <option value="open">Open issues</option>
            <option value="closed">Closed issues</option>
            <option value="all">Open and closed</option>
          </select>
        </div>
        <ul class="tabs">
          <li v-bind:class="{'tab': true, 'tab__active': (mode === '')}">
            <a class="tab--title" href="#" @click="setMode('')">All issues</a>
          </li>
          <li v-bind:class="{'tab': true, 'tab__active': (mode === 'bugs')}">
            <a class="tab--title" href="#" @click="setMode('bugs')">Bugs</a>
          </li>
          <li v-bind:class="{'tab': true, 'tab__active': (mode === 'ux')}">
            <a class="tab--title" title="User experience issues" href="#" @click="setMode('ux')">UX issues</a>
          </li>
          <li v-bind:class="{'tab': true, 'tab__active': (mode === 'easy')}">
            <a class="tab--title" href="#" @click="setMode('easy')">Good first issues</a>
          </li>
          <li v-bind:class="{'tab': true, 'tab__active': (mode === 'rfc')}">
            <a class="tab--title" title="Requests For Comments" href="#" @click="setMode('rfc')">RFCs</a>
          </li>
          <li v-bind:class="{'tab': true, 'tab__active': (mode === 'untriaged')}">
            <a class="tab--title" href="#" @click="setMode('untriaged')">Untriaged</a>
          </li>
        </ul>
      </form>
    </div>

    <!-- Loading -->
    <div v-if="loading && !allResults.edges" class="btn loading apollo">Loading...</div>

    <!-- Error -->
    <div v-else-if="error" class="error apollo">An error occurred.</div>

    <!-- Result -->
    <div v-else-if="allResults.edges.length > 0" class="results apollo">
      <h3 class="results__title">Search results</h3>
      <ul class="results__list">
        <SearchResult v-for="issue in allResults.edges" :key="issue.id" :issue-data="issue" />
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
import SearchResult from "./SearchResult";
import SearchQuery from "../graphql/Search.gql";
import 'url-search-params-polyfill';
import repoGroups from '../repos.json';

export default {
  data() {
    const searchParams = this.getSearchParams();

    return {
      query: searchParams.get('q') || '',
      submitQuery: searchParams.get('q') || '',
      mode: searchParams.get('mode') || '',
      includeSupported: searchParams.get('supported') !== '0',
      productTeamMode: searchParams.get('product-team-mode') === '1',
      issueStatus: searchParams.get('status') || 'open',
      loading: 0,
      totalCount: 0,
      allResults: [],
      error: null,
      repoGroups,
    };
  },

  components: {
    SearchResult
  },

  computed: {
    modeQuery() {
      const queryModes = {
        ux: 'label:type/ux',
        rfc: 'RFC', // search term
        easy: 'label:effort/easy',
        bugs: 'label:type/bug',
        untriaged: 'is:open is:issue -label:Epic -label:type/docs -label:type/ux -label:type/bug -label:type/enhancement -label:effort/easy -label:effort/medium -label:effort/hard -label:impact/critical -label:impact/high -label:impact/medium -label:impact/low -label:rfc/draft -label:rfc/accepted',
      };

      return queryModes[this.mode] || '';
    },

    repoQuery() {
      if (!this.repoGroups) {
        // eslint-disable-next-line
        console.error('Repository groups were not defined!');
      }

      // See README for "product team mode" explanation.
      // Note that core issues are filtered out from supportedGroups in product team mode,
      // in order to avoid cross-team noise in issue workflows.
      const coreGroups = this.productTeamMode ? ['core-product-team'] : ['core'];
      const supportedGroups = this.productTeamMode ? ['supported-product-team'] : ['core', 'supported'];

      // TODO Pass this through main.js as props
      const ids = this.includeSupported ? supportedGroups : coreGroups;

      const repos = this.repoGroups
        .filter(repoGroup => ids.includes(repoGroup.id))
        .reduce((repos, repoGroup) => repos.concat(repoGroup.repos), []);
      const uniqueRepos = [...new Set(repos)]; // filter out duplicates

      return uniqueRepos.map(repo => `repo:${repo}`).join(' ');
    },

    /**
     * Returns a query component for filtering issues by their open/closed status. Defaults to
     * only including open issues.
     */
    statusQuery() {
      const queryParts = {
        all: ' ',
        open: 'is:open',
        closed: 'is:closed',
      };

      return queryParts[this.issueStatus] || queryParts.Open;
    },

    compositeQuery() {
      return `
          ${this.submitQuery}
          ${this.modeQuery}
          ${this.statusQuery}
          is:issue
          ${this.repoQuery}
        `;
    },

    showShowMore() {
      return this.allResults.pageInfo && this.allResults.pageInfo['hasNextPage'];
    }
  },

  methods: {
    /**
     * Form submission handler that will update the `submitQuery` state that
     * the `<ApolloQuery>` component is watching to make the API requests.
     *
     * @return {void}
     */
    onClick() {
      this.submitQuery = this.query;
      this.updateURLWithParam('q', this.query);
    },
    setMode(mode) {
      this.mode = mode;
      this.updateURLWithParam('mode', this.mode);
    },
    setSupportedModules() {
      this.updateURLWithParam('supported', this.includeSupported ? '1' : '0');
    },
    setIssueStatus() {
      this.updateURLWithParam('status', this.issueStatus);
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
     *
     * @param {string} key
     * @param {string} value
     */
    updateURLWithParam(key, value) {
      let searchParams = this.getSearchParams();
      if (!value.length) {
        searchParams.delete(key);
      } else {
        searchParams.set(key, value);
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
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  label {
    color: #43536D;
  }

  .form,
  .input,
  .submit,
  .message,
  .btn {
    padding: 12px;
  }

  .form {
    background-color: #eef0f4;
    border-radius: 6px 6px 0 0;
    color: #8F9FBA;
    font-family: "Helvetica Neue", sans-serif;
    margin-bottom: 40px;
    padding: 18px 20px 0 20px;
  }

  .searchbar {
    background-color: white;
    border: solid 1px #CED3D9;
    border-radius: 3px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 3px;
    width: 100%;
  }

  .loading {
    background: #efefef;
    max-width: 100px;
    margin: 0 auto;
    text-align: center;
  }

  .input {
    font-family: inherit;
    font-size: inherit;
  }

  .input__query {
    border: none;
    flex-grow: 1;
    font-size: 16px;
    font-style: italic;
    line-height: 20px;
  }

  .submit, .btn {
    background-color: #0071C4;
    border: 1px solid white;
    border-radius: 3px;
    color: white;
    cursor: pointer;
    flex-grow: 0;
    font-size: 14px;
    line-height: 20px;
  }

  button:disabled, .btn.loading {
    background-color: #999;
    cursor: wait;
  }

  .options {
    margin: 10px 0;
    font-size: 0.8em;
  }

  .tabs {
    display: flex;
    flex-direction: row;
  }

  .tab {
    padding: 15px;
  }

  .tab--title {
    color: #43536D;
    text-decoration: none;
  }

  .tab__active {
    border-bottom: 5px solid #0171c4;
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

  .option-filter {
    margin-right: 20px;
  }

</style>
