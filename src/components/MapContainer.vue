<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import {MapCredit} from "../models/MapDefinition.ts";


const props = defineProps<{
  mapUrl: string;
  mapCredit?: MapCredit;
}>();

const storedZoom = localStorage.getItem(`${encodeURIComponent(props.mapUrl)}_zoom`);
const storedCenter = localStorage.getItem(`${encodeURIComponent(props.mapUrl)}_center`);

const zoom = ref(2.5);
const size = ref([0, 0]);
const center = ref([0, 0]);
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

    zoom.value = storedZoom ? parseFloat(storedZoom) : 2.5;
    size.value = [img.width, img.height];
    center.value = storedCenter ? JSON.parse(storedCenter) : [img.width / 2, img.height / 2];
  };
});

const onZoomChange = (e: any) => {
  const zoom = e.target.getZoom();

  if (isNaN(zoom))
    return;

  localStorage.setItem(`${encodeURIComponent(props.mapUrl)}_zoom`, zoom);
};

const onCenterChange = (e: any) => {
  const center = e.target.getCenter();

  if (isNaN(center[0]) || isNaN(center[1]))
    return;

  localStorage.setItem(`${encodeURIComponent(props.mapUrl)}_center`, JSON.stringify(center));
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
      @change:center="onCenterChange"
      @change:resolution="onZoomChange"
    />
    <ol-fullscreen-control />
    <ol-attribution-control />

    <ol-rotate-control />
    <ol-zoom-control />
    <ol-zoomslider-control />
    
    <ol-image-layer id="xkcd">
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