import 'react-native-gesture-handler';
import React from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { AssetIconsPack } from './components/Icons/AssetIconsPack';
import { AppRegistry } from 'react-native';
import { customLightTheme, customDarkTheme } from './theme/customTheme';
import { name as appName } from '../app.json';

import { MyNavigation } from './navigations/Navigation';

const ThemeProvider = ({ children }: any) => {
  // const themeType = useAppSelector(selectThemeType);
  const themeType = 'light';
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
      <IconRegistry icons={[EvaIconsPack, AssetIconsPack]} />
      <ThemeProvider>
        <MyNavigation />
      </ThemeProvider>
    </>
  );
}

AppRegistry.registerComponent(appName, () => App);
