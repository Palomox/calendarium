<template>
  <div class="flex flex-col w-full items-center mt-16">
    <form @submit.prevent="login()"  class="flex flex-col" >
      <label>ID</label>
      <input v-model="content.id" type="text">
      <label class="mt-4">Password</label>
      <input v-model="content.password" type="password">

      <input class="text-white bg-blue-400 mt-16" value="Log In" type="submit">
    </form>
  </div>
</template>
<script setup lang="ts">
import {onBeforeMount, ref} from "vue";
import {ory} from "@/auth/auth";
import router from "@/router";

let flow = ""
let csrfToken = ""

let content = ref({
  id: "",
  password: ""
})

onBeforeMount(async () => {
  let data = (await ory.createBrowserLoginFlow({})).data;

  flow = data.id;
  csrfToken = data.ui.nodes[0].attributes.value
})
async function login(){
  let response = await ory.updateLoginFlow({flow: flow, updateLoginFlowBody: {csrf_token: csrfToken, method: "password", identifier: content.value.id, password: content.value.password}},
      {
        headers: {
          Accept: "application/json"
        }
  })

  switch (response.status){
    case 200:
    case 400:
      router.back()
      break;
  }
}
</script>
<style scoped>
input{
  @apply text-black rounded-md h-10 w-full p-1
}

label{
  @apply text-2xl font-bold
}
</style>
