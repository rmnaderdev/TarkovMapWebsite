<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";


const props = defineProps<{
  title: string;
  mapUrl: string;
}>();

const zoom = ref(2.5);
const size = ref([0, 0]);
const center = computed(() => [size.value[0] / 2, size.value[1] / 2]);
const extent = computed(() => [0, 0, ...size.value]);
const projection = reactive({
  code: "xkcd-image",
  units: "pixels",
  extent: extent
});
const image = ref<string | null>(null);
const imgCopyright = ref("Map By <a target='_blank' href=\"http://www.re3mr.com\">RE3MR</a>");

onMounted(() => {
  const img = new Image();
  img.src = props.mapUrl;
  img.onload = () => {
    image.value = props.mapUrl;
    size.value = [img.width, img.height];
  };
});

const onZoomChange = (e: any) => {
  console.log("Zoom Changed", e);
};

</script>

<template>
  <h1 class="page-heading">{{ props.title }}</h1>
  <!--  <img class="object-contain" :src="props.mapUrl" alt="Tarkov Map" />-->

  <ol-map v-if="image"
    :loadTilesWhileAnimating="true"
    :loadTilesWhileInteracting="true"
    class="w-full flex-1"
          @change='(e: any) => console.log("Changed", e)'
  >
    <ol-view
      ref="view"
      :center="center"
      :zoom="zoom"
      :projection="projection"
    />
    <ol-fullscreen-control />
    <ol-attribution-control />

    <ol-rotate-control />
    <ol-zoom-control @change="onZoomChange" />
    <ol-zoomslider-control />
    
    <ol-image-layer id="xkcd" @change="onZoomChange">
      <ol-source-image-static
        :url="image"
        :imageSize="size"
        :imageExtent="extent"
        :projection="projection"
        :attributions="imgCopyright"
      ></ol-source-image-static>
    </ol-image-layer>
  </ol-map>
</template>

<style scoped>

</style>