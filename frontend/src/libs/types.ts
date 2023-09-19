export type CalendarEvent = {
    type: string
    label: string
    date: string
    new?:boolean
}

export type CalendarEventType = {
    name: string
    prefix: string
    color: string
    new?:boolean
}

export type CalendarEventTypeMap = {
    [name: string]: CalendarEventType
}

export type CalendarTask = {
    label: string
    completed: boolean
    date: string
    new?: boolean
}

export type CalendarTaskMap = {
    [date: string]: CalendarTask[]
}

export type CalendarEventMap = {
    [date: string]: CalendarEvent[]
}

export type CalendarPeriod = {
    name: string
    color: string
    startdate: number
    enddate: number
    priority: number
    new?:boolean
}
