<template>
  <div class="flex flex-col w-1/2 m-auto mt-16 gap-4">
    <display-period-component v-for="period of useEventStore().periods.periods" :key="period.name+period.startdate" :period="period"/>
    <button @click="addNewPeriod()" class="w-16 h-16 self-center mt-8 p-2 text-5xl regular-button">
      <font-awesome-icon icon="fa-solid fa-plus" />
    </button>
  </div>
</template>
<script setup lang="ts">
import {onBeforeMount, ref} from "vue";
import {useEventStore} from "@/stores/eventstore";
import DisplayPeriodComponent from "@/components/DisplayPeriodComponent.vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

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
  useEventStore().fetchPeriodsFromApi()
})

</script>
<style scoped>

</style>
