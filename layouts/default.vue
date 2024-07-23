<template>
  <div class="flex flex-col min-h-screen max-h-screen">
    <!-- ===== Page Wrapper Start ===== -->
    <div class="flex h-screen overflow-hidden">
      <!-- ===== Sidebar Start ===== -->
      <Sidebar />
      <!-- ===== Sidebar End ===== -->

      <!-- ===== Content Area Start ===== -->
      <div class="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <!-- ===== Header Start ===== -->
        <Header />
        <!-- ===== Header End ===== -->

        <!-- ===== Main Content Start ===== -->
        <main class="flex flex-col flex-1 p-4 md:px-6 md:py-4">
          <slot></slot>
        </main>
        <!-- ===== Main Content End ===== -->
      </div>
    </div>
    <!-- ===== Page Wrapper End ===== -->
  </div>
</template>

<script lang="ts" setup>



</script>

<style scoped></style>