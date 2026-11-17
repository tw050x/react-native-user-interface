module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      ['module:@react-native/babel-preset', { useTransformReactJSX: true }],
    ],
    // NOTE: the Worklets plugin (used by Reanimated 4) must be listed last.
    // See https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started
    plugins: ['react-native-worklets/plugin'],
  };
};
