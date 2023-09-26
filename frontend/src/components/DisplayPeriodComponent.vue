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
          <input @change="changeStartDate((<any>$event).target.value)" :value="startDateISO" type="date" class="text-black rounded-md p-1">
        </div>
      </div>
      <div>
        <span v-if="!editing" v-text="'Final: '+new Date(period.enddate*1000).toLocaleDateString()" class="text-xl mr-2" />
        <div v-else>
          <label class="mr-2">Final: </label>
          <input @change="changeEndDate((<any>$event).target.value)" :value="endDateISO" type="date" class="text-black rounded-md p-1">
        </div>
      </div>
      <div>
        <span v-if="!editing" v-text="'Prioridad: '+period.priority" class="text-xl mr-2" />
        <div v-else>
          <label class="mr-2">Prioridad: </label>
          <input v-model="period.priority" type="number" class="text-black rounded-md p-1">
        </div>
      </div>
    </div>
    <button v-if="!editing" @click="editing = true" class="ml-8 p-2 h-min regular-button">Editar</button>
    <button v-if="editing" @click="savePeriod()" class="ml-8 p-2 h-min save-button">Guardar</button>

    <button v-if="editing" @click="deletePeriod()" class="w-16 h-16 ml-auto p-2 text-5xl font-bold close-button">
      <font-awesome-icon icon="fa-solid fa-xmark" />
    </button>
  </div>
</template>
<script setup lang="ts">

import type {CalendarPeriod} from "@/libs/types";
import axios from "axios";
import {apiPath, useEventStore} from "@/stores/eventstore";
import {useToast} from "vue-toastification";
import {computed, onBeforeMount, ref} from "vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";


const props = defineProps<{
  period: CalendarPeriod
}>()

const toasts = useToast()

let editing = ref(false)

let period = ref<CalendarPeriod>(Object.assign({}, props.period))

let isNew = ref(false)

const startDateISO = computed(() => {
  let date = new Date(period.value.startdate*1000);
  return date.toISOString().substring(0, 10)
})


const endDateISO = computed(() => {
  let date = new Date(period.value.enddate*1000)
  return date.toISOString().substring(0, 10)
})

onBeforeMount(() => {
  if(period.value.new != undefined) {
    isNew.value = true
    editing.value = true
  }
})

function changeStartDate(date: any){
  let split = (<string>date).split("-");

  let dateObject = new Date()
  dateObject.setUTCFullYear(Number(split[0]), Number(split[1])-1, Number(split[2]))
  dateObject.setUTCHours(0, 0, 0, 0)

  period.value.startdate = dateObject.getTime()/1000
}

function changeEndDate(date: any) {
  let split = (<string>date).split("-");

  let dateObject = new Date()
  dateObject.setUTCFullYear(Number(split[0]), Number(split[1])-1, Number(split[2]))
  dateObject.setUTCHours(0, 0, 0, 0)
  period.value.enddate = dateObject.getTime()/1000
}

function savePeriod() {
  axios.post(apiPath+"periods", {
    name: period.value.name,
    color: period.value.color,
    startDate: period.value.startdate,
    endDate: period.value.enddate,
    priority: period.value.priority
  }, {
    params: {
      name: isNew.value ? undefined : props.period.name,
      startDate: isNew.value ? undefined : props.period.startdate,
      endDate: isNew.value ? undefined : props.period.enddate
    },
    withCredentials: true
  }).then(response => {
    editing.value = false
    toasts.success("Periodo modificado con éxito")
    useEventStore().fetchPeriodsFromApi()
  }).catch(error => {
    toasts.error(error.message)
  })
}
function deletePeriod(){
  if(isNew.value){
    let newIndex = useEventStore().periods.periods.findIndex(periodToCompare => {
      return periodToCompare.name == props.period.name && periodToCompare.startdate == props.period.startdate && periodToCompare.enddate == props.period.enddate
    })

    useEventStore().periods.periods.splice(newIndex, newIndex)

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

    useEventStore().fetchPeriodsFromApi()
  }).catch((error) => {
    toasts.error(error.message)
  })
}

</script>
<style scoped>

</style>
