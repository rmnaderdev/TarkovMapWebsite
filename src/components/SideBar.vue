<script setup lang="ts">
import {Maps} from "../maps.ts";
import {ref} from "vue";
import {useSidebarStore} from "../stores/sidebar.ts";
import {onClickOutside} from "@vueuse/core";

const sidebarStore = useSidebarStore();

const target = ref(null);

onClickOutside(target, () => {
  sidebarStore.isSidebarOpen = false;
});

</script>

<template>
  <aside
      class="absolute left-0 top-0 z-20 flex h-screen w-72 flex-col overflow-y-hidden bg-gray-800 duration-300 ease-linear"
      :class="{
      'translate-x-0': sidebarStore.isSidebarOpen,
      '-translate-x-full': !sidebarStore.isSidebarOpen
    }"
      ref="target"
  >
    <!-- SIDEBAR HEADER -->
    <div class="flex items-center justify-between text-white gap-2 px-6 py-6">
      <button class="block ml-auto" @click="sidebarStore.isSidebarOpen = false">
        <svg
            class="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
          <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
          />
        </svg>
      </button>
    </div>
    <!-- SIDEBAR HEADER -->

    <div class="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
      <!-- Sidebar Menu -->
      <nav class="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
        <ul class="mb-6 flex flex-col gap-1.5">
          <RouterLink
              class="flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-gray-300 duration-300 ease-in-out hover:text-gray-700"
              exact-active-class="text-white"
              to="/"
          >
            Home
          </RouterLink>
          
          <li v-for="map in Maps" :key="map.name">
            <RouterLink
                class="flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-gray-300 duration-300 ease-in-out hover:text-gray-700"
                exact-active-class="text-white"
                :to="map.link"
            >
              {{ map.navLinkName || map.name }}
            </RouterLink>
          </li>
        </ul>
      </nav>
    </div>
  </aside>
</template>

<style scoped>
</style>