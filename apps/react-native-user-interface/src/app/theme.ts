import { Platform } from 'react-native';

/**
 * Colours and spacing shared by the showcase. The accent matches the blue the
 * picker libraries use by default, so the demo and the modals look like one app.
 */
export const colors = {
  accent: '#4a83e7',
  accentSoft: '#e8f0fd',
  background: '#f3f5f9',
  border: '#e3e7ee',
  card: '#ffffff',
  code: '#1e2433',
  codeText: '#e6ebf5',
  text: '#1b2230',
  textMuted: '#667085',
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
} as const;

export const monospace = Platform.select({
  android: 'monospace',
  ios: 'Menlo',
  default: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
});

// Widest the content gets on tablets and the web, and the width at which the
// component cards sit side by side.
export const maxContentWidth = 1040;
export const twoColumnBreakpoint = 820;
