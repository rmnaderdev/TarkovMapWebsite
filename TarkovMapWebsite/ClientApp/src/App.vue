<script setup lang="ts">
import {RouterView} from "vue-router";
import { IconHome, IconMap } from '@tabler/icons-vue';
import {Maps} from "./maps.ts";
</script>

<template>
  <div class="w-full max-h-screen flex flex-col sm:flex-row flex-wrap sm:flex-nowrap py-4 grow">
    <div class="w-fixed w-full flex-shrink flex-grow-0 px-4 ">
      <div class="sticky top-0 p-4 bg-gray-100 rounded-xl w-full h-full">
        <ul class="flex sm:flex-col overflow-hidden content-center justify-center gap-2">
          <li>
            <RouterLink class="flex py-2 hover:bg-blue-400 rounded" exact-active-class="bg-blue-400" to="/">
              <IconHome class="w-7 sm:mx-2 mx-4 inline" stroke={2} /> <span class="hidden sm:inline">Home</span>
            </RouterLink>
          </li>

          <li v-for="map in Maps" :key="map.name">
            <RouterLink class="flex py-2 hover:bg-blue-400 rounded" exact-active-class="bg-blue-400" :to="map.link">
              <IconMap class="w-7 sm:mx-2 mx-4 inline" stroke={2} /> <span class="hidden sm:inline">{{ map.navLinkName || map.name }}</span>
            </RouterLink>
          </li>
          
        </ul>
      </div>
    </div>

    <main class="w-full flex-shrink flex-grow-0 flex flex-col pt-1 px-3">
      <RouterView/>
    </main>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.router-link-active {
  font-weight: bold;
}

a {
  font-weight: 500;
  color: #242424;
  text-decoration: inherit;
}

</style>
