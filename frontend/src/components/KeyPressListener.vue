<template>
</template>
<script setup lang="ts">
import {onBeforeUnmount, onMounted} from "vue";

const props = defineProps<{
  keyCode: string
}>()

const emit = defineEmits(['pressed'])

function emitPressed(event: KeyboardEvent) {
  if(event.code==props.keyCode){
    emit('pressed')
  }
}

onMounted(() => {
  addEventListener("keydown", emitPressed)
})

onBeforeUnmount(() => {
  removeEventListener("keydown", emitPressed)
})
</script>
<style scoped>

</style>
