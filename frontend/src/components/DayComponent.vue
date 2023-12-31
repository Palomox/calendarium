<template>
  <div class="h-8 w-8 m-0.5 rounded-md col-span-1 text-center">
    <button @click.left="openDetails" class="h-8 w-8 cursor-default border border-zinc-700 rounded-md"
            :style="getInlineStyles" v-text="props.day"/>
    <popup-component class="left-10 bottom-8 min-w-max" @close_popup="closeDetails" v-if="detailsOpen">
      <div class="flex flex-row gap-4">
        <font-awesome-icon icon="fa-regular fa-circle-xmark" class="text-2xl hover:text-red-700"
                            @click="closeDetails"/>
        <button @click="toggleEditing" class="hover:underline ml-auto" v-text="editing ? 'Guardar' : 'Editar'"/>
      </div>

      <div class="relative flex flex-col items-start gap-1">
        <h1 class="font-bold text-xl text-left mb-1" :hidden="eventsForToday.length == 0 && !editing" v-text="eventsForToday.length == 0 && !editing? '' : 'Eventos:'"/>
        <event-component :editing="editing" :key="event.label" v-for="event of eventsForToday" :entry="event"/>
        <button v-if="editing" @click="newEvent()" class="regular-button w-6 h-6 m-auto">
          <font-awesome-icon icon="fa-solid fa-plus" />
        </button>
        <h1 class="font-bold text-xl text-left mb-1" :hidden="eventsForToday.length == 0 && !editing" v-text="tasksForToday.length == 0 && !editing? '' : 'Tareas:'"/>
        <task-component :editing="editing" :task="task" :key="task.label" v-for="task of tasksForToday" />
        <button v-if="editing" @click="newTask()" class="regular-button w-6 h-6 m-auto">
          <font-awesome-icon icon="fa-solid fa-plus" />
        </button>
        <h1 class="font-bold text-xl" v-if="periodsForToday.length!=0">Periodos:</h1>
        <period-component v-for="period of periodsForToday" :period="period"/>
      </div>
    </popup-component>

  </div>
</template>
<script setup lang="ts">

import {computed, ref, watch} from "vue";
import {useEventStore} from "@/stores/eventstore";
import type {CalendarEvent, CalendarPeriod, CalendarTask} from "@/libs/types";
import PopupComponent from "@/components/PopupComponent.vue";
import PeriodComponent from "@/components/PeriodComponent.vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import TaskComponent from "@/components/TaskComponent.vue";
import EventComponent from "@/components/EventComponent.vue";
import {useViewStore, newEvent as newEventStore, newTask as newTaskStore} from "@/stores/viewstore";
import {StringUtils} from "@/libs/stringutils";
import {DateUtils} from "@/libs/dateutils";

const props = defineProps<{
  year: number
  month: number
  day: number
}>();

const viewStore = useViewStore();

const eventStore = useEventStore();

let detailsOpen = ref(false)

let editing = ref(false)

let dayString = props.day+"-"+props.month+"-"+props.year;

let eventsForToday = ref<CalendarEvent[]>([])

let periodsForToday = ref<CalendarPeriod[]>([])

let tasksForToday = ref<CalendarTask[]>([])

let mainEventType = ref<string>("")

function toggleEditing() {
  editing.value = !editing.value;
}

function newEvent(){
  viewStore.editingPopup = "event";

  let editingEvent = Object.assign({}, newEventStore)

  editingEvent.date = props.year+"-"+props.month.toString().padStart(2, "0")+"-"+props.day.toString().padStart(2, "0")

  viewStore.editingEvent = editingEvent;
}

function newTask(){
  viewStore.editingPopup = "task";

  let editingTask = Object.assign({}, newTaskStore)

  editingTask.date = props.year+"-"+props.month.toString().padStart(2, "0")+"-"+props.day.toString().padStart(2, "0")

  viewStore.editingTask = editingTask
}

watch(eventStore.events, () => {
  let events = useEventStore().events.events[dayString];
  eventsForToday.value = events == undefined ? [] : events;

  if(eventsForToday.value.length==0){ return; }

  let eventTypesCache = useEventStore().eventTypes.event_types

  let maxPriority = 0
  let maxPriorityEvent !: CalendarEvent

  for (let iterEvent of eventsForToday.value){
    let priority = eventTypesCache[iterEvent.type].priority
    if (priority>maxPriority){
      maxPriority = priority
      maxPriorityEvent = iterEvent
    }
  }

  mainEventType.value = maxPriorityEvent.type
})
watch(eventStore.periods, () => {
  let periods : CalendarPeriod[] = [];
  let dateObject = new Date()
  dateObject.setUTCFullYear(props.year, props.month-1, props.day);
  dateObject.setUTCHours(0, 0, 0, 0)

  let date = dateObject.getTime()/1000

  for (let period of eventStore.periods.periods) {
    if(period.startdate <= date && date <= period.enddate){
      // Included
      periods[periods.length] = period
    }
  }

  periodsForToday.value = periods.sort((one, two) => {
    return two.priority-one.priority
  })
})
watch(eventStore.tasks, () => {
  let tasks = eventStore.tasks.tasks[dayString];
  tasksForToday.value = tasks == undefined ? [] : tasks;
})



const getInlineStyles = computed(() => {
  let bgColor = periodsForToday.value.length != 0? 'background-color: ' + periodsForToday.value[0].color + '; ' : '';


  let colorHex;
  if (eventsForToday.value.length == 0) {
    if(periodsForToday.value.length == 0){
      colorHex = "#ffffff"
    } else {
      let color = periodsForToday.value[0].color

      let triplet = StringUtils.hexToRgb(color)

      if(triplet == null){
        colorHex = "#ffffff"
      } else {
        colorHex = (triplet.r * 0.299 + triplet.g * 0.587 + triplet.b * 0.114) > 186 ? '#000000' : '#ffffff'
      }
    }
  } else {
    colorHex = eventStore.eventTypes.event_types[mainEventType.value].color
  }

  let textColor = 'color: ' + colorHex + ';'

  let today = new Date()
  let todayString = DateUtils.getDateString(today)

  let underline = todayString == dayString ? "text-decoration: underline;" : ""

  return bgColor + textColor + underline
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
