import {createRouter, createWebHistory} from 'vue-router'
import HomeView from "@/views/HomeView.vue";
import {useViewStore} from "@/stores/viewstore";
import {logoutUrl, ory, session} from "@/auth/auth";

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
            router.push("/year/" + viewStore)
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
            props: route => ({year: route.params.year == "12months" ? route.params.year : Number(route.params.year)})
        },
        {
            name: "Month view",
            path: "/year/:year(\\d+)/month/:month(\\d+)",
            component: () => import('../views/MonthView.vue'),
            props: route => ({year: Number(route.params.year), month: Number(route.params.month)})
        },
        {
            name: "Login",
            path: "/login",
            component: () => import('../views/LoginView.vue')
        },
        {
            name: "Edit Event Types",
            path: "/event_types",
            meta: {config: true},
            component: () => import('../views/EditEventTypesView.vue')
        },
        {
            name: "Edit Periods",
            path: "/periods",
            meta: {config: true},
            component: () => import('../views/EditPeriodsView.vue')
        }
    ]
})


export default router
