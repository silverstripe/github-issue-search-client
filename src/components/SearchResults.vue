<template>
  <div class="apollo-example">
    <!-- Cute tiny form -->
    <div class="form">
      <input
        v-model="query"
        placeholder="Search for issues"
        class="input"
      >
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
        <div v-else-if="data" class="result apollo">
          <ul>
            <li v-for="issue in data.search.nodes">
              {{ issue.title }}
            </li>
          </ul>
        </div>

        <!-- No result -->
        <div v-else class="no-result apollo">No result :(</div>
      </template>
    </ApolloQuery>

  </div>
</template>

<script>
export default {
  data() {
    return {
      query: ""
    };
  },

  computed: {
    compositeQuery() {
      return `${
        this.query
      } is:open is:issue repo:silverstripe/silverstripe-framework repo:silverstripe/silverstripe-cms repo:silverstripe/silverstripe-admin repo:silverstripe/silverstripe-installer repo:silverstripe/silverstripe-asset-admin repo:silverstripe/silverstripe-versioned repo:silverstripe/silverstripe-reports repo:silverstripe/silverstripe-siteconfig repo:silverstripe/silverstripe-assets repo:silverstripe/silverstripe-campaign-admin repo:silverstripe/silverstripe-errorpage repo:silverstripe/silverstripe-graphql repo:silverstripe/recipe-core repo:silverstripe/recipe-plugin repo:silverstripe/recipe-cms`;
    }
  },

  methods: {}
};
</script>

<style scoped>
.form,
.input,
.apollo,
.message {
  padding: 12px;
}

.input {
  font-family: inherit;
  font-size: inherit;
  border: solid 2px #ccc;
  border-radius: 3px;
}

.error {
  color: red;
}
</style>