<template>
  <div class="flex flex-col mt-16 items-center w-full gap-7">
    <span class="text-9xl font-bold">CALENDAR</span>
    <span class="text-5xl italic">Loading...</span>
  </div>
</template>
<script setup lang="ts">
import {onMounted} from "vue";
import {useViewStore} from "@/stores/viewstore";
import {onBeforeRouteLeave} from "vue-router";
import router, {refreshPath} from "@/router";

onMounted(() => {
  refreshPath()
})

</script>
<style scoped>

</style>
