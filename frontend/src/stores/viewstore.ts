import {defineStore} from "pinia";
import {ref} from "vue";
import type {CalendarEvent, CalendarTask} from "@/libs/types";

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
        year: 2023,
        month: 1
    });
    const week = ref({
        year: 2023,
        week: 3
    })

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
    function setWeek(newWeek : {year: number, week: number}) {
        week.value = newWeek;
    }
    return {mode, setMode, yearInterval, month, week, editingPopup, editingEvent, editingTask, setYearInterval, setFullMonth, setMonthMonth, setMonthYear, setWeek};
});
