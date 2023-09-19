<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavbarComponent from "@/components/NavbarComponent.vue";
import {useViewStore} from "@/stores/viewstore";
import EditPopupComponent from "@/components/EditPopupComponent.vue";
import EditEventComponent from "@/components/EditEventComponent.vue";
import EditTaskComponent from "@/components/EditTaskComponent.vue";
</script>

<template>
  <navbar-component/>
  <edit-popup-component v-if="useViewStore().editingPopup != 'none'">
    <edit-event-component :event="useViewStore().editingEvent" v-if="useViewStore().editingPopup == 'event'"/>
    <edit-task-component :task="useViewStore().editingTask" v-if="useViewStore().editingPopup == 'task' "/>
  </edit-popup-component>
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

input{
  @apply text-black;
}

.close-button {
  @apply bg-red-600 rounded-md hover:bg-red-700;
}

.regular-button {
  @apply bg-indigo-600 hover:bg-indigo-700 rounded-md;
}
.save-button {
  @apply bg-emerald-600 hover:bg-emerald-700 rounded-md;
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
