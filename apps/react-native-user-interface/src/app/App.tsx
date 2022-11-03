import React, { useCallback, useState } from 'react';
import { Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import DatePickerModal from '@react-native-user-interface/react-native-date-picker-modal';
import format from 'date-fns/format';

//
const defaultStylesheet = StyleSheet.create({
  button: {
    backgroundColor: '#cccccc',
    borderRadius: 8,
    padding: 20,
  },
  buttonText: {
    color: '#4a83e7',
    fontSize: 16,
    fontWeight: '600',
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

/**
 * 
 * @returns {JSX.Element}
 */
export const App = () => { 

  const [date, setDate] = useState(() => new Date());
  const [isVisible, setIsVisible] = useState(false);

  const onConfirm = useCallback((selectedDate: Date) => {
    setDate(selectedDate);
    setIsVisible(false);
  }, []);

  const closeModal = useCallback(() => {
    setIsVisible(false);
  }, []);

  const openModal = useCallback(() => {
    setIsVisible(true);
  }, []);

  const renderDateTextOrNothing = () => {

    return (
      <Pressable onPress={openModal} style={defaultStylesheet.button}>
        <Text style={defaultStylesheet.buttonText}>
          {format(date, 'do MMM yyyy')}
        </Text>
      </Pressable>
    );
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaProvider>
        <View style={defaultStylesheet.container}>
          {renderDateTextOrNothing()}
          <Text style={defaultStylesheet.intro}>Tap on the button above to change the date</Text>
        </View>
        <DatePickerModal
          onCancel={closeModal}
          onConfirm={onConfirm}
          visible={isVisible}
        />
      </SafeAreaProvider>
    </>
  );
};

//
export default App;
