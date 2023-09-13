<template>
  <div class="h-8 w-8 m-0.5 rounded-md col-span-1 text-center">
    <button @click.left="openDetails" class="h-8 w-8 cursor-default border border-zinc-700 rounded-md"
            :style="getInlineStyles" v-text="props.day"/>
    <popup-component class="left-10 bottom-8 w-36" v-if="detailsOpen">
      <div class="flex flex-row">
        <span>
         <font-awesome-icon icon="fa-regular fa-circle-xmark" class="text-2xl hover:text-red-700"
                            @click="closeDetails"/>
        </span>
        <button @click="toggleEditing" class="ml-auto">Edit</button>
      </div>
      <div class="relative flex flex-col items-start">
        <h1 class="font-bold text-xl text-left mb-1" v-text="eventsForToday.length == 0? 'No hay eventos.' : 'Eventos:'"/>
        <div v-if="editing">

        </div>
        <entry-component v-else :key="event.label" v-for="event of eventsForToday" :entry="event"/>
        <h1 class="font-bold text-xl" v-if="periodsForToday.length!=0">Periodos:</h1>
        <period-component v-for="period of periodsForToday" :period="period"/>
      </div>
    </popup-component>

  </div>
</template>
<script setup lang="ts">

import {computed, onBeforeMount, onMounted, ref, watch} from "vue";
import EditDayComponent from "@/components/PopupComponent.vue";
import {useEventStore} from "@/stores/eventstore";
import type {CalendarEvent, CalendarEventType, CalendarPeriod, CalendarTask} from "@/libs/types";
import PopupComponent from "@/components/PopupComponent.vue";
import EntryComponent from "@/components/EntryComponent.vue";
import PeriodComponent from "@/components/PeriodComponent.vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {storeToRefs} from "pinia";

const props = defineProps<{
  year: number
  month: number
  day: number
}>();

let detailsOpen = ref(false)

let editing = ref(false)

let dayString = props.day+"-"+props.month+"-"+props.year;

let eventsForToday = ref<CalendarEvent[]>([])

let periodsForToday = ref<CalendarPeriod[]>([])

let tasksForToday = ref<CalendarTask[]>([])

function toggleEditing() {
  editing.value = !editing.value;
}

watch(useEventStore().events, () => {
  let events = useEventStore().events.events[dayString];
  eventsForToday.value = events == undefined ? [] : events;
})
watch(useEventStore().periods, () => {
  let periods : CalendarPeriod[] = [];
  let date = new Date(props.year, props.month-1, props.day).getTime()/1000
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

function openDetails() {
  detailsOpen.value = true;
}


function closeDetails() {
  detailsOpen.value = false;
}
</script>
<style scoped>
</style>
