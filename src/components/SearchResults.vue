<template>
  <div class="apollo-example">
    <SearchForm v-model="formData" @doSearch="setFormData" />
    <component :is="resultsComponent" v-bind:formData="formData" v-bind:setQuery="setQuery" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { FormData } from '@/types';
import SearchForm from "./SearchForm.vue";
import ApolloResults from "./ApolloResults.vue";
import RestResults from "./RestResults.vue";
import 'url-search-params-polyfill';

export default defineComponent({
  props: {
    // Fixes "Property 'formData' does not exist on type 'CreateComponentPublicInstance" - I don't know why :D
    dummy: String
  },
  data() {
    const searchParams = this.getSearchParams();
    const defaults: FormData = {
      query: '',
      mode: '',
      customRepos: [],
      includeSupported: true,
      issueStatus: 'open',
      issueType: 'issue',
      sort: '',
      codeIn: '',
      language: ''
    };

    return {
      defaults,
      formData: {
        query: searchParams.get('query') || defaults.query,
        mode: searchParams.get('mode') || defaults.mode,
        customRepos: searchParams.get('customRepos') ? searchParams.get('customRepos').split(',') : defaults.customRepos,
        includeSupported: searchParams.get('includeSupported') !== '0',
        issueStatus: searchParams.get('issueStatus') || defaults.issueStatus,
        issueType: searchParams.get('issueType') || defaults.issueType,
        sort: searchParams.get('sort') || defaults.sort,
        codeIn: searchParams.get('codeIn') || defaults.codeIn,
        language: searchParams.get('language') || defaults.language,
      } as FormData
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
    setFormData(formData: FormData) {
      this.formData = {
        query: formData.query || '',
        mode: formData.mode || '',
        customRepos: formData.customRepos ? formData.customRepos : [],
        includeSupported: formData.includeSupported,
        issueStatus: formData.issueStatus || 'open',
        issueType: formData.issueType,
        sort: formData.sort || '',
        codeIn: formData.codeIn || '',
        language: formData.language || '',
      };

      this.updateURLWithParam()
    },
    setQuery(query: string) {
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
        let value:any = this.formData[key as keyof FormData];
        // Leave out "=== false" check because that might be needed to override true defaults
        if (value === undefined || value === '' || value === this.defaults[key as keyof FormData]) {
          searchParams.delete(key);
        } else {
          value = (typeof value === 'boolean') ? (value ? '1' : '0') : value;
          searchParams.set(key, value);
        }
      }

      window.history.replaceState({}, '', `${location.pathname}?${searchParams}`);
    }
  },
});
</script>

<style scoped> </style>
