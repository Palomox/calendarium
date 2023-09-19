<template>
<div class="w-32 h-32 xl:w-48 xl:h-48 border border-gray-700 xl:border-2 rounded-md m-0.5 xl:m-2 flex flex-col items-center">
  <span class="text-3xl border-b xl:border-b-2 border-gray-700 w-full text-center hover:cursor-default" :style="getInlineStyles" :textContent="props.day" @click="openPopup"/>
  <popup-component class="relative left-16 bottom-8 z-50" v-if="open" @close_edit="openPopup">
    <button :class="editing ? 'save-button' : 'regular-button'" class="p-1" @click="editing = !editing" v-text="editing? 'Guardar' : 'Editar'" />
  </popup-component>
  <div class="flex flex-col overflow-y-scroll relative p-2 gap-2">
    <event-component :editing="editing" :key="calendarEvent.label" v-for="calendarEvent of eventsForToday" :entry="calendarEvent"/>
  </div>
</div>
</template>
<script setup lang="ts">
  import EntryComponent from "@/components/EventComponent.vue";
  import EditDayComponent from "@/components/PopupComponent.vue";
  import {computed, onBeforeMount, ref, watch} from "vue";
  import {useEventStore} from "@/stores/eventstore";
  import type {CalendarEvent, CalendarPeriod, CalendarTask} from "@/libs/types";
  import PopupComponent from "@/components/PopupComponent.vue";
  import EventComponent from "@/components/EventComponent.vue";

  const props = defineProps<{
    year: number
    month: number
    day: number
  }>()

  let open = ref(false)
  let editing = ref(false)
  let eventsForToday = ref<CalendarEvent[]>([])
  let periodsForToday = ref<CalendarPeriod[]>([])
  let tasksForToday = ref<CalendarTask[]>([])

  let dayString = props.day+"-"+props.month+"-"+props.year;

  watch(useEventStore().events, () => {
    let events = useEventStore().events.events[dayString];
    eventsForToday.value = events == undefined ? [] : events;
  })
  watch(useEventStore().periods, () => {
    let periods : CalendarPeriod[] = [];
    let dateObject = new Date()
    dateObject.setUTCFullYear(props.year, props.month-1, props.day);
    dateObject.setUTCHours(0, 0, 0, 0)

    let date = dateObject.getTime()/1000

    for (let period of useEventStore().periods.periods) {
      if(period.startdate <= date && date <= period.enddate){
        // Included
        periods[periods.length] = period
      }
    }

    periodsForToday.value = periods.sort((one, two) => {
      return two.priority-one.priority
    })

  })
  watch(useEventStore().tasks, () => {
    let tasks = useEventStore().tasks.tasks[dayString];
    tasksForToday.value = tasks;
  })


  const getInlineStyles = computed(() => {
    let bgColor = periodsForToday.value.length != 0? 'background-color: ' + periodsForToday.value[0].color + '; ' : '';


    let colorHex;
    if (eventsForToday.value.length == 0) {
      colorHex = "#ffffff"
    } else {
      colorHex = useEventStore().eventTypes.event_types[eventsForToday.value[0].type].color
    }
    let textColor = 'color: ' + colorHex + ';'

    return bgColor + textColor
  })


  function openPopup(){
    open.value = !open.value
  }

</script>
<style scoped>
div>div{
  scrollbar-width: thin;
}
</style>
