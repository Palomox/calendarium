<template>
<div class="flex flex-col w-1/2 m-auto mt-16 gap-4">
  <display-event-type-component v-for="eventType in useEventStore().eventTypes.event_types" :key="eventType.name" :event-type="eventType"/>
  <button @click="addNewEvent()" class="w-16 h-16 self-center mt-8 p-2 text-5xl regular-button">
    <font-awesome-icon icon="fa-solid fa-plus" />
  </button>
</div>
</template>
<script setup lang="ts">
import {onBeforeMount, ref} from "vue";
import {useEventStore} from "@/stores/eventstore";
import DisplayEventTypeComponent from "@/components/DisplayEventTypeComponent.vue";
import type {CalendarEventType} from "@/libs/types";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

function addNewEvent() {
  useEventStore().eventTypes.event_types['Nuevo tipo'] = {
    name: "Nuevo tipo",
    color: "#ffffff",
    prefix: "",
    new: true
  }
}
onBeforeMount(() => {
  useEventStore().fetchEventTypesFromApi()
})

</script>
<style scoped>

</style>
