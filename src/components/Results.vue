<template>
  <div class="">
    <!-- Loading -->
    <div v-if="loading && ( !results || results.length === 0) " class="btn loading apollo">
      <Loading size="50px" color="#0071C4" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error apollo">An error occurred.</div>

    <!-- Result -->
    <div v-else-if="results.length > 0" class="results apollo">
      <h3 class="results__title">
        Search results
        ({{totalCount}}
        {{searchType}}{{totalCount > 1 ? 's' : ''}}
        found)
      </h3>
      <ul class="results__list">
        <slot />
      </ul>
      <div class="results__footer">
        <p class="results__count">Showing {{results.length}} of {{totalCount}}</p>
        <button v-if="hasMore" class="btn" v-bind:disabled="loading == 1" @click="getMoreResults">
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

import {ThreeDots as Loading} from 'vue-loading-spinner';

export default {
  props: {
    loading: Boolean,
    results: Array,
    error: Object,
    totalCount: Number,
    searchType: String,
    hasMore: Boolean,
    getMoreResults: Function,
    setQuery: Function,
  },
  components: {
    Loading
  }
};
</script>

<style scoped>


  .loading {
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
