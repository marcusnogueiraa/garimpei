<template>
  <div id="app">
    <router-view />
    <LoginRequired :show="loginRequired" @close="loginRequired = false"  />
  </div>
</template>

<script lang="ts" setup>
import { ref} from 'vue';
import { useAuthGuard } from '@/composables/useAuthGuard';
import LoginRequired from '@/components/loginRequired.vue';

const { loginRequired } = useAuthGuard();


</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
