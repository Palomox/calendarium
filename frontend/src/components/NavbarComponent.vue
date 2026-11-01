<template>
<nav class="bg-zinc-900 sticky  shadow-l shadow-black text-white flex flex-col top-0 w-full z-[1000] ">
  <div class="items-center flex flex-row lg:gap-4 gap-1 lg:max-h-16 max-h-8">
    <button ref="entrypoint" @click="menuOpened = true" class="lg:text-2xl sm:text-xl md:text-2xl pl-2 text-gray-400 flex-wrap w-auto" :textContent="appName"/>
    <teleport to="#navpopuplayer">
      <popup-component :style="popupPosition" class="absolute pointer-events-auto" v-if="menuOpened" @close_popup="toggleMenu" >
        <div class="flex flex-col m-2 gap-2">
          <a class="regular-button p-2" :href="logoutUrl">Cerrar Sesión</a>
          <router-link to="/event_types" class="regular-button p-2">Editar tipos de eventos</router-link>
          <router-link to="/periods" class="regular-button p-2">Editar periodos</router-link>
          <router-link v-if="$route.meta.config != undefined && $route.meta.config == true" to="/" class="regular-button p-2">Volver al calendario</router-link>
        </div>
      </popup-component>
    </teleport>
    <!-- Time period -->
    <select v-if="useViewStore().mode=='year'" :value="useViewStore().yearInterval" @change="useViewStore().setYearInterval((<any>$event).target.value); refreshPath()" class="ml-auto lg:w-1/12 w-1/2  h-3/4 mr-2 text-black rounded rounded-md text-black pl-2">
      <option value="12months">12 meses</option>
      <option :value="getYear(index)"  v-for="index in 4" :textContent="getYear(index)" />
    </select>
    <!-- Month -->
    <!--div v-if="viewType=='month'" class="lg:w-1/3 flex flex-row-reverse lg:gap-4 gap-2 h-3/4 self-center text-black"-->
    <select v-if="useViewStore().mode=='month'" :value="useViewStore().month.year" @change="useViewStore().setMonthYear((<any>$event).target.value); refreshPath()" class="ml-auto h-3/4 lg:w-1/12 w-16 rounded rounded-md lg:pl-2 text-black">
      <option :key="index" v-for="index of 4" :textContent="getYear(index)" :value="getYear(index)"/>
    </select>
    <select v-if="useViewStore().mode=='month'" :value="useViewStore().month.month" @change="useViewStore().setMonthMonth((<any>$event).target.value); refreshPath()" class="h-3/4 lg:w-1/12 lg:mr-2 w-28 rounded rounded-md lg:pl-2 text-black">
      <option :key="index" v-for="index of 12" :textContent="StringUtils.capitalize(DateUtils.getMonth(index))" :value="index"/>
    </select>
    <!-- /div-->
    <!-- Week -->
    <input v-if="useViewStore().mode=='week'" :value="DateUtils.getStandardString(useViewStore().week.startingDay)" @change="(event: any) => {useViewStore().setWeek(new Date(<string>event.target.value)); refreshPath()}" type="date" step="7" min="2022-01-03" class="ml-auto h-3/4 rounded rounded-md text-black mr-2"/>
  </div>
  <div class="flex flex-row pl-2 gap-2 border-b-2 border-zinc-800">
    <button class="nav-element" :class="useViewStore().mode == 'year' ? 'selected-view' : ''" @click="useViewStore().setMode('year'); refreshPath()">Año</button>
    <button class="nav-element" :class="useViewStore().mode == 'month' ? 'selected-view' : ''" @click="useViewStore().setMode('month'); refreshPath()">Mes</button>
    <button class="nav-element" :class="useViewStore().mode == 'week' ? 'selected-view' : ''" @click="useViewStore().setMode('week'); refreshPath()">Semana</button>
  </div>
</nav>
</template>
<script setup lang="ts">
import {computed, onBeforeMount, ref} from "vue";
import {refreshPath} from "@/router";
import {DateUtils} from "@/libs/dateutils";
import {StringUtils} from "@/libs/stringutils";
import {useViewStore} from "@/stores/viewstore";
import PopupComponent from "@/components/PopupComponent.vue";
// @ts-ignore
import { logoutUrl } from "@/auth/auth";
import {appName} from "@/main";

const entrypoint = ref(null)

let currentYear : number;
let menuOpened = ref(false)

const popupPosition = computed(() => {
  let box = (<unknown>entrypoint.value as HTMLElement).getBoundingClientRect()

  return `top: ${box.top+15}px; left: ${box.right+5}px;`
});

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
.nav-element:hover {
  background-color: theme('colors.zinc.600');
}
.nav-element.selected-view {
  border-bottom-color: theme('colors.indigo.600');
  border-bottom-width: 2px;
  margin-bottom: -2px;
}

</style>
