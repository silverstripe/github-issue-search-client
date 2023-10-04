<template>
  <li class="result-card">
    <div class="result-card__inner">
      <h3 class="result-card__title" :class="{ dark: isDark }">
        <a :href="url" class="result-card__title-link" :class="{ dark: isDark }" target="_blank">
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

<script setup lang="ts">
import { useDark } from '@vueuse/core';

const isDark = useDark();
</script>

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
    &.dark {
      color: #adbac7 !important;
    }
  }

  .result-card__subtitle {
    display: inline;
    font-size: 15px;
    font-weight: 400;
    margin-left: 10px;
    &.dark {
      color: white !important;
    }
  }

  .result-card__title-link:hover {
    text-decoration: underline;
  }
</style>
