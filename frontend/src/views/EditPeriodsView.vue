<template>
  <div class="flex flex-col w-1/2 m-auto mt-16 gap-4">
    <display-period-component v-for="period of useEventStore().periods.periods" :key="period.name+period.startdate" :period="period"/>
    <button @click="addNewPeriod()" class="w-16 h-16 bg-indigo-600 self-center mt-8 p-2 rounded-md text-5xl font-bold">+</button>
  </div>
</template>
<script setup lang="ts">
import {onBeforeMount, ref} from "vue";
import {useEventStore} from "@/stores/eventstore";
import DisplayPeriodComponent from "@/components/DisplayPeriodComponent.vue";

function addNewPeriod() {
  useEventStore().periods.periods[useEventStore().periods.periods.length] = {
    name: "Nuevo Periodo",
    priority: 1,
    color: "#ffffff",
    startdate: 1,
    enddate: 86400,
    new: true
  }
}
onBeforeMount(() => {
  useEventStore().fetchPeriodsFromApi()
})

</script>
<style scoped>

</style>
