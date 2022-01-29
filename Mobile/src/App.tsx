import 'react-native-gesture-handler';
import React from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { AppRegistry } from 'react-native';
import { name as appName } from '../app.json';

import { MyNavigation } from './navigations/Navigation';

export default function App() {
  return (
    <>
      <IconRegistry icons={[EvaIconsPack]} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <MyNavigation />
      </ApplicationProvider>
    </>
  );
}

AppRegistry.registerComponent(appName, () => App);
