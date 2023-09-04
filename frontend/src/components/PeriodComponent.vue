<template>
<span class="hover:cursor-default" :textContent="props.period.name" :style="'color: '+period.color" />
</template>
<script setup lang="ts">
import type { CalendarPeriod} from "@/libs/types";

const props = defineProps<{
  period : CalendarPeriod
}>()
</script>
<style scoped>

</style>
