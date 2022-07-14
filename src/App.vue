<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <MapView></MapView>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import MapView from './components/MapView.vue'

export default {
  name: 'App',
  components: {
    MapView
  }
}
</script>

<style>
@import url('~ol/ol.css');
.ol-zoom{
  display: none;
}
html,body{
  padding: 0;
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  padding: 0;
}
</style>
