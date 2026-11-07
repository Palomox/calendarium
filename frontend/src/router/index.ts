import {createRouter, createWebHistory} from 'vue-router'
import HomeView from "@/views/HomeView.vue";
import {useViewStore} from "@/stores/viewstore";
import {logoutUrl, ory, session} from "@/auth/auth";
import {vercelEnv} from "@/main";
import {DateUtils} from "@/libs/dateutils.ts"

export function refreshPath() {
    let viewStore = useViewStore();
    switch (viewStore.mode) {
        case "year":
            router.push("/year/" + viewStore.yearInterval);
            break;
        case "month":
            router.push("/year/" + viewStore.month.year + "/month/" + viewStore.month.month);
            break;
        case "week":
            router.push("/week/"+  DateUtils.getStandardString(viewStore.week.startingDay));
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
            component: () => import('@/views/YearView.vue'),
            props: route => ({year: route.params.year == "12months" ? route.params.year : Number(route.params.year)})
        },
        {
            name: "Month view",
            path: "/year/:year(\\d+)/month/:month(\\d+)",
            component: () => import('@/views/MonthView.vue'),
            props: route => ({year: Number(route.params.year), month: Number(route.params.month)})
        },
        {
            name: "Week view",
            path: "/week/:week(\\d+-\\d+-\\d+)",
            component: () => import('@/views/WeekView.vue'),
            props: route => ({week: new Date(<string>route.params.week)})
        },
        {
            name: "Options",
            path: "/options",
            meta: {config: true},
            component: () => import('@/views/OptionsView.vue')
        },
    ]
})
router.beforeEach(async () => {
    if (session.value == undefined) {
        try {
            let result = await ory.toSession()
            session.value = result.data

            ory.createBrowserLogoutFlow({returnTo: window.location.origin}).then(({data}) => {
                logoutUrl.value = data.logout_url
            })
        } catch (e) {
            window.location.href = import.meta.env.VITE_ORY_DOMAIN+"/ui/login" + (vercelEnv == 'development' ? '' : '?return_to='+window.location.href)
        }
    }
})



export default router
