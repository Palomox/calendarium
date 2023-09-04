<template>
<span class="hover:cursor-default" :textContent="props.entry.type.prefix+' '+props.entry.label" :style="'color: '+entry.type.color" />
</template>
<script setup lang="ts">
import type {CalendarEvent} from "@/libs/types";

const props = defineProps<{
  entry : CalendarEvent
}>()
</script>
<style scoped>

</style>
