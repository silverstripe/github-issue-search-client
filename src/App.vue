<template>
  <div id="app">
    <div class="logo">
      <img src="logo.png" class="logo--img" alt="Elvis Bug Tracker" />
    </div>
    <SearchResults/>
  </div>
</template>

<script>
import SearchResults from "./components/SearchResults.vue";

export default {
  name: "app",
  components: {
    SearchResults
  }
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
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
</style>
