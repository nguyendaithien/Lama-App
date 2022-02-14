import 'react-native-gesture-handler';
import React from 'react';
import * as eva from '@eva-design/eva';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './configs/redux/store';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { AssetIconsPack } from './components/Icons/AssetIconsPack';
import { AppRegistry } from 'react-native';
import { customLightTheme, customDarkTheme } from './theme/customTheme';
import { name as appName } from '../app.json';
// import 'moment/locale/vi';

import { MyNavigation } from './navigations/Navigation';
import { useAppSelector } from './hooks/reduxHooks';
import { selectThemeType } from './features/app/appSlice';

const ThemeProvider = ({ children }: any) => {
  const themeType = useAppSelector(selectThemeType);
  return (
    <ApplicationProvider
      {...eva}
      theme={themeType === 'light' ? customLightTheme : customDarkTheme}
    >
      {children}
    </ApplicationProvider>
  );
};

export default function App() {
  return (
    <>
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <IconRegistry icons={[EvaIconsPack, AssetIconsPack]} />
          <ThemeProvider>
            <MyNavigation />
          </ThemeProvider>
        </PersistGate>
      </ReduxProvider>
    </>
  );
}

AppRegistry.registerComponent(appName, () => App);
