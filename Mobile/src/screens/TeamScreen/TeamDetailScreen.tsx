import React from 'react';
import {
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
  Divider,
  useTheme
} from '@ui-kitten/components';
import { ROUTES } from '@src/navigations/routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, RootStackParamListPassID } from '@src/navigations/Navigation';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StyleSheet, SafeAreaView, Image } from 'react-native';
import {
  BellIcon,
  PhoneIcon,
  MailIcon,
  LocationIcon,
  GenderIcon,
  BackIcon
} from '@src/components/Icons';
import { DataInforRender } from '@src/components/Member';

const inforUser = [
  {
    username: 'daobakhanhbk',
    name: 'Đào Bá Khánh',
    mail: 'daobakhanh@gmail.com',
    avatar: null
  }
];

export const TeamDetailScreen = () => {
  const navigationPassID = useNavigation<NativeStackNavigationProp<RootStackParamListPassID>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamListPassID>>();
  const memberID = route.params.id;

  const theme = useTheme();

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
    <Layout style={style.container}>
      <TopNavigation
        alignment="center"
        title="Team Detail"
        accessoryRight={renderBellAction}
        accessoryLeft={BackAction}
      />
      <Divider />
      <Text>Hello, this is a team detail</Text>
    </Layout>
  );
};
const style = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 10 },
  profileContainer: {},
  avatarContainer: {
    height: 250,
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  avatar: {
    height: 140,
    width: 140,
    borderWidth: 2,
    borderRadius: 70,
    borderColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: { height: 25, width: 25, marginRight: 5 }
});
