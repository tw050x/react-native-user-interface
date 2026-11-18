import { LogBox } from 'react-native';

// Detox turns on the emulator's reduced-motion setting, and Reanimated's
// warning about it covers the bottom of the pickers in debug builds.
// This runs in its own module, imported first by main.tsx, because Reanimated
// logs the warning as soon as it is imported.
LogBox.ignoreLogs(['[Reanimated] Reduced motion setting is enabled']);
