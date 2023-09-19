import {defineStore} from "pinia";
import {ref} from "vue";
import type {
    CalendarEvent,
    CalendarEventMap,
    CalendarEventTypeMap,
    CalendarPeriod,
    CalendarTaskMap
} from "@/libs/types";
import axios from "axios";


export const apiPath = import.meta.env.VITE_API_PATH;

export const useEventStore = defineStore('event', () => {
    const events = ref<{events: CalendarEventMap}>({events: {}})

    const eventTypes = ref<{event_types: CalendarEventTypeMap}>({event_types: {}})

    const periods = ref<{periods: CalendarPeriod[]}>({periods: []})

    const tasks = ref<{tasks: CalendarTaskMap}>({tasks: {}})

    const interval = ref<{
        startDate?: string,
        endDate?: string
    }>({
        startDate: undefined,
        endDate: undefined
    })

    function getEventsForDay(day: string) : CalendarEvent[] {
        let eventsForDay = events.value.events[day]

        return eventsForDay == null ? [] : eventsForDay
    }

    function getPeriodsForDate(date: Date) : CalendarPeriod[] {
        let periodsForToday: CalendarPeriod[] = []

        for (let period of periods.value.periods) {
            if(period.startdate<=date.getTime()/1000 && date.getTime()/1000<=period.enddate){
                periodsForToday[periodsForToday.length] = period
            }
        }
        return periodsForToday;
    }

    async function fetchEventsFromApi(intialDate?: string, finalDate?: string){
        let response = await axios.get(apiPath+"events", {withCredentials: true, params: {
                startDate: intialDate,
                endDate: finalDate
            }})
        events.value.events = <CalendarEventMap>response.data
    }

    async function fetchEventsFromApiWithStoredInterval(){
        await fetchEventsFromApi(interval.value.startDate, interval.value.endDate)
    }

    async function fetchEventTypesFromApi(){
        let response = await axios.get(apiPath+"events/types", {withCredentials: true})

        eventTypes.value.event_types = <CalendarEventTypeMap>response.data
    }
    async function fetchPeriodsFromApi(){
        let response = await axios.get(apiPath+"periods", {withCredentials: true})

        periods.value.periods = <CalendarPeriod[]>response.data.periods
    }
    async function fetchTasksFromApi(intialDate?: string, finalDate?: string){
        let response = await axios.get(apiPath+"tasks", {withCredentials: true, params: {
                startDate: intialDate,
                endDate: finalDate
            }})

        tasks.value.tasks = <CalendarTaskMap>response.data
    }

    async function fetchTasksFromApiWithStoredInterval(){
        await fetchTasksFromApi(interval.value.startDate, interval.value.endDate)
    }
    function fetchAllFromApi(initialDate?: string, finalDate?: string) {
        fetchEventTypesFromApi().then(() => {
            fetchEventsFromApi(initialDate, finalDate)
            fetchPeriodsFromApi()
            fetchTasksFromApi(initialDate, finalDate)
        })
    }

    function fetchAllFromApiWithStoredInterval(){
        fetchAllFromApi(interval.value.startDate, interval.value.endDate)
    }


    return {events, getEventsForDay, periods, getPeriodsForDate, eventTypes, tasks, interval, fetchEventsFromApi, fetchEventsFromApiWithStoredInterval, fetchPeriodsFromApi, fetchTasksFromApi, fetchTasksFromApiWithStoredInterval,fetchEventTypesFromApi, fetchAllFromApi, fetchAllFromApiWithStoredInterval }
})
