import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, monospace, radius } from '../theme';

//
const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  label: {
    color: colors.textMuted,
    fontFamily: monospace,
    fontSize: 13,
    marginBottom: 8,
  },
  options: {
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    flexDirection: 'row',
    padding: 3,
  },
  option: {
    alignItems: 'center',
    borderRadius: radius.sm - 2,
    flex: 1,
    paddingVertical: 7,
  },
  optionSelected: {
    backgroundColor: colors.card,
    shadowColor: '#000000',
    shadowOffset: { height: 1, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  optionText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: colors.text,
    fontWeight: '600',
  },
});

//
export type OptionGroupProps<Value extends string | number> = {
  label: string;
  onChange: (value: NoInfer<Value>) => void;
  options: ReadonlyArray<{ label: string; value: Value }>;
  testID?: string;
  value: NoInfer<Value>;
};

/**
 * A segmented control for one prop of a showcased component.
 *
 * @param {OptionGroupProps} props
 * @returns {JSX.Element}
 */
export const OptionGroup = <Value extends string | number>({ label, onChange, options, testID, value }: OptionGroupProps<Value>) => (
  <View style={styles.container} testID={testID}>
    <Text style={styles.label}>{label}</Text>
    <View accessibilityRole="radiogroup" style={styles.options}>
      {options.map((option) => {
        const selected = option.value === value;

        return (
          <Pressable
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            key={String(option.value)}
            onPress={() => onChange(option.value)}
            style={[styles.option, selected && styles.optionSelected]}
            testID={testID ? `${testID}-${option.value}` : undefined}
          >
            <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  </View>
);

export default OptionGroup;
