
export class DateUtils{
    static getMonth(month : number):string{
        let dateObject = new Date();
        dateObject.setDate(1);
        dateObject.setMonth(month-1);
        return dateObject.toLocaleString(navigator.language, {month: "long"});
    }

    static getFollowing12Months() {
        let date = new Date(Date.now());
        let months: number[] = [];
        let years: number[] = [];
        for (let i=date.getMonth()+1; i<12+date.getMonth()+1; i++) {
            let j = i;
            let year = date.getFullYear();
            if(j>12){
                j-=12;
                year+=1;
            }
            months[months.length] = j;
            years[years.length] = year;
        }
        return {months: months, years: years};
    }

    static getMonthWeeks(month : number, year: number):number{
        let firstMonthDay = new Date(year, month-1,2);
        let lastMonthDay = new Date(year, month, 1);

        return Math.ceil((firstMonthDay.getUTCDay() +  lastMonthDay.getUTCDate())/7);
    }

    static getMonthDays(month: number, year : number) : number {
        switch (month){
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
                return 31;
            case 4:
            case 6:
            case 9:
            case 11:
                return 30;
            case 2:
                if (year%4==0){
                    if(year%100==0) {
                        if(year%400==0) {
                            return 29;
                        }
                    } else {
                        return 29;
                    }
                }
                return 28;
            default:
                return 0;
        }
    }

    static getDayInitial(day: number) :string {
        let monday = new Date(2023, 6, 3);
        let tuesday = new Date(2023, 6, 4);
        let wednesday = new Date(2023, 6, 5);
        let thursday = new Date(2023, 6, 6);
        let friday = new Date(2023, 6, 7);
        let saturday = new Date(2023, 6, 8);
        let sunday = new Date(2023, 6, 9);
        let date : Date | undefined;
        switch (day){
            case 1: date = monday; break;
            case 2: date = tuesday; break;
            case 3: date = wednesday; break;
            case 4: date = thursday; break;
            case 5: date = friday; break;
            case 6: date = saturday; break;
            case 7: date = sunday; break;
        }
        if(typeof  date == "undefined"){
            throw new Error();
        }
        let monthName = date.toLocaleString(navigator.language, {weekday: "long"});
        let character = monthName.charAt(0);
        return character.toLocaleUpperCase();
    }

    static getMonthOffset(year: number, month: number): number {
        let firstDay = new Date(year, month-1, 1);
        let day = firstDay.getDay();
        if(day==0) {
            day=6
        } else {
            day-=1;
        }

        return day;
    }
}
