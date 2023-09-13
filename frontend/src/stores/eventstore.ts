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

    function fetchEventsFromApi(intialDate?: string, finalDate?: string){
        axios.get(apiPath+"events", {withCredentials: true, params: {
                startDate: intialDate,
                endDate: finalDate
            }}).then((response) => {
            events.value.events = <CalendarEventMap>response.data
        });
    }
    function fetchEventTypesFromApi(){
        axios.get(apiPath+"events/types", {withCredentials: true}).then((response) => {
            eventTypes.value.event_types = <CalendarEventTypeMap>response.data
        });
    }
    function fetchPeriodsFromApi(){
        axios.get(apiPath+"periods", {withCredentials: true}).then((response) => {
            periods.value.periods = <CalendarPeriod[]>response.data.periods
        });
    }
    function fetchTasksFromApi(intialDate?: string, finalDate?: string){
        axios.get(apiPath+"tasks", {withCredentials: true, params: {
                startDate: intialDate,
                endDate: finalDate
            }}).then((response) => {
            tasks.value.tasks = <CalendarTaskMap>response.data
        });
    }

    function fetchAllFromApi(initialDate?: string, finalDate?: string) {
        fetchEventsFromApi(initialDate, finalDate)
        fetchEventTypesFromApi()
        fetchPeriodsFromApi()
        fetchTasksFromApi(initialDate, finalDate)
    }


    return {events, getEventsForDay, periods, getPeriodsForDate, eventTypes, tasks, fetchEventsFromApi, fetchPeriodsFromApi, fetchTasksFromApi, fetchEventTypesFromApi, fetchAllFromApi }
})
