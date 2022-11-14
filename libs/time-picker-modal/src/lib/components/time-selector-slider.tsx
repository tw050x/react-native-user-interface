import React, { FunctionComponent, useCallback, useMemo } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { Gesture, GestureDetector, GestureUpdateEvent, PanGestureHandlerEventPayload } from 'react-native-gesture-handler';
import Animated, { runOnUI, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import format from 'date-fns/format';

//
import { useTimePickerModalContext } from '../context';
import findClosestNumberInNumbersArray from '../helpers/find-closest-number-in-numbers-array';
import getTimeBoundaryIndexesFromTimeStep from '../helpers/get-time-boundary-indexes';
import getDatetimeFromSelectedTimeBoundaryIndexAndTimeStep from '../helpers/get-datetime';
import snapPoint from '../helpers/snap-point';
import { TimeStep } from '../types';

//
export type TimeSelectorSliderDefaultStyleSheet = {
  timeSelectorBar: ViewStyle;
  timeSelectorBarContainer: ViewStyle;
  timeSelectorBarHalfHour: ViewStyle;
  timeSelectorBarHour: ViewStyle;
  timeSelectorBarIndexes: ViewStyle;
  timeSelectorBarSelectedSnapPoint: ViewStyle;
  timeSelectorBarText: TextStyle;
}

//
export const defaultStylesheet: TimeSelectorSliderDefaultStyleSheet = StyleSheet.create({
  timeSelectorBar: {
    backgroundColor: '#cccccc',
    borderRadius: 3,
    height: 20,
    marginHorizontal: 2,
    width: 5,
  },
  timeSelectorBarContainer: {
    width: '100%',
  },
  timeSelectorBarHalfHour: {
    height: 25
  },
  timeSelectorBarHour: {
    height: 35
  },
  timeSelectorBarIndexes: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    paddingTop: 65,
  },
  timeSelectorBarSelectedSnapPoint: {
    backgroundColor: '#4a83e7'
  },
  timeSelectorBarText: {
    bottom: 40,
    color: '#888888',
    left: -15,
    position: 'absolute',
    textAlign: 'center',
    width: 42,
  },
});

//
export type TimeSelectorSliderProps = {
  selectedTimeBoundaryIndex: number;
  stylesheet?: Partial<TimeSelectorSliderDefaultStyleSheet>;
  timeBarWidthAndMargins: number;
  timeStep: TimeStep;
}

/**
 * 
 * @param {TimeSelectorSliderProps} props
 * @returns {JSX.Element}
 */
const TimeSelectorSlider: FunctionComponent<TimeSelectorSliderProps> = ({ selectedTimeBoundaryIndex, stylesheet, timeBarWidthAndMargins, timeStep }) => {
  const { timeSelectorOffsetXSharedValue, timeSelectorPositionXSharedValue, timeSelectorTargetXSharedValue, timeSelectorWidthSharedValue } = useTimePickerModalContext();

  const timeBoundaryIndexes = useMemo(
    () => getTimeBoundaryIndexesFromTimeStep(timeStep), 
    [timeStep],
  );

  const timeBoundarySnapPoints = useMemo(
    () => timeBoundaryIndexes.map((index: number) => -(index * timeBarWidthAndMargins - (timeSelectorWidthSharedValue.value / 2))),
    [timeBarWidthAndMargins, timeBoundaryIndexes, timeSelectorWidthSharedValue.value]
  );

  const onTimeSelectorBarContainerLayout = useCallback(
    (event: LayoutChangeEvent) => {
      if (timeSelectorWidthSharedValue.value !== event.nativeEvent.layout.width) {
        const selectorBarContainerLayoutWidth = event.nativeEvent.layout.width
        timeSelectorPositionXSharedValue.value = -((selectedTimeBoundaryIndex * timeBarWidthAndMargins) - (selectorBarContainerLayoutWidth / 2));
        timeSelectorWidthSharedValue.value = selectorBarContainerLayoutWidth;
      }
    }, 
    [selectedTimeBoundaryIndex, timeBarWidthAndMargins, timeSelectorPositionXSharedValue, timeSelectorWidthSharedValue]
  );

  const onDayPanGestureStart = runOnUI(() => {
    timeSelectorOffsetXSharedValue.value = timeSelectorPositionXSharedValue.value;
  });

  const onDayPanGestureUpdate = runOnUI((event: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
    timeSelectorPositionXSharedValue.value = timeSelectorOffsetXSharedValue.value + event.translationX;
    timeSelectorTargetXSharedValue.value = Math.abs(event.velocityX) > 150
      ? snapPoint(timeSelectorPositionXSharedValue.value, event.velocityX, timeBoundarySnapPoints) 
      : findClosestNumberInNumbersArray(timeSelectorPositionXSharedValue.value, timeBoundarySnapPoints);
  });

  const onDayPanGestureEnd = runOnUI(() => {
    timeSelectorPositionXSharedValue.value = withTiming(timeSelectorTargetXSharedValue.value);
  });

  const timePanGesture = Gesture.Pan().
    onStart(onDayPanGestureStart).
    onUpdate(onDayPanGestureUpdate).
    onEnd(onDayPanGestureEnd);

  const renderTimeSelectorBar = (_: number, index: number) => {
    const isHour = (index % 12) === 0;
    const isHalfHour = (index % 6) === 0;

    const timeSelectorBarStyle: Array<ViewStyle | undefined> = [
      defaultStylesheet.timeSelectorBar,
      stylesheet?.timeSelectorBar,
    ];

    const timeSelectorBarTextStyle: Array<TextStyle | undefined> = [
      defaultStylesheet.timeSelectorBarText,
      stylesheet?.timeSelectorBarText,
    ];

    if (isHalfHour) {
      timeSelectorBarStyle.push(defaultStylesheet.timeSelectorBarHalfHour);
      timeSelectorBarStyle.push(stylesheet?.timeSelectorBarHalfHour);
    }

    if (isHour) {
      timeSelectorBarStyle.push(defaultStylesheet.timeSelectorBarHour);
      timeSelectorBarStyle.push(stylesheet?.timeSelectorBarHour);
    }

    if (index === selectedTimeBoundaryIndex) {
      timeSelectorBarStyle.push(defaultStylesheet.timeSelectorBarSelectedSnapPoint);
      timeSelectorBarStyle.push(stylesheet?.timeSelectorBarSelectedSnapPoint);
    }

    const datetime = getDatetimeFromSelectedTimeBoundaryIndexAndTimeStep(index, timeStep);
    const value = format(datetime, 'hh:mm');

    return (
      <View key={index}>
        {isHour === true && <Text style={timeSelectorBarTextStyle}>{value}</Text>}
        <View style={timeSelectorBarStyle} />
      </View>
    );
  };

  const timeSelectorAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: timeSelectorPositionXSharedValue.value }],
  }));

  return (
    <GestureDetector gesture={timePanGesture}>
      <View onLayout={onTimeSelectorBarContainerLayout} style={[defaultStylesheet.timeSelectorBarContainer, stylesheet?.timeSelectorBarContainer]}>
        <Animated.View style={[defaultStylesheet.timeSelectorBarIndexes, stylesheet?.timeSelectorBarIndexes, timeSelectorAnimatedStyle]}>
          {timeBoundaryIndexes.map(renderTimeSelectorBar)}
        </Animated.View>
      </View>
    </GestureDetector>
  );
};

//
export default TimeSelectorSlider;
