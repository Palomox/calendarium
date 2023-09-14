<template>
  <div class="flex flex-row items-center">
    <span class="hover:cursor-default" :textContent="useEventStore().eventTypes.event_types[props.entry.type].prefix+' '+props.entry.label" :style="'color: '+useEventStore().eventTypes.event_types[props.entry.type].color" />
    <button @click="deleteEvent()" v-if="editing" class="bg-red-500 rounded-md w-6 h-6">-</button>
  </div>
</template>
<script setup lang="ts">
import type {CalendarEvent} from "@/libs/types";
import {apiPath, useEventStore} from "@/stores/eventstore";
import {computed} from "vue";
import axios from "axios";
import {useToast} from "vue-toastification";

const props = defineProps<{
  entry : CalendarEvent
  editing: boolean
}>()

const text = computed(() => useEventStore().eventTypes.event_types[props.entry.type].prefix+' '+props.entry.label)

const toast = useToast()

function deleteEvent(){
  let splitDate = props.entry.date.split("-")

  axios.delete(apiPath+"events", {
    params: {
      label: props.entry.label,
      date: splitDate[2]+"-"+splitDate[1]+"-"+splitDate[0]
    },
    withCredentials: true
  }).then(result => {
    toast.success(`Evento ${props.entry.label} eliminado éxitosamente`)
  }).catch(error => {
    toast.error(error.message)
  })
}
</script>
<style scoped>

</style>
