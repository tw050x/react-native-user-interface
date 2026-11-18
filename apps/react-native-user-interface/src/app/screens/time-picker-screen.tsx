import React, { useCallback, useMemo, useState } from 'react';
import { Text } from 'react-native';
import TimePickerModal, { TimeStep } from '@react-native-user-interface/time-picker-modal';
import { format } from 'date-fns';
import OptionGroup from '../components/option-group';
import Screen from '../components/screen';
import Section, { CodeBlock } from '../components/section';
import ValueField from '../components/value-field';
import { AnimationType, animationOptions, hintStyle } from '../showcase';
import { PickerTheme, describeStylesheet, getTimePickerStylesheet, pickerThemeOptions } from '../picker-themes';

//
const timeStepOptions = [
  { label: '1 min', value: 1 },
  { label: '5 min', value: 5 },
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '1 hr', value: 60 },
] as const satisfies ReadonlyArray<{ label: string; value: TimeStep }>;

/**
 * Showcases <TimePickerModal />: try it, change its props, and copy the code.
 *
 * @param {{ onBack: () => void }} props
 * @returns {JSX.Element}
 */
export const TimePickerScreen = ({ onBack }: { onBack: () => void }) => {
  const [datetime, setDatetime] = useState(() => new Date());
  const [visible, setVisible] = useState(false);
  const [animationType, setAnimationType] = useState<AnimationType>('slide');
  const [timeStep, setTimeStep] = useState<(typeof timeStepOptions)[number]['value']>(5);
  const [theme, setTheme] = useState<PickerTheme>('default');

  const stylesheet = useMemo(() => getTimePickerStylesheet(theme), [theme]);

  const onConfirm = useCallback((selected: Date) => {
    setDatetime(selected);
    setVisible(false);
  }, []);

  const usage = [
    '<TimePickerModal',
    `  animationType="${animationType}"`,
    '  initialDatetime={datetime}',
    '  onCancel={() => setVisible(false)}',
    '  onConfirm={(selected) => {',
    '    setDatetime(selected);',
    '    setVisible(false);',
    '  }}',
    describeStylesheet(stylesheet) && `  ${describeStylesheet(stylesheet)}`,
    `  timeStep={${timeStep}}`,
    '  visible={visible}',
    '/>',
  ].filter(Boolean).join('\n');

  return (
    <Screen
      eyebrow="Component"
      intro="A slider across the day in a bottom-sheet modal. Drag it, or step with the − and + buttons, and confirm. The date is kept."
      onBack={onBack}
      testID="time-picker-screen"
      title="Time picker"
    >
      <Section title="Try it">
        <ValueField action="Pick a time" label="Time" onPress={() => setVisible(true)} testID="time-button" value={format(datetime, 'h:mm aa')} />
        <Text style={hintStyle}>Kept from the original value: {format(datetime, 'EEE d MMM yyyy')}</Text>
      </Section>

      <Section description="Change these and open the picker again." title="Props">
        <OptionGroup label="timeStep" onChange={setTimeStep} options={timeStepOptions} testID="time-step" value={timeStep} />
        <OptionGroup label="animationType" onChange={setAnimationType} options={animationOptions} testID="time-animation" value={animationType} />
        <OptionGroup label="stylesheet" onChange={setTheme} options={pickerThemeOptions} testID="time-theme" value={theme} />
      </Section>

      <Section title="Install">
        <CodeBlock code="yarn add @react-native-user-interface/time-picker-modal" />
      </Section>

      <Section description="Updates as you change the props above." title="Usage">
        <CodeBlock code={usage} />
      </Section>

      <TimePickerModal
        animationType={animationType}
        initialDatetime={datetime}
        onCancel={() => setVisible(false)}
        onConfirm={onConfirm}
        stylesheet={stylesheet}
        timeStep={timeStep}
        visible={visible}
      />
    </Screen>
  );
};

export default TimePickerScreen;
