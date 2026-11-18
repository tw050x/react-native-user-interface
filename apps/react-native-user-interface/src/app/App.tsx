import React, { useCallback, useEffect, useState } from 'react';
import { BackHandler, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import DatePickerScreen from './screens/date-picker-screen';
import HomeScreen from './screens/home-screen';
import TimePickerScreen from './screens/time-picker-screen';
import { ComponentId } from './showcase';

/**
 * The showcase: a home screen listing the components, and a screen for each.
 *
 * Navigation is a single piece of state rather than a navigation library, so
 * the demo needs no extra native modules and renders the same with
 * react-native-web.
 *
 * @returns {JSX.Element}
 */
export const App = () => {
  const [screen, setScreen] = useState<ComponentId | null>(null);

  const goHome = useCallback(() => setScreen(null), []);

  // Android's back button returns to the list instead of leaving the app.
  useEffect(() => {
    if (screen === null) return;

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      goHome();
      return true;
    });

    return () => subscription.remove();
  }, [goHome, screen]);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      {screen === null && <HomeScreen onOpen={setScreen} />}
      {screen === 'date-picker' && <DatePickerScreen onBack={goHome} />}
      {screen === 'time-picker' && <TimePickerScreen onBack={goHome} />}
    </SafeAreaProvider>
  );
};

//
export default App;
