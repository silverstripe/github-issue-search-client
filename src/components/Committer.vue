<template>
  <div :v-if="committer" class="committer">
    <a :href="committer.html_url">
      <img :src="committer.avatar_url" />
      {{ committer.login }}
    </a>
    commited
    <CommitDate :date="date" />
  </div>
</template>

<script>

import CommitDate from "./CommitDate.vue"

export default {
  props: {
    committer: {
      type: Object
    },
    date: String
  },

  data() {
    return {};
  },

  components: {
    CommitDate
  }
};
</script>

<style scoped>
  .committer {
    display: block;
  }

  .committer a {

    font-weight: bold;
    text-decoration: none;
    color: #43536D;
  }

  .committer a:hover, .committer a:focus {
    text-decoration: underline;
  }

  .committer img {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    vertical-align: middle;
  }
</style>
