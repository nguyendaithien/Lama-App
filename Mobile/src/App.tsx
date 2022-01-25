import React from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import { AppRegistry } from 'react-native';

import { WelcomeScreen } from './screens/WelcomeScreen/index';

export default function App() {
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <WelcomeScreen />
    </ApplicationProvider>
  );
}

AppRegistry.registerComponent('app', () => App);
