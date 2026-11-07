import {defineStore} from "pinia";
import {type Ref, ref} from "vue";
import type {CalendarEvent, CalendarTask} from "@/libs/types";
import {DateUtils} from "@/libs/dateutils.ts";

export const newEvent : CalendarEvent= {
    type: "global",
    label: "Nuevo evento",
    date: new Date().toISOString().substring(0, 10),
    new: true
}

export const newTask :CalendarTask = {
    date: new Date().toISOString().substring(0, 10),
    label: "Nueva tarea",
    completed: false,
    new: true
}

export const useViewStore = defineStore('view', () => {
    const mode = ref('year');
    const yearInterval = ref('12months');
    const month = ref({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
    });
    const week :Ref<{ startingDay: Date }> = ref({
        startingDay: mondayThisWeek(),
    })

    function mondayThisWeek(): Date {
        let today = new Date();
        if (today.getDay() == 0 ){ // Sunday
            today.setDate(today.getDate() - 6);
        } else { // Any other days
            today.setDate(today.getDate() - today.getDay()+1);
        }
        return today;
    }

    const editingPopup = ref<'none' | 'event' | 'task'>("none");

    const editingEvent = ref<CalendarEvent>(Object.assign({}, newEvent))

    const editingTask = ref<CalendarTask>(Object.assign({}, newTask))

    function setMode(modeSetting : 'year' | 'month' | 'week' ){
        mode.value = modeSetting;
    }

    function setYearInterval(interval : string) {
        yearInterval.value = interval;
    }

    function setFullMonth(newMonth : {year: number, month: number}) {
        month.value = newMonth;
    }

    function setMonthMonth(newMonth: number){
        month.value.month = newMonth;
    }

    function setMonthYear(newYear: number){
        month.value.year = newYear;
    }
    // Weeks are referred by their starting monday (as that's the sketchy date picker method used)
    function setWeek(startingDate : Date) {
        week.value.startingDay = startingDate;
    }
    return {mode, setMode, yearInterval, month, week, editingPopup, editingEvent, editingTask, setYearInterval, setFullMonth, setMonthMonth, setMonthYear, setWeek};
});
