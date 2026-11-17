# @react-native-user-interface/time-picker-modal

> :warning: This library is not ready for use in production environments. Use at your own risk.

The `<TimePickerModal />` allows gesture based input of time values onto a `Date` object. The provided date object will only have the hours and minute values changed, you can therefore use the same date object with our `<DatePickerModal />`.

### Requirements

* React Native 0.80 or later, with the New Architecture enabled (required by Reanimated 4).
* React 19.

### Peer Dependencies

To use this component you must install the following peer dependencies:

| Package | Version |
| --- | --- |
| [date-fns](https://www.npmjs.com/package/date-fns) | 2.30+, 3 or 4 |
| [react](https://www.npmjs.com/package/react) | 19+ |
| [react-native](https://www.npmjs.com/package/react-native) | 0.80+ |
| [react-native-gesture-handler](https://www.npmjs.com/package/react-native-gesture-handler) | 2.16+ (2.x) |
| [react-native-reanimated](https://www.npmjs.com/package/react-native-reanimated) | 4.x |
| [react-native-safe-area-context](https://www.npmjs.com/package/react-native-safe-area-context) | 4.4.1+ |

To install with `npm` run:

```
npm install date-fns react-native-gesture-handler react-native-reanimated react-native-worklets react-native-safe-area-context
```

To install with `yarn` run:

```
yarn add date-fns react-native-gesture-handler react-native-reanimated react-native-worklets react-native-safe-area-context
```

Reanimated 4 also needs [react-native-worklets](https://www.npmjs.com/package/react-native-worklets) and its Babel plugin (`react-native-worklets/plugin`, listed last in your Babel config). Pick the Reanimated and Worklets versions that match your React Native version; see the [Reanimated compatibility table](https://docs.swmansion.com/react-native-reanimated/docs/guides/compatibility).

You will also need a means to work with SVG files, We have tested with [react-native-svg](https://www.npmjs.com/package/react-native-svg) and [react-native-svg-transformer](https://www.npmjs.com/package/react-native-svg-transformer). But have left these out of the peer dependencies in order to allow you to decide what to use.

> Without a means to handle SVG files <ins>Metro</ins> will throw an error during compilation. Simply follow the respective projects installation instructions to fix this issue.
