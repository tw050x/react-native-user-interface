import React, { useCallback, useMemo, useState } from 'react';
import { Text } from 'react-native';
import DatePickerModal from '@react-native-user-interface/date-picker-modal';
import { format } from 'date-fns';
import OptionGroup from '../components/option-group';
import Screen from '../components/screen';
import Section, { CodeBlock } from '../components/section';
import ValueField from '../components/value-field';
import { AnimationType, animationOptions, hintStyle } from '../showcase';
import { PickerTheme, describeStylesheet, getDatePickerStylesheet, pickerThemeOptions } from '../picker-themes';

/**
 * Showcases <DatePickerModal />: try it, change its props, and copy the code.
 *
 * @param {{ onBack: () => void }} props
 * @returns {JSX.Element}
 */
export const DatePickerScreen = ({ onBack }: { onBack: () => void }) => {
  const [date, setDate] = useState(() => new Date());
  const [visible, setVisible] = useState(false);
  const [animationType, setAnimationType] = useState<AnimationType>('slide');
  const [theme, setTheme] = useState<PickerTheme>('default');

  const stylesheet = useMemo(() => getDatePickerStylesheet(theme), [theme]);

  const onConfirm = useCallback((selected: Date) => {
    setDate(selected);
    setVisible(false);
  }, []);

  const usage = [
    '<DatePickerModal',
    `  animationType="${animationType}"`,
    '  initialDate={date}',
    '  onCancel={() => setVisible(false)}',
    '  onConfirm={(selected) => {',
    '    setDate(selected);',
    '    setVisible(false);',
    '  }}',
    describeStylesheet(stylesheet) && `  ${describeStylesheet(stylesheet)}`,
    '  visible={visible}',
    '/>',
  ].filter(Boolean).join('\n');

  return (
    <Screen
      eyebrow="Component"
      intro="A month calendar in a bottom-sheet modal. Step through months and years with the arrows, tap a day, and confirm. The time of day is kept."
      onBack={onBack}
      testID="date-picker-screen"
      title="Date picker"
    >
      <Section title="Try it">
        <ValueField action="Pick a date" label="Date" onPress={() => setVisible(true)} testID="date-button" value={format(date, 'EEE d MMM yyyy')} />
        <Text style={hintStyle}>Kept from the original value: {format(date, 'h:mm aa')}</Text>
      </Section>

      <Section description="Change these and open the picker again." title="Props">
        <OptionGroup label="animationType" onChange={setAnimationType} options={animationOptions} testID="date-animation" value={animationType} />
        <OptionGroup label="stylesheet" onChange={setTheme} options={pickerThemeOptions} testID="date-theme" value={theme} />
      </Section>

      <Section title="Install">
        <CodeBlock code="yarn add @react-native-user-interface/date-picker-modal" />
      </Section>

      <Section description="Updates as you change the props above." title="Usage">
        <CodeBlock code={usage} />
      </Section>

      <DatePickerModal
        animationType={animationType}
        initialDate={date}
        onCancel={() => setVisible(false)}
        onConfirm={onConfirm}
        stylesheet={stylesheet}
        visible={visible}
      />
    </Screen>
  );
};

export default DatePickerScreen;
