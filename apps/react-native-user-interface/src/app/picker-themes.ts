import type { DatePickerModalStyleSheet } from '@react-native-user-interface/date-picker-modal';
import type { TimePickerModalStyleSheet } from '@react-native-user-interface/time-picker-modal';

/**
 * Example `stylesheet` props the showcase can switch between, to show that the
 * pickers can be restyled. Each one only swaps the accent colour, because the
 * icons are drawn in the text colour and stay black.
 */
export type PickerTheme = 'default' | 'ink' | 'forest';

export const pickerThemeOptions = [
  { label: 'Default', value: 'default' },
  { label: 'Ink', value: 'ink' },
  { label: 'Forest', value: 'forest' },
] as const;

const accents: Record<Exclude<PickerTheme, 'default'>, string> = {
  forest: '#15803d',
  ink: '#111827',
};

export const getDatePickerStylesheet = (theme: PickerTheme): DatePickerModalStyleSheet | undefined => {
  if (theme === 'default') return undefined;
  const accent = accents[theme];

  return {
    cancelButtonText: { color: accent },
    confirmButton: { backgroundColor: accent },
    dateSelectorDayContentCurrentDayIndex: { backgroundColor: `${accent}22` },
    dateSelectorDayContentFocusedDayIndex: { backgroundColor: accent },
    dateSelectorDayContentFocusedPastDayIndex: { backgroundColor: `${accent}44` },
  };
};

export const getTimePickerStylesheet = (theme: PickerTheme): TimePickerModalStyleSheet | undefined => {
  if (theme === 'default') return undefined;
  const accent = accents[theme];

  return {
    cancelButtonText: { color: accent },
    confirmButton: { backgroundColor: accent },
    timeSelectorBarSelectedSnapPoint: { backgroundColor: accent },
  };
};

/**
 * The `stylesheet={...}` line for the usage snippet, or nothing for the default.
 */
export const describeStylesheet = (stylesheet: object | undefined): string | undefined => {
  if (stylesheet === undefined) return undefined;
  const json = JSON.stringify(stylesheet, null, 2)
    .replace(/"([a-zA-Z]+)":/g, '$1:')
    .replace(/"/g, "'")
    .split('\n')
    .join('\n  ');

  return `stylesheet={${json}}`;
};
