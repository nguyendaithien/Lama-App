import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from './routes';
import { BottomNavigator } from './BottomNavigator';
import { LoginScreen } from '@src/screens/AuthScreen';
import { RegisterScreen } from '@src/screens/AuthScreen/RegisterScreen';

export type RootStackParamList = {
  [name: string]: any;
};
const Stack = createNativeStackNavigator();

export const MyNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={ROUTES.login} component={LoginScreen} />
        <Stack.Screen name={ROUTES.register} component={RegisterScreen} />
        <Stack.Screen name={ROUTES.main} component={BottomNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
