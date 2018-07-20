<template>
  <li class="result">
    <div class="result__inner" :class="`result__inner--${statusLower}`">
      <h3 class="result__title">
        <a :href="issueData.node.url" class="result__title-link" target="_blank">
          {{ issueData.node.title }}
        </a>
        <span class="result__status" :class="`result__status--${statusLower}`">
          {{ status }}
        </span>
      </h3>
      <a :href="issueData.node.repository.url" class="result__repository" target="_blank">{{ issueData.node.repository.name }}</a>
      <span class="result__created">{{ createdNice }}</span>
      <div class="result__labels" v-if="labelsDefined">
        <span class="result__labels-title">Labels: </span>
        <span
          v-for="label in issueData.node.labels.nodes"
          :key="label.id"
          :style="{ borderColor: `#${label.color}` }"
          class="result__label">
          {{ label.name }}
        </span>
      </div>
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
      type: Object
    }
  },

  data() {
    return {};
  },

  computed: {
    /**
     * Helper to capitalize first letter of status and lowercase the rest.
     *
     * @return {String}
     */
    status() {
      const state = this.issueData.node.state;

      return state.charAt(0) + state.slice(1).toLowerCase();
    },

    /**
     * Helper to lowercase the state of the issue.
     *
     * @return {String}
     */
    statusLower() {
      return this.issueData.node.state.toLowerCase();
    },

    /**
     * Helper to format the ISO date to a nicer format.
     *
     * @return {String}
     */
    createdNice() {
      const date = new Date(this.issueData.node.createdAt);

      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    },

    /**
     * Helper to check if the issue has labels defined.
     *
     * @return {Boolean}
     */
    labelsDefined() {
      return this.issueData.node.labels.nodes.length > 0;
    }
  },

  methods: {}
};
</script>

<style scoped>
  .result {
    border-bottom: 1px solid #E1E5ED;
    margin-bottom: 25px;
    padding-bottom: 25px;
  }

  .result__inner {
    border-left-style: solid;
    border-left-width: 5px;
    padding-left: 25px;
  }

  .result__inner--closed {
    border-left-color: #566B8D;
  }

  .result__inner--open {
    border-left-color: #29ABE2;
  }

  .result__title {
    font-size: 22px;
    font-weight: 400;
    margin-bottom: 10px;
  }

  .result__title-link {
    color: #43536D;
    text-decoration: none;
  }

  .result__status {
    display: inline;
    font-size: 15px;
    font-weight: 400;
    margin-left: 10px;
  }

  .result__status--closed {
    color: #6F84A7;
  }

  .result__status--open {
    color: #007FAD;
  }

  .result__title-link:hover {
    text-decoration: underline;
  }

  .result__repository {
    color: #43536D;
    display: inline-block;
    font-size: 15px;
    margin-bottom: 20px;
    margin-right: 10px;
    text-decoration: none;
  }

  .result__repository:hover {
    text-decoration: underline;
  }

  .result__created {
    display: inline-block;
    font-size: 14px;
  }

  .result__labels-title {
    display: inline-block;
    font-size: 15px;
    margin-right: 5px;
  }

  .result__label {
    border-radius: 3px;
    border-style: solid;
    border-width: 2px;
    display: inline-block;
    font-size: 12px;
    font-weight: 400;
    margin: 5px;
    padding: 3px 5px;
  }
</style>
