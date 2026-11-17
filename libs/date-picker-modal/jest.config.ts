// Unit tests cover the library's pure logic (helpers) only, so they run in
// plain Node with no React Native preset. UI behaviour is covered by the
// Detox tests in apps/react-native-user-interface-e2e.
module.exports = {
  displayName: 'date-picker-modal',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/date-picker-modal',
};
