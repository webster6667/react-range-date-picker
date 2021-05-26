import {ReactElement} from "react";

export let moveDirection: 'next' | 'prev'
export let arrowDirection: 'left' | 'right'
export let MonthStatus: 'prev' | 'open' | 'next'

export interface HookProps {
    monthStatus: typeof  MonthStatus,
    cellDate: Date,
    selectedDate: Date | null,
    dateNumber: number
}

export interface SetDateProps {
    (setFunc: (date: Date) => Date)
}

export interface DateRangeProps {
    clickCount: number,
    dateFrom: Date | null,
    dateTo: Date | null,
    shouldClearDateToOnThirdClick: boolean,
    shouldFocusOnLastCellsOfRange: boolean,
    dateFromFocus: boolean,
    dateToFocus: boolean
}

export interface SetDateRangeProps {
    (setFunc: (data: DateRangeProps) => any)
}

export interface NavigationProps {
    openMonth: Date,
    setOpenMonth: SetDateProps,
    beforeChangeMonth?:any,
    afterChangeMonth?:any,
    beforeChangeYear?:any,
    afterChangeYear?:any
}

export interface DateTableProps {
    openMonth: Date,

    dateRange: DateRangeProps,
    setDateRange: SetDateRangeProps,

    cellContentLayout?(hookData:HookProps):ReactElement,
    beforeCellClick?:any,
    afterCellClick?:any,
}

export interface SingleFromToDataPickerProps {
    className?: string,
    openMonthDate?: Date,
    value?: [Date | null, Date | null] | [],
    shouldClearDateToOnThirdClick?: boolean,
    shouldFocusOnLastCellsOfRange?: boolean,
    cellContentLayout?(hookData:HookProps):ReactElement,
    beforeChangeMonth?:any,
    afterChangeMonth?:any,
    beforeChangeYear?:any,
    afterChangeYear?:any,
    beforeCellClick?:any,
    afterCellClick?:any,
}