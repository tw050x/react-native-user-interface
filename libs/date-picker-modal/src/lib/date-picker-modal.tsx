import React, { FunctionComponent, useCallback, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, Modal, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { Gesture, GestureDetector, GestureStateChangeEvent, TapGestureHandlerEventPayload, TouchableOpacity, TouchableWithoutFeedback, gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import format from 'date-fns/format';
import isSameDay from 'date-fns/isSameDay';
import startOfDay from 'date-fns/startOfDay';
import subMonths from 'date-fns/subMonths';
import addMonths from 'date-fns/addMonths';


// assets
import ChevronLeft from '../asset/ChevronLeft.svg';
import ChevronRight from '../asset/ChevronRight.svg';

// hooks
import useCalendarDataForDate from './hooks/use-calendar-data-for-date';
import useCurrentDatetime from './hooks/use-current-datetime';

//
export type DatePickerModalStyleSheet = {
  cancelButton?: ViewStyle;
  cancelButtonText?: TextStyle;
  confirmButton?: ViewStyle;
  confirmButtonText?: TextStyle;
  container?: ViewStyle;
  content?: ViewStyle;
  dateSelector?: ViewStyle;
  dateSelectorControl?: ViewStyle;
  dateSelectorControlText?: TextStyle;
  dateSelectorControls?: ViewStyle;
  dateSelectorDayContainer?: ViewStyle;
  dateSelectorDayContent?: ViewStyle
  dateSelectorDayContentCurrentDayIndex?: ViewStyle;
  dateSelectorDayContentFocusedDayIndex?: ViewStyle;
  dateSelectorDayContentFocusedPastDayIndex?: ViewStyle;
  dateSelectorDayText?: TextStyle;
  dateSelectorDayTextIsCurrentMonth?: TextStyle;
  dateSelectorDayTextIsSelected?: TextStyle;
  dateSelectorWeek?: ViewStyle;
  dateSelectorWeekday?: ViewStyle;
  dateSelectorWeekdayText?: TextStyle;
  dateSelectorWeekdays?: ViewStyle;
  dateSelectorWeeks?: ViewStyle;
  heading?: TextStyle;
  selectedDateErrorContainer?: ViewStyle;
  selectedDateErrorText?: TextStyle;
}

//
const defaultStylesheet = StyleSheet.create({
  cancelButton: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  cancelButtonText: {
    color: '#4a83e7',
    fontSize: 16,
    fontWeight: '600',
    padding: 15,
    textAlign: 'center',
  },
  confirmButton: {
    backgroundColor: '#4a83e7',
    borderRadius: 8,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    padding: 15,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    justifyContent: 'center',
    paddingTop: 20,
  },
  dateSelector: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  dateSelectorControl: {
    flexDirection: 'row',
  },
  dateSelectorControlButton: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  dateSelectorControlText: {
    fontSize: 16,
    lineHeight: 16,
    paddingHorizontal: 5,
    paddingVertical: 10,
    textAlign: 'center',
  },
  dateSelectorControls: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  dateSelectorDayContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dateSelectorDayContent: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dateSelectorDayContentCurrentDayIndex: {
    backgroundColor: '#4a83e733',
  },
  dateSelectorDayContentFocusedDayIndex: {
    backgroundColor: '#4a83e7',
  },
  dateSelectorDayContentFocusedPastDayIndex: {
    backgroundColor: '#4a83e733',
  },
  dateSelectorDayText: {
    color: '#000000',
  },
  dateSelectorDayTextIsCurrentMonth: {
    color: '#cccccc',
  },
  dateSelectorDayTextIsSelected: {
    color: '#ffffff',
  },
  dateSelectorWeekday: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dateSelectorWeekdayText: {
    fontSize: 16,
    fontWeight: '600',
  },
  dateSelectorWeekdays: {
    flexDirection: 'row',
  },
  dateSelectorWeek: {
    flexDirection: 'row',
  },
  dateSelectorWeeks: {},
  heading: {
    fontFamily: 'Arial',
    fontSize: 30,
    fontWeight: '600',
    marginHorizontal: 20,
    marginVertical: 20,
    textAlign: 'center',
  },
  selectedDateErrorContainer: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    height: 60,
    justifyContent: 'center',
    padding: 20,
  },
  selectedDateErrorText: {
    color: 'red',
  },
});

//
type CalendarWeekday = {
  date: Date,
  isCurrentMonth: boolean
  isNextMonth: boolean
  isPreviousMonth: boolean
  monthDay: number
}

//
type DatePickerModalProps = {
  animationType?: 'fade' | 'none' | 'slide';
  initialDate?: Date;
  onCancel?: () => void;
  onConfirm?: (date: Date) => void;
  presentationStyle?: 'formSheet' | 'fullScreen' | 'overFullScreen' | 'pageSheet';
  stylesheet?: DatePickerModalStyleSheet;
  transparent?: boolean;
  visible?: boolean;
};

/**
 *
 * @param {DatePickerModalProps} props
 * @returns {JSX.Element}
 */
const DatePickerModal: FunctionComponent<DatePickerModalProps> = ({
  animationType = 'slide',
  initialDate,
  onCancel,
  onConfirm,
  presentationStyle = 'overFullScreen',
  stylesheet = {} as DatePickerModalStyleSheet,
  transparent = true,
  visible = false,
}) => {
  const { bottom } = useSafeAreaInsets();

  const { currentDatetime } = useCurrentDatetime();

  const [focusedDate, setFocusedDate] = useState<Date>(initialDate || currentDatetime);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(initialDate || currentDatetime);
  const [selectedDateError, setSelectedDateError] = useState(false);

  const [dateSelectorColumnWidth, setDateSelectorColumnWidth] = useState(0);

  const targetDate = useRef(initialDate || currentDatetime);

  const onCancelPress = useCallback(() => {
    if (onCancel) onCancel()
  }, [onCancel]);

  const onConfirmPress = useCallback(() => {
    if (selectedDate === undefined) {
      setSelectedDateError(true)
      return
    }

    if (onConfirm) onConfirm(selectedDate)
  }, [onConfirm, selectedDate]);

  const onContainerPress = useCallback(() => {
    if (onCancel) onCancel()
  }, [onCancel]);


  const onContentPress = useCallback(() => null, []);

  const onDateSelectorWeeksLayout = useCallback((event: LayoutChangeEvent) => {
    setDateSelectorColumnWidth(event.nativeEvent.layout.width / 7)
  }, []);

  const onGoToPreviousYearPress = useCallback(() => {
    if (focusedDate === undefined ) return;
    setFocusedDate(subMonths(focusedDate, 12));
  }, [focusedDate]);

  const onGoToNextYearPress = useCallback(() => {
    if (focusedDate === undefined ) return;
    setFocusedDate(addMonths(focusedDate, 12));
  }, [focusedDate]);

  const onGoToPreviousMonthPress = useCallback(() => {
    if (focusedDate === undefined) return;
    setFocusedDate(subMonths(focusedDate, 1));
  }, [focusedDate]);

  const onGoToNextMonthPress = useCallback(() => {
    if (focusedDate === undefined) return;
    setFocusedDate(addMonths(focusedDate, 1));
  }, [focusedDate]);

  const calendarDataForFocusedDate = useCalendarDataForDate(focusedDate);

  const dateSelectorWeeks = useMemo(
    () => {
      const { month, monthFirstDayWeekday, monthFirstDayWeekdayIndex, monthIndex, monthLastDay, previousMonthLastMonthDay, year } = calendarDataForFocusedDate;

      if (month === undefined) return
      if (monthFirstDayWeekday === undefined) return
      if (monthFirstDayWeekdayIndex === undefined) return
      if (monthIndex === undefined) return
      if (monthLastDay === undefined) return
      if (previousMonthLastMonthDay === undefined) return
      if (year === undefined) return

      const dateSelectorWeeksData: Array<{ days: Array<CalendarWeekday> }> = [{ days: [] }]
      let calendarWeekIndex = 0

      // previous month
      for (let iteration = previousMonthLastMonthDay - (monthFirstDayWeekdayIndex || 7); iteration < previousMonthLastMonthDay; iteration++) {
        dateSelectorWeeksData[calendarWeekIndex].days.push({
          date: new Date(year, monthIndex - 1, iteration + 1),
          isCurrentMonth: false,
          isNextMonth: false,
          isPreviousMonth: true,
          monthDay: iteration + 1,
        })
      }

      // current month
      for (let iteration = 0; iteration < monthLastDay; iteration++) {
        if (dateSelectorWeeksData[calendarWeekIndex].days.length === 7) {
          calendarWeekIndex = calendarWeekIndex + 1
          dateSelectorWeeksData[calendarWeekIndex] = { days: [] }
        }

        dateSelectorWeeksData[calendarWeekIndex].days.push({
          date: new Date(year, monthIndex, iteration + 1),
          isCurrentMonth: true,
          isNextMonth: false,
          isPreviousMonth: false,
          monthDay: iteration + 1,
        })
      }

      const nextMonthDayCount = (7 - dateSelectorWeeksData[calendarWeekIndex].days.length) || 7

      for (let iteration = 0; iteration < nextMonthDayCount; iteration++) {
        if (dateSelectorWeeksData[calendarWeekIndex].days.length === 7) {
          calendarWeekIndex = calendarWeekIndex + 1
          dateSelectorWeeksData[calendarWeekIndex] = { days: [] }
        }

        if (dateSelectorWeeksData[calendarWeekIndex] === undefined) dateSelectorWeeksData[calendarWeekIndex] = { days: [] }
        dateSelectorWeeksData[calendarWeekIndex].days.push({
          date: new Date(year, monthIndex + 1, iteration + 1),
          isCurrentMonth: false,
          isNextMonth: true,
          isPreviousMonth: false,
          monthDay: iteration + 1,
        })
      }

      return dateSelectorWeeksData
    },
    [calendarDataForFocusedDate]
  );

  const renderDateSelectorControls = () => {
    return (
      <View style={[defaultStylesheet.dateSelectorControls, stylesheet.dateSelectorControls]}>
        <View style={[defaultStylesheet.dateSelectorControl, stylesheet.dateSelectorControl]}>
          <TouchableOpacity onPress={onGoToPreviousYearPress} style={[defaultStylesheet.dateSelectorControlButton]}>
            <ChevronLeft />
          </TouchableOpacity>
          <Text style={[defaultStylesheet.dateSelectorControlText, stylesheet.dateSelectorControlText]}>
            {format(focusedDate, 'yyyy')}
          </Text>
          <TouchableOpacity onPress={onGoToNextYearPress} style={[defaultStylesheet.dateSelectorControlButton]}>
            <ChevronRight />
          </TouchableOpacity>
        </View>
        <View style={[defaultStylesheet.dateSelectorControl, stylesheet.dateSelectorControl]}>
          <TouchableOpacity onPress={onGoToPreviousMonthPress} style={[defaultStylesheet.dateSelectorControlButton]}>
            <ChevronLeft />
          </TouchableOpacity>
          <Text style={[defaultStylesheet.dateSelectorControlText, stylesheet.dateSelectorControlText]}>
            {format(focusedDate, 'MMM')}
          </Text>
          <TouchableOpacity onPress={onGoToNextMonthPress} style={[defaultStylesheet.dateSelectorControlButton]}>
            <ChevronRight />
          </TouchableOpacity>
        </View>
      </View>
    )
  };

  const renderDateSelectorWeekdays = () => {

    const weekdayMapper = (weekdayInitial: string, index: number) => {
      const viewStyle: Array<ViewStyle> = [
        { height: dateSelectorColumnWidth, width: dateSelectorColumnWidth },
      ];

      return (
        <View key={index} style={[defaultStylesheet.dateSelectorWeekday, stylesheet.dateSelectorWeekday, viewStyle]}>
          <Text style={[defaultStylesheet.dateSelectorWeekdayText, stylesheet.dateSelectorWeekdayText]}>
            {weekdayInitial.toUpperCase()}
          </Text>
        </View>
      )
    }

    return (
      <View onLayout={onDateSelectorWeeksLayout} style={defaultStylesheet.dateSelectorWeekdays}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(weekdayMapper)}
      </View>
    );
  };

  const renderDateSelectorWeeks = () => {

    const dateSelectorWeekMapper = ({ date: dailyDate, isCurrentMonth, monthDay }: CalendarWeekday) => {

      const normalisedCurrentDate = startOfDay(currentDatetime)

      const containerStyle = [
        { height: dateSelectorColumnWidth, width: dateSelectorColumnWidth },
      ]

      const textStyle = [
        stylesheet.dateSelectorDayText || defaultStylesheet.dateSelectorDayText,
      ]

      if (isCurrentMonth === false) {
        textStyle.push(stylesheet.dateSelectorDayTextIsCurrentMonth || defaultStylesheet.dateSelectorDayTextIsCurrentMonth)
      }

      if (selectedDate !== undefined && selectedDate >= normalisedCurrentDate && isSameDay(dailyDate, selectedDate)) {
        textStyle.push(stylesheet.dateSelectorDayTextIsSelected || defaultStylesheet.dateSelectorDayTextIsSelected)
      }

      const viewStyle: Array<ViewStyle> = [
        { borderRadius: dateSelectorColumnWidth / 2, height: dateSelectorColumnWidth - 5, width: dateSelectorColumnWidth - 5 },
      ]

      if (isSameDay(dailyDate, normalisedCurrentDate)) {
        viewStyle.push(stylesheet.dateSelectorDayContentCurrentDayIndex || defaultStylesheet.dateSelectorDayContentCurrentDayIndex)
      }

      if (selectedDate !== undefined && selectedDate < normalisedCurrentDate && isSameDay(dailyDate, selectedDate)) {
        viewStyle.push(stylesheet.dateSelectorDayContentFocusedPastDayIndex || defaultStylesheet.dateSelectorDayContentFocusedPastDayIndex)
      }

      if (selectedDate !== undefined && selectedDate >= normalisedCurrentDate && isSameDay(dailyDate, selectedDate)) {
        viewStyle.push(stylesheet.dateSelectorDayContentFocusedDayIndex || defaultStylesheet.dateSelectorDayContentFocusedDayIndex)
      }

      return (
        <View key={dailyDate.toString()} style={[defaultStylesheet.dateSelectorDayContainer, stylesheet.dateSelectorDayContainer, containerStyle]}>
          <View style={[defaultStylesheet.dateSelectorDayContent, stylesheet.dateSelectorDayContent, viewStyle]}>
            <Text style={[defaultStylesheet.dateSelectorDayText, stylesheet.dateSelectorDayText, textStyle]}>
              {monthDay}
            </Text>
          </View>
        </View>
      )
    };

    const dateSelectorWeeksMapper = ({ days }: { days: Array<CalendarWeekday> }, index: number) => {

      return (
        <View key={index} style={[defaultStylesheet.dateSelectorWeek, stylesheet.dateSelectorWeek]}>
          {days.map(dateSelectorWeekMapper)}
        </View>
      )
    };

    return (
      <GestureDetector gesture={dayTapGesture}>
        <View style={[defaultStylesheet.dateSelectorWeeks, stylesheet.dateSelectorWeeks]}>
          {dateSelectorWeeks?.map(dateSelectorWeeksMapper)}
        </View>
      </GestureDetector>
    );
  };

  const onDayTapGestureStart = (event: GestureStateChangeEvent<TapGestureHandlerEventPayload>) => {
    const columnIndex = Math.floor(event.x / dateSelectorColumnWidth)
    const rowIndex = Math.floor(event.y / dateSelectorColumnWidth)

    if (columnIndex < 0) return
    if (rowIndex < 0) return

    const tappedDate = dateSelectorWeeks?.[rowIndex > dateSelectorWeeks.length - 1 ? dateSelectorWeeks.length - 1 : rowIndex].days?.[columnIndex > 6 ? 6 : columnIndex].date
    if (tappedDate !== undefined) {

      const normalisedFocusedDate = new Date(tappedDate)

      normalisedFocusedDate.setHours(0)
      normalisedFocusedDate.setMinutes(0)
      normalisedFocusedDate.setSeconds(0)
      normalisedFocusedDate.setMilliseconds(0)

      targetDate.current = normalisedFocusedDate
    }
  }

  const onDayTapGestureEnd = () => {
    if (targetDate.current === undefined) return
    runOnJS(setSelectedDate)(targetDate.current)
  }

  const dayTapGesture = Gesture.Tap().
    onStart(onDayTapGestureStart).
    onEnd(onDayTapGestureEnd)

  const contentStyles = {
    paddingBottom: bottom + Number(stylesheet?.content?.paddingBottom || 0),
  };

  const Component = gestureHandlerRootHOC(() => (
    <TouchableWithoutFeedback
      containerStyle={[defaultStylesheet.container, stylesheet.container]}
      onPress={onContainerPress}
      style={[defaultStylesheet.container, stylesheet.container]}
    >
      <TouchableWithoutFeedback
        onPress={onContentPress}
        style={[defaultStylesheet.content, stylesheet.content, contentStyles]}
      >
        <Text style={[defaultStylesheet.heading, stylesheet.heading]}>Select a Date</Text>
        <View style={[defaultStylesheet.dateSelector, stylesheet.dateSelector]}>
          {renderDateSelectorControls()}
          {renderDateSelectorWeekdays()}
          {renderDateSelectorWeeks()}
        </View>
        <View style={[defaultStylesheet.selectedDateErrorContainer, stylesheet.selectedDateErrorContainer]}>
          {selectedDateError && <Text style={[defaultStylesheet.selectedDateErrorText, stylesheet.selectedDateErrorText]}>You need to select a date</Text>}
        </View>
        <TouchableOpacity onPress={onConfirmPress} style={[defaultStylesheet.confirmButton, stylesheet.confirmButton]}>
          <Text style={[defaultStylesheet.confirmButtonText, stylesheet.confirmButtonText]}>Confirm</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onCancelPress} style={[defaultStylesheet.cancelButton, stylesheet.cancelButton]}>
          <Text style={[defaultStylesheet.cancelButtonText, stylesheet.cancelButtonText]}>Cancel</Text>
        </TouchableOpacity>
      </TouchableWithoutFeedback>
    </TouchableWithoutFeedback>
  ))

  return (
    <Modal
      animationType={animationType}
      presentationStyle={presentationStyle}
      transparent={transparent}
      visible={visible}
    >
      <Component />
    </Modal>
  );
};

//
export default DatePickerModal;
