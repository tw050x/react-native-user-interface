# @react-native-user-interface/date-picker-modal

> :warning: This library is not ready for use in production environments. Use at your own risk.

The `<DatePickerModal />` allows gesture based input of date values onto a `Date` object. The provided date object will only have the year, month and date (month day) values changed, you can therefore use the same date object with out `<TimePickerModal />`.

### Peer Dependencies

To use this component you must install the following peer dependencies:

* [date-fns](https://www.npmjs.com/package/date-fns)
* [react](https://www.npmjs.com/package/react)
* [react-native](https://www.npmjs.com/package/react-native)
* [react-native-gesture-handler](https://www.npmjs.com/package/react-native-gesture-handler)
* [react-native-reanimated](https://www.npmjs.com/package/react-native-reanimated)
* [react-native-safe-area-context](https://www.npmjs.com/package/react-native-safe-area-context)

To install these with `npm` run:

```
npm install date-fns react react-native react-native-gesture-handler react-native-reanimated react-native-safe-area-context
```

To install with `yarn` run:

```
yarn add date-fns react react-native react-native-gesture-handler react-native-reanimated react-native-safe-area-context
```

You will also need a means to work with SVG files, We have tested with [react-native-svg](https://www.npmjs.com/package/react-native-svg) and [react-native-svg-transformer](https://www.npmjs.com/package/react-native-svg-transformer). But have left these out of the peer dependencies in order to allow you to decide what to use.

> Without a means to handle SVG files <ins>Metro</ins> will throw an error during compilation. Simply follow the respective projects installation instructions to fix this issue.
