import React from 'react';
import { Layout, Text, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { StyleSheet, SafeAreaView } from 'react-native';
import { BellIcon } from '@src/components/Icons';
const inforUser = [
  {
    username: 'daobakhanhbk',
    name: 'Đào Bá Khánh',
    mail: 'daobakhanh@gmail.com',
    avatar: null
  }
];
export const ProfileScreen = () => {
  const renderBellAction = () => <TopNavigationAction icon={BellIcon} />;
  return (
    <SafeAreaView style={style.container}>
      <TopNavigation alignment="center" title="Profile" accessoryRight={renderBellAction} />
      <Text category="h1">Your Profile</Text>
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
  container: { flex: 1 }
});
