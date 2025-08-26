import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../hooks';
import { RootStackParamList } from '../types';
import { COLORS } from '../constants';

import LoginScreen from '../screens/auth/login';
import RegisterScreen from '../screens/auth/register';
import MainTabNavigator from './MainTabNavigator';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.primary,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" color={COLORS.white} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        animationTypeForReplace: isAuthenticated ? 'push' : 'pop',
      }}
      initialRouteName={isAuthenticated ? 'MainTabs' : 'Login'}
    >
      {isAuthenticated ? (
  
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      ) : (
  
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              animationTypeForReplace: 'push',
              gestureDirection: 'horizontal',
            }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{
              gestureDirection: 'horizontal',
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
