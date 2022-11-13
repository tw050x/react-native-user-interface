import type { TimePickerModalDefaultStyleSheet } from './time-picker-modal';
import type { TimeSelectorControlsAndValueDefaultStyleSheet } from './components/time-selector-controls-and-value';
import type { TimeSelectorSliderDefaultStyleSheet } from './components/time-selector-slider';

//
export type TimePickerModalStyleSheet = Partial<TimePickerModalDefaultStyleSheet> & Partial<TimeSelectorControlsAndValueDefaultStyleSheet> & Partial<TimeSelectorSliderDefaultStyleSheet>;

//
export type TimeStep = 1 | "1" | 2 | "2" | 3 | "3" | 4 | "4" | 5 | "5" | 10 | "10" | 15 | "15" | 20 | "20" | 30 | "30" | 60 | "60";
