import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { LogBox, StatusBar } from 'react-native';
import BootSplash from 'react-native-bootsplash';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';

import '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';

import { store } from './src/store';

import './src/i18n';

import AppNavigator from './src/navigation/AppNavigator';

import { COLORS } from './src/constants';

import { ToastProvider } from './src/context/ToastContext';
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'AsyncStorage has been extracted from react-native',
  'Setting a timer for a long period of time',
]);

const App: React.FC = () => {
  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        await firestore().enableNetwork();
      } catch (error) {}
    };

    initializeFirebase();
  }, []);

  return (
    <Provider store={store}>
      <ToastProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar
            barStyle="dark-content"
            backgroundColor={COLORS.background}
            translucent={false}
          />
          <NavigationContainer
            onReady={() => {
              BootSplash.hide({ fade: true });
            }}
          >
            <AppNavigator />
          </NavigationContainer>
        </GestureHandlerRootView>
      </ToastProvider>
    </Provider>
  );
};

export default App;
 