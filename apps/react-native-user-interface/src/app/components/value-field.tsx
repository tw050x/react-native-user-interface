import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../theme';

//
const styles = StyleSheet.create({
  field: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  fieldPressed: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  label: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  value: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
    marginTop: 2,
  },
  action: {
    backgroundColor: colors.accent,
    borderRadius: 999,
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
    overflow: 'hidden',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
});

//
export type ValueFieldProps = {
  action: string;
  label: string;
  onPress: () => void;
  testID: string;
  value: string;
};

/**
 * Shows the current value and opens the picker that edits it.
 *
 * @param {ValueFieldProps} props
 * @returns {JSX.Element}
 */
export const ValueField = ({ action, label, onPress, testID, value }: ValueFieldProps) => (
  <Pressable
    accessibilityRole="button"
    onPress={onPress}
    style={({ pressed }) => [styles.field, pressed && styles.fieldPressed]}
    testID={testID}
  >
    <View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value} testID={`${testID}-text`}>{value}</Text>
    </View>
    <Text style={styles.action}>{action}</Text>
  </Pressable>
);

export default ValueField;
