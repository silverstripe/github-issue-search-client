<template>
  <li class="result-card">
    <div class="result-card__inner">
      <h3 class="result-card__title">
        <a :href="url" class="result-card__title-link" target="_blank">
          {{ title }}
        </a>
        <span class="result-card__subtitle" :title="subTitleTitle">
          {{ subTitle }}
        </span>
      </h3>
      <slot />
    </div>
  </li>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    url: String,
    title: String,
    subTitle: String,
    statusLower: String,
    subTitleTitle: String
  },

  data() {
    return {};
  },

});
</script>

<style scoped>
  .result-card {
    border-bottom: 1px solid #E1E5ED;
    margin-bottom: 25px;
    padding-bottom: 25px;
  }

  .result-card__inner {
    border-left-style: solid;
    border-left-width: 5px;
    padding-left: 25px;
  }

  .result-card__inner--closed {
    border-left-color: #566B8D;
  }

  .result-card__inner--open {
    border-left-color: #29ABE2;
  }

  .result-card__title {
    font-size: 22px;
    font-weight: 400;
    margin-bottom: 10px;
  }

  .result-card__title-link {
    color: #43536D;
    text-decoration: none;
  }

  .result-card__subtitle {
    display: inline;
    font-size: 15px;
    font-weight: 400;
    margin-left: 10px;
  }

  .result-card__title-link:hover {
    text-decoration: underline;
  }
</style>
