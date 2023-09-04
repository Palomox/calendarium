import {defineStore} from "pinia";
import {reactive, ref} from "vue";
import type {CalendarEvent, CalendarPeriod} from "@/libs/types";
import axios from "axios";


const apiPath = "https://calendar-api.hopoke.workers.dev/api/v1"

export const useEventStore = defineStore('event', () => {
    const events = reactive({})

    const eventTypes = ref([])

    eventTypes.value[0] = {
        name: "global",
        prefix: "",
        color: "#d9b81e"
    }

    const periods = ref(
        [{
            name: "1er cuatrimestre",
            color: "#003dff",
            startDate: new Date(2023, 8, 4).getTime()/1000,
            endDate: new Date(2023, 11, 14).getTime()/1000,
            priority: 1
        }]
    )

    function getEventsForDay(day: string) : CalendarEvent[] {
        let eventsForDay = events.value[day]

        return eventsForDay == null ? [] : eventsForDay
    }

    function getPeriodsForDate(date: Date) : CalendarPeriod[] {
        let periodsForToday: CalendarPeriod[] = []

        for (let period of periods.value) {
            if(period.startDate<=date.getTime()/1000 && date.getTime()/1000<=period.endDate){
                periodsForToday[periodsForToday.length] = period
            }
        }
        return periodsForToday;
    }

    function fetchEventsFromApi(){
        axios.get(apiPath+"events").then((response) => {
            events.value = response.data
        });
    }

    return {events, getEventsForDay, periods, getPeriodsForDate, eventTypes, fetchEventsFromApi }
})
