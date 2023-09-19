<template>
<h1 class="text-9xl">TBD</h1>
</template>
<script setup lang="ts">
  import {onMounted} from "vue";
  import {useViewStore} from "@/stores/viewstore";

  const props = defineProps<{
    year: number
    week: number
  }>()

  const viewStore = useViewStore();


  onMounted(() => {
    viewStore.setMode("week")
    viewStore.setWeek({
      year: props.year,
      week: props.week
    })
  })
</script>
<style scoped>

</style>
