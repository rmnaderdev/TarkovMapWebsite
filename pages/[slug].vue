<template>
  <h1 class="page-heading" v-if="map">{{ map.name }}</h1>
  <MapContainer v-if="map" :key="map.name" :map-url="map.img" :mapCredit="map.credit" />
</template>

<script lang="ts" setup>
import { Maps } from '~/maps';

const route = useRoute();

const mapName = route.params.slug;

const map = Maps.find(m => m.link === mapName);

// If the map is not found, return a 404
if (!map) {
  throw createError({ statusCode: 404, message: 'Map not found' });
}

useHead({
  title: `Map - ${map.name}`
});

</script>

<style>

</style>