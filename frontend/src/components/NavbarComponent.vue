<template>
<nav class="bg-neutral-950 sticky shadow-l shadow-black text-white flex flex-col gap-1.5 top-0 w-full z-[1000] ">
  <div class="items-center flex flex-row lg:gap-4 gap-1 lg:max-h-16 max-h-8">
    <button class="lg:text-2xl sm:text-xl md:text-2xl pl-2 pt-0.5 flex-wrap w-auto font-titlebar text-indigo-500/85" :textContent="appName.toUpperCase()"/>
    <!-- Time period -->
    <select v-if="$route.meta.config == undefined && useViewStore().mode=='year'" :value="useViewStore().yearInterval" @change="useViewStore().setYearInterval((<any>$event).target.value); refreshPath()" class="ml-auto lg:w-1/12 w-1/2 mr-2 rounded-md mt-1 ">
      <option value="12months">12 meses</option>
      <option :value="getYear(index)"  v-for="index in 4" :textContent="getYear(index)" />
    </select>
    <!-- Month -->
    <!--div v-if="viewType=='month'" class="lg:w-1/3 flex flex-row-reverse lg:gap-4 gap-2 h-3/4 self-center text-black"-->
    <select v-if="$route.meta.config == undefined && useViewStore().mode=='month'" :value="useViewStore().month.year" @change="useViewStore().setMonthYear((<any>$event).target.value); refreshPath()" class="ml-auto mt-1 rounded rounded-md">
      <option :key="index" v-for="index of 4" :textContent="getYear(index)" :value="getYear(index)"/>
    </select>
    <select v-if="$route.meta.config == undefined && useViewStore().mode=='month'" :value="useViewStore().month.month" @change="useViewStore().setMonthMonth((<any>$event).target.value); refreshPath()" class="lg:w-1/12 lg:mr-2 rounded rounded-md mt-1">
      <option :key="index" v-for="index of 12" :textContent="StringUtils.capitalize(DateUtils.getMonth(index))" :value="index"/>
    </select>
    <!-- /div-->
    <!-- Week -->
    <input v-if="$route.meta.config == undefined && useViewStore().mode=='week'" :value="DateUtils.getStandardString(useViewStore().week.startingDay)" @change="(event: any) => {useViewStore().setWeek(new Date(<string>event.target.value)); refreshPath()}" type="date" step="7" min="2022-01-03" class="ml-auto rounded-md mr-2 mt-1 border-neutral-500 bg-neutral-950 text-indigo-400/90 border-[0.5px] px-2 p-0.5"/>
  </div>
  <div class="flex flex-row pl-1 gap-1 border-b-2 border-neutral-700">
    <div class="border-indigo-600 test">
      <button class="nav-element" :class="$route.meta.config == undefined &&  useViewStore().mode == 'year' ? 'selected-view' : ''" @click="useViewStore().setMode('year'); refreshPath()">Año</button>
      <!--svg height="4px" width="3rem" xmlns="http://www.w3.org/2000/svg">
        <line
            x1="0"
            y1="0"
            x2="100%"
            y2="0"
            class="line"
        />
      </svg-->
    </div>
    <div class="border-indigo-600">
      <button class="nav-element" :class="$route.meta.config == undefined && useViewStore().mode == 'month' ? 'selected-view' : ''" @click="useViewStore().setMode('month'); refreshPath()">Mes</button>
    </div>
    <div class="border-indigo-600">
      <button class="nav-element" :class="$route.meta.config == undefined && useViewStore().mode == 'week' ? 'selected-view' : ''" @click="useViewStore().setMode('week'); refreshPath()">Semana</button>
    </div>
    <div class="ml-auto border-indigo-600">
      <router-link to="/options" class="nav-element block" :class="$route.meta.config != undefined && $route.meta.config ? 'selected-view' : ''">Opciones</router-link>
    </div>
    <div class="border-indigo-600 mr-1">
      <a class="nav-element block" :href="logoutUrl">Cerrar Sesión</a>
    </div>
  </div>
</nav>
</template>
<script setup lang="ts">
import { onBeforeMount } from "vue";
import {refreshPath} from "@/router";
import {DateUtils} from "@/libs/dateutils";
import {StringUtils} from "@/libs/stringutils";
import {useViewStore} from "@/stores/viewstore";
import { logoutUrl } from "@/auth/auth";
import {appName} from "@/main";

let currentYear : number;

onBeforeMount(()=> {
  currentYear = new Date(Date.now()).getFullYear()
})

function getYear(index : number) : number {
  return currentYear-2+index;
}
</script>
<style scoped>
@reference "@/assets/main.css";

.nav-element{
  @apply rounded-sm mb-1 p-0.5 px-1.5 cursor-pointer;
}

.nav-element:hover {
  @apply hover:bg-neutral-900;
}

.test svg {
  position: relative;
}

.test .line {
  stroke-width: 4px;
  stroke: var(--color-indigo-700);
}

select {
  @apply border-neutral-500 bg-neutral-950 text-indigo-400/90 border-[0.5px] p-1 pl-2;
}

div:has(>.selected-view) {
  border-bottom-width: 2px;
  margin-bottom: -2px;
}

</style>
