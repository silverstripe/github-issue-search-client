<template>
  <result-card :title="entry.commit ? entry.commit.message : ''" :url="entry.html_url" :subTitle="entry.sha.slice(0,8)" :subTitleTitle="entry.sha">
    <repo v-bind="entry.repository" />
    <user class="commit__user" v-if="entry.author" :url="entry.author.html_url" :login="entry.author.login" :avatarUrl="entry.author.avatar_url">
      commited <AgoDate :date="entry.commit.author.date" />
    </user>

  </result-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ResultCard from './ResultCard.vue';
import Repo from './Repo.vue';
import AgoDate from "./AgoDate.vue"
import User from "./User.vue";

export default defineComponent({
  props: {
    entry: {
      type: Object,
      required: true
    }
  },

  data() {
    return {};
  },

  components: {
    AgoDate,
    ResultCard,
    Repo,
    User
  },

  methods: {
    clickLabel(event:Event) {
      event.preventDefault();
      const target = event.target as HTMLAnchorElement;
      const label = target.text.trim();
      this.$emit('labelClicked', `label:${label}`);
    }
  },
});
</script>

<style scoped>
  .commit__user {
    display: block;
  }
</style>
