<template>
  <div hidden>
    <key-press-listener key-code="ArrowLeft" @pressed="jumpPrevious"/>
    <key-press-listener key-code="ArrowRight" @pressed="jumpNext"/>
  </div>
  <div class="week-grid mx-8 grid grid-cols-7 grid-rows-[4rem_5rem_1fr] justify-items-center items-center place-content-stretch gap-x-0">
    <span class="w-full text-center row-start-1 row-span-1 text-xl  xl:text-4xl border-l border-r border-neutral-600" v-for="month of monthTitle" :style=" 'grid-column: '+month.start+'/ span '+month.span+';' " :textContent="StringUtils.capitalize(DateUtils.getMonth(month.month))"/>
    <span class="row-span-1 col-span-1 row-start-2 text-red-700 text-center lg:text-4xl xl:text-5xl lg:m-10 text-xl" :style="'grid-column-start: '+day+';'" v-for="day in 7" :textContent="DateUtils.getDayInitial(day)"/>
    <week-day-component class="row-start-3 row-span-1" v-for="date of weekDays" :year="date.getFullYear()" :month="date.getMonth()+1" :day="date.getDate()"/>
  </div>
</template>
<script setup lang="ts">
import {computed, onMounted} from "vue";
import {useViewStore} from "@/stores/viewstore";
import {useEventStore} from "@/stores/eventstore.ts";
import {DateUtils} from "@/libs/dateutils.ts";
import WeekDayComponent from "@/components/WeekDayComponent.vue";
import KeyPressListener from "@/components/KeyPressListener.vue";
import {refreshPath} from "@/router";
import {StringUtils} from "@/libs/stringutils.ts";

  const props = defineProps<{
    week: Date
  }>()

  const viewStore = useViewStore();
  const eventStore = useEventStore();

  function jumpPrevious() {
    let prevWeek = new Date(props.week);
    prevWeek.setDate(props.week.getDate() - 7);
    viewStore.setWeek(prevWeek);
    refreshPath();
  }
  function jumpNext() {
    let nextWeek = new Date(props.week);
    nextWeek.setDate(props.week.getDate() + 7);
    viewStore.setWeek(nextWeek);
    refreshPath();
  }

  onMounted(() => {
    viewStore.setMode("week")
    viewStore.setWeek(props.week)
  })
  let startingDayNumber = props.week.getDate();
  let weekDays: Date[] = [];
  for (let i=0; i<7; i++) {
    let date = new Date(props.week);
    date.setDate(startingDayNumber + i);
    weekDays.push(date);
  }

  let monthTitle = computed(() => {
    let currentMonth = props.week.getMonth() + 1;
    let months : {month: number, start: number, span: number}[]= [{month: currentMonth, start:1, span: 7}]

    for (let dayk in weekDays) {
      let day = weekDays[dayk];
      if (day.getMonth()+1 != currentMonth) { // different month
        let keyNumber = Number(dayk);
        months.pop();
        months.push({month: currentMonth, start: 1, span: keyNumber})
        months.push({month: day.getMonth()+1, start: 1+keyNumber, span: 7-keyNumber})
        break;
      }
    }
    return months;
  });
  eventStore.interval.startDate = DateUtils.getDateString(props.week);
  let sunday = new Date(props.week);
  sunday.setDate(sunday.getDate() + 6);
  eventStore.interval.endDate = DateUtils.getDateString(sunday);

  useEventStore().fetchAllFromApiWithStoredInterval()

</script>
<style scoped>
</style>
