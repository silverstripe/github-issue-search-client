<template>
  <result-card
    :title="issueData.node.title"
    :url="issueData.node.url"
    :subTitle="status"
    :class="`issue issue--${statusLower}`">

    <repo v-bind="issueData.node.repository" />

    <div class="issue__labels" v-if="labelsDefined">
      <span class="issue__labels-title">Labels: </span>
      <a
        v-for="label in issueData.node.labels.nodes"
        :key="label.id"
        :style="{ borderColor: `#${label.color}` }"
        href="#"
        @click="clickLabel"
        class="issue__label">
        {{ label.name }}
      </a>
    </div>

    <div class="issue__users">
      <user v-if="issueData.node.author" class="issue__author" v-bind="issueData.node.author">
        opened <AgoDate :date="issueData.node.createdAt" />
      </user>

      <div v-if="participants" class="issue_participants">
        <ul class="issue_participants-list">
          <li v-for="participant in participants" :key="participant.login" :entry="participant">
            <user v-bind="participant" noLabel />
          </li>
        </ul>
      </div>

    </div>

  </result-card>
</template>

<script>
import ResultCard from './ResultCard.vue';
import Repo from './Repo.vue';
import AgoDate from "./AgoDate.vue"
import User from "./User.vue";

export default {
  props: {
    issueData: {
      type: Object
    }
  },

  components: {
    ResultCard,
    Repo,
    AgoDate,
    User
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
      const state = this.issueData.node.state;

      return state.charAt(0) + state.slice(1).toLowerCase();
    },

    /**
     * Helper to lowercase the state of the issue.
     *
     * @return {String}
     */
    statusLower() {
      return this.issueData.node.state.toLowerCase();
    },

    participants() {
      return this.issueData.node.participants.nodes.filter(
        ({login}) => login !== this.issueData.node.author?.login
      );
    },

    /**
     * Helper to check if the issue has labels defined.
     *
     * @return {Boolean}
     */
    labelsDefined() {
      return this.issueData.node.labels.nodes.length > 0;
    },
  },

  methods: {
    clickLabel(event) {
      event.preventDefault();
      const label = event.target.text.trim();
      this.$emit('labelClicked', `label:${label}`);
    }
  }
};
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
