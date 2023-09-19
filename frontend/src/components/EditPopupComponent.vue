<template>
<div class="z-[100] p-2 absolute rounded-md bg-zinc-700 left-0 right-0 ml-auto mr-auto top-0 bottom-0 mt-auto mb-auto h-min lg:w-1/2 w-3/4">
  <button @click="closePopup" class="w-8 h-8 close-button right-2 absolute">
    <font-awesome-icon icon="fa-solid fa-xmark"/>
  </button>
  <slot/>
</div>
</template>
<script setup lang="ts">

import {useViewStore} from "@/stores/viewstore";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

function closePopup(){
  useViewStore().editingPopup = 'none'
}
</script>
<style scoped>

</style>
