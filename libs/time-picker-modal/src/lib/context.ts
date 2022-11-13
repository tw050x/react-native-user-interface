import { createContext, useContext } from 'react';
import { SharedValue } from 'react-native-reanimated';

//
export type TimePickerModalContext = {
  timeSelectorHeightSharedValue: SharedValue<number>;
  timeSelectorOffsetXSharedValue: SharedValue<number>;
  timeSelectorPositionXSharedValue: SharedValue<number>;
  timeSelectorSlideLockSharedValue: SharedValue<boolean>;
  timeSelectorTargetXSharedValue: SharedValue<number>;
  timeSelectorWidthSharedValue: SharedValue<number>;
};

//
export const context = createContext<TimePickerModalContext | null>(null);

/**
 * 
 * @returns {TimePickerModalContext}
 */
export const useTimePickerModalContext = () => {
  const timePickerModalContext = useContext(context)

  if (timePickerModalContext === null) {
    throw new Error('useTimePickerModalContext() must be used within a <TimePickerModalContextProvider />')
  }

  return timePickerModalContext
}

//
export const TimePickerModalContextConsumer = context.Consumer;
export const TimePickerModalContextProvider = context.Provider;
