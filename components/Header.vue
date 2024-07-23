<template>
  <header class="sticky top-0 z-10 flex w-full bg-gray-600 drop-shadow-1 duration-300 ease-linear">
    <div class="flex flex-grow items-center justify-between py-4 px-4 shadow-2 md:px-6 2xl:px-11">
      <div class="flex items-center gap-2 sm:gap-4">
        <!-- Hamburger Toggle BTN -->
        <button class="" @click="() => sidebar.toggleSidebar()">
          <IconMenu2 stroke={2} class="w-8 h-8" />
        </button>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { IconMenu2 } from "@tabler/icons-vue";

const sidebar = useSidebarStore();
</script>

<style></style>