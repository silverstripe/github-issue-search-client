<template>
  <li class="result">
    <h3 class="result__title">
      <a :href="issueData.url" target="_blank">
        {{ issueData.title }}
      </a>
    </h3>
    <dl>
      <dt>Status</dt>
      <dd>{{ issueData.state }}</dd>
      <dt>Created</dt>
      <dd>{{ issueData.createdAt }}</dd>
      <dt>Repository</dt>
      <dd><a :href="issueData.repository.url" target="_blank">{{ issueData.repository.name }}</a></dd>
    </dl>
  </li>
</template>

<script>
  /**
   * Data mockup:
   *
   * createdAt: "2018-03-15T14:08:41Z"
   * id: "MDU6SXNzdWUzMDU1NjczNzU="
   * labels: {nodes: [], __typename: "LabelConnection"}
   * state: "OPEN"
   * title: "[Recoverable Error] Argument 1 passed to SilverStripe\Config\MergeStrategy\Priority::mergeArray() must be of the type array"
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
