<script setup lang="ts">

import NavBar from "../components/SideBar.vue";
import HeaderBar from "../components/HeaderBar.vue";
</script>

<template>
  <!-- ===== Page Wrapper Start ===== -->
  <div class="flex h-screen overflow-hidden">
    <!-- ===== Sidebar Start ===== -->
    <NavBar />
    <!-- ===== Sidebar End ===== -->

    <!-- ===== Content Area Start ===== -->
    <div class="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
      <!-- ===== Header Start ===== -->
      <HeaderBar />
      <!-- ===== Header End ===== -->

      <!-- ===== Main Content Start ===== -->
      <main class="flex flex-col flex-1 p-4 md:px-6 md:py-4">
        <slot></slot>
      </main>
      <!-- ===== Main Content End ===== -->
    </div>
  </div>
  <!-- ===== Page Wrapper End ===== -->
</template>

<style scoped>

</style>