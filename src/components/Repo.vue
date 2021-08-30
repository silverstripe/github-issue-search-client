<template>
  <a :href="html_url || url" class="repo" target="_blank">{{ name }}</a>
</template>

<script>

export default {
  props: {
    html_url: String,
    url: String,
    name: String
  },
};
</script>

<style scoped>
  .repo {
    color: #43536D;
    display: inline-block;
    font-size: 15px;
    margin-bottom: 20px;
    margin-right: 10px;
    text-decoration: none;
  }

  .repo:hover {
    text-decoration: underline;
  }
</style>
