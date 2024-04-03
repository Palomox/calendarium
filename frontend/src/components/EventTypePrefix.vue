<template>
<span ref="box" class="align-middle inline-block hover:cursor-default rounded rounded-s px-1 py-0.5 mr-1 text-center" :title="event_type" :textContent="content" :style="inlineStyles">
</span>
</template>
<script setup lang="ts">
import {computed, onBeforeMount, onMounted, ref} from "vue";
import {useEventStore} from "@/stores/eventstore";
import {StringUtils} from "@/libs/stringutils";
import twemoji from "twemoji";
import {findEmoji} from "@/emoji_helpers/emoji_helper";

const box = ref<HTMLElement | null>(null)


const props = defineProps<{
  event_type: string
}>()

const content = ref(useEventStore().eventTypes.event_types[props.event_type].prefix)

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

onBeforeMount(() => {
  if(content.value.includes(":")) {
    let prefix = content.value
    for (let matched of prefix.matchAll(/:.*:/g)) {
      for (let item of matched) {
        // @ts-ignore
        let name = item.replaceAll(":", "")
        let emoji = findEmoji(name)

        content.value = content.value.replace(item, emoji)

      }
    }
  }

})
onMounted(() => {
  twemoji.parse(box.value as HTMLElement, {folder: 'svg', ext: '.svg', base: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/"})
})

</script>
<style scoped>

</style>
