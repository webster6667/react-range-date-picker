import React, {FC, ReactElement, useState} from "react";
import {useImmer} from "use-immer";
import ReactDOM from 'react-dom'
import {blockClassesConcat, bemClassName, elementClassesConcat} from 'bem-components-connector'

import {
    getFirstDateOfMonth,
    getLastDateOfMonth,
    getMonthNameByMonthIndex,
    getNextMonth,
    getPrevMonth,
    getDayOfWeekNumber,
    getDayOfMonthNumber,
    getDateByDayOfMonthNumber,
    isDatesEqual
} from 'date-helper-js'

import './style.less'


import SvgArrow from './img/arrow.svg'


import {
    moveDirection,
    arrowDirection,
    DateTableProps,
    MonthStatus,
    SingleFromToDataPickerProps,
    HookProps,
    NavigationProps, DateRangeProps, SetDateRangeProps
} from "./types"

const block = bemClassName('range-date-picker')

const Arrow: FC<{duration: typeof arrowDirection, onClick, children?}> = ({duration = 'left', onClick, children = null}) => {
    return (<div onClick={onClick} className={elementClassesConcat(block(), 'arrow', {[duration]: true})} >
        {children ? children : <SvgArrow />}
    </div>)
}

const DayOfWeekList: FC<{dayOfWeekArray?: string[]}> = ({dayOfWeekArray = ['П', 'В', 'С', 'Ч', 'П', 'С', 'В']}) => {

    const dayOfWeekList = dayOfWeekArray.map((item, key) => {
        return (<span className={block('day-of-week')} key={key}>
            {item}
        </span>)
    })

    return (<div className={block('header-row')}>
        {dayOfWeekList}
    </div>)
}

const Navigation = ({openMonth, setOpenMonth, beforeChangeMonth, afterChangeMonth, beforeChangeYear, afterChangeYear}:NavigationProps) => {

    const openMonthIndex = openMonth.getMonth(),
          openMonthName = getMonthNameByMonthIndex(openMonthIndex),
          openMontYearNumber = openMonth.getFullYear(),
          changeMonth = async (duration: typeof moveDirection) => {
              const needMonth = duration === 'next' ? getNextMonth(openMonth) : getPrevMonth(openMonth),
                    isYearWasChanged = openMonth.getFullYear() !== needMonth.getFullYear()

              //Хук до смены месяца
              if (typeof beforeChangeMonth === 'function') {
                  await beforeChangeMonth()
              }

              //Хук до смены года
              if (typeof beforeChangeYear === 'function' && isYearWasChanged) {
                  await beforeChangeYear()
              }

              //Сменить месяц
              setOpenMonth(() => {
                  return needMonth
              })

              //Хук после смены месяца
              if (typeof afterChangeMonth === 'function') {
                  await afterChangeMonth()
              }

              //Хук после смены года
              if (typeof afterChangeYear === 'function' && isYearWasChanged) {
                  await afterChangeYear()
              }

          }


    return (<div className={block('nav')}>

                <Arrow duration={'left'} onClick={() => changeMonth("prev")} />
                        <div className={block('selected-month')}>
                            <span className={block('month-name')} >
                                {openMonthName}
                            </span>
                            <span className={block('full-year')} >
                                {openMontYearNumber}
                            </span>
                        </div>
                <Arrow duration={'right'} onClick={() => changeMonth('next')} />

    </div>)

}

const pushCellsToTable = (cellContentLayout: (hookData:HookProps) => ReactElement | null,
                          dateRange: DateRangeProps,
                          setDateRange: SetDateRangeProps,

                          beforeCellClick,
                          afterCellClick
) => {
    let table: ReactElement[] = [],
        row: ReactElement[] = [],
        quantityFilledCellsInRow: number = 0,
        hasRowStartDate = false,
        hasRowFinishDate = false,
        shouldCheckRowBetweenRange = false,
        filledRowCount = 0,
        {dateFrom, dateTo, clickCount} = dateRange


    return (monthStatus: typeof MonthStatus, pushMonth: Date, monthDaysCount: number = 0, cellModifier = '', dayForStartIteration: number = null) => {

            Array(monthDaysCount).fill('').forEach((_, key: number) => {
                let iterationStep = ++key,
                    dateNumber = dayForStartIteration ? dayForStartIteration + iterationStep : iterationStep,
                    cellDate = getDateByDayOfMonthNumber(pushMonth, dateNumber),
                    isRangeStartCell: boolean = dateFrom !== null ? isDatesEqual(cellDate, dateFrom) : false,
                    isRangeFinishCell: boolean = dateTo !== null ? isDatesEqual(cellDate, dateTo) : false,
                    isDateRangeExist = Boolean(dateFrom && dateTo),
                    isCellFromRange = isDateRangeExist ? cellDate > dateFrom && cellDate < dateTo || isRangeStartCell || isRangeFinishCell : false,
                    isStartOfRangeOnFocus = clickCount === 3 && isDatesEqual(cellDate, dateFrom),
                    isFinishOfRangeOnFocus = dateTo && clickCount === 2 && isDatesEqual(cellDate, dateTo),

                    //@todo: think about name
                    isRangeFinishCellOnFocus = isStartOfRangeOnFocus || isFinishOfRangeOnFocus,
                    cellClasses = elementClassesConcat(block(), 'date-cell',
                        {
                            [cellModifier]: Boolean(cellModifier),
                            selected: isCellFromRange,
                            from: isRangeStartCell,
                            to: isRangeFinishCell,
                            focus: isRangeFinishCellOnFocus
                        }),
                    hookData = {monthStatus, cellDate, selectedDate: null, dateNumber},
                    cellContent = typeof cellContentLayout === 'function' ? cellContentLayout(hookData) : dateNumber

                 if (isCellFromRange) ++quantityFilledCellsInRow

                if (isRangeStartCell) hasRowStartDate = true
                if (isRangeFinishCell) hasRowFinishDate = true



                //Обработать клик from-to
                row.push(<div
                    key={cellDate.getTime()}
                    className={cellClasses}
                    onClick={async () => {

                        //Хук до клика
                        if (typeof beforeCellClick === 'function') {
                            await beforeCellClick(cellDate)
                        }

                        setDateRange((range) => {
                            const {dateFrom, dateTo, clickCount, shouldClearDateToOnThirdClick, shouldFocusOnLastCellsOfRange} = range,
                                  wasFinishDateClicked = isDatesEqual(dateTo, cellDate),
                                  wasStartDateClicked = isDatesEqual(dateFrom, cellDate)

                            switch (clickCount) {
                                case 1:
                                    range.dateFrom = cellDate
                                    range.clickCount = 2
                                break
                                case 2:

                                    //Если можно сфокусироватся на крайней дате
                                    if (shouldFocusOnLastCellsOfRange && wasStartDateClicked) {
                                            range.dateFrom = cellDate
                                            range.dateTo = dateTo
                                            range.clickCount = 3
                                    } else {

                                        //Развернуть даты если дата финиша меньше даты старта
                                        if (cellDate < dateFrom) {
                                            range.dateFrom = cellDate
                                            range.dateTo = dateFrom

                                            //Скидывать даты на третий клик
                                            if (shouldClearDateToOnThirdClick) {
                                                range.clickCount = 3
                                            } else {
                                                range.clickCount = 2
                                            }

                                        } else {
                                            range.dateTo = cellDate
                                            range.clickCount = 3
                                        }

                                    }

                                    //Не создавать диапазон при повторном клике на дату старта
                                    if (!isDateRangeExist && wasStartDateClicked) {
                                        range.dateTo = null
                                        range.dateFrom = cellDate
                                        range.clickCount = 1
                                    }

                                break
                                case 3:

                                    //Если кликнули по дате финиша при созданом диапазоне
                                    if (wasFinishDateClicked && shouldFocusOnLastCellsOfRange) {
                                        range.dateTo = cellDate
                                        range.clickCount = 2
                                        //Если кликнули по дате старта при созданом диапазоне
                                    } else if(wasStartDateClicked && shouldFocusOnLastCellsOfRange) {
                                        range.dateFrom = cellDate
                                        range.clickCount = 1
                                    } else {

                                        //Если на третий клик сбрасывается дата финиша
                                        if (shouldClearDateToOnThirdClick) {
                                            range.clickCount = 2
                                            range.dateTo = null
                                            range.dateFrom = cellDate
                                        } else {

                                            //Развернуть даты, если start больше finish
                                            if (cellDate > dateTo) {
                                                range.dateFrom = dateTo
                                                range.dateTo = cellDate
                                                range.clickCount = 3
                                            } else {
                                                range.dateFrom = cellDate
                                                range.clickCount = 2
                                            }

                                        }

                                    }

                                break
                            }



                        })

                        //Хук после клика
                        if (typeof afterCellClick === 'function') {
                            await afterCellClick(cellDate)
                        }

                    }}
                >
                    <span>
                        {cellContent}
                    </span>
                </div>)


                
                if (row.length === 7) {
                    let rowModifier = 'filled',
                        isRowFilled = Boolean(quantityFilledCellsInRow),
                        isFirstRowBetweenRange = shouldCheckRowBetweenRange && !hasRowFinishDate && isDateRangeExist || false

                    if (isRowFilled) filledRowCount++

                    //Отметить полностью заполненную строку
                    if (quantityFilledCellsInRow === 7) {
                        rowModifier = 'full-filled'
                    }


                    //Отметить предпоследнюю строку
                    if (hasRowFinishDate && !hasRowStartDate && filledRowCount > 2) {

                        let penultimateRowKey = table.length - 1,
                            penultimateRow = table[penultimateRowKey]

                        table[table.length - 1] = (<div
                            key={penultimateRowKey}
                            className={elementClassesConcat(block(),'date-row', {
                                [rowModifier]: isRowFilled,
                                firstRowBetweenRange: filledRowCount === 3,
                                penultimateRow: true
                            })}>
                            {penultimateRow.props.children}
                        </div>)

                    }
                    
                    table.push(<div
                            key={table.length}
                            className={elementClassesConcat(block(),'date-row', {
                                [rowModifier]: isRowFilled, 
                                hasStartDate: hasRowStartDate, 
                                hasFinishDate: hasRowFinishDate,
                                firstRowBetweenRange: isFirstRowBetweenRange
                            })}
                            >
                        {row}
                    </div>)

                    row = []
                    quantityFilledCellsInRow = 0


                    shouldCheckRowBetweenRange = false

                    //Была добавленна первая строка
                    if (hasRowStartDate && !hasRowFinishDate) shouldCheckRowBetweenRange = true

                    hasRowStartDate = false
                    hasRowFinishDate = false
                }
            })

            return [table]

    }

}

const DateTable = ({
                    openMonth,

                    dateRange,
                    setDateRange,

                    cellContentLayout,

                    beforeCellClick,
                    afterCellClick
}:DateTableProps) => {
    
    //Пред месяц
    const prevMonth = getPrevMonth(openMonth),
          nextMonth = getNextMonth(openMonth)

    //Последнее число(type Data, type Number) предыдущего месяца
    const lastDateOfPrevMonth = getLastDateOfMonth(prevMonth),
          lastDateNumberOfPrevMonth = getDayOfMonthNumber(lastDateOfPrevMonth)

    //Крайние даты открытого месяца
    const firstDateOfMonth = getFirstDateOfMonth(openMonth),
          lastDateOfMonth =  getLastDateOfMonth(openMonth)

    //Дни недели крайних дат открытого месяца
    const dayOfWeekFirstDayOfMonth = getDayOfWeekNumber(firstDateOfMonth), //День недели первого числа месяца
          dayOfWeekLastDayOfMonth = getDayOfWeekNumber(lastDateOfMonth) //День недели последнего числа месяца
    
    //Кол-во каждого месяца
    let prevMonthDaysCount = dayOfWeekFirstDayOfMonth ? dayOfWeekFirstDayOfMonth - 1 : 6,
        openMontDaysCount = getDayOfMonthNumber(lastDateOfMonth),
        nextMonthDaysCount = dayOfWeekLastDayOfMonth ? 8 - dayOfWeekLastDayOfMonth : 0


    //Функция генерация таблици
    const pushCells = pushCellsToTable(
        cellContentLayout,

        dateRange,
        setDateRange,

        beforeCellClick,
        afterCellClick
    )

    //Даты предыдущего месяца
    pushCells('prev', prevMonth, prevMonthDaysCount, 'prev', (lastDateNumberOfPrevMonth - prevMonthDaysCount))

    //Даты текущего месяца
    const [tableBeforeAddNextMonthCells] = pushCells('open', openMonth, openMontDaysCount)


    //Подсчитать добавить одну недостающую строку или две
    if (tableBeforeAddNextMonthCells.length === 4) {
        nextMonthDaysCount = nextMonthDaysCount ? nextMonthDaysCount + 7 : 14
    }

    //Добавить закрывающие строку даты, или целую строчку дат
    if (tableBeforeAddNextMonthCells.length === 5) nextMonthDaysCount = nextMonthDaysCount || 7

    const [table] = pushCells('next', nextMonth, nextMonthDaysCount, 'next')

    return (<div className={block('table')}>
        {table}
    </div>)
}

export default function rangeDatePicker({
                                  className = '',
                                  openMonthDate = new Date(),
                                  value = [],
                                  shouldClearDateToOnThirdClick = false,
                                  shouldFocusOnLastCellsOfRange = true,
                                  cellContentLayout = null,
                                  beforeChangeMonth = null,
                                  afterChangeMonth = null,
                                  beforeChangeYear = null,
                                  afterChangeYear = null,
                                  beforeCellClick = null,
                                  afterCellClick = null
}:SingleFromToDataPickerProps) {

    const [dateFromInit = null, dateToInit = null] = value,

          [dateRange, setDateRange] = useImmer({
              clickCount: 1,
              dateFrom: dateFromInit,
              dateTo: dateToInit,
              shouldClearDateToOnThirdClick,
              shouldFocusOnLastCellsOfRange,
              dateFromFocus: false,
              dateToFocus: false
}),
          [openMonth, setOpenMonth] = useState(openMonthDate)
    
    const blockClasses = blockClassesConcat(block(), {firstTheme: true}, className)
    
    return (<div className={blockClasses}>

        <div className={block('header')}>
            {Navigation({openMonth, setOpenMonth, beforeChangeMonth, afterChangeMonth, beforeChangeYear, afterChangeYear})}
            <DayOfWeekList />
        </div>


        {DateTable({openMonth,

            dateRange,
            setDateRange,

            cellContentLayout,
            beforeCellClick,
            afterCellClick})}

    </div>)
}
