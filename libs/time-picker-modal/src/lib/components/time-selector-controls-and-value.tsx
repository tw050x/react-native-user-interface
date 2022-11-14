import React, { FunctionComponent, useCallback, useRef } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import format from 'date-fns/format';

//
import CircledDash from '../../asset/CircledDash.svg';
import CircledPlus from '../../asset/CircledPlus.svg';
import getDatetimeFromSelectedTimeBoundaryIndexAndTimeStep from '../helpers/get-datetime';
import { TimeStep } from '../types';

//
export type TimeSelectorControlsAndValueDefaultStyleSheet = {
  timeSelectorControlsAndValueContainer: ViewStyle;
  timeSelectorValue: ViewStyle;
}

//
const defaultStylesheet = StyleSheet.create({
  timeSelectorControlsAndValueContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 20,
  },
  timeSelectorValue: {
    fontSize: 30,
    fontWeight: '600',
  },
})

//
export type TimeSelectorControlsAndValueProps = {
  onAddOneTimeStepToSelectedDatePress: () => void;
  onRemoveOneTimeStepToSelectedDatePress: () => void;
  selectedTimeBoundaryIndex: number;
  stylesheet?: Partial<TimeSelectorControlsAndValueDefaultStyleSheet>;
  timeStep: TimeStep;
}

/**
 *
 * @param {TimeSelectorControlsAndValueProps} props
 * @returns {JSX.Element} 
 */
const TimeSelectorControlsAndValue: FunctionComponent<TimeSelectorControlsAndValueProps> = ({ 
  onAddOneTimeStepToSelectedDatePress,
  onRemoveOneTimeStepToSelectedDatePress,
  selectedTimeBoundaryIndex, 
  stylesheet = {},
  timeStep,
}) => {
  const value = format(getDatetimeFromSelectedTimeBoundaryIndexAndTimeStep(selectedTimeBoundaryIndex, timeStep), 'hh:mm aa');

  const intervalId = useRef<NodeJS.Timer | null>(null);

  const onAddTimeStepLongPress = useCallback(
    () => {
      intervalId.current = setInterval(
        () => onAddOneTimeStepToSelectedDatePress(), 
        100
      );
    }, 
    [onAddOneTimeStepToSelectedDatePress]
  );

  const onRemoveTimeStepLongPress = useCallback(
    () => {
      intervalId.current = setInterval(
        () => onRemoveOneTimeStepToSelectedDatePress(), 
        100
      );
    }, 
    [onRemoveOneTimeStepToSelectedDatePress]
  );

  const onPressOut = useCallback(() => {
    if (intervalId.current !== null) clearInterval(intervalId.current);
  }, []);

  return (
    <View style={[defaultStylesheet.timeSelectorControlsAndValueContainer, stylesheet.timeSelectorControlsAndValueContainer]}>
      <TouchableOpacity onLongPress={onRemoveTimeStepLongPress} onPress={onRemoveOneTimeStepToSelectedDatePress} onPressOut={onPressOut}>
        <CircledDash />
      </TouchableOpacity>
      <Text style={[defaultStylesheet.timeSelectorValue, stylesheet.timeSelectorValue]}>{value}</Text>
      <TouchableOpacity onLongPress={onAddTimeStepLongPress} onPress={onAddOneTimeStepToSelectedDatePress} onPressOut={onPressOut}>
        <CircledPlus />
      </TouchableOpacity>
    </View>
  )
};

//
export default TimeSelectorControlsAndValue;
