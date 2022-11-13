import React, { FunctionComponent } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import format from 'date-fns/format';

//
import CircledDash from '../../asset/CircledDash.svg';
import CircledPlus from '../../asset/CircledPlus.svg';
import getDatetimeFromSelectedTimeBoundaryIndexAndTimeStep from '../helpers/get-datetime-from-selected-time-boundary-index-and-time-step';
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
  addOneTimeStepToSelectedDate: () => void;
  removeOneTimeStepToSelectedDate: () => void;
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
  addOneTimeStepToSelectedDate,
  removeOneTimeStepToSelectedDate,
  selectedTimeBoundaryIndex, 
  stylesheet = {},
  timeStep,
}) => {
  const value = format(getDatetimeFromSelectedTimeBoundaryIndexAndTimeStep(selectedTimeBoundaryIndex, timeStep), 'hh:mm aa');

  return (
    <View style={[defaultStylesheet.timeSelectorControlsAndValueContainer, stylesheet.timeSelectorControlsAndValueContainer]}>
      <TouchableOpacity onPress={removeOneTimeStepToSelectedDate}>
        <CircledDash />
      </TouchableOpacity>
      <Text style={[defaultStylesheet.timeSelectorValue, stylesheet.timeSelectorValue]}>{value}</Text>
      <TouchableOpacity onPress={addOneTimeStepToSelectedDate}>
        <CircledPlus />
      </TouchableOpacity>
    </View>
  )
};

//
export default TimeSelectorControlsAndValue;
