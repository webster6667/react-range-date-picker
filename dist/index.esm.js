import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import _asyncToGenerator from '@babel/runtime/helpers/asyncToGenerator';
import _defineProperty from '@babel/runtime/helpers/defineProperty';
import _regeneratorRuntime from '@babel/runtime/regenerator';
import React, { useState } from 'react';
import { useImmer } from 'use-immer';
import { blockClassesConcat, bemClassName, elementClassesConcat } from 'bem-components-connector';
import { getMonthNameByMonthIndex, getNextMonth, getPrevMonth, getLastDateOfMonth, getDayOfMonthNumber, getFirstDateOfMonth, getDayOfWeekNumber, getDateByDayOfMonthNumber, isDatesEqual } from 'date-helper-js';

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = ".range-date-picker {\n  display: inline-flex;\n  flex-direction: column;\n}\n.range-date-picker__header {\n  display: flex;\n  flex-direction: column;\n}\n.range-date-picker__nav {\n  display: flex;\n}\n.range-date-picker__selected-month {\n  flex-grow: 1;\n  text-align: center;\n}\n.range-date-picker__selected-month span {\n  align-items: center;\n  justify-content: center;\n  margin: 0 2px;\n  font-size: 12px;\n  color: black;\n}\n.range-date-picker__arrow {\n  position: relative;\n  width: 20px;\n  height: 20px;\n  cursor: pointer;\n}\n.range-date-picker__arrow svg {\n  width: 10px;\n  fill: slategrey;\n}\n.range-date-picker__arrow:hover svg {\n  fill: black;\n}\n.range-date-picker__arrow_left svg {\n  transform: rotate(180deg);\n  transform-origin: center;\n}\n.range-date-picker__arrow_left:hover {\n  transform: translateX(-1px);\n}\n.range-date-picker__arrow_right:hover {\n  transform: translateX(1px);\n}\n.range-date-picker__header-row {\n  display: flex;\n}\n.range-date-picker__day-of-week {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: 25px;\n  height: 25px;\n  color: silver;\n  font-size: 9px;\n}\n.range-date-picker__table {\n  display: flex;\n  flex-direction: column;\n}\n.range-date-picker__date-row {\n  display: flex;\n}\n.range-date-picker__date-cell {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: 25px;\n  height: 25px;\n}\n.range-date-picker__date-cell > span {\n  flex-grow: 1;\n  line-height: 25px;\n  text-align: center;\n  font-size: 12px;\n  cursor: pointer;\n  color: #000;\n}\n.range-date-picker__date-cell_prev,\n.range-date-picker__date-cell_next {\n  color: #a9a9a9;\n}\n.range-date-picker__date-cell_selected {\n  background-color: #cecece;\n}\n.range-date-picker__date-cell_from,\n.range-date-picker__date-cell_to {\n  background-color: #888888;\n}\n";
styleInject(css_248z);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
var SvgArrow = (({
  styles = {},
  ...props
}) => /*#__PURE__*/React.createElement("svg", _extends({
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 240.823 240.823"
}, props), /*#__PURE__*/React.createElement("path", {
  d: "M183.189 111.816L74.892 3.555c-4.752-4.74-12.451-4.74-17.215 0-4.752 4.74-4.752 12.439 0 17.179l99.707 99.671-99.695 99.671c-4.752 4.74-4.752 12.439 0 17.191 4.752 4.74 12.463 4.74 17.215 0l108.297-108.261c4.68-4.691 4.68-12.511-.012-17.19z"
})));

var block = bemClassName('range-date-picker');

var Arrow = function Arrow(_ref) {
  var _ref$duration = _ref.duration,
      duration = _ref$duration === void 0 ? 'left' : _ref$duration,
      onClick = _ref.onClick,
      _ref$children = _ref.children,
      children = _ref$children === void 0 ? null : _ref$children;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    className: elementClassesConcat(block(), 'arrow', _defineProperty({}, duration, true))
  }, children ? children : /*#__PURE__*/React.createElement(SvgArrow, null));
};

var DayOfWeekList = function DayOfWeekList(_ref2) {
  var _ref2$dayOfWeekArray = _ref2.dayOfWeekArray,
      dayOfWeekArray = _ref2$dayOfWeekArray === void 0 ? ['П', 'В', 'С', 'Ч', 'П', 'С', 'В'] : _ref2$dayOfWeekArray;
  var dayOfWeekList = dayOfWeekArray.map(function (item, key) {
    return /*#__PURE__*/React.createElement("span", {
      className: block('day-of-week'),
      key: key
    }, item);
  });
  return /*#__PURE__*/React.createElement("div", {
    className: block('header-row')
  }, dayOfWeekList);
};

var Navigation = function Navigation(_ref3) {
  var openMonth = _ref3.openMonth,
      setOpenMonth = _ref3.setOpenMonth,
      beforeChangeMonth = _ref3.beforeChangeMonth,
      afterChangeMonth = _ref3.afterChangeMonth,
      beforeChangeYear = _ref3.beforeChangeYear,
      afterChangeYear = _ref3.afterChangeYear;

  var openMonthIndex = openMonth.getMonth(),
      openMonthName = getMonthNameByMonthIndex(openMonthIndex),
      openMontYearNumber = openMonth.getFullYear(),
      changeMonth = /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(duration) {
      var needMonth, isYearWasChanged;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              needMonth = duration === 'next' ? getNextMonth(openMonth) : getPrevMonth(openMonth), isYearWasChanged = openMonth.getFullYear() !== needMonth.getFullYear(); //Хук до смены месяца

              if (!(typeof beforeChangeMonth === 'function')) {
                _context.next = 4;
                break;
              }

              _context.next = 4;
              return beforeChangeMonth();

            case 4:
              if (!(typeof beforeChangeYear === 'function' && isYearWasChanged)) {
                _context.next = 7;
                break;
              }

              _context.next = 7;
              return beforeChangeYear();

            case 7:
              //Сменить месяц
              setOpenMonth(function () {
                return needMonth;
              }); //Хук после смены месяца

              if (!(typeof afterChangeMonth === 'function')) {
                _context.next = 11;
                break;
              }

              _context.next = 11;
              return afterChangeMonth();

            case 11:
              if (!(typeof afterChangeYear === 'function' && isYearWasChanged)) {
                _context.next = 14;
                break;
              }

              _context.next = 14;
              return afterChangeYear();

            case 14:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function changeMonth(_x) {
      return _ref4.apply(this, arguments);
    };
  }();

  return /*#__PURE__*/React.createElement("div", {
    className: block('nav')
  }, /*#__PURE__*/React.createElement(Arrow, {
    duration: 'left',
    onClick: function onClick() {
      return changeMonth("prev");
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: block('selected-month')
  }, /*#__PURE__*/React.createElement("span", {
    className: block('month-name')
  }, openMonthName), /*#__PURE__*/React.createElement("span", {
    className: block('full-year')
  }, openMontYearNumber)), /*#__PURE__*/React.createElement(Arrow, {
    duration: 'right',
    onClick: function onClick() {
      return changeMonth('next');
    }
  }));
};

var pushCellsToTable = function pushCellsToTable(cellContentLayout, dateRange, setDateRange, beforeCellClick, afterCellClick) {
  var table = [],
      row = [],
      quantityFilledCellsInRow = 0,
      hasRowStartDate = false,
      hasRowFinishDate = false,
      shouldCheckRowBetweenRange = false,
      filledRowCount = 0,
      dateFrom = dateRange.dateFrom,
      dateTo = dateRange.dateTo,
      clickCount = dateRange.clickCount;
  return function (monthStatus, pushMonth) {
    var monthDaysCount = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var cellModifier = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
    var dayForStartIteration = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
    Array(monthDaysCount).fill('').forEach(function (_, key) {
      var _elementClassesConcat2;

      var iterationStep = ++key,
          dateNumber = dayForStartIteration ? dayForStartIteration + iterationStep : iterationStep,
          cellDate = getDateByDayOfMonthNumber(pushMonth, dateNumber),
          isRangeStartCell = dateFrom !== null ? isDatesEqual(cellDate, dateFrom) : false,
          isRangeFinishCell = dateTo !== null ? isDatesEqual(cellDate, dateTo) : false,
          isDateRangeExist = Boolean(dateFrom && dateTo),
          isCellFromRange = isDateRangeExist ? cellDate > dateFrom && cellDate < dateTo || isRangeStartCell || isRangeFinishCell : false,
          isStartOfRangeOnFocus = clickCount === 3 && isDatesEqual(cellDate, dateFrom),
          isFinishOfRangeOnFocus = dateTo && clickCount === 2 && isDatesEqual(cellDate, dateTo),
          //@todo: think about name
      isRangeFinishCellOnFocus = isStartOfRangeOnFocus || isFinishOfRangeOnFocus,
          cellClasses = elementClassesConcat(block(), 'date-cell', (_elementClassesConcat2 = {}, _defineProperty(_elementClassesConcat2, cellModifier, Boolean(cellModifier)), _defineProperty(_elementClassesConcat2, "selected", isCellFromRange), _defineProperty(_elementClassesConcat2, "from", isRangeStartCell), _defineProperty(_elementClassesConcat2, "to", isRangeFinishCell), _defineProperty(_elementClassesConcat2, "focus", isRangeFinishCellOnFocus), _elementClassesConcat2)),
          hookData = {
        monthStatus: monthStatus,
        cellDate: cellDate,
        selectedDate: null,
        dateNumber: dateNumber
      },
          cellContent = typeof cellContentLayout === 'function' ? cellContentLayout(hookData) : dateNumber;
      if (isCellFromRange) ++quantityFilledCellsInRow;
      if (isRangeStartCell) hasRowStartDate = true;
      if (isRangeFinishCell) hasRowFinishDate = true; //Обработать клик from-to

      row.push( /*#__PURE__*/React.createElement("div", {
        key: cellDate.getTime(),
        className: cellClasses,
        onClick: /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
          return _regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  if (!(typeof beforeCellClick === 'function')) {
                    _context2.next = 3;
                    break;
                  }

                  _context2.next = 3;
                  return beforeCellClick(cellDate);

                case 3:
                  setDateRange(function (range) {
                    var dateFrom = range.dateFrom,
                        dateTo = range.dateTo,
                        clickCount = range.clickCount,
                        shouldClearDateToOnThirdClick = range.shouldClearDateToOnThirdClick,
                        shouldFocusOnLastCellsOfRange = range.shouldFocusOnLastCellsOfRange,
                        wasFinishDateClicked = isDatesEqual(dateTo, cellDate),
                        wasStartDateClicked = isDatesEqual(dateFrom, cellDate);

                    switch (clickCount) {
                      case 1:
                        range.dateFrom = cellDate;
                        range.clickCount = 2;
                        break;

                      case 2:
                        //Если можно сфокусироватся на крайней дате
                        if (shouldFocusOnLastCellsOfRange && wasStartDateClicked) {
                          range.dateFrom = cellDate;
                          range.dateTo = dateTo;
                          range.clickCount = 3;
                        } else {
                          //Развернуть даты если дата финиша меньше даты старта
                          if (cellDate < dateFrom) {
                            range.dateFrom = cellDate;
                            range.dateTo = dateFrom; //Скидывать даты на третий клик

                            if (shouldClearDateToOnThirdClick) {
                              range.clickCount = 3;
                            } else {
                              range.clickCount = 2;
                            }
                          } else {
                            range.dateTo = cellDate;
                            range.clickCount = 3;
                          }
                        } //Не создавать диапазон при повторном клике на дату старта


                        if (!isDateRangeExist && wasStartDateClicked) {
                          range.dateTo = null;
                          range.dateFrom = cellDate;
                          range.clickCount = 1;
                        }

                        break;

                      case 3:
                        //Если кликнули по дате финиша при созданом диапазоне
                        if (wasFinishDateClicked && shouldFocusOnLastCellsOfRange) {
                          range.dateTo = cellDate;
                          range.clickCount = 2; //Если кликнули по дате старта при созданом диапазоне
                        } else if (wasStartDateClicked && shouldFocusOnLastCellsOfRange) {
                          range.dateFrom = cellDate;
                          range.clickCount = 1;
                        } else {
                          //Если на третий клик сбрасывается дата финиша
                          if (shouldClearDateToOnThirdClick) {
                            range.clickCount = 2;
                            range.dateTo = null;
                            range.dateFrom = cellDate;
                          } else {
                            //Развернуть даты, если start больше finish
                            if (cellDate > dateTo) {
                              range.dateFrom = dateTo;
                              range.dateTo = cellDate;
                              range.clickCount = 3;
                            } else {
                              range.dateFrom = cellDate;
                              range.clickCount = 2;
                            }
                          }
                        }

                        break;
                    }
                  }); //Хук после клика

                  if (!(typeof afterCellClick === 'function')) {
                    _context2.next = 7;
                    break;
                  }

                  _context2.next = 7;
                  return afterCellClick(cellDate);

                case 7:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2);
        }))
      }, /*#__PURE__*/React.createElement("span", null, cellContent)));

      if (row.length === 7) {
        var _elementClassesConcat4;

        var rowModifier = 'filled',
            isRowFilled = Boolean(quantityFilledCellsInRow),
            isFirstRowBetweenRange = shouldCheckRowBetweenRange && !hasRowFinishDate && isDateRangeExist || false;
        if (isRowFilled) filledRowCount++; //Отметить полностью заполненную строку

        if (quantityFilledCellsInRow === 7) {
          rowModifier = 'full-filled';
        } //Отметить предпоследнюю строку


        if (hasRowFinishDate && !hasRowStartDate && filledRowCount > 2) {
          var _elementClassesConcat3;

          var penultimateRowKey = table.length - 1,
              penultimateRow = table[penultimateRowKey];
          table[table.length - 1] = /*#__PURE__*/React.createElement("div", {
            key: penultimateRowKey,
            className: elementClassesConcat(block(), 'date-row', (_elementClassesConcat3 = {}, _defineProperty(_elementClassesConcat3, rowModifier, isRowFilled), _defineProperty(_elementClassesConcat3, "firstRowBetweenRange", filledRowCount === 3), _defineProperty(_elementClassesConcat3, "penultimateRow", true), _elementClassesConcat3))
          }, penultimateRow.props.children);
        }

        table.push( /*#__PURE__*/React.createElement("div", {
          key: table.length,
          className: elementClassesConcat(block(), 'date-row', (_elementClassesConcat4 = {}, _defineProperty(_elementClassesConcat4, rowModifier, isRowFilled), _defineProperty(_elementClassesConcat4, "hasStartDate", hasRowStartDate), _defineProperty(_elementClassesConcat4, "hasFinishDate", hasRowFinishDate), _defineProperty(_elementClassesConcat4, "firstRowBetweenRange", isFirstRowBetweenRange), _elementClassesConcat4))
        }, row));
        row = [];
        quantityFilledCellsInRow = 0;
        shouldCheckRowBetweenRange = false; //Была добавленна первая строка

        if (hasRowStartDate && !hasRowFinishDate) shouldCheckRowBetweenRange = true;
        hasRowStartDate = false;
        hasRowFinishDate = false;
      }
    });
    return [table];
  };
};

var DateTable = function DateTable(_ref6) {
  var openMonth = _ref6.openMonth,
      dateRange = _ref6.dateRange,
      setDateRange = _ref6.setDateRange,
      cellContentLayout = _ref6.cellContentLayout,
      beforeCellClick = _ref6.beforeCellClick,
      afterCellClick = _ref6.afterCellClick;
  //Пред месяц
  var prevMonth = getPrevMonth(openMonth),
      nextMonth = getNextMonth(openMonth); //Последнее число(type Data, type Number) предыдущего месяца

  var lastDateOfPrevMonth = getLastDateOfMonth(prevMonth),
      lastDateNumberOfPrevMonth = getDayOfMonthNumber(lastDateOfPrevMonth); //Крайние даты открытого месяца

  var firstDateOfMonth = getFirstDateOfMonth(openMonth),
      lastDateOfMonth = getLastDateOfMonth(openMonth); //Дни недели крайних дат открытого месяца

  var dayOfWeekFirstDayOfMonth = getDayOfWeekNumber(firstDateOfMonth),
      //День недели первого числа месяца
  dayOfWeekLastDayOfMonth = getDayOfWeekNumber(lastDateOfMonth); //День недели последнего числа месяца
  //Кол-во каждого месяца

  var prevMonthDaysCount = dayOfWeekFirstDayOfMonth ? dayOfWeekFirstDayOfMonth - 1 : 6,
      openMontDaysCount = getDayOfMonthNumber(lastDateOfMonth),
      nextMonthDaysCount = dayOfWeekLastDayOfMonth ? 8 - dayOfWeekLastDayOfMonth : 0; //Функция генерация таблици

  var pushCells = pushCellsToTable(cellContentLayout, dateRange, setDateRange, beforeCellClick, afterCellClick); //Даты предыдущего месяца

  pushCells('prev', prevMonth, prevMonthDaysCount, 'prev', lastDateNumberOfPrevMonth - prevMonthDaysCount); //Даты текущего месяца

  var _pushCells = pushCells('open', openMonth, openMontDaysCount),
      _pushCells2 = _slicedToArray(_pushCells, 1),
      tableBeforeAddNextMonthCells = _pushCells2[0]; //Подсчитать добавить одну недостающую строку или две


  if (tableBeforeAddNextMonthCells.length === 4) {
    nextMonthDaysCount = nextMonthDaysCount ? nextMonthDaysCount + 7 : 14;
  } //Добавить закрывающие строку даты, или целую строчку дат


  if (tableBeforeAddNextMonthCells.length === 5) nextMonthDaysCount = nextMonthDaysCount || 7;

  var _pushCells3 = pushCells('next', nextMonth, nextMonthDaysCount, 'next'),
      _pushCells4 = _slicedToArray(_pushCells3, 1),
      table = _pushCells4[0];

  return /*#__PURE__*/React.createElement("div", {
    className: block('table')
  }, table);
};

function rangeDatePicker(_ref7) {
  var _ref7$className = _ref7.className,
      className = _ref7$className === void 0 ? '' : _ref7$className,
      _ref7$openMonthDate = _ref7.openMonthDate,
      openMonthDate = _ref7$openMonthDate === void 0 ? new Date() : _ref7$openMonthDate,
      _ref7$value = _ref7.value,
      value = _ref7$value === void 0 ? [] : _ref7$value,
      _ref7$shouldClearDate = _ref7.shouldClearDateToOnThirdClick,
      shouldClearDateToOnThirdClick = _ref7$shouldClearDate === void 0 ? false : _ref7$shouldClearDate,
      _ref7$shouldFocusOnLa = _ref7.shouldFocusOnLastCellsOfRange,
      shouldFocusOnLastCellsOfRange = _ref7$shouldFocusOnLa === void 0 ? true : _ref7$shouldFocusOnLa,
      _ref7$cellContentLayo = _ref7.cellContentLayout,
      cellContentLayout = _ref7$cellContentLayo === void 0 ? null : _ref7$cellContentLayo,
      _ref7$beforeChangeMon = _ref7.beforeChangeMonth,
      beforeChangeMonth = _ref7$beforeChangeMon === void 0 ? null : _ref7$beforeChangeMon,
      _ref7$afterChangeMont = _ref7.afterChangeMonth,
      afterChangeMonth = _ref7$afterChangeMont === void 0 ? null : _ref7$afterChangeMont,
      _ref7$beforeChangeYea = _ref7.beforeChangeYear,
      beforeChangeYear = _ref7$beforeChangeYea === void 0 ? null : _ref7$beforeChangeYea,
      _ref7$afterChangeYear = _ref7.afterChangeYear,
      afterChangeYear = _ref7$afterChangeYear === void 0 ? null : _ref7$afterChangeYear,
      _ref7$beforeCellClick = _ref7.beforeCellClick,
      beforeCellClick = _ref7$beforeCellClick === void 0 ? null : _ref7$beforeCellClick,
      _ref7$afterCellClick = _ref7.afterCellClick,
      afterCellClick = _ref7$afterCellClick === void 0 ? null : _ref7$afterCellClick;

  var _value = _slicedToArray(value, 2),
      _value$ = _value[0],
      dateFromInit = _value$ === void 0 ? null : _value$,
      _value$2 = _value[1],
      dateToInit = _value$2 === void 0 ? null : _value$2,
      _useImmer = useImmer({
    clickCount: 1,
    dateFrom: dateFromInit,
    dateTo: dateToInit,
    shouldClearDateToOnThirdClick: shouldClearDateToOnThirdClick,
    shouldFocusOnLastCellsOfRange: shouldFocusOnLastCellsOfRange,
    dateFromFocus: false,
    dateToFocus: false
  }),
      _useImmer2 = _slicedToArray(_useImmer, 2),
      dateRange = _useImmer2[0],
      setDateRange = _useImmer2[1],
      _useState = useState(openMonthDate),
      _useState2 = _slicedToArray(_useState, 2),
      openMonth = _useState2[0],
      setOpenMonth = _useState2[1];

  var blockClasses = blockClassesConcat(block(), {
    firstTheme: true
  }, className);
  return /*#__PURE__*/React.createElement("div", {
    className: blockClasses
  }, /*#__PURE__*/React.createElement("div", {
    className: block('header')
  }, Navigation({
    openMonth: openMonth,
    setOpenMonth: setOpenMonth,
    beforeChangeMonth: beforeChangeMonth,
    afterChangeMonth: afterChangeMonth,
    beforeChangeYear: beforeChangeYear,
    afterChangeYear: afterChangeYear
  }), /*#__PURE__*/React.createElement(DayOfWeekList, null)), DateTable({
    openMonth: openMonth,
    dateRange: dateRange,
    setDateRange: setDateRange,
    cellContentLayout: cellContentLayout,
    beforeCellClick: beforeCellClick,
    afterCellClick: afterCellClick
  }));
}

export default rangeDatePicker;
