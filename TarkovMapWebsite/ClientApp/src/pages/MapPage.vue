<script setup lang="ts">
import MapContainer from "../components/MapContainer.vue";
import {MapCredit} from "../models/MapDefinition.ts";

const props = defineProps<{
  title: string;
  mapUrl: string;
  credit?: MapCredit;
}>();

</script>

<template>
  <h1 class="page-heading">{{ props.title }}</h1>
  <MapContainer :key="props.title" :map-url="props.mapUrl" :mapCredit="props.credit" />
</template>

<style scoped>
  
</style>