<template>
  <li class="result">
    <h3 class="result__title">
      <a :href="issueData.url" target="_blank">
        {{ issueData.title }}
      </a>
    </h3>
    <dl class="result__details">
      <dt>Status</dt>
      <dd>{{ issueData.state }}</dd>
      <dt>Created</dt>
      <dd>{{ issueData.createdAt }}</dd>
      <dt>Repository</dt>
      <dd><a :href="issueData.repository.url" target="_blank">{{ issueData.repository.name }}</a></dd>
    </dl>
    <div class="result__labels">
      <span
        v-for="label in issueData.labels.nodes"
        :key="label.id"
        :style="{ borderColor: `#${label.color}` }"
        class="result__label"
      >
        {{ label.name }}
      </span>
    </div>
  </li>
</template>

<script>
  /**
   * Data mockup:
   *
   * createdAt: "2018-03-15T14:08:41Z",
   * id: "MDU6SXNzdWUzMDU1NjczNzU=",
   * labels: {
   *   nodes: [
   *     0: {id: "MDU6TGFiZWwzODYzMTYwNDE=", name: "affects/v4", color: "5319e7", __typename: "Label"},
   *     ...
   *   ],
   *   __typename: "LabelConnection"
   * },
   * state: "OPEN",
   * title: "[Recoverable Error] Argument 1 passed to SilverStripe\Config\MergeStrategy\Priority::mergeArray() must be of the type array",
   * url: "https://github.com/silverstripe/silverstripe-framework/issues/7938"
   */
  export default {
    props: {
      issueData: {
        type: Object,
      },
    },

    data() {
      return {};
    },

    computed: {

    },

    methods: {

    },
  }
</script>

<style scoped>
  .result__label {
    border-style: solid;
    border-width: 1px;
    display: inline-block;
    font-weight: 700;
    margin: 5px;
    padding: 5px 10px;
  }
</style>
