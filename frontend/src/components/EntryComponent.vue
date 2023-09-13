<template>
<span class="hover:cursor-default" :textContent="useEventStore().eventTypes.event_types[props.entry.type].prefix+' '+props.entry.label" :style="'color: '+useEventStore().eventTypes.event_types[props.entry.type].color" />
</template>
<script setup lang="ts">
import type {CalendarEvent} from "@/libs/types";
import {useEventStore} from "@/stores/eventstore";
import {computed} from "vue";

const props = defineProps<{
  entry : CalendarEvent
}>()

const text = computed(() => useEventStore().eventTypes.event_types[props.entry.type].prefix+' '+props.entry.label)
</script>
<style scoped>

</style>
