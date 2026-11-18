import React, { useCallback, useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import DatePickerModal from '@react-native-user-interface/date-picker-modal';
import TimePickerModal from '@react-native-user-interface/time-picker-modal';
import { format } from 'date-fns';
import ComponentCard from './components/component-card';
import OptionGroup from './components/option-group';
import { colors, maxContentWidth, radius, twoColumnBreakpoint } from './theme';

//
const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    alignSelf: 'center',
    maxWidth: maxContentWidth,
    paddingHorizontal: 16,
    width: '100%',
  },
  hero: {
    paddingBottom: 24,
    paddingTop: 32,
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
  summary: {
    backgroundColor: colors.accent,
    borderRadius: radius.lg,
    marginBottom: 16,
    padding: 20,
  },
  summaryLabel: {
    color: '#ffffffcc',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  summaryValue: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 4,
  },
  summaryHint: {
    color: '#ffffffcc',
    fontSize: 14,
    marginTop: 6,
  },
  cards: {
    gap: 16,
  },
  cardsWide: {
    flexDirection: 'row',
  },
  cardColumn: {
    flex: 1,
  },
  statusBarBackdrop: {
    backgroundColor: colors.background,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  footer: {
    color: colors.textMuted,
    fontSize: 13,
    paddingVertical: 32,
    textAlign: 'center',
  },
});

//
type OpenModal = 'date' | 'time' | null;
type AnimationType = 'slide' | 'fade' | 'none';
type TimeStep = 1 | 5 | 15 | 30 | 60;

const animationOptions = [
  { label: 'Slide', value: 'slide' },
  { label: 'Fade', value: 'fade' },
  { label: 'None', value: 'none' },
] as const;

const timeStepOptions = [
  { label: '1 min', value: 1 },
  { label: '5 min', value: 5 },
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '1 hr', value: 60 },
] as const;

/**
 * The showcase page. Both pickers edit the same Date, so the summary at the
 * top shows them working together: the date picker changes the day and the
 * time picker changes the time of day.
 *
 * @returns {JSX.Element}
 */
const Showcase = () => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const wide = width >= twoColumnBreakpoint;

  const [datetime, setDatetime] = useState(() => new Date());
  const [openModal, setOpenModal] = useState<OpenModal>(null);
  const [dateAnimation, setDateAnimation] = useState<AnimationType>('slide');
  const [timeAnimation, setTimeAnimation] = useState<AnimationType>('slide');
  const [timeStep, setTimeStep] = useState<TimeStep>(5);

  const onConfirm = useCallback((selectedDatetime: Date) => {
    setDatetime(selectedDatetime);
    setOpenModal(null);
  }, []);

  const closeModal = useCallback(() => setOpenModal(null), []);
  const openDateModal = useCallback(() => setOpenModal('date'), []);
  const openTimeModal = useCallback(() => setOpenModal('time'), []);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom, paddingTop: insets.top }} testID="showcase">
        <View style={styles.content}>
          <View style={styles.hero}>
            <Text style={styles.eyebrow}>React Native User Interface</Text>
            <Text accessibilityRole="header" style={styles.title}>Component showcase</Text>
            <Text style={styles.intro} testID="intro">
              Modal pickers for React Native, built on Reanimated and Gesture Handler. Try each one below.
            </Text>
          </View>

          <View style={styles.summary} testID="summary">
            <Text style={styles.summaryLabel}>Selected</Text>
            <Text style={styles.summaryValue} testID="summary-text">
              {format(datetime, "EEEE d MMMM yyyy 'at' h:mm aa")}
            </Text>
            <Text style={styles.summaryHint}>Both pickers edit this one value.</Text>
          </View>

          <View style={[styles.cards, wide && styles.cardsWide]}>
            <View style={wide && styles.cardColumn}>
              <ComponentCard
                description="A month calendar in a modal. Swipe between months and tap a day. The time of day is kept."
                fieldLabel="Date"
                fieldValue={format(datetime, 'EEE d MMM yyyy')}
                onOpen={openDateModal}
                packageName="@react-native-user-interface/date-picker-modal"
                testID="date-button"
                title="Date picker"
              >
                <OptionGroup
                  label="animationType"
                  onChange={setDateAnimation}
                  options={animationOptions}
                  testID="date-animation"
                  value={dateAnimation}
                />
              </ComponentCard>
            </View>

            <View style={wide && styles.cardColumn}>
              <ComponentCard
                description="Drag the slider or use the arrows to pick a time. The date is kept."
                fieldLabel="Time"
                fieldValue={format(datetime, 'h:mm aa')}
                onOpen={openTimeModal}
                packageName="@react-native-user-interface/time-picker-modal"
                testID="time-button"
                title="Time picker"
              >
                <OptionGroup
                  label="timeStep"
                  onChange={setTimeStep}
                  options={timeStepOptions}
                  testID="time-step"
                  value={timeStep}
                />
                <OptionGroup
                  label="animationType"
                  onChange={setTimeAnimation}
                  options={animationOptions}
                  testID="time-animation"
                  value={timeAnimation}
                />
              </ComponentCard>
            </View>
          </View>

          <Text style={styles.footer}>MIT licensed · Built with React Native</Text>
        </View>
      </ScrollView>
      {/* Keeps scrolled content from showing through the status bar. */}
      <View pointerEvents="none" style={[styles.statusBarBackdrop, { height: insets.top }]} />

      <DatePickerModal
        animationType={dateAnimation}
        initialDate={datetime}
        onCancel={closeModal}
        onConfirm={onConfirm}
        visible={openModal === 'date'}
      />
      <TimePickerModal
        animationType={timeAnimation}
        initialDatetime={datetime}
        onCancel={closeModal}
        onConfirm={onConfirm}
        timeStep={timeStep}
        visible={openModal === 'time'}
      />
    </View>
  );
};

/**
 * @returns {JSX.Element}
 */
export const App = () => (
  <SafeAreaProvider>
    <StatusBar barStyle="dark-content" />
    <Showcase />
  </SafeAreaProvider>
);

//
export default App;
