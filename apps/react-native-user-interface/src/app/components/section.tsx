import React, { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, monospace, radius } from '../theme';

//
const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginBottom: 16,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 1,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  description: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 4,
  },
  code: {
    backgroundColor: colors.code,
    borderRadius: radius.sm,
    marginTop: 12,
    padding: 12,
  },
  codeText: {
    color: colors.codeText,
    fontFamily: monospace,
    fontSize: 12,
    lineHeight: 18,
  },
});

//
export type SectionProps = PropsWithChildren<{
  description?: string;
  title: string;
}>;

/**
 * A titled card on a showcase screen.
 *
 * @param {SectionProps} props
 * @returns {JSX.Element}
 */
export const Section = ({ children, description, title }: SectionProps) => (
  <View style={styles.card}>
    <Text accessibilityRole="header" style={styles.title}>{title}</Text>
    {description && <Text style={styles.description}>{description}</Text>}
    {children}
  </View>
);

/**
 * A block of code people can select and copy.
 *
 * @param {{ code: string }} props
 * @returns {JSX.Element}
 */
export const CodeBlock = ({ code }: { code: string }) => (
  <View style={styles.code}>
    <Text selectable style={styles.codeText}>{code}</Text>
  </View>
);

export default Section;
