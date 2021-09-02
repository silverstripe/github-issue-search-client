<template>
  <div class="apollo-example">
    <SearchForm v-model="formData" @doSearch="setFormData" />
    <component :is="resultsComponent" v-bind:formData="formData" v-bind:setQuery="setQuery" />
  </div>
</template>

<script>
import SearchForm from "./SearchForm";
import ApolloResults from "./ApolloResults";
import RestResults from "./RestResults";
import 'url-search-params-polyfill';

export default {
  data() {
    const searchParams = this.getSearchParams();
    const issueType = searchParams.get('issueType') || 'issue';

    return {
      formData: {
        query: searchParams.get('query') || '',
        mode: searchParams.get('mode') || '',
        customRepos: searchParams.get('customRepos') ? searchParams.get('customRepos').split(',') : [],
        includeSupported: searchParams.get('includeSupported') !== '0',
        productTeamMode: searchParams.get('productTeamMode') === '1',
        issueStatus: searchParams.get('issueStatus') || 'open',
        issueType,
        sort: searchParams.get('sort') || '',
        codeIn: searchParams.get('codeIn') || '',
        language: searchParams.get('language') || '',
      }
    };
  },

  components: {
    SearchForm
  },

  computed: {
    resultsComponent() {
      return ['pr', 'issue'].includes(this.formData.issueType) ? ApolloResults : RestResults;
    }
  },

  methods: {
    setFormData(formData) {
      this.formData = {
        query: formData.query || '',
        mode: formData.mode || '',
        customRepos: formData.customRepos ? formData.customRepos : [],
        includeSupported: formData.includeSupported,
        productTeamMode: formData.productTeamMode,
        issueStatus: formData.issueStatus || 'open',
        issueType: formData.issueType,
        sort: formData.sort || '',
        codeIn: formData.codeIn || '',
        language: formData.language || '',
      };

      this.updateURLWithParam()
    },
    setQuery(query) {
      this.formData.query = query
      this.updateURLWithParam()
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
};
</script>

<style scoped> </style>
