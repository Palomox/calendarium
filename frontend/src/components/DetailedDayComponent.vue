<template>
<div class="w-32 h-32 xl:w-48 xl:h-48 border border-gray-700 xl:border-2 rounded-md m-0.5 xl:m-2 flex flex-col items-center">
  <span class="text-3xl border-b xl:border-b-2 border-gray-700 w-full text-center" :style="getInlineStyles" :textContent="props.day" @click="editDay"/>
  <popup-component class="relative left-16 bottom-8" v-if="editing" @close_edit="editDay">Hellloooooadkjsfgisfdjgn</popup-component>
  <div class="flex flex-col overflow-y-scroll relative p-2 gap-2">
    <entry-component v-for="calendarEvent of eventsForToday" :entry="calendarEvent"/>
  </div>
</div>
</template>
<script setup lang="ts">
  import EntryComponent from "@/components/EntryComponent.vue";
  import EditDayComponent from "@/components/PopupComponent.vue";
  import {computed, onBeforeMount, ref} from "vue";
  import {useEventStore} from "@/stores/eventstore";
  import type {CalendarEvent, CalendarPeriod} from "@/libs/types";
  import PopupComponent from "@/components/PopupComponent.vue";

  const props = defineProps<{
    year: number
    month: number
    day: number
  }>()

  let editing = ref(false)
  let eventsForToday = ref<CalendarEvent[]>([])
  let periodsForToday = ref<CalendarPeriod[]>([])

  let mainPeriod = ref<CalendarPeriod | undefined>(undefined)

  const getInlineStyles = computed(() => {
    let bgColor = mainPeriod.value != undefined ? 'background-color: ' + mainPeriod.value.color + '; ' : '';


    let colorHex;
    if (eventsForToday.value.length==0){
      colorHex = "#ffffff"
    } else {
      colorHex = eventsForToday.value[0].type.color
    }
    let textColor = 'color: ' + colorHex + ';'

    return bgColor + textColor
  })


  function editDay(){
    editing.value = !editing.value;
  }

  onBeforeMount(() => {
    eventsForToday.value = useEventStore().getEventsForDay(props.day+"-"+props.month+"-"+props.year)

    periodsForToday.value = useEventStore().getPeriodsForDate(new Date(props.year, props.month-1, props.day))

    let max = 0;
    let maxPriority = 0;
    for(let i=0; i>periodsForToday.value.length; i++){
      if(periodsForToday.value[i].priority>maxPriority){
        maxPriority=periodsForToday.value[i].priority;
        max = i;
      }
    }

    mainPeriod.value = periodsForToday.value[max]
  })
</script>
<style scoped>
div>div{
  scrollbar-width: thin;
}
</style>
