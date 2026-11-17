import React, { useCallback, useState } from 'react';
import { Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import DatePickerModal from '@react-native-user-interface/date-picker-modal';
import TimePickerModal from '@react-native-user-interface/time-picker-modal';
import { format } from 'date-fns';

//
const defaultStylesheet = StyleSheet.create({
  button: {
    backgroundColor: '#cccccc',
    borderRadius: 8,
    marginTop: 20,
    padding: 20,
  },
  buttonText: {
    color: '#4a83e7',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#dfdfdf',
    flex: 1,
    justifyContent: 'center',
  },
  intro: {
    fontSize: 18,
    marginHorizontal: 20,
    marginTop: 50,
    textAlign: 'center',
  },
});

//
type OpenModal = 'date' | 'time' | null;

/**
 * Demo of the date and time pickers. Both edit the same Date: the date picker
 * changes the day and the time picker changes the time of day.
 *
 * @returns {JSX.Element}
 */
export const App = () => {
  const [datetime, setDatetime] = useState(() => new Date());
  const [openModal, setOpenModal] = useState<OpenModal>(null);

  const onConfirm = useCallback((selectedDatetime: Date) => {
    setDatetime(selectedDatetime);
    setOpenModal(null);
  }, []);

  const closeModal = useCallback(() => setOpenModal(null), []);
  const openDateModal = useCallback(() => setOpenModal('date'), []);
  const openTimeModal = useCallback(() => setOpenModal('time'), []);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaProvider>
        <View style={defaultStylesheet.container}>
          <Pressable onPress={openDateModal} style={defaultStylesheet.button} testID="date-button">
            <Text style={defaultStylesheet.buttonText} testID="date-button-text">
              {format(datetime, 'EEE d MMM yyyy')}
            </Text>
          </Pressable>
          <Pressable onPress={openTimeModal} style={defaultStylesheet.button} testID="time-button">
            <Text style={defaultStylesheet.buttonText} testID="time-button-text">
              {format(datetime, 'hh:mm aa')}
            </Text>
          </Pressable>
          <Text style={defaultStylesheet.intro} testID="intro">Tap on the buttons above to change the date and time</Text>
        </View>
        <DatePickerModal
          initialDate={datetime}
          onCancel={closeModal}
          onConfirm={onConfirm}
          visible={openModal === 'date'}
        />
        <TimePickerModal
          initialDatetime={datetime}
          onCancel={closeModal}
          onConfirm={onConfirm}
          visible={openModal === 'time'}
        />
      </SafeAreaProvider>
    </>
  );
};

//
export default App;
