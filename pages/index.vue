<template>
  <h1 class="page-heading">Home</h1>
  <p>Welcome to a Tarkov map site. It is very much a WIP.</p>
  <p class="mt-3">
    I created this site to make it easier to navigate between Tarkov maps and to have them all in one place. I take no
    credit for the creation of any of these maps. All credit goes to the original map creators.
    <b>You can find a link to their work in the bottom right corner of each map.</b>
  </p>

  <h4 class="text-3xl mt-8">Todo:</h4>
  <div class="pl-6">
    <ul class="list-disc">
      <li class="line-through">Add collapsable nav bar</li>
      <li>Add more options for each location. Dropdown next to location title with maps from different creators.</li>
      <li>Be able to save zoom and position so the pages open to where you left off</li>
      <li class="line-through">Make it look better</li>
      <li class="line-through">Add better nav icons</li>
      <li>Change favicon</li>
      <li>WiKi page links</li>
      <li class="line-through">Profit</li>
    </ul>
  </div>

  <p class="mt-8 font-light">Created by a dude who doesn't want to pay for MapGenie.</p>
</template>

<script lang="ts" setup>

useHead({
  title: "Tarkov Maps",
  meta: [
    { name: "description", content: "A Tarkov map site" }
  ]
})

</script>

<style></style>