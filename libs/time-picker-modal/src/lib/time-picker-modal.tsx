import React, { FunctionComponent, useCallback, useMemo, useState } from 'react';
import { Modal, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { TouchableOpacity, TouchableWithoutFeedback, gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { runOnJS, useAnimatedReaction, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

//
import TimeSelectorControlsAndValue, { TimeSelectorControlsAndValueProps } from './components/time-selector-controls-and-value';
import TimeSelectorSlider, { TimeSelectorSliderProps, defaultStylesheet as timeSelectorSliderDefaultStylesheet } from './components/time-selector-slider';
import { TimePickerModalContext, TimePickerModalContextProvider } from './context';
import getDatetimeFromSelectedTimeBoundaryIndexAndTimeStep from './helpers/get-datetime-from-selected-time-boundary-index-and-time-step';
import getSelectedDatetimeBoundaryIndexFromDatetimeAndTimeStep from './helpers/get-selected-datetime-boundary-index-from-datetime-and-time-step';
import getTimeBoundaryIndexesFromTimeStep from './helpers/get-time-boundary-indexes-from-time-step';
import type { TimePickerModalStyleSheet, TimeStep } from './types';

//
export type TimePickerModalDefaultStyleSheet = {
  cancelButton: ViewStyle;
  cancelButtonText: TextStyle;
  confirmButton: ViewStyle;
  confirmButtonText: TextStyle;
  container: ViewStyle;
  content: ViewStyle;
  heading: TextStyle;
  selectedTimeBoundaryIndexErrorContainer: ViewStyle;
  selectedDateErrorText: TextStyle;
  timeSelector: ViewStyle;
  timeSelectorBarMinMaxSnapPoint: ViewStyle;
  timeSelectorContainer: ViewStyle;
};

//
const defaultStylesheet: TimePickerModalDefaultStyleSheet = StyleSheet.create({
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
  heading: {
    fontFamily: 'Arial',
    fontSize: 30,
    fontWeight: '600',
    marginHorizontal: 20,
    marginVertical: 20,
    textAlign: 'center',
  },
  selectedTimeBoundaryIndexErrorContainer: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    height: 60,
    justifyContent: 'center',
    padding: 20,
  },
  selectedDateErrorText: {
    color: 'red',
  },
  timeSelector: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  timeSelectorBarMinMaxSnapPoint: {
    backgroundColor: '#e20303',
  },
  timeSelectorContainer: {
    width: '100%',
  },
  timeSelectorControlIcon: {
    padding: 15,
  },
});

//
export type HourIndexes = 0 | 1 | 2 | 3 | 4 | 5 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 21 | 22 | 23
export type MinuteIndexes = 0 | 1 | 2 | 3 | 4 | 5 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59

//
export type TimePickerModalContentProps = {
  initialDatetime?: Date;
  onCancel?: () => void;
  onConfirm?: (date: Date) => void;
  stylesheet?: TimePickerModalStyleSheet;
  timeStep?: TimeStep;
}

/**
 * 
 * @param {TimePickerModalContentProps} props
 * @returns {JSX.Element}
 */
const TimePickerModalContent: FunctionComponent<TimePickerModalContentProps> = ({
  initialDatetime = new Date(),
  onCancel,
  onConfirm,
  stylesheet = {} as TimePickerModalStyleSheet,
  timeStep = 5,
}) => {
  const { bottom } = useSafeAreaInsets();

  const [selectedTimeBoundaryIndex, setSelectedTimeBoundaryIndex] = useState(() => getSelectedDatetimeBoundaryIndexFromDatetimeAndTimeStep(initialDatetime, timeStep));
  const [selectedTimeBoundaryIndexError, setSelectedTimeBoundaryIndexError] = useState(false);

  const timeSelectorHeightSharedValue = useSharedValue(0);
  const timeSelectorOffsetXSharedValue = useSharedValue(0);
  const timeSelectorPositionXSharedValue = useSharedValue(0);
  const timeSelectorSlideLockSharedValue = useSharedValue(false);
  const timeSelectorTargetXSharedValue = useSharedValue(0);
  const timeSelectorWidthSharedValue = useSharedValue(0);

  const timeBoundaryIndexesLength = useMemo(
    () => getTimeBoundaryIndexesFromTimeStep(timeStep).length, 
    [timeStep],
  );

  const timeBarWidthAndMargins = useMemo(
    () => {
      const timeBarWidth = stylesheet.timeSelectorBar?.width || timeSelectorSliderDefaultStylesheet.timeSelectorBar.width;
      const timeBarMarginHorizontal = stylesheet.timeSelectorBar?.marginHorizontal || timeSelectorSliderDefaultStylesheet.timeSelectorBar.marginHorizontal;
      return Number(timeBarWidth) + (Number(timeBarMarginHorizontal) * 2);
    },
    [stylesheet]
  );

  const timePickerModalContextValue: TimePickerModalContext = useMemo(
    () => ({
      timeSelectorHeightSharedValue,
      timeSelectorOffsetXSharedValue,
      timeSelectorPositionXSharedValue,
      timeSelectorSlideLockSharedValue,
      timeSelectorTargetXSharedValue,
      timeSelectorWidthSharedValue,
    }), 
    [
      timeSelectorHeightSharedValue,
      timeSelectorOffsetXSharedValue,
      timeSelectorPositionXSharedValue,
      timeSelectorSlideLockSharedValue,
      timeSelectorTargetXSharedValue,
      timeSelectorWidthSharedValue,
    ],
  );

  const onAddOneTimeStepToSelectedDatePress = useCallback(
    () => {
      const nextPositionX = timeSelectorPositionXSharedValue.value - timeBarWidthAndMargins

      const index = Math.round(-((nextPositionX - (timeSelectorWidthSharedValue.value / 2)) / timeBarWidthAndMargins));
      const isOutOfBounds = index > (timeBoundaryIndexesLength - 1);

      if (isOutOfBounds) return;

      timeSelectorPositionXSharedValue.value = timeSelectorPositionXSharedValue.value - timeBarWidthAndMargins;
    },
    [timeBarWidthAndMargins, timeBoundaryIndexesLength, timeSelectorPositionXSharedValue, timeSelectorWidthSharedValue]
  );

  const onRemoveOneTimeStepToSelectedDatePress = useCallback(
    () => {
      const nextPositionX = timeSelectorPositionXSharedValue.value + timeBarWidthAndMargins

      const index = Math.round(-((nextPositionX - (timeSelectorWidthSharedValue.value / 2)) / timeBarWidthAndMargins));
      const isOutOfBounds = 0 > index;

      if (isOutOfBounds) return;

      timeSelectorPositionXSharedValue.value = timeSelectorPositionXSharedValue.value + timeBarWidthAndMargins;
    },
    [timeBarWidthAndMargins, timeBoundaryIndexesLength, timeSelectorPositionXSharedValue, timeSelectorWidthSharedValue]
  );

  const onCancelPress = useCallback(
    () => {
      if (onCancel) onCancel();
    }, 
    [onCancel]
  );

  const onConfirmPress = useCallback(
    () => {
      if (selectedTimeBoundaryIndex === undefined) {
        setSelectedTimeBoundaryIndexError(true);
        return;
      }

      if (onConfirm) onConfirm(
        getDatetimeFromSelectedTimeBoundaryIndexAndTimeStep(
          selectedTimeBoundaryIndex, 
          timeStep
        )
      );
    }, 
    [onConfirm, selectedTimeBoundaryIndex, timeStep]
  );

  const onContainerPress = useCallback(
    () => {
      if (onCancel) onCancel();
    }, 
    [onCancel]
  );

  const onContentPress = useCallback(
    () => null, 
    []
  );

  const contentStyles = {
    paddingBottom: bottom + Number(stylesheet?.content?.paddingBottom || 0),
  };

  const containerProps = {
    containerStyle: [defaultStylesheet.container, stylesheet.container],
    onPress: onContainerPress,
    style: [defaultStylesheet.container, stylesheet.container],
  };

  const contentProps = {
    onPress: onContentPress,
    style: [defaultStylesheet.content, stylesheet.content, contentStyles],
  };

  const timeSelectorControlsAndValueProps: TimeSelectorControlsAndValueProps = {
    onAddOneTimeStepToSelectedDatePress,
    onRemoveOneTimeStepToSelectedDatePress,
    selectedTimeBoundaryIndex,
    stylesheet: {
      timeSelectorControlsAndValueContainer: stylesheet.timeSelectorControlsAndValueContainer,
      timeSelectorValue: stylesheet.timeSelectorValue,
    },
    timeStep,
  };

  const timeSelectorSliderProps: TimeSelectorSliderProps = {
    selectedTimeBoundaryIndex,
    stylesheet: {
      timeSelectorBar: stylesheet.timeSelectorBar,
      timeSelectorBarContainer: stylesheet.timeSelectorBarContainer,
      timeSelectorBarHalfHour: stylesheet.timeSelectorBarHalfHour,
      timeSelectorBarHour: stylesheet.timeSelectorBarHour,
      timeSelectorBarIndexes: stylesheet.timeSelectorBarIndexes,
      timeSelectorBarSelectedSnapPoint: stylesheet.timeSelectorBarSelectedSnapPoint,
      timeSelectorBarText: stylesheet.timeSelectorBarText,
    },
    timeBarWidthAndMargins,
    timeStep,
  };

  useAnimatedReaction(
    () => timeSelectorPositionXSharedValue.value, 
    (positionX: number) => {
      if (timeSelectorWidthSharedValue.value === 0) return;
      const index = Math.round(-((positionX - (timeSelectorWidthSharedValue.value / 2)) / timeBarWidthAndMargins));
      if (index < 0) runOnJS(setSelectedTimeBoundaryIndex)(0);
      else if (index > timeBoundaryIndexesLength -1) runOnJS(setSelectedTimeBoundaryIndex)(timeBoundaryIndexesLength - 1);
      else runOnJS(setSelectedTimeBoundaryIndex)(index);
    },
    [timeBarWidthAndMargins, timeSelectorWidthSharedValue]
  );

  return (
    <TouchableWithoutFeedback {...containerProps}>
      <TouchableWithoutFeedback {...contentProps}>
        <Text style={[defaultStylesheet.heading, stylesheet.heading]}>Select a Time</Text>
        <View style={[defaultStylesheet.timeSelector, stylesheet.timeSelector]}>
          <TimePickerModalContextProvider value={timePickerModalContextValue}>
            <TimeSelectorControlsAndValue {...timeSelectorControlsAndValueProps} />
            <TimeSelectorSlider {...timeSelectorSliderProps} />
          </TimePickerModalContextProvider>
        </View>
        <View style={[defaultStylesheet.selectedTimeBoundaryIndexErrorContainer, stylesheet.selectedTimeBoundaryIndexErrorContainer]}>
          {selectedTimeBoundaryIndexError && <Text style={[defaultStylesheet.selectedDateErrorText, stylesheet.selectedDateErrorText]}>You need to select a time</Text>}
        </View>
        <TouchableOpacity onPress={onConfirmPress} style={[defaultStylesheet.confirmButton, stylesheet.confirmButton]}>
          <Text style={[defaultStylesheet.confirmButtonText, stylesheet.confirmButtonText]}>Confirm</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onCancelPress} style={[defaultStylesheet.cancelButton, stylesheet.cancelButton]}>
          <Text style={[defaultStylesheet.cancelButtonText, stylesheet.cancelButtonText]}>Cancel</Text>
        </TouchableOpacity>
      </TouchableWithoutFeedback>
    </TouchableWithoutFeedback>
  );
};

//
const WrappedTimePickerModalContent = gestureHandlerRootHOC<TimePickerModalContentProps>(TimePickerModalContent);

//
export type TimePickerModalProps = {
  animationType?: 'fade' | 'none' | 'slide';
  initialDatetime?: Date;
  onCancel?: () => void;
  onConfirm?: (date: Date) => void;
  presentationStyle?: 'formSheet' | 'fullScreen' | 'overFullScreen' | 'pageSheet';
  stylesheet?: TimePickerModalStyleSheet;
  timeStep?: TimeStep;
  transparent?: boolean;
  visible?: boolean;
};

/**
 * 
 * @param {TimePickerModalProps} props 
 * @returns {JSX.Element}
 */
const TimePickerModalContainer: FunctionComponent<TimePickerModalProps> = ({
  animationType = 'slide',
  presentationStyle = 'overFullScreen',
  transparent = true,
  visible = false,
  ...otherProps
}) => {
  const modalProps = { animationType, presentationStyle, transparent, visible };
  return (
    <Modal {...modalProps}>
      <WrappedTimePickerModalContent {...otherProps} />
    </Modal>
  );
};

//
export default TimePickerModalContainer;
