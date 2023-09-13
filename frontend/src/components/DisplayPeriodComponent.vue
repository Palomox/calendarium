<template>
  <div class="bg-zinc-700 rounded-md p-4 flex">
    <div class="flex flex-col gap-2">
      <div>
        <span v-if="!editing" v-text="period.name" class="text-2xl font-bold mr-2"/>
        <div v-else>
          <label class="mr-2">Nombre: </label>
          <input v-model="period.name" type="text" class="text-black p-1 rounded-md">
        </div>
      </div>
      <div>
        <span v-if="!editing" v-text="'Color: '+period.color" :style="'color: '+period.color+';'" class="text-xl mr-2" />
        <div class="flex flex-row gap-2" v-else>
          <label>Color: </label>
          <input v-model="period.color" type="text" class="text-black p-1 rounded-md">
          <input v-model="period.color" type="color" class="rounded-md">
        </div>
      </div>
      <div>
        <span v-if="!editing" v-text="'Inicio: '+new Date(period.startdate*1000).toLocaleDateString()" class="text-xl mr-2" />
        <div v-else>
          <label class="mr-2">Inicio: </label>
          <input hidden v-model="period.startdate" type="text" class="text-black p-1 rounded-md">
          <input @change="changeStartDate((<any>$event).target.value)" type="date" class="text-black rounded-md p-1">
        </div>
      </div>
      <div>
        <span v-if="!editing" v-text="'Final: '+new Date(period.enddate*1000).toLocaleDateString()" class="text-xl mr-2" />
        <div v-else>
          <label class="mr-2">Final: </label>
          <input hidden v-model="period.enddate" type="text" class="text-black p-1 rounded-md">
          <input @change="changeEndDate((<any>$event).target.value)" type="date" class="text-black rounded-md p-1">
        </div>
      </div>


    </div>
    <button v-if="!editing" @click="editing = true" class="ml-8 bg-indigo-400 p-2 rounded-md text-black h-min">Editar</button>
    <button v-if="editing" @click="saveType()" class="ml-8 bg-emerald-600 p-2 rounded-md text-black h-min">Guardar</button>

    <button v-if="editing" @click="deleteType()" class="w-16 h-16 bg-red-600 ml-auto p-2 rounded-md text-5xl font-bold">x</button>
  </div>
</template>
<script setup lang="ts">

import type {CalendarPeriod} from "@/libs/types";
import axios from "axios";
import {apiPath, useEventStore} from "@/stores/eventstore";
import {useToast} from "vue-toastification";
import {onBeforeMount, ref} from "vue";


const props = defineProps<{
  period: CalendarPeriod
}>()

const toasts = useToast()

let editing = ref(false)

let period = ref<CalendarPeriod>(Object.assign({}, props.period))

let isNew = ref(false)

onBeforeMount(() => {
  if(period.value.new != undefined) {
    isNew.value = true
    editing.value = true
  }
})

function changeStartDate(date: any){
  let split = (<string>date).split("-");
  for(let i of split){
    console.log(Number(i))

  }
  let dateObject = new Date(0, 0, 0, 0, 0, 0, 0)
  dateObject.setUTCFullYear(Number(split[0]), Number(split[2])-1, Number(split[1]))
  console.log(dateObject.getTime())
}

function changeEndDate(date: any) {
  console.log(date)
}

function saveType() {
  axios.post(apiPath+"periods", {
    name: period.value.name,
    color: period.value.color,
    startDate: period.value.startdate,
    endDate: period.value.enddate,
    priority: period.value.priority
  }, {
    withCredentials: true
  }).then(response => {
    editing.value = false
    toasts.success("Periodo modificado con éxito")
    useEventStore().fetchPeriodsFromApi()
  }).catch(error => {
    toasts.error(error.message)
  })
}
function deleteType(){
  if(isNew.value){
    delete useEventStore().periods.periods[useEventStore().periods.periods.length-1]
    return
  }

  axios.delete(apiPath+"periods", {withCredentials: true, data: {
      name: period.value.name,
      color: period.value.color,
      startDate: period.value.startdate,
      endDate: period.value.enddate,
      priority: period.value.priority
    }}).then((response) => {
    toasts.success(`Periodo ${period.value.name} eliminado`)

    delete useEventStore().eventTypes.event_types[useEventStore().periods.periods.findIndex(periodI => {
      return periodI.name == props.period.name && periodI.startdate == props.period.startdate && periodI.enddate == props.period.enddate;
    })]
  }).catch((error) => {
    toasts.error(error.message)
  })
}

</script>
<style scoped>

</style>
