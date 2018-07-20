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
        <ul class="tabs">
          <li v-bind:class="{'tab': true, 'tab__active': (mode === 'ALL')}">
            <a class="tab--title" href="#" @click="setMode('ALL')">All Issues</a>
          </li>
          <li v-bind:class="{'tab': true, 'tab__active': (mode === 'UX')}">
            <a class="tab--title" href="#" @click="setMode('UX')">UX Issues</a>
          </li>
          <li v-bind:class="{'tab': true, 'tab__active': (mode === 'RFC')}">
            <a class="tab--title" href="#" @click="setMode('RFC')">RFCs</a>
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

export default {
  data() {
    return {
      query: "",
      submitQuery: "",
      mode: "ALL",
      loading: 0,
      allResults: [],
      error: null
    };
  },

  components: {
    SearchResult
  },

  computed: {
    modeQuery() {
      let query = "";

      if (this.mode === "ALL") {
        query = "";
      } else if (this.mode === "UX") {
        query = "label:type/ux";
      } else if (this.mode === "RFC") {
        query = "RFC"; // search term
      } else {
        query = `Unknown mode: ${this.mode}`;
      }

      return query;
    },

    compositeQuery() {
      return `
          ${this.submitQuery}
          ${this.modeQuery}
          is:open
          is:issue
          repo:silverstripe/silverstripe-framework repo:silverstripe/silverstripe-cms
          repo:silverstripe/silverstripe-admin repo:silverstripe/silverstripe-installer
          repo:silverstripe/silverstripe-asset-admin repo:silverstripe/silverstripe-versioned
          repo:silverstripe/silverstripe-reports repo:silverstripe/silverstripe-siteconfig
          repo:silverstripe/silverstripe-assets repo:silverstripe/silverstripe-campaign-admin
          repo:silverstripe/silverstripe-errorpage repo:silverstripe/silverstripe-graphql
          repo:silverstripe/recipe-core repo:silverstripe/recipe-plugin repo:silverstripe/recipe-cms
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
    },
    setMode(mode) {
      this.mode = mode;
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
              edges: [...previousResult.search.edges, ...fetchMoreResult.search.edges],
              __typename: previousResult.search.__typename
            }
          };
          return search;
        }
      })
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

</style>
