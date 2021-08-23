<template>
  <span class="commitDate" :title="date">{{ ago }}</span>
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
    ago() {
      const relativeTime = new RelativeTime();
      return relativeTime.from(new Date(this.date));
    }
  },
};
</script>

<style scoped>

</style>
