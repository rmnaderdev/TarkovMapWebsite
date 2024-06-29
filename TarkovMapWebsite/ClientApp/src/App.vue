<script setup lang="ts">
import {RouterView} from "vue-router";
import NavBar from "./components/NavBar.vue";
</script>

<template>
  <div class="w-full max-h-screen flex flex-col sm:flex-row flex-wrap sm:flex-nowrap py-4 grow">
    <NavBar />
    <main class="w-full flex-shrink flex-grow-0 flex flex-col pt-1 px-3">
      <RouterView/>
    </main>
  </div>
</template>

<style scoped>

</style>
