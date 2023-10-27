<template>
  <form @submit.prevent="editTask()" class="m-auto flex flex-col gap-1 w-1/2 mb-5">
    <label class="text-5xl text-center" v-text="props.task.new != undefined ? 'Crear tarea' : 'Editar tarea'"/>
    <label>Fecha</label>
    <input v-model="taskObj.date" class="rounded-md h-8 p-1" type="date">
    <label>Descripción</label>
    <input v-model="taskObj.label" class="rounded-md h-8 p-1" type="text">
    <input class="regular-button h-10 mt-8" :value="props.task.new != undefined ? 'Crear tarea' : 'Editar tarea'" type="submit">
  </form>

</template>
<script setup lang="ts">
import type {CalendarEvent, CalendarTask} from "@/libs/types";
import {useToast} from "vue-toastification";
import {apiPath, useEventStore} from "@/stores/eventstore";
import {useViewStore} from "@/stores/viewstore";
import {ref} from "vue";
import axios from "axios";
import {handleError} from "@/apiwrapper/errormanager";

const props = defineProps<{
  task: CalendarTask
}>()

const toast = useToast()

let taskObj = ref<CalendarTask>(Object.assign({}, props.task))

function editTask(){
  let splitDate = taskObj.value.date.split("-")

  let requestPromise;

  if (!props.task.new){
    let splitOldDate = props.task.date.split("-")

    requestPromise = axios.patch(apiPath+"tasks", {
      date: splitDate[2]+"-"+splitDate[1]+"-"+splitDate[0],
      label: taskObj.value.label,
    }, {
      withCredentials: true,
      params: {
        label: props.task.new != undefined ? undefined : props.task.label,
        date: props.task.new != undefined ? undefined : splitOldDate[2]+"-"+splitOldDate[1]+"-"+splitOldDate[0]
      }
    })

  } else {
    requestPromise = axios.post(apiPath+"tasks", {
      date: splitDate[2]+"-"+splitDate[1]+"-"+splitDate[0],
      label: taskObj.value.label,
    }, {
      withCredentials: true,
    })
  }

  requestPromise.then(response => {
    useEventStore().fetchTasksFromApiWithStoredInterval()
    toast.success(`Tarea ${props.task.new != undefined ? 'creada' : 'modificada'} exitosamente`)
    useViewStore().editingPopup = "none"
  }).catch(error => {
    handleError(error)
  })

}
</script>
<style scoped>
label{
  @apply mt-2;
}

</style>
