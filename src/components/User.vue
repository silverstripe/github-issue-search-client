<template>
  <div class="user" :class="{ dark: isDark }">
    <a :href="url">
      <img :src="avatarUrlResized" :width="size" :height="size" loading="lazy" :alt="noLabel ? login : ''" />
      {{ noLabel ? '' : login }}
    </a>
    <slot/>
  </div>
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
    login: String,
    avatarUrl: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      default: 20
    },
    noLabel: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {};
  },

  computed: {
    avatarUrlResized() {
      const url = new URL(this.avatarUrl);
      url.searchParams.set('s', String(this.size * 2));
      return url.href;
    }
  }

});
</script>

<style scoped>
  .user {
    display: inline-block;
  }

  .user a {
    font-weight: bold;
    text-decoration: none;
    color: #43536D;
  }

  .dark a{
    color: white;
    font-weight: normal;
  }

  .user a:hover, .user a:focus {
    text-decoration: underline;
  }

  .user img {
    border-radius: 50%;
    vertical-align: middle;
  }
</style>
