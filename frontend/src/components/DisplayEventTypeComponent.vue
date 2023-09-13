<template>
  <div class="bg-zinc-700 rounded-md p-4 flex">
    <div>
      <div>
        <span v-if="!editing" v-text="eventType.name" class="text-2xl font-bold mr-2"/>
        <div v-else>
          <label class="mr-2">Nombre: </label>
          <input v-model="eventType.name" type="text" class="text-black p-1 rounded-md">
        </div>
      </div>
      <div class="mt-2">
        <span v-if="!editing" v-text="'Color: '+eventType.color" :style="'color: '+eventType.color+';'" class="text-xl mr-2" />
        <div class="flex flex-row gap-2" v-else>
          <label>Color: </label>
          <input v-model="eventType.color" type="text" class="text-black p-1 rounded-md">
          <input v-model="eventType.color" type="color" class="rounded-md">
        </div>
      </div>
      <div class="mt-2">
        <span v-if="!editing" v-text="eventType.prefix.length == 0 ? 'Sin prefijo' : eventType.prefix" class="text-xl mr-2" />
        <div v-else>
          <label class="mr-2">Prefijo: </label>
          <input v-model="eventType.prefix" type="text" class="text-black p-1 rounded-md">
        </div>
      </div>

    </div>
    <button v-if="!editing" @click="editing = true" class="ml-8 bg-indigo-400 p-2 rounded-md text-black h-min">Editar</button>
    <button v-if="editing" @click="saveType()" class="ml-8 bg-emerald-600 p-2 rounded-md text-black h-min">Guardar</button>

    <button v-if="editing" @click="deleteType()" class="w-16 h-16 bg-red-600 ml-auto p-2 rounded-md text-5xl font-bold">x</button>
  </div>
</template>
<script setup lang="ts">

import type {CalendarEventType} from "@/libs/types";
import axios from "axios";
import {apiPath, useEventStore} from "@/stores/eventstore";
import {useToast} from "vue-toastification";
import {onBeforeMount, ref} from "vue";


const props = defineProps<{
  eventType: CalendarEventType
}>()

const toasts = useToast()

let editing = ref(false)

let eventType = ref<CalendarEventType>(Object.assign({}, props.eventType))

let isNew = ref(false)

onBeforeMount(() => {
  if(eventType.value.new != undefined) {
    isNew.value = true
    editing.value = true
  }
})

function saveType() {
  axios.post(apiPath+"events/types", {
    type: eventType.value.name,
    color: eventType.value.color,
    prefix: eventType.value.prefix
  }, {
    withCredentials: true
  }).then(response => {
    editing.value = false
    toasts.success("Tipo de evento modificado con éxito")
    useEventStore().fetchEventTypesFromApi()
  }).catch(error => {
    toasts.error(error.message)
  })
}
function deleteType(){
  if(isNew.value){
    delete useEventStore().eventTypes.event_types[eventType.value.name]
    return
  }

  axios.delete(apiPath+"events/types", {withCredentials: true, data: {
      type: props.eventType.name
  }}).then((response) => {
    toasts.success(`Tipo de evento ${eventType.value.name} eliminado`)
    delete useEventStore().eventTypes.event_types[eventType.value.name]
  }).catch((error) => {
    toasts.error(error.message)
  })
}

</script>
<style scoped>

</style>
