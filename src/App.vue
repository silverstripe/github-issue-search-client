<template>
  <div id="app">
    <div class="container">
      <div class="logo">
        <img src="logo.png" class="logo--img" alt="Elvis Bug Tracker" />
      </div>
      <DarkModeToggle/>
      <SearchResults/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import 'vue-loaders/dist/vue-loaders.css';
import SearchResults from "./components/SearchResults.vue";
import DarkModeToggle from './components/DarkModeToggle.vue';

export default defineComponent({
  name: "app",
  components: {
    DarkModeToggle,
    SearchResults
},
  created() {
    document.title = 'SilverStripe GitHub Issues';
  }
});
</script>

<style>
  html.dark {
    color-scheme: dark;
  }

  .dark {
    color: #adbac7;
  }

  #app {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #43536D;
    margin-top: 60px;
  }

  .logo {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-bottom: 50px;
  }

  .logo--img {
      width: 112px;
      height: 101px;
  }

  .sponsor-logo {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 1em;
  }

  .container {
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;
  }

  @media (min-width: 576px) {
    .container {
      max-width: 540px;
    }
  }

  @media (min-width: 768px) {
    .container {
      max-width: 720px;
    }
  }

  @media (min-width: 992px) {
    .container {
      max-width: 960px;
    }
  }

  @media (min-width: 1200px) {
    .container {
      max-width: 1140px;
    }
  }
</style>
