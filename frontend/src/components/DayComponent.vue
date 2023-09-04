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
        <h1 class="font-bold text-xl text-left mb-1" v-text="eventsForToday==undefined? 'No hay eventos.' : 'Eventos:'"/>
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
import type {CalendarEvent, CalendarPeriod} from "@/libs/types";
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

let eventsForToday = useEventStore().events[dayString]

let periodsForToday = ref<CalendarPeriod[]>([])

let mainPeriod = ref<CalendarPeriod | undefined>(undefined)

function toggleEditing() {
  editing.value = !editing.value;
}

//watch(eventsStore.events, loadFromPinia)

const getInlineStyles = computed(() => {
  let bgColor = mainPeriod.value != undefined ? 'background-color: ' + mainPeriod.value.color + '; ' : '';


  let colorHex;
  if (eventsForToday.value == undefined) {
    colorHex = "#ffffff"
  } else {
    colorHex = eventsForToday.value[0].type.color
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

/*function loadFromPinia() {
  periodsForToday.value = useEventStore().getPeriodsForDate(new Date(props.year, props.month - 1, props.day))

  let max = 0;
  let maxPriority = 0;
  for (let i = 0; i > periodsForToday.value.length; i++) {
    if (periodsForToday.value[i].priority > maxPriority) {
      maxPriority = periodsForToday.value[i].priority;
      max = i;
    }
  }

  mainPeriod.value = periodsForToday.value[max]

  eventsForToday.value = useEventStore().getEventsForDay(props.day + "-" + props.month + "-" + props.year)
}*/




</script>
<style scoped>
</style>
