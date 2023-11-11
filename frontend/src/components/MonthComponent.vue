<template>
  <div class="flex flex-col items-center p-2">
    <div hidden v-if="props.big">
      <key-press-listener  key-code="ArrowLeft" @pressed="jumpPrevious"/>
      <key-press-listener key-code="ArrowRight" @pressed="jumpNext"/>
    </div>
    <router-link v-if="!big" :to="'/year/'+props.year+'/month/'+props.month" class="font-bold text-3xl" :class="props.big ? 'lg:text-7xl' : '' " :textContent="StringUtils.capitalize(DateUtils.getMonth(props.month))+' '+props.year"/>
  <div class="flex flex-col items-center" v-else>
    <router-link :to="'/year/'+props.year" class="font-bold text-3xl" :class="props.big ? 'lg:text-7xl' : '' " :textContent="props.year"/>
    <div class="flex flex-row gap-14 items-end" :class="props.big ? 'lg:text-6xl' : '' ">
      <router-link :to="previousMonthLink" >
        <font-awesome-icon icon="fa-solid fa-arrow-left" />
      </router-link>
      <router-link :to="'/year/'+props.year+'/month/'+props.month" class="text-3xl" :class="props.big ? 'lg:text-7xl' : '' " :textContent="StringUtils.capitalize(DateUtils.getMonth(props.month))"/>
      <router-link :to="followingMonthLink">
        <font-awesome-icon icon="fa-solid fa-arrow-right" />
      </router-link>
    </div>
  </div>
  <div class="grid grid-cols-7" :style="'grid-template-rows: repeat(' + DateUtils.getMonthWeeks(props.month, props.year) + ', minmax(0, 1fr));'">
    <span class="row-span-1 col-span-1 row-start-1 text-red-700 text-center" :class="props.big ? 'lg:text-6xl lg:m-10 text-xl' : 'text-xl' " :style="'grid-column-start: '+day+';'" v-for="day in 7" :textContent="DateUtils.getDayInitial(day)"/>

    <day-component :key="index" :style="'grid-column-start: '+((index+monthOffset)-(((Math.ceil((index+monthOffset)/7)-1)*7)))+'; grid-row-start: '+ (Math.ceil((index+monthOffset)/7)+1)+';'" v-if="!props.big" :year=props.year :month=props.month :day=index v-for="index in DateUtils.getMonthDays(props.month, props.year)"/>
    <detailed-day-component :key="index" :style="'grid-column-start: '+((index+monthOffset)-(((Math.ceil((index+monthOffset)/7)-1)*7)))+'; grid-row-start: '+ (Math.ceil((index+monthOffset)/7)+1)+';'" v-if="props.big" :year=props.year :month=props.month :day=index v-for="index in DateUtils.getMonthDays(props.month, props.year)"/>
  </div>
  </div>

</template>

<script setup lang="ts">
import {StringUtils} from "@/libs/stringutils";
import {DateUtils} from "@/libs/dateutils";
import DayComponent from "@/components/DayComponent.vue";
import {computed, onBeforeMount} from "vue";
import DetailedDayComponent from "@/components/DetailedDayComponent.vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import KeyPressListener from "@/components/KeyPressListener.vue";
import router from "@/router";
import {useViewStore} from "@/stores/viewstore";

const props = defineProps<{
  month: number
  year: number
  big: boolean
}>();

let monthOffset : number;

let previousMonthLink = computed(() => {
  if(props.month==1) {
    return "/year/"+(props.year-1)+"/month/12";
  }

  return "/year/"+props.year+"/month/"+(props.month-1);
})

let followingMonthLink = computed(() => {
  if(props.month==12) {
    return "/year/"+(props.year+1)+"/month/1";
  }

  return "/year/"+props.year+"/month/"+(props.month+1);

})

function jumpPrevious(){
  if(useViewStore().editingPopup != "none") {
    return;
  }
  router.push(previousMonthLink.value)
}

function jumpNext(){
  if(useViewStore().editingPopup != "none") {
    return;
  }
  router.push(followingMonthLink.value)
}

onBeforeMount(()=>{
  monthOffset = DateUtils.getMonthOffset(props.year, props.month)
})
</script>
<style scoped>

</style>
