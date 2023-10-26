<template>
<div class="flex flex-row gap-1">
  <div id="checkbox" @click="changeTask" class="rounded-sm flex-shrink-0 w-5 h-5 bg-gray-700 text-center align-middle" >
    <font-awesome-icon class="w-full h-full hover:opacity-100 opacity-0" :class="completed ? 'opacity-100' : ''" icon="fa-solid fa-check" />
  </div>
  <p @click="openTaskEditor()" :class="completed ? 'line-through' : ''" class="hover:cursor-default leading-tight hyphens-auto" :textContent="props.task.label"/>
  <button @click="deleteTask()" v-if="editing" class="flex-shrink-0 ml-2 bg-red-500 rounded-md w-6 h-6">
    <font-awesome-icon icon="fa-solid fa-minus"/>
  </button>
</div>
</template>
<script setup lang="ts">
import type {CalendarTask} from "@/libs/types";
import {ref} from "vue";
import axios from "axios";
import {apiPath, useEventStore} from "@/stores/eventstore";
import {useToast} from "vue-toastification";
import {useViewStore} from "@/stores/viewstore";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const props = defineProps<{
  task: CalendarTask
  editing: boolean
}>()

let completed = ref(props.task.completed)

const viewStore = useViewStore()
const toast = useToast()

function openTaskEditor(){
  if(!props.editing){
    return
  }

  viewStore.editingPopup = "task"
  viewStore.editingTask = props.task
}

function deleteTask(){
  let splitDate = props.task.date.split("-")

  axios.delete(apiPath+"tasks", {
    withCredentials: true,
    params: {
      label: props.task.label,
      date: splitDate[2]+"-"+splitDate[1]+"-"+splitDate[0]
    }
  }).then(() => {
    toast.success("Tarea eliminada exitosamente")
    delete useEventStore().tasks.tasks[Number(splitDate[2])+"-"+Number(splitDate[1])+"-"+Number(splitDate[0])]
  }).catch(error => {
    toast.error(error.message)
  })
}

function changeTask(){
  let splitDate = props.task.date.split("-")

  axios.patch(apiPath+"tasks", {
    completed: !completed.value
  }, {
    withCredentials: true,
    params: {
      label: props.task.label,
      date: splitDate[2]+"-"+splitDate[1]+"-"+splitDate[0]
    }
  }).then(() => {
    toast.success("Tarea modificada exitosamente")
  }).catch(error => {
    toast.error(error.message)
  })

  completed.value = !completed.value
}

</script>
<style scoped>

</style>
