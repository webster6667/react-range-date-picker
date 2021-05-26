/// <reference types="react" />
import './style.less';
import { SingleFromToDataPickerProps } from "./types";
export default function rangeDatePicker({ className, openMonthDate, value, shouldClearDateToOnThirdClick, shouldFocusOnLastCellsOfRange, cellContentLayout, beforeChangeMonth, afterChangeMonth, beforeChangeYear, afterChangeYear, beforeCellClick, afterCellClick }: SingleFromToDataPickerProps): JSX.Element;
