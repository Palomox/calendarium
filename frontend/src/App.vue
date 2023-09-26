<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavbarComponent from "@/components/NavbarComponent.vue";
import {useViewStore} from "@/stores/viewstore";
import EditPopupComponent from "@/components/EditPopupComponent.vue";
import EditEventComponent from "@/components/EditEventComponent.vue";
import EditTaskComponent from "@/components/EditTaskComponent.vue";
</script>

<template>
  <div id="navpopuplayer" class="z-[1005] left-0 right-0 top-0 fixed pointer-events-none"/>
  <navbar-component/>
  <div id="popuplayer" class="z-[500] left-0 right-0 top-0 bottom-0 absolute pointer-events-none">
    <edit-popup-component class="pointer-events-auto" v-if="useViewStore().editingPopup != 'none'">
      <edit-event-component :event="useViewStore().editingEvent" v-if="useViewStore().editingPopup == 'event'"/>
      <edit-task-component :task="useViewStore().editingTask" v-if="useViewStore().editingPopup == 'task' "/>
    </edit-popup-component>
  </div>
  <router-view class="lg:mt-16 mt-8 mx-auto" :key="$route.fullPath"/>
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

html{
  @apply bg-zinc-900 text-white;
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
