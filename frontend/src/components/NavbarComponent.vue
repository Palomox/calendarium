<template>
<nav class="bg-zinc-800  shadow shadow-2xl shadow-black text-white items-center lg:h-16 h-8  w-full flex flex-row lg:gap-4 gap-1">
  <button @click="toggleMenu" class="text-white lg:text-5xl sm:text-xl md:text-xl p-2 pl-5 font-bold flex-wrap w-auto" to="/">Calendario</button>
  <popup-component  v-if="menuOpened">
    <a class="rounded-md bg-blue-400 p-2" :href="logoutUrl">Cerrar Sesión</a>
  </popup-component>
  <select :value="useViewStore().mode" @change="useViewStore().setMode((<any>$event).target.value); refreshPath()" class="lg:w-1/12 w-1/5 ml-auto h-3/4 rounded rounded-md text-black pl-2">
    <option value="year">Año</option>
    <option value="month">Mes</option>
    <option value="week">Semana</option>
  </select>
  <!-- Time period -->
  <select v-if="useViewStore().mode=='year'" :value="useViewStore().yearInterval" @change="useViewStore().setYearInterval((<any>$event).target.value); refreshPath()" class=" lg:w-1/12 w-1/2  h-3/4 mr-2 text-black rounded rounded-md text-black pl-2">
    <option value="12months">12 meses</option>
    <option :value="getYear(index)"  v-for="index in 4" :textContent="getYear(index)" />
  </select>
  <!-- Month -->
  <!--div v-if="viewType=='month'" class="lg:w-1/3 flex flex-row-reverse lg:gap-4 gap-2 h-3/4 self-center text-black"-->
  <select v-if="useViewStore().mode=='month'" :value="useViewStore().month.year" @change="useViewStore().setMonthYear((<any>$event).target.value); refreshPath()" class="h-3/4 lg:w-1/12 w-16 rounded rounded-md lg:pl-2 text-black">
    <option :key="index" v-for="index of 4" :textContent="getYear(index)" :value="getYear(index)"/>
  </select>
  <select v-if="useViewStore().mode=='month'" :value="useViewStore().month.month" @change="useViewStore().setMonthMonth((<any>$event).target.value); refreshPath()" class="h-3/4 lg:w-1/12 lg:mr-2 w-28 rounded rounded-md lg:pl-2 text-black">
      <option :key="index" v-for="index of 12" :textContent="StringUtils.capitalize(DateUtils.getMonth(index))" :value="index"/>
    </select>
  <!-- /div-->
  <!-- Week -->
  <input v-if="useViewStore().mode=='week'" :value="useViewStore().week" @change="useViewStore().setWeek((<any>$event).target.value); refreshPath()" type="date" step="7" min="3-1-2022" class="h-3/4 rounded rounded-md text-black mr-2"/>
</nav>
</template>
<script setup lang="ts">
import {onBeforeMount, onMounted, ref} from "vue";
import router, {refreshPath} from "@/router";
import {DateUtils} from "@/libs/dateutils";
import {StringUtils} from "@/libs/stringutils";
import {useViewStore} from "@/stores/viewstore";
import PopupComponent from "@/components/PopupComponent.vue";
// @ts-ignore
import { logoutUrl } from "@/auth/auth";

let viewType = ref("year")
let currentYear : number;
let menuOpened = ref(false)

onBeforeMount(()=> {
  currentYear = new Date(Date.now()).getFullYear()
})


function getYear(index : number) : number {
  return currentYear-2+index;
}

function toggleMenu(){
  menuOpened.value = !menuOpened.value
}
</script>
<style scoped>

</style>
