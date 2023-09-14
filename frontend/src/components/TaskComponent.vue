<template>
<div class="flex flex-row gap-1">
  <input @change="changeTask()" :checked="completed" type="checkbox">
  <span class="hover:cursor-default" :textContent="props.task.label"/>
</div>
</template>
<script setup lang="ts">
import type {CalendarTask} from "@/libs/types";
import {ref} from "vue";
import axios from "axios";
import {apiPath} from "@/stores/eventstore";
import {useToast} from "vue-toastification";

const props = defineProps<{
  task: CalendarTask
}>()

let completed = ref(props.task.completed)

const toast = useToast()

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
