module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [


    // NOTE: RN Reanimated must be listed last.
    // See https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation
    ["react-native-reanimated/plugin"]
  ]
}
