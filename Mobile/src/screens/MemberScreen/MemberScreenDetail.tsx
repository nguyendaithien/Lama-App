import React, { useEffect } from 'react';
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
  TeamIcon,
  BackIcon,
  MessageIcon,
  ClockIcon
} from '@src/components/Icons';
import { DataInforRender } from '@src/components/Member';
import { useAppDispatch, useAppSelector } from '@src/hooks/reduxHooks';
import { fetchGetUserInforByID, selectUserInfor } from '@src/features/user/userSlice';

export const MemberDetailScreen = () => {
  const navigationPassID = useNavigation<NativeStackNavigationProp<RootStackParamListPassID>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamListPassID>>();

  const userInfor = useAppSelector(selectUserInfor);
  const dispatch = useAppDispatch();
  const memberID = route.params.id;

  useEffect(() => {
    dispatch(fetchGetUserInforByID(memberID));
  }, [dispatch, memberID]);

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

  const inforData = [
    {
      id: 0,
      nameOfData: 'Mail',
      dataInfor: `${userInfor.email!}`,
      icon: <MailIcon style={style.icon} fill={theme['color-info-500']} />
    },
    {
      id: 1,
      nameOfData: 'Phone',
      dataInfor: `${userInfor.phone!}`,
      icon: <PhoneIcon style={style.icon} fill={theme['color-info-500']} />
    },
    {
      id: 2,
      nameOfData: 'Status',
      dataInfor: userInfor.isActive ? 'Active' : 'Inactive',
      icon: <MessageIcon style={style.icon} fill={theme['color-info-500']} />
    },
    {
      id: 3,
      nameOfData: 'Team',
      dataInfor: userInfor.userTeams?.length
        ? `${userInfor.userTeams![0]?.team?.name} (${userInfor.userTeams![0]?.role})`
        : 'Null',
      icon: <TeamIcon style={style.icon} fill={theme['color-info-500']} />
    },
    {
      id: 4,
      nameOfData: 'Created',
      dataInfor: `${userInfor.createdAt?.slice(0, 10)}`,
      icon: <ClockIcon style={style.icon} fill={theme['color-info-500']} />
    }
  ];

  return (
    <Layout style={style.container}>
      <TopNavigation
        alignment="center"
        title="Profile"
        accessoryRight={renderBellAction}
        accessoryLeft={BackAction}
      />
      <Divider />
      <Layout style={style.avatarContainer}>
        <Layout style={style.avatar}>
          <Image
            style={[style.avatar, { resizeMode: 'contain', borderWidth: 0 }]}
            source={{
              uri: userInfor?.avatar
              // uri: 'https://reactnative.dev/img/tiny_logo.png'
            }}
          />
        </Layout>
        <Text category="h4">{`${userInfor.firstName} ${userInfor.lastName} - ID: ${userInfor.id}`}</Text>
        <Layout style={{ flexDirection: 'row' }}>
          <LocationIcon fill={theme['color-info-500']} style={style.icon} />
          <Text status="primary"> Hai Ba Trung, Ha Noi</Text>
        </Layout>
      </Layout>
      <Divider />
      <Layout style={{ alignItems: 'flex-start', paddingTop: 20, paddingLeft: 20 }}>
        {inforData.map((item, index) => {
          return <DataInforRender key={index} Icon={item.icon} Data={item} />;
        })}
      </Layout>
    </Layout>
  );
};
const style = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 10 },
  profileContainer: {},
  avatarContainer: {
    height: 200,
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  avatar: {
    height: 120,
    width: 120,
    borderWidth: 2,
    borderRadius: 70,
    borderColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: { height: 25, width: 25, marginRight: 5 }
});
