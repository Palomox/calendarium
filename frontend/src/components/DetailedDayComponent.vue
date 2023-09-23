<template>
<div class="w-32 h-32 xl:w-48 xl:h-48 border border-gray-700 xl:border-2 rounded-md m-0.5 xl:m-2 flex flex-col items-center">
  <span class="text-3xl border-b xl:border-b-2 border-gray-700 w-full text-center hover:cursor-default" :style="dayStyle" @click="open = true">
    <span ref="today" :textContent="props.day"/>
  </span>
  <teleport to="#popuplayer">
    <popup-component :style="popupStyle" class="absolute z-50" v-if="open" @close_popup="togglePopup">
      <button :class="editing ? 'save-button' : 'regular-button'" class="p-1 pointer-events-auto" @click="editing = !editing" v-text="editing? 'Guardar' : 'Editar'" />
    </popup-component>
  </teleport>
  <div class="flex flex-col overflow-y-scroll relative p-2 gap-2 w-full">
    <h1 class="font-bold text-xl text-left mb-1" :hidden="!editing" v-text="editing? 'Eventos:' : ''"/>
    <event-component :editing="editing" :key="calendarEvent.label" v-for="calendarEvent of eventsForToday" :entry="calendarEvent"/>
    <button v-if="editing" @click="newEvent()" class="regular-button w-6 h-6 m-auto">
      <font-awesome-icon icon="fa-solid fa-plus" />
    </button>
    <h1 class="font-bold text-xl text-left mb-1" :hidden="!editing" v-text="editing? 'Tareas:' : ''"/>
    <task-component :editing="editing" :task="task" :key="task.label" v-for="task of tasksForToday" />
    <button v-if="editing" @click="newTask()" class="regular-button w-6 h-6 m-auto">
      <font-awesome-icon icon="fa-solid fa-plus" />
    </button>
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
  import TaskComponent from "@/components/TaskComponent.vue";
  import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
  import {newEvent as newEventStore, newTask as newTaskStore, useViewStore} from "@/stores/viewstore";
  import {StringUtils} from "@/libs/stringutils";

  const props = defineProps<{
    year: number
    month: number
    day: number
  }>()

  const today = ref(null)

  const viewStore = useViewStore()

  let open = ref(false)
  let editing = ref(false)
  let eventsForToday = ref<CalendarEvent[]>([])
  let periodsForToday = ref<CalendarPeriod[]>([])
  let tasksForToday = ref<CalendarTask[]>([])

  let dayString = props.day+"-"+props.month+"-"+props.year;


  function togglePopup(){
    open.value = !open.value
  }

  const popupStyle = computed(() => {
    let bounding = (<unknown>today.value as HTMLElement).getBoundingClientRect()

    let left = bounding.left
    let top = bounding.top + window.scrollY;

    let width = 2 * parseFloat(getComputedStyle(document.documentElement).fontSize) // 2 rem to pixels

    return `left: ${left+width}px; top: ${top}px`
  })

  const dayStyle = computed(() => {
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
      colorHex = useEventStore().eventTypes.event_types[eventsForToday.value[0].type].color
    }
    let textColor = 'color: ' + colorHex + ';'

    return bgColor + textColor
  })


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
</script>
<style scoped>
div>div{
  scrollbar-width: thin;
}


</style>
