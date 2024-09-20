<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import {MapCredit} from "../models/MapDefinition.ts";


const props = defineProps<{
  mapUrl: string;
  mapCredit?: MapCredit;
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
const imgCopyright = ref(props.mapCredit ? `Map By <a target='_blank' href="${props.mapCredit.creditLink}">${props.mapCredit.creditText}</a>` : null);

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