<template>
<div class="w-1/2">
  <div class="relative flex flex-col gap-4 mt-32">
    <h1 class="text-7xl text-center font-bold mb-3">Tipos de eventos:</h1>
    <display-event-type-component v-for="eventType in useEventStore().eventTypes.event_types" :key="eventType.name" :event-type="eventType"/>
    <button @click="addNewEvent()" class="w-16 h-16 self-center mt-8 p-2 text-5xl regular-button">
      <font-awesome-icon icon="fa-solid fa-plus" />
    </button>
  </div>
</div>
</template>
<script setup lang="ts">
import {onBeforeMount} from "vue";
import {useEventStore} from "@/stores/eventstore";
import DisplayEventTypeComponent from "@/components/DisplayEventTypeComponent.vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

function addNewEvent() {
  useEventStore().eventTypes.event_types['Nuevo tipo'] = {
    name: "Nuevo tipo",
    color: "#ffffff",
    prefix: "",
    new: true,
    priority: 1
  }
}
onBeforeMount(() => {
  useEventStore().fetchEventTypesFromApi()
})

</script>
<style scoped>

</style>
