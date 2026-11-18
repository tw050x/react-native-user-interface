import React, { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, monospace, radius } from '../theme';

//
const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 1,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  description: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 6,
  },
  install: {
    backgroundColor: colors.code,
    borderRadius: radius.sm,
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  installText: {
    color: colors.codeText,
    fontFamily: monospace,
    fontSize: 12,
  },
  field: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  fieldPressed: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  fieldLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  fieldValue: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 2,
  },
  fieldAction: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: '600',
  },
});

//
export type ComponentCardProps = PropsWithChildren<{
  description: string;
  fieldLabel: string;
  fieldValue: string;
  onOpen: () => void;
  packageName: string;
  testID: string;
  title: string;
}>;

/**
 * Showcases one library: what it is, how to install it, a field that opens it
 * with the current value, and the options passed as children.
 *
 * @param {ComponentCardProps} props
 * @returns {JSX.Element}
 */
export const ComponentCard = ({ children, description, fieldLabel, fieldValue, onOpen, packageName, testID, title }: ComponentCardProps) => (
  <View style={styles.card}>
    <Text accessibilityRole="header" style={styles.title}>{title}</Text>
    <Text style={styles.description}>{description}</Text>
    <View style={styles.install}>
      <Text selectable style={styles.installText}>yarn add {packageName}</Text>
    </View>
    <Pressable
      accessibilityHint={`Opens the ${title.toLowerCase()}`}
      accessibilityRole="button"
      onPress={onOpen}
      style={({ pressed }) => [styles.field, pressed && styles.fieldPressed]}
      testID={testID}
    >
      <View>
        <Text style={styles.fieldLabel}>{fieldLabel}</Text>
        <Text style={styles.fieldValue} testID={`${testID}-text`}>{fieldValue}</Text>
      </View>
      <Text style={styles.fieldAction}>Change</Text>
    </Pressable>
    {children}
  </View>
);

export default ComponentCard;
