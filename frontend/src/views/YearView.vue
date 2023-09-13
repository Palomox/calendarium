<template>
  <div class="flex flex-row  justify-center w-3/4 m-auto gap-4 flex-wrap">
    <month-component v-for="index of 12" :month="years.months[index-1]" :year="years.years[index-1]" :big="false" />
  </div>
</template>
<script setup lang="ts">
import {DateUtils} from "@/libs/dateutils";
import MonthComponent from "@/components/MonthComponent.vue";
import {onBeforeMount, onMounted, onUpdated, watch, watchEffect} from "vue";
import {useViewStore} from "@/stores/viewstore";
import {useEventStore} from "@/stores/eventstore";

const props = defineProps<{
  year: number | '12months'
}>();

let years : {months: number[], years: number[]};

onBeforeMount(() => {
  if(props.year == '12months') {
    years = DateUtils.getFollowing12Months()
  }  else {
    years = {
      months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      years: []
    }
    for (let i = 0; i < 12; i++) {
      years.years[i] = <number>props.year;
    }
  }

  useViewStore().setMode('year')
  useViewStore().setYearInterval(<string>props.year)

  useEventStore().fetchAllFromApi("1-"+years.months[0]+"-"+years.years[0], "31-"+years.months[years.months.length-1]+"-"+years.years[years.years.length-1])

})

</script>
<style scoped>
</style>
