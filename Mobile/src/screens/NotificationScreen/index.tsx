import React from 'react';
import { Layout, Divider, Text, TopNavigationAction, TopNavigation } from '@ui-kitten/components';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamListPassID } from '@src/navigations/Navigation';
import { useNavigation } from '@react-navigation/native';
import { BackIcon } from '@src/components/Icons';

export const NotificationScreen = () => {
  const navigationPassID = useNavigation<NativeStackNavigationProp<RootStackParamListPassID>>();

  const navigateBack = () => {
    navigationPassID.goBack();
  };

  const BackAction = () => <TopNavigationAction icon={BackIcon} onPress={navigateBack} />;
  return (
    <Layout style={{ flex: 1 }}>
      <TopNavigation
        alignment="center"
        title="Notification"
        // accessoryRight={renderBellAction}
        accessoryLeft={BackAction}
      />
      <Divider />
      <Layout style={{ alignItems: 'center', marginTop: 20 }}>
        <Text>Don't have noti</Text>
      </Layout>
    </Layout>
  );
};
