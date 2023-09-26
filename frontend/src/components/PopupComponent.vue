<template>
  <div ref="container" id="popup" class="relative p-2 bg-zinc-800 shadow-md shadow-black inline-block rounded-r-md rounded-b-md">
    <slot/>
  </div>
</template>
<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue";

  const emits = defineEmits(['close_popup'])

  const container = ref(null)



  onMounted(() => {
    document.addEventListener("click", () => {
      // This registers the click of when the popup is opened, and adds an event listener for further clicks
      document.addEventListener('click', clickListener)
    } , {
      once: true
    })
  });

  onUnmounted(() => {
    document.removeEventListener('click', clickListener)
  })

  function clickListener(event : MouseEvent) {
    let boundingBox = (<unknown> container.value as HTMLElement).getBoundingClientRect()

    if(event.x < boundingBox.left || boundingBox.top > event.y || boundingBox.right < event.x || event.y > boundingBox.bottom) {
      // outside the popup
      emits('close_popup')
    }
  }
</script>
<style scoped>
#popup::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  margin-left: -2rem;
  border-width: 1rem;
  border-style: solid;
  border-color: transparent theme('colors.zinc.800') transparent transparent;
}
</style>
