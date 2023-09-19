<template>
  <month-component :year="props.year" :month="props.month" :big="isBig" />
</template>
<script setup lang="ts">

import MonthComponent from "@/components/MonthComponent.vue";
import {computed, onBeforeMount, onBeforeUnmount, ref} from "vue";
import {useViewStore} from "@/stores/viewstore";
import EditDayComponent from "@/components/PopupComponent.vue";
import {useEventStore} from "@/stores/eventstore";

const props = defineProps<{
  year: number
  month: number
}>()

let eventStore = useEventStore()

let width = ref(window.matchMedia('(min-width: 57rem)').matches)

function onResize() {
  width.value = window.matchMedia('(min-width: 57rem)').matches;
}

const isBig = computed(() => {
  return width.value;
})

onBeforeMount(() => {
  useViewStore().setMode("month");
  useViewStore().setFullMonth({year: props.year, month:props.month})

  addEventListener("resize", onResize)
})

eventStore.interval.startDate = "1-"+props.month+"-"+props.year
eventStore.interval.endDate = "31-"+props.month+"-"+props.year

useEventStore().fetchAllFromApiWithStoredInterval()


onBeforeUnmount(()=> {
  removeEventListener('resize', onResize)
})
</script>
<style scoped>

</style>
