<template>
  <div class="flex flex-row items-center">
    <div>
      <event-type-prefix v-if="hasPrefix" :event_type="props.entry.type"/>
      <span @click="editEventPopup()" class="hover:cursor-default leading-tight hyphens-auto align-middle" :textContent="props.entry.label" :style="'color: '+color" />
    </div>
      <button @click="deleteEvent()" v-if="editing" class="flex-shrink-0 ml-2 bg-red-500 rounded-md w-6 h-6">
      <font-awesome-icon icon="fa-solid fa-minus"/>
    </button>
  </div>
</template>
<script setup lang="ts">
import type {CalendarEvent} from "@/libs/types";
import {apiPath, useEventStore} from "@/stores/eventstore";
import {computed} from "vue";
import axios from "axios";
import {useToast} from "vue-toastification";
import {useViewStore} from "@/stores/viewstore";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {handleError} from "@/apiwrapper/errormanager";
import EventTypePrefix from "@/components/EventTypePrefix.vue";



const props = defineProps<{
  entry : CalendarEvent
  editing: boolean
}>()

let eventType = useEventStore().eventTypes.event_types[props.entry.type]

let color = computed(() => eventType.color)
let hasPrefix = computed(() => eventType.prefix != '')

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
  }).then(() => {
    toast.success(`Evento ${props.entry.label} eliminado éxitosamente`)
    delete useEventStore().events.events[dateString]
  }).catch(error => {
    handleError(error)
  })
}
</script>
<style scoped>

</style>
