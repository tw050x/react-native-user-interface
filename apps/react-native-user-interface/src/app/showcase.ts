import { TextStyle } from 'react-native';
import { colors } from './theme';

/**
 * The components the showcase lists, in order. Add an entry and a screen in
 * App.tsx to showcase a new component.
 */
export const showcasedComponents = [
  {
    description: 'A month calendar in a bottom-sheet modal. Pick a day; the time of day is kept.',
    id: 'date-picker',
    packageName: '@react-native-user-interface/date-picker-modal',
    title: 'Date picker',
  },
  {
    description: 'A slider across the day in a bottom-sheet modal. Pick a time; the date is kept.',
    id: 'time-picker',
    packageName: '@react-native-user-interface/time-picker-modal',
    title: 'Time picker',
  },
] as const;

export type ComponentId = (typeof showcasedComponents)[number]['id'];

//
export type AnimationType = 'slide' | 'fade' | 'none';

export const animationOptions = [
  { label: 'Slide', value: 'slide' },
  { label: 'Fade', value: 'fade' },
  { label: 'None', value: 'none' },
] as const;

//
export const hintStyle: TextStyle = {
  color: colors.textMuted,
  fontSize: 13,
  marginTop: 10,
};
