<template>
<div class="flex flex-row gap-1">
  <input @change="changeTask()" :checked="completed" type="checkbox">
  <span @click="openTaskEditor()" class="hover:cursor-default" :textContent="props.task.label"/>
  <button @click="deleteTask()" v-if="editing" class="bg-red-500 rounded-md w-6 h-6">-</button>
</div>
</template>
<script setup lang="ts">
import type {CalendarTask} from "@/libs/types";
import {ref} from "vue";
import axios from "axios";
import {apiPath, useEventStore} from "@/stores/eventstore";
import {useToast} from "vue-toastification";
import {useViewStore} from "@/stores/viewstore";

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
  }).then(result => {
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
  }).then(result => {
    toast.success("Tarea modificada exitosamente")
  }).catch(error => {
    toast.error(error.message)
  })

  completed.value = !completed.value
}

</script>
<style scoped>

</style>
