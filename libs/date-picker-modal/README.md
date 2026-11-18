# @react-native-user-interface/date-picker-modal

A date picker for React Native that opens as a bottom-sheet modal. Step through months and years with the arrows, tap a day, and confirm.

<p align="center">
  <img alt="Date picker demo: stepping through months and picking a day" src="https://raw.githubusercontent.com/tw050x/react-native-user-interface/main/libs/date-picker-modal/media/demo.gif" width="300" />
</p>

> :warning: This library is not yet recommended for production use. Use at your own risk.

- Shows a full month, Sunday to Saturday, with days from the previous and next months greyed out.
- Highlights today, and the selected day.
- Only the year, month and day change: the time of day of the `Date` you pass in is kept. This means you can share one `Date` with [`<TimePickerModal />`](https://www.npmjs.com/package/@react-native-user-interface/time-picker-modal).
- Every part can be restyled through the `stylesheet` prop.
- Written in TypeScript, with types included.

## Requirements

- React Native 0.80 or later, with the New Architecture enabled (Reanimated 4 requires it).
- React 19.

## Installation

```sh
npm install @react-native-user-interface/date-picker-modal
# or
yarn add @react-native-user-interface/date-picker-modal
```

### Peer dependencies

| Package | Version |
| --- | --- |
| [date-fns](https://www.npmjs.com/package/date-fns) | 2.30+, 3 or 4 |
| [react](https://www.npmjs.com/package/react) | 19+ |
| [react-native](https://www.npmjs.com/package/react-native) | 0.80+ |
| [react-native-gesture-handler](https://www.npmjs.com/package/react-native-gesture-handler) | 2.16+ (2.x) |
| [react-native-reanimated](https://www.npmjs.com/package/react-native-reanimated) | 4.x |
| [react-native-safe-area-context](https://www.npmjs.com/package/react-native-safe-area-context) | 4.4.1+ |

```sh
npm install date-fns react-native-gesture-handler react-native-reanimated react-native-worklets react-native-safe-area-context
```

Reanimated 4 also needs [react-native-worklets](https://www.npmjs.com/package/react-native-worklets) and its Babel plugin. Add `react-native-worklets/plugin` as the **last** plugin in your Babel config. Pick the Reanimated and Worklets versions that match your React Native version; see the [Reanimated compatibility table](https://docs.swmansion.com/react-native-reanimated/docs/guides/compatibility).

### SVG support

The arrow icons are SVG files, so Metro needs to be able to import SVGs. We test with [react-native-svg](https://www.npmjs.com/package/react-native-svg) and [react-native-svg-transformer](https://www.npmjs.com/package/react-native-svg-transformer). They are not peer dependencies, so you can choose your own setup. Without one, Metro fails to bundle the package.

```sh
npm install react-native-svg
npm install --save-dev react-native-svg-transformer
```

```js
// metro.config.js
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

module.exports = mergeConfig(defaultConfig, {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
  },
});
```

## Usage

Render your app inside a `SafeAreaProvider`, then control the modal with `visible`:

```tsx
import React, { useState } from 'react';
import { Button, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import DatePickerModal from '@react-native-user-interface/date-picker-modal';

export const App = () => {
  const [date, setDate] = useState(() => new Date());
  const [visible, setVisible] = useState(false);

  return (
    <SafeAreaProvider>
      <View>
        <Text>{date.toDateString()}</Text>
        <Button title="Change date" onPress={() => setVisible(true)} />
      </View>
      <DatePickerModal
        initialDate={date}
        onCancel={() => setVisible(false)}
        onConfirm={(selected) => {
          setDate(selected);
          setVisible(false);
        }}
        visible={visible}
      />
    </SafeAreaProvider>
  );
};
```

The modal does not close itself: hide it in `onConfirm` and `onCancel`. Tapping outside the sheet calls `onCancel`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `visible` | `boolean` | `false` | Whether the modal is shown. |
| `initialDate` | `Date` | today | The date selected when the picker opens. Its time of day is kept in the confirmed date. |
| `onConfirm` | `(date: Date) => void` | | Called with the selected date when **Confirm** is pressed. |
| `onCancel` | `() => void` | | Called when **Cancel** is pressed or the backdrop is tapped. |
| `stylesheet` | `DatePickerModalStyleSheet` | `{}` | Style overrides, see below. |
| `animationType` | `'slide' \| 'fade' \| 'none'` | `'slide'` | Passed to React Native's `Modal`. |
| `presentationStyle` | `'overFullScreen' \| 'fullScreen' \| 'pageSheet' \| 'formSheet'` | `'overFullScreen'` | Passed to React Native's `Modal`. |
| `transparent` | `boolean` | `true` | Passed to React Native's `Modal`. |

## Styling

Pass a `stylesheet` to override any part of the default look. Each key is merged over the default style for that part.

```tsx
<DatePickerModal
  stylesheet={{
    confirmButton: { backgroundColor: '#111827' },
    dateSelectorDayContentFocusedDayIndex: { backgroundColor: '#111827' },
    heading: { fontSize: 24 },
  }}
/>
```

| Key | Part |
| --- | --- |
| `container` | The full-screen backdrop. |
| `content` | The sheet. |
| `heading` | The "Select a Date" title. |
| `dateSelector` | The area holding the controls and calendar. |
| `dateSelectorControls`, `dateSelectorControl`, `dateSelectorControlText` | The year and month controls. |
| `dateSelectorWeekdays`, `dateSelectorWeekday`, `dateSelectorWeekdayText` | The S M T W T F S row. |
| `dateSelectorWeeks`, `dateSelectorWeek` | The calendar grid and each week row. |
| `dateSelectorDayContainer`, `dateSelectorDayContent`, `dateSelectorDayText` | Each day. |
| `dateSelectorDayTextIsCurrentMonth` | Text of days outside the shown month. |
| `dateSelectorDayContentCurrentDayIndex` | Today. |
| `dateSelectorDayContentFocusedDayIndex`, `dateSelectorDayTextIsSelected` | The selected day (today or later). |
| `dateSelectorDayContentFocusedPastDayIndex` | The selected day, when it is in the past. |
| `selectedDateErrorContainer`, `selectedDateErrorText` | The "You need to select a date" message. |
| `confirmButton`, `confirmButtonText` | The **Confirm** button. |
| `cancelButton`, `cancelButtonText` | The **Cancel** button. |

## TypeScript

```ts
import type { DatePickerModalProps, DatePickerModalStyleSheet } from '@react-native-user-interface/date-picker-modal';
```

## License

MIT
