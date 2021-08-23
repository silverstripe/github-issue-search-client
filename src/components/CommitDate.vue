<template>
  <span class="commitDate">{{ dateTime }}</span>
</template>

<script>
import RelativeTime from '@yaireo/relative-time'


export default {
  props: {
    date: String
  },

  data() {
    return {};
  },

  computed: {
    dateTime() {
      const relativeTime = new RelativeTime();
      return relativeTime.from(new Date(this.date));
    }
  },
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
