import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from './routes';
import { BottomNavigator } from './BottomNavigator';
import { LoginScreen } from '@src/screens/AuthScreen';
import useCheckAppFirstLaunch from '@src/hooks/useCheckAppFirstLaunch';
import useCheckAuth from '@src/hooks/useCheckAuth';
import { RegisterScreen } from '@src/screens/AuthScreen/RegisterScreen';
import { NotificationScreen } from '@src/screens/NotificationScreen';
export type RootStackParamList = {
  [name: string]: any;
};

export type RootStackParamListPassID = {
  [name: string]: { id: number };
};

const Stack = createNativeStackNavigator();

export const MyNavigation = () => {
  const isAppFirstLaunch = useCheckAppFirstLaunch();
  const isAuth = useCheckAuth();
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuth ? (
          <>
            <Stack.Screen name={ROUTES.main} component={BottomNavigator} />
            <Stack.Screen name={ROUTES.notice} component={NotificationScreen} />
          </>
        ) : (
          <>
            {/* {isAppFirstLaunch && (
              <Stack.Screen name={ROUTES.onboarding} component={WelcomeScreen} />
            )} */}
            <Stack.Screen name={ROUTES.login} component={LoginScreen} />
            <Stack.Screen name={ROUTES.register} component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
