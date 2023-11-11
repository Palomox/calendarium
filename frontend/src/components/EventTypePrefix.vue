<template>
<span v-if="content != ''" class="hover:cursor-default rounded rounded-s px-1 py-0.5 mr-1 text-center" :title="event_type" :textContent="content" :style="inlineStyles">
</span>
</template>
<script setup lang="ts">
import {computed} from "vue";
import {useEventStore} from "@/stores/eventstore";
import {StringUtils} from "@/libs/stringutils";

const props = defineProps<{
  event_type: string
}>()

const content = computed(() => {
  return useEventStore().eventTypes.event_types[props.event_type].prefix
})

const inlineStyles = computed(() => {
  let bgColor = useEventStore().eventTypes.event_types[props.event_type].color

  let bgColorStyle = "background-color: "+bgColor+";"

  let triplet = StringUtils.hexToRgb(bgColor)

  let textColor

  if(triplet == null){
    textColor = "#ffffff"
  } else {
    textColor = (triplet.r * 0.299 + triplet.g * 0.587 + triplet.b * 0.114) > 186 ? '#000000' : '#ffffff'
  }

  let textColorStyle = "color: "+textColor+";"


  return bgColorStyle + textColorStyle
})
</script>
<style scoped>

</style>
