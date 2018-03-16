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
          <li v-bind:class="{'tab': true, 'tab__active':(mode == 'ALL')}">
            <a class="tab--title" href="#" @click="setMode('ALL')">All Issues</a>
          </li>
          <li v-bind:class="{'tab': true, 'tab__active':(mode == 'UX')}">
            <a class="tab--title" href="#" @click="setMode('UX')">UX Issues</a>
          </li>
          <li v-bind:class="{'tab': true, 'tab__active':(mode == 'RFC')}">
            <a class="tab--title" href="#" @click="setMode('RFC')">RFCs</a>
          </li>
        </ul>
      </form>
    </div>

    <!-- Apollo watched Graphql query -->
    <ApolloQuery
      :query="require('../graphql/Search.gql')"
      :variables="{ query: compositeQuery }"
    >
      <template slot-scope="{ result: { loading, error, data } }">
        <!-- Loading -->
        <div v-if="loading" class="loading apollo">Loading...</div>

        <!-- Error -->
        <div v-else-if="error" class="error apollo">An error occured</div>

        <!-- Result -->
        <div v-else-if="data" class="results apollo">
          <h3 class="results__title">Search results</h3>
          <ul class="results__list">
            <SearchResult v-for="issue in data.search.nodes" :key="issue.id" :issue-data="issue" />
          </ul>
        </div>

        <!-- No result -->
        <div v-else class="no-result apollo">No result :(</div>
      </template>
    </ApolloQuery>

  </div>
</template>

<script>
import SearchResult from "./SearchResult";

export default {
  data() {
    return {
      query: "",
      submitQuery: "",
      mode: "ALL"
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
          repo:silverstripe/silverstripe-framework repo:silverstripe/silverstripe-cms repo:silverstripe/silverstripe-admin repo:silverstripe/silverstripe-installer repo:silverstripe/silverstripe-asset-admin repo:silverstripe/silverstripe-versioned repo:silverstripe/silverstripe-reports repo:silverstripe/silverstripe-siteconfig repo:silverstripe/silverstripe-assets repo:silverstripe/silverstripe-campaign-admin repo:silverstripe/silverstripe-errorpage repo:silverstripe/silverstripe-graphql repo:silverstripe/recipe-core repo:silverstripe/recipe-plugin repo:silverstripe/recipe-cms
        `;
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
  .message {
    padding: 12px;
  }

  .form {
    font-family: "Helvetica Neue";
    color: #8F9FBA;
    background-color: #eef0f4;
    border-radius: 6px 6px 0 0;
    margin-bottom: 40px;
    padding: 18px 20px 0 20px;
  }

  .searchbar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    background-color: white;
    border: solid 1px #CED3D9;
    border-radius: 3px;
    padding: 3px;
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

  .submit {
    color: white;
    background-color: #0071C4;
    border: 1px solid white;
    border-radius: 3px;
    font-size: 14px;
    line-height: 20px;
    flex-grow: 0;
  }

  .tabs {
    display: flex;
    flex-direction: row;
  }

  .tab {
    padding: 15px;
  }

  .tab--title {
    text-decoration: none;
    color: #43536D;
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
    font-size: 15px;
    margin-bottom: 20px;
    padding-bottom: 15px;
  }

  .results__list {
    list-style: none;
    margin: 0;
    padding: 0;
  }
</style>
