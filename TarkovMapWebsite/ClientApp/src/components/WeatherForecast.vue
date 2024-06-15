<script setup lang="ts">

import {ref, onMounted, defineProps, watch} from 'vue';
import { WeatherForecast as Forecast } from "../models/WeatherForecast.ts";

const props = defineProps<{ days: number }>();

const forecasts = ref<Forecast[]>([]);

const updateForecast = async (d: number) => {
  const response = await fetch(`api/WeatherForecast?days=${d}`);
  forecasts.value = await response.json() as Forecast[];
  console.log(forecasts.value);
}

onMounted(async () => {
  await updateForecast(props.days);
});

// Update the count when the days prop changes
watch(() => props.days, (newValue, oldValue) => {
  console.log(`days changed to ${newValue} from ${oldValue}`);
  updateForecast(newValue);
});

</script>

<template>
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>TemperatureC</th>
        <th>TemperatureF</th>
        <th>Summary</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="forecast in forecasts" :key="forecast.date">
        <td>{{ forecast.date }}</td>
        <td>{{ forecast.temperatureC }}</td>
        <td>{{ forecast.temperatureF }}</td>
        <td>{{ forecast.summary }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>

</style>