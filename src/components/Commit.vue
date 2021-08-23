<template>
  <li class="result">
    <div class="result__inner" :class="`result__inner--`">
      <h3 class="result__title">
        <a :href="entry.url" class="result__title-link" target="_blank">
          {{ entry.commit.message }}
        </a>
        <span class="result__status" :title="entry.sha">
          {{ entry.sha.slice(0,8) }}
        </span>
      </h3>
      <a :href="entry.repository.html_url" class="result__repository" target="_blank">{{ entry.repository.name }}</a>
      <Committer :committer="entry.author" :date="entry.commit.author.date" />
    </div>
  </li>
</template>

<script>
import Committer from './Committer.vue';

export default {
  props: {
    entry: {
      type: Object
    }
  },

  data() {
    return {};
  },

  components: {
    Committer
  },

  computed: {

  },

  methods: {
    clickLabel(event) {
      event.preventDefault();
      const label = event.target.text.trim();
      this.$emit('labelClicked', `label:${label}`);
    }
  },

  mounted() {
  }
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
</style>
