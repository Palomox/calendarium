<template>
  <div id="popup" class="relative p-2 bg-zinc-700 inline-block rounded-r-md rounded-b-md">
    <slot/>
  </div>
</template>
<script setup lang="ts">

</script>
<style scoped>
#popup::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  margin-left: -2rem;
  border-width: 1rem;
  border-style: solid;
  border-color: transparent theme('colors.zinc.700') transparent transparent;
}
</style>
