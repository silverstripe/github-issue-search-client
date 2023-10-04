<template>
  <ul class="tabs">
    <li v-for="tab in tabs" :key="tab.value" v-bind:class="{'tab': true, 'tab__active': (selected === tab.value)}">
      <a class="tab--title" :class="{ dark: isDark }" href="#" @click="onChange(tab.value)" :title="tab.title">{{ tab.label }}</a>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { useDark } from '@vueuse/core';

const isDark = useDark();
</script>

<script lang="ts">
import { defineComponent, PropType } from 'vue';


export type Tab = {
  title?: string,
  value: string,
  label: string,
};

export default defineComponent({
  props: {
    tabs: {
      type: Array as PropType<Tab[]>,
      required: true
    },
    selected: String,
  },
  emits: [
    'onChange'
  ],
  data() {
    return {
      data: { }
    };
  },
  methods: {
    onChange(value: string) {
      this.$emit('onChange', value);
    }
  },
});
</script>

<style scoped>
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .tabs {
    display: flex;
    flex-direction: row;
  }

  .tab {
    padding: 0 15px 15px 15px;
  }

  .tab--title {
    color: #43536D;
    text-decoration: none;

    &.dark {
      color: #adbac7;
    }
  }

  .tab__active {
    border-bottom: 5px solid #0171c4;
  }

</style>
