<script setup lang="ts">

const props = defineProps<{
  title: string;
  mapUrl: string;
}>();
</script>

<template>
  <h1 class="page-heading">{{props.title}}</h1>
  <img class="w-full" :src="props.mapUrl" alt="Tarkov Map" />
</template>

<style scoped>

</style>