import React, { FunctionComponent, useCallback, useMemo, useState } from 'react';
import { LayoutChangeEvent, Modal, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView, GestureStateChangeEvent, TapGestureHandlerEventPayload, TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { addMonths, format, isSameDay, startOfDay, subMonths } from 'date-fns';

// assets
import ChevronLeft from '../asset/ChevronLeft.svg';
import ChevronRight from '../asset/ChevronRight.svg';

// hooks
import useCurrentDatetime from './hooks/use-current-datetime';

// helpers
import getCalendarWeeksForDate, { CalendarDay, CalendarWeek, MAX_CALENDAR_WEEKS } from './helpers/get-calendar-weeks-for-date';

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
  gestureHandlerRoot: {
    flex: 1,
  },
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

  const onCancelPress = useCallback(() => {
    if (onCancel) onCancel()
  }, [onCancel]);

  const onConfirmPress = useCallback(() => {
    if (selectedDate === undefined) {
      setSelectedDateError(true)
      return
    }

    if (onConfirm) {
      // Only the year, month and day change: keep the time of day from
      // initialDate so the same Date can be shared with <TimePickerModal />.
      const confirmedDate = new Date(selectedDate)
      if (initialDate !== undefined) {
        confirmedDate.setHours(initialDate.getHours(), initialDate.getMinutes(), initialDate.getSeconds(), initialDate.getMilliseconds())
      }
      onConfirm(confirmedDate)
    }
  }, [initialDate, onConfirm, selectedDate]);

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

  const dateSelectorWeeks = useMemo(
    () => getCalendarWeeksForDate(focusedDate),
    [focusedDate]
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
      // Measure the weekday row, not the padded container: the row spans the
      // inner width that the seven columns must fill.
      <View onLayout={onDateSelectorWeeksLayout} style={defaultStylesheet.dateSelectorWeekdays}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(weekdayMapper)}
      </View>
    );
  };

  const renderDateSelectorWeeks = () => {

    const dateSelectorWeekMapper = ({ date: dailyDate, isCurrentMonth, monthDay }: CalendarDay) => {

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
          {/* collapsable={false}: on Android a view with no background is flattened away, and the
              rounded corners are lost when a selected background is added later. */}
          <View collapsable={false} style={[defaultStylesheet.dateSelectorDayContent, stylesheet.dateSelectorDayContent, viewStyle]}>
            <Text style={[defaultStylesheet.dateSelectorDayText, stylesheet.dateSelectorDayText, textStyle]}>
              {monthDay}
            </Text>
          </View>
        </View>
      )
    };

    const dateSelectorWeeksMapper = ({ days }: CalendarWeek, index: number) => {

      return (
        <View key={index} style={[defaultStylesheet.dateSelectorWeek, stylesheet.dateSelectorWeek]}>
          {days.map(dateSelectorWeekMapper)}
        </View>
      )
    };

    // Always reserve room for the most weeks a month can need. Months have five
    // or six weeks, and the sheet is anchored to the bottom of the screen, so
    // without this the heading and controls would jump when the row count
    // changes. The weeks are laid out from the top and any spare row is left
    // empty at the bottom.
    const weeksStyle = { minHeight: dateSelectorColumnWidth * MAX_CALENDAR_WEEKS };

    return (
      <GestureDetector gesture={dayTapGesture}>
        <View style={[defaultStylesheet.dateSelectorWeeks, stylesheet.dateSelectorWeeks, weeksStyle]} testID="date-picker-calendar">
          {dateSelectorWeeks.map(dateSelectorWeeksMapper)}
        </View>
      </GestureDetector>
    );
  };

  // Work out which day was tapped from the tap position in the grid. The
  // gesture runs on the JS thread so it can update React state directly.
  const onDayTapGestureEnd = (event: GestureStateChangeEvent<TapGestureHandlerEventPayload>) => {
    if (dateSelectorColumnWidth === 0) return;

    const columnIndex = Math.min(Math.floor(event.x / dateSelectorColumnWidth), 6);
    const rowIndex = Math.floor(event.y / dateSelectorColumnWidth);

    // Taps in the empty row reserved below a five-week month select nothing.
    if (columnIndex < 0 || rowIndex < 0 || rowIndex >= dateSelectorWeeks.length) return;

    const tappedDate = dateSelectorWeeks[rowIndex]?.days[columnIndex]?.date;
    if (tappedDate === undefined) return;

    setSelectedDate(startOfDay(tappedDate));
  };

  const dayTapGesture = Gesture.Tap()
    .runOnJS(true)
    .onEnd(onDayTapGestureEnd);

  const contentStyles = {
    paddingBottom: bottom + Number(stylesheet?.content?.paddingBottom || 0),
  };

  return (
    <Modal
      animationType={animationType}
      presentationStyle={presentationStyle}
      transparent={transparent}
      visible={visible}
    >
      <GestureHandlerRootView style={defaultStylesheet.gestureHandlerRoot}>
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
      </GestureHandlerRootView>
    </Modal>
  );
};

//
export default DatePickerModal;
