<template>
  <div class="form" :class="{ dark: isDark }">
    <form>
      <div class="searchbar" :class="{ dark: isDark }">
        <input
          v-model="data.query"
          placeholder="Search for issue"
          class="input input__query"
        >
        <input type="submit" class="submit" @click.prevent="doSearch()" value="Search" />
      </div>
      <div class="options" :class="{ dark: isDark }">
        <span class="option-filter" v-if="data.customRepos.length">
          Filtering by {{data.customRepos.length}} repos
        </span>
        <label class="option-filter" v-else>
          <input type="checkbox" id="supported-modules" v-model="data.includeSupported" @change="doSearch()" />
          <span v-if="data.productTeamMode">
            Only <a href="https://www.silverstripe.org/software/addons/silverstripe-commercially-supported-module-list/" target="_blank" rel="noopener">supported modules</a>
          </span>
          <span v-else>
            Include <a href="https://www.silverstripe.org/software/addons/silverstripe-commercially-supported-module-list/" target="_blank" rel="noopener">supported modules</a>
          </span>
        </label>

        <select id="issue-type" v-model="data.issueType" aria-label="Issue Type" class="option-filter" @change="handleIssueType">
          <option value="issue">Issues</option>
          <option value="pr">Pull requests</option>
          <option value="code">Code</option>
          <option value="commits">Commits</option>
        </select>

        <select v-if="isIssueOrPr" id="issue-status" v-model="data.issueStatus" aria-label="Issue status" class="option-filter" @change="doSearch()">
          <option value="open">Open</option>
          <option value="closed">Closed</option>
          <option value="all">Open or closed</option>
        </select>

        <select id="sort" v-model="data.sort" aria-label="Sort issues by" class="option-filter" @change="doSearch()">
          <option value="">Best Match</option>
          <option v-if="isIssueOrPr" value="updated">Recently Updated</option>
          <option v-if="isIssueOrPr" value="updated-asc">Least Recently Updated</option>
          <option value="created">Newest</option>
          <option value="created-asc">Oldest</option>
        </select>

        <select v-if="data.issueType === 'code'" id="code-in" v-model="data.codeIn" aria-label="Code in" class="option-filter" @change="doSearch()">
          <option value="">File and path</option>
          <option value="file">File</option>
          <option value="path">Path</option>
        </select>

        <select v-if="data.issueType === 'code'" id="language" v-model="data.language" aria-label="Code language" class="option-filter" @change="doSearch()">
          <option value="">Any language</option>
          <option value="php">PHP</option>
          <option value="javascript">JavaScript</option>
          <option value="css">CSS</option>
          <option value="markdown">Markdown</option>
          <option value="json">JSON</option>
        </select>
      </div>
      <search-form-tabs v-if="isIssueOrPr" :selected="data.mode" :tabs="tabs" @onChange="setMode" />
    </form>
  </div>
</template>

<script setup lang="ts">
import { useDark } from '@vueuse/core';

const isDark = useDark();
</script>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import 'url-search-params-polyfill';
import SearchFormTabs from "./SearchFormTabs.vue";
import { FormData, IssueType, Mode } from '@/types';
import {isGraphqlType} from "../helpers";

export default defineComponent({
  props: {
    modelValue: {
      type: Object as PropType<FormData>,
      required: true,
    },
  },
  data() {
    return {
      data: {} as FormData
    };
  },
  emits: [
    'doSearch'
  ],
  components: {
    SearchFormTabs
  },
  created() {
    this.data = this.modelValue
  },
  updated() {
    this.data = this.modelValue
  },
  computed: {
    tabs() {
      return [
        {value: "", label: "All issues"},
        {value: "bugs", label: "Bugs"},
        {value: "ux", title: "User experience issues", label: "UX issues"},
        {value: "easy", label: "Good first issues"},
        {value: "rfc", title: "Requests For Comments", label: "RFCs"},
        {value: "untriaged", label: "Untriaged"}
      ];
    },
    isIssueOrPr() {
      return isGraphqlType(this.data.issueType);
    }
  },
  methods: {
    setMode(mode:Mode) {
      this.data.mode = mode;
      this.doSearch();
    },
    doSearch() {
      this.$emit('doSearch', this.data)
    },
    handleIssueType(e:Event) {
      const issueType:IssueType = (e.target as HTMLInputElement).value as IssueType;
      if (isGraphqlType(issueType)) {
        this.data.issueType = issueType;
      } else {
        const updateSort = (['updated-asc', 'updated'].includes(this.data.sort));
        this.data = {
          ...this.data,
          issueType,
          issueStatus: '',
          mode: '',
          sort: updateSort ? '' : this.data.sort
        };
      }
      this.doSearch();
    }
  },
});
</script>

<style scoped>
  label {
    color: #43536D;
  }

  .form,
  .input,
  .submit,
  .message,
  .btn {
    padding: 12px;
  }

  .form {
    background-color: #eef0f4;
    border-radius: 6px 6px 0 0;
    color: #43536D;
    font-family: "Helvetica Neue", sans-serif;
    margin-bottom: 40px;
    padding: 18px 20px 0 20px;
    &.dark {
      background-color: inherit;
      border: #eef0f4 1px solid;
    }
  }


  .searchbar {
    background-color: white;
    border: solid 1px #CED3D9;
    border-radius: 3px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 3px;
    width: 100%;
    &.dark {
      background-color: inherit;
    }
  }

  .input {
    font-family: inherit;
    font-size: inherit;
  }

  .input__query {
    border: none;
    flex-grow: 1;
    font-size: 16px;
    font-style: italic;
    line-height: 20px;
  }

  .submit, .btn {
    background-color: #0071C4;
    border: 1px solid white;
    border-radius: 3px;
    color: white;
    cursor: pointer;
    flex-grow: 0;
    font-size: 14px;
    line-height: 20px;
  }

  button:disabled, .btn.loading {
    background-color: #999;
    cursor: wait;
  }

  .options {
    margin: 10px 0;
    padding-bottom: 15px;
    font-size: 0.8em;

    &.dark > label {
      color: #adbac7;
    }
  }

  .option-filter {
    margin-right: 20px;
  }

</style>
