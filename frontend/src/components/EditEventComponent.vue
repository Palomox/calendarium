<template>
<form @submit.prevent="modifyEvent()" class="m-auto flex flex-col gap-1 w-1/2 mb-5">
  <label class="text-4xl text-center text-neutral-300" v-text="props.event.new != undefined ? 'Crear evento' : 'Editar evento'"/>
  <label>Fecha</label>
  <input v-model="eventObj.date" type="date">
  <label>Descripción</label>
  <input v-model="eventObj.label" type="text">
  <label>Tipo</label>
  <select :style="'color: '+eventStore.eventTypes.event_types[eventObj.type].color+';'" v-model="eventObj.type">
    <option :key="type.name" :value="type.name" v-text="type.name" :style="'color: '+type.color+';'" v-for="type in eventStore.eventTypes.event_types" />
  </select>
  <input class="regular-button h-10 mt-8" :value="props.event.new != undefined ? 'Crear evento' : 'Editar evento'" type="submit">
</form>
</template>
<script setup lang="ts">
  import type {CalendarEvent} from "@/libs/types";
  import {computed, ref} from "vue";
  import {apiPath, useEventStore} from "@/stores/eventstore";
  import axios from "axios";
  import {useToast} from "vue-toastification";
  import {useViewStore} from "@/stores/viewstore";
  import {handleError} from "@/apiwrapper/errormanager";

  const props = defineProps<{
    event: CalendarEvent
  }>()

  const toast = useToast()

  const eventStore = useEventStore()

  let eventObj = ref<CalendarEvent>(Object.assign({}, props.event))

  function modifyEvent(){
    let splitDate = eventObj.value.date.split("-")

    let splitOldDate = props.event.date.split("-")


    axios.post(apiPath+"events", {
      date: splitDate[2]+"-"+splitDate[1]+"-"+splitDate[0],
      label: eventObj.value.label,
      type: eventObj.value.type
    }, {
      withCredentials: true,
      params: {
        label: props.event.new != undefined ? undefined : props.event.label,
        date: props.event.new != undefined ? undefined : splitOldDate[2]+"-"+splitOldDate[1]+"-"+splitOldDate[0]
      }
    }).then(response => {
      useEventStore().fetchEventsFromApiWithStoredInterval()
      toast.success(`Evento ${props.event.new != undefined ? 'creado' : 'modificado'} exitosamente`)
      useViewStore().editingPopup = "none"
    }).catch(error => {
      handleError(error)
    })
  }
</script>
<style scoped>
@reference "@/assets/main.css"
label{
  @apply mt-2;
}
input:not([type="submit"]) {
  @apply rounded-md h-8 p-1 bg-neutral-800 border-1 border-neutral-600;
}

select {
  @apply rounded-md h-8 p-1 bg-neutral-800 border-1 border-neutral-600;
}

</style>
