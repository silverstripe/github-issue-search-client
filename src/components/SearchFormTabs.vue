<template>
  <ul class="tabs">
    <li v-for="tab in tabs" :key="tab.value" v-bind:class="{'tab': true, 'tab__active': (selected === tab.value)}">
      <a class="tab--title" href="#" @click="onChange(tab.value)" :title="tab.title">{{ tab.label }}</a>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    tabs: {
      type: Array,
      required: true
    },
    selected: String
  },
  data() {
    return {
      data: { }
    };
  },
  methods: {
    onChange(value) {
      this.$emit('onChange', value);
    }
  },
};
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
  }

  .tab__active {
    border-bottom: 5px solid #0171c4;
  }

</style>
