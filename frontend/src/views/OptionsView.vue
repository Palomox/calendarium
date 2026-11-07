<template>
  <div class="w-full flex justify-center">
    <div class="w-3/4 flex flex-col gap-4">
      <div class="top-16 sticky bg-neutral-900">
        <h1 class="text-7xl text-center font-bold block">Tipos de eventos:</h1>
      </div>
      <display-event-type-component v-for="eventType in useEventStore().eventTypes.event_types" :key="eventType.name" :event-type="eventType"/>
      <button @click="addNewEvent()" class="w-16 h-16 self-center mt-8 p-2 text-5xl regular-button">
        <font-awesome-icon icon="fa-solid fa-plus" />
      </button>
      <div class="top-16 sticky bg-neutral-900">
        <h1 class="text-7xl text-center font-bold block">Periodos:</h1>
      </div>
      <display-period-component v-for="period of useEventStore().periods.periods" :key="period.name+period.startdate" :period="period"/>
      <button @click="addNewPeriod()" class="w-16 h-16 self-center mt-8 p-2 text-5xl regular-button">
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
import DisplayPeriodComponent from "@/components/DisplayPeriodComponent.vue";

function addNewEvent() {
  useEventStore().eventTypes.event_types['Nuevo tipo'] = {
    name: "Nuevo tipo",
    color: "#ffffff",
    prefix: "",
    new: true,
    priority: 1
  }
}
function addNewPeriod() {
  let today = new Date()
  let tomorrow = new Date()
  tomorrow.setDate(today.getDate()+1)

  useEventStore().periods.periods[useEventStore().periods.periods.length] = {
    name: "Nuevo Periodo",
    priority: 1,
    color: "#ffffff",
    startdate: today.getTime()/1000,
    enddate: tomorrow.getTime()/1000,
    new: true
  }
}
onBeforeMount(() => {
  useEventStore().fetchEventTypesFromApi();
  useEventStore().fetchPeriodsFromApi();
})
</script>
<style scoped>

</style>
