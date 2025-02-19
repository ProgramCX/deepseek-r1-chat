<script setup lang="ts">
import { nextTick } from 'vue';
import Header from './components/Header.vue';
import ChatView from './view/ChatView.vue';

</script>

<template>
  <div id="app">
    <div id="main">
      <Header />
      <ChatView />
    </div>
  </div>
</template>

<style>
@import './style.css';

body,html{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  display: flex;
  flex-direction: row;
}
.el-header {
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    left: 0;
}

#main {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  position: sticky;
  top: 0;
  left: 0;
  height: 100%;
}

</style>
