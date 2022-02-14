import React from 'react';
import { Layout, Divider, Text, TopNavigationAction, TopNavigation } from '@ui-kitten/components';
import { ROUTES } from '@src/navigations/routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, RootStackParamListPassID } from '@src/navigations/Navigation';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { BellIcon, BackIcon } from '@src/components/Icons';

export const NotificationScreen = () => {
  const navigationPassID = useNavigation<NativeStackNavigationProp<RootStackParamListPassID>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const navigateBack = () => {
    navigationPassID.goBack();
  };

  const renderBellAction = () => {
    return (
      <TopNavigationAction icon={BellIcon} onPress={() => navigation.navigate(ROUTES.notice)} />
    );
  };
  const BackAction = () => <TopNavigationAction icon={BackIcon} onPress={navigateBack} />;
  return (
    <Layout style={{ flex: 1 }}>
      <TopNavigation
        alignment="center"
        title="Notification"
        accessoryRight={renderBellAction}
        accessoryLeft={BackAction}
      />
      <Divider />
      <Text>Hello, I'm Khanh 411 Lib</Text>
    </Layout>
  );
};
