<template>
  <result-card
    :title="issueData.title"
    :url="issueData.url"
    :subTitle="status"
    :class="`issue issue--${statusLower}`">

    <template v-if="issueData.repository">
      <repo v-bind="issueData.repository" />
    </template>

    <div class="issue__labels" v-if="labelsDefined && issueData.labels">
      <span class="issue__labels-title">Labels: </span>
      <a
        v-for="label in issueData.labels.nodes"
        :key="label?.id"
        :style="{ borderColor: `#${label?.color}` }"
        href="#"
        @click="clickLabel"
        class="issue__label">
        {{ label?.name }}
      </a>
    </div>

    <div class="issue__users">
      <user v-if="issueData.author" class="issue__author" v-bind="issueData.author">
        opened <AgoDate :date="issueData.createdAt" />
      </user>

      <div v-if="participants" class="issue_participants">
        <ul class="issue_participants-list">
          <!-- This is a weird TS hack, Github's typing is Maybe<User> -->
          <li v-for="participant in participants" :key="participant?.login" :entry="participant">
            <user v-bind="participant" v-if="participant" noLabel />
          </li>
        </ul>
      </div>

    </div>

  </result-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Issue, User as UserType } from "@octokit/graphql-schema";
import ResultCard from './ResultCard.vue';
import Repo from './Repo.vue';
import AgoDate from "./AgoDate.vue"
import User from "./User.vue";

export default defineComponent({
  props: {
    issueData: {
      type: Object as PropType<Issue>,
      required: true
    }
  },

  components: {
    ResultCard,
    Repo,
    AgoDate,
    User
  },

  emits: {
    labelClicked(payload: string) {
      return payload;
    }
  },

  data() {
    return {};
  },

  computed: {
    /**
     * Helper to capitalize first letter of status and lowercase the rest.
     *
     * @return {String}
     */
    status() {
      const state = this.issueData.state;

      return state.charAt(0) + state.slice(1).toLowerCase();
    },

    /**
     * Helper to lowercase the state of the issue.
     *
     * @return {String}
     */
    statusLower() {
      return this.issueData.state.toLowerCase();
    },

    participants() {
      if (!this.issueData.participants || !this.issueData.participants.nodes || !this.issueData.author) {
        return null;
      }

      return (this.issueData.participants.nodes as UserType[]).filter(
        ({login}: {login: string}) => login !== this.issueData.author?.login
      );
    },

    /**
     * Helper to check if the issue has labels defined.
     *
     * @return {Boolean}
     */
    labelsDefined() {
      return (this.issueData.labels && this.issueData.labels.nodes) ? this.issueData.labels.nodes.length > 0 : 0;
    },
  },

  methods: {
    clickLabel(event:Event) {
      event.preventDefault();
      const target = event.target as HTMLAnchorElement;
      const label = target.text.trim();
      this.$emit('labelClicked', `label:${label}`);
    }
  }
});
</script>

<style>
  .issue--closed .result-card__inner {
    border-left-color: #566B8D;
  }

  .issue--open .result-card__inner {
    border-left-color: #29ABE2;
  }

  .issue--closed .result-card__subtitle {
    color: #6F84A7;
  }

  .issue--open .result-card__subtitle {
    color: #007FAD;
  }

  .issue__users {
    display: flex;
    margin-top: 20px
  }

  .issue__author {
    width: 350px;
  }

  .issue_participants-list li {
    display: inline-block;
  }

  .issue_participants-list img {
    margin-left: -5px
  }
</style>

<style scoped>
  .issue__repository {
    color: #43536D;
    display: inline-block;
    font-size: 15px;
    margin-bottom: 20px;
    margin-right: 10px;
    text-decoration: none;
  }

  .issue__repository:hover {
    text-decoration: underline;
  }

  .issue__created {
    display: inline-block;
    font-size: 14px;
  }

  .issue__labels-title {
    display: inline-block;
    font-size: 15px;
    margin-right: 5px;
  }

  .issue__label {
    border-radius: 3px;
    border-style: solid;
    border-width: 2px;
    display: inline-block;
    font-size: 12px;
    font-weight: 400;
    margin: 5px;
    padding: 3px 5px;
    color: inherit;
    text-decoration: none;
  }

  .issue__label:hover {
    text-decoration: underline;
  }
</style>
