<script setup lang="ts">
import { ref } from 'vue'
import WeatherForecast from "./WeatherForecast.vue";

defineProps<{ msg: string }>()

const count = ref(1)
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <input type="number" v-model="count" min="1" />
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>
  
  <WeatherForecast :days="count" />
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
