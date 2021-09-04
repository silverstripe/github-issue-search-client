<template>
  <span class="agoDate" :title="date">{{ ago }}</span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { formatRelative } from 'date-fns'


export default defineComponent({
  props: {
    date: {
      type: String
    }
  },

  data() {
    return {};
  },

  computed: {
    ago() {
      return this.date ? formatRelative(new Date(this.date), new Date()) : null;
    }
  },
});
</script>

<style scoped>

</style>
