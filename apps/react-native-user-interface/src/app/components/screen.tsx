import React, { PropsWithChildren } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, maxContentWidth } from '../theme';

//
const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    alignSelf: 'center',
    maxWidth: maxContentWidth,
    paddingBottom: 32,
    paddingHorizontal: 16,
    width: '100%',
  },
  back: {
    alignSelf: 'flex-start',
    marginLeft: -8,
    marginTop: 12,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  backText: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    paddingBottom: 24,
    paddingTop: 20,
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: 6,
  },
  intro: {
    color: colors.textMuted,
    fontSize: 16,
    lineHeight: 24,
    marginTop: 10,
    maxWidth: 620,
  },
  statusBarBackdrop: {
    backgroundColor: colors.background,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});

//
export type ScreenProps = PropsWithChildren<{
  eyebrow: string;
  intro: string;
  onBack?: () => void;
  testID: string;
  title: string;
}>;

/**
 * The frame every showcase screen shares: a scrolling page with a header, an
 * optional back link, and content capped at a readable width.
 *
 * @param {ScreenProps} props
 * @returns {JSX.Element}
 */
export const Screen = ({ children, eyebrow, intro, onBack, testID, title }: ScreenProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom, paddingTop: insets.top }} testID={testID}>
        <View style={styles.content}>
          {onBack && (
            <Pressable accessibilityRole="link" hitSlop={8} onPress={onBack} style={styles.back} testID="back">
              <Text style={styles.backText}>‹ All components</Text>
            </Pressable>
          )}
          <View style={styles.header}>
            <Text style={styles.eyebrow}>{eyebrow}</Text>
            <Text accessibilityRole="header" style={styles.title}>{title}</Text>
            <Text style={styles.intro}>{intro}</Text>
          </View>
          {children}
        </View>
      </ScrollView>
      {/* Keeps scrolled content from showing through the status bar. */}
      <View pointerEvents="none" style={[styles.statusBarBackdrop, { height: insets.top }]} />
    </View>
  );
};

export default Screen;
