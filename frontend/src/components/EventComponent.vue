<template>
  <div class="flex flex-row items-center">
    <span @click="editEventPopup()" class="hover:cursor-default" :textContent="useEventStore().eventTypes.event_types[props.entry.type].prefix+' '+props.entry.label" :style="'color: '+useEventStore().eventTypes.event_types[props.entry.type].color" />
    <button @click="deleteEvent()" v-if="editing" class="ml-2 bg-red-500 rounded-md w-6 h-6">
      <font-awesome-icon icon="fa-solid fa-minus"/>
    </button>
  </div>
</template>
<script setup lang="ts">
import type {CalendarEvent} from "@/libs/types";
import {apiPath, useEventStore} from "@/stores/eventstore";
import {computed, ref} from "vue";
import axios from "axios";
import {useToast} from "vue-toastification";
import EditEventPopupComponent from "@/components/EditPopupComponent.vue";
import {useViewStore} from "@/stores/viewstore";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const props = defineProps<{
  entry : CalendarEvent
  editing: boolean
}>()

const text = computed(() => useEventStore().eventTypes.event_types[props.entry.type].prefix+' '+props.entry.label)

const toast = useToast()

const viewStore = useViewStore()

function editEventPopup(){
  if(props.editing){
    viewStore.editingPopup = "event";
    viewStore.editingEvent = props.entry;
  }
}

function deleteEvent(){
  let splitDate = props.entry.date.split("-")
  let dateString = splitDate[2]+"-"+splitDate[1]+"-"+splitDate[0]

  axios.delete(apiPath+"events", {
    params: {
      label: props.entry.label,
      date: dateString
    },
    withCredentials: true
  }).then(result => {
    toast.success(`Evento ${props.entry.label} eliminado éxitosamente`)
    delete useEventStore().events.events[dateString]
  }).catch(error => {
    toast.error(error.message)
  })
}
</script>
<style scoped>

</style>
