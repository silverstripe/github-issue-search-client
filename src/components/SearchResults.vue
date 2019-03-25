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
          <input type="checkbox" id="checkbox" v-model="includeSupported">
          <label for="checkbox">Include <a href="https://www.silverstripe.org/software/addons/silverstripe-commercially-supported-module-list/" target="_blank" rel="noopener">supported modules</a></label>
        </div>
        <ul class="tabs">
          <li v-bind:class="{'tab': true, 'tab__active': (mode === '')}">
            <a class="tab--title" href="#" @click="setMode('')">All issues</a>
          </li>
          <li v-bind:class="{'tab': true, 'tab__active': (mode === 'ux')}">
            <a class="tab--title" href="#" @click="setMode('ux')">UX issues</a>
          </li>
          <li v-bind:class="{'tab': true, 'tab__active': (mode === 'easy')}">
            <a class="tab--title" href="#" @click="setMode('easy')">Good first issues</a>
          </li>
          <li v-bind:class="{'tab': true, 'tab__active': (mode === 'rfc')}">
            <a class="tab--title" href="#" @click="setMode('rfc')">RFCs</a>
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
import 'url-search-params-polyfill';

export default {
  data() {
    const searchParams = this.getSearchParams();

    return {
      query: searchParams.get('q') || '',
      submitQuery: searchParams.get('q') || '',
      mode: searchParams.get('mode') || 'all',
      includeSupported: true,
      loading: 0,
      allResults: [],
      error: null,
      repoGroups: [{"id":"core","name":"Core","repos":["silverstripe/silverstripe-admin","silverstripe/silverstripe-asset-admin","silverstripe/silverstripe-assets","silverstripe/silverstripe-campaign-admin","silverstripe/silverstripe-cms","silverstripe/silverstripe-config","silverstripe/silverstripe-errorpage","silverstripe/silverstripe-framework","silverstripe/silverstripe-graphql","silverstripe/silverstripe-reports","silverstripe/silverstripe-siteconfig","silverstripe/silverstripe-versioned","silverstripe/silverstripe-versioned-admin"]},{"id":"supported","name":"Supported","repos":["bringyourownideas/silverstripe-maintenance","bringyourownideas/silverstripe-composer-update-checker","bringyourownideas/silverstripe-composer-security-checker","silverstripe/cwp-agencyextensions","silverstripe/cwp","silverstripe/cwp-core","silverstripe/cwp-installer","silverstripe/cwp-pdfexport","silverstripe/cwp-recipe-basic","silverstripe/cwp-recipe-basic-dev","silverstripe/cwp-recipe-blog","silverstripe/cwp-recipe-cms","silverstripe/cwp-recipe-core","silverstripe/cwp-recipe-search","silverstripe/cwp-search","silverstripe/cwp-starter-theme","silverstripe/cwp-watea-theme","silverstripe/cwp-theme-default","dnadesign/silverstripe-elemental","lekoala/silverstripe-debugbar","silverstripe/silverstripe-activedirectory","silverstripe/silverstripe-admin","silverstripe/silverstripe-akismet","silverstripe/silverstripe-asset-admin","silverstripe/silverstripe-assets","silverstripe/silverstripe-auditor","silverstripe/silverstripe-blog","silverstripe/silverstripe-campaign-admin","silverstripe/silverstripe-cms","silverstripe/comment-notifications","silverstripe/silverstripe-comments","silverstripe/silverstripe-config","silverstripe/silverstripe-content-widget","silverstripe/silverstripe-contentreview","silverstripe/silverstripe-controllerpolicy","silverstripe/silverstripe-crontask","silverstripe/silverstripe-dms","silverstripe/silverstripe-dms-cart","silverstripe/silverstripe-documentconverter","silverstripe/silverstripe-elemental-blocks","silverstripe/silverstripe-elemental-bannerblock","silverstripe/silverstripe-elemental-fileblock","silverstripe/silverstripe-environmentcheck","silverstripe/silverstripe-errorpage","silverstripe/eslint-config","silverstripe/silverstripe-externallinks","silverstripe/silverstripe-framework","silverstripe/silverstripe-fulltextsearch","silverstripe/silverstripe-graphql","silverstripe/silverstripe-gridfieldqueuedexport","silverstripe/silverstripe-html5","silverstripe/silverstripe-hybridsessions","silverstripe/silverstripe-iframe","silverstripe/silverstripe-installer","silverstripe/silverstripe-ldap","silverstripe/silverstripe-lumberjack","silverstripe/silverstripe-mimevalidator","silverstripe/silverstripe-postgresql","silverstripe/silverstripe-realme","silverstripe/recipe-authoring-tools","silverstripe/recipe-blog","silverstripe/recipe-cms","silverstripe/recipe-collaboration","silverstripe/recipe-content-blocks","silverstripe/recipe-core","silverstripe/recipe-form-building","silverstripe/recipe-plugin","silverstripe/recipe-reporting-tools","silverstripe/recipe-services","silverstripe/silverstripe-registry","silverstripe/silverstripe-reports","silverstripe/silverstripe-restfulserver","silverstripe/silverstripe-secureassets","silverstripe/silverstripe-securityreport","silverstripe/silverstripe-segment-field","silverstripe/silverstripe-selectupload","silverstripe/silverstripe-sharedraftcontent","silverstripe/silverstripe-siteconfig","silverstripe/silverstripe-sitewidecontent-report","silverstripe/silverstripe-spamprotection","silverstripe/silverstripe-spellcheck","silverstripe/silverstripe-sqlite3","silverstripe/sspak","silverstripe/silverstripe-staticpublishqueue","silverstripe/silverstripe-subsites","silverstripe/silverstripe-tagfield","silverstripe/silverstripe-taxonomy","silverstripe/silverstripe-translatable","silverstripe/silverstripe-upgrader","silverstripe/silverstripe-userforms","silverstripe/vendor-plugin","silverstripe/silverstripe-versioned","silverstripe/silverstripe-versioned-admin","silverstripe/silverstripe-versionfeed","silverstripe/silverstripe-widgets","silverstripe/webpack-config","silverstripe-themes/silverstripe-simple","symbiote/silverstripe-advancedworkflow","symbiote/silverstripe-multivaluefield","symbiote/silverstripe-queuedjobs","symbiote/silverstripe-versionedfiles"]}]
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
      };

      return queryModes[this.mode] || '';
    },

    repoQuery() {
      if (!this.repoGroups) {
        console.error('Repository groups were not defined!');
      }

      // TODO Pass this through main.js as props
      const ids = this.includeSupported ? ['core', 'supported'] : ['core'];

      return this.repoGroups
        .filter(repoGroup => ids.includes(repoGroup.id))
        .reduce((repos, repoGroup) => repos.concat(repoGroup.repos), [])
        .map(repo => `repo:${repo}`)
        .join(' ');
    },

    compositeQuery() {
      return `
          ${this.submitQuery}
          ${this.modeQuery}
          is:open
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

</style>
