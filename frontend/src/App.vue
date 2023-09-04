<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavbarComponent from "@/components/NavbarComponent.vue";
</script>

<template>
  <navbar-component/>
  <div class="absolute lg:top-16 top-8 right-0 w-full bottom-0 overflow-y-scroll">
    <router-view :key="$route.fullPath"/>
  </div>
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

html{
  @apply bg-zinc-950 text-white overflow-y-hidden;
  scrollbar-width: thin;

}

div{
  scrollbar-width: thin;
}

::-webkit-scrollbar {
  width: 9px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background-color: rgba(155, 155, 155, 0.5);
  border-radius: 20px;
  border: transparent;
}
</style>
