import {defineStore} from "pinia";
import {ref} from "vue";

export const useViewStore = defineStore('view', () => {
    const mode = ref('year');
    const yearInterval = ref('12months');
    const month = ref({
        year: 2023,
        month: 1
    });
    const week = ref('2023-06-06')
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
    function setWeek(newWeek : string) {
        week.value = newWeek;
    }
    return {mode, setMode, yearInterval, month, week, setYearInterval, setFullMonth, setMonthMonth, setMonthYear, setWeek};
});
