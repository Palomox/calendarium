import { createRouter, createWebHistory } from 'vue-router'
import HomeView from "@/views/HomeView.vue";
import YearView from "@/views/YearView.vue";
import {useViewStore} from "@/stores/viewstore";
import {logoutUrl, ory, session} from "@/auth/auth";

export function refreshPath() {
  let viewStore = useViewStore();
  switch(viewStore.mode){
    case "year": router.push("/year/"+viewStore.yearInterval); break;
    case "month": router.push("/year/"+viewStore.month.year+"/month/"+viewStore.month.month); break;
    case "week": router.push("/year/"+viewStore)
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: "Home view",
      path: "/",
      component: HomeView
    },
    {
      name: "Year view",
      path: "/year/:year",
      component: () => import('../views/YearView.vue'),
      props: route => ({year: route.params.year == "12months" ? route.params.year : Number(route.params.year) })
    },
    {
      name: "Month view",
      path: "/year/:year(\\d+)/month/:month(\\d+)",
      component: () => import('../views/MonthView.vue'),
      props: route => ({year: Number(route.params.year), month: Number(route.params.month)})
    },
  ]
})

router.beforeEach(async (from, to) => {
  if(session.value == undefined) {
    try {
      let result = await ory.toSession()
      session.value = result.data

      ory.createBrowserLogoutFlow().then(({data}) => {
        logoutUrl.value = data.logout_url+"&return_to="+window.location.href
      })
    } catch (e) {
      window.location.href = "/.ory/ui/login?return_to="+window.location.href
    }
  }
})

export default router
