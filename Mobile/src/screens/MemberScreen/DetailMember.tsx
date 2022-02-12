import React from 'react';
import {
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
  Divider,
  useTheme
} from '@ui-kitten/components';
import { StyleSheet, SafeAreaView, Image } from 'react-native';
import { BellIcon, PhoneIcon, MailIcon, LocationIcon, GenderIcon } from '@src/components/Icons';
import { DataInforRender } from '@src/components/Member';

const inforUser = [
  {
    username: 'daobakhanhbk',
    name: 'Đào Bá Khánh',
    mail: 'daobakhanh@gmail.com',
    avatar: null
  }
];

export const DetailMemberScreen = () => {
  const theme = useTheme();
  const renderBellAction = () => <TopNavigationAction icon={BellIcon} />;

  const inforData = [
    {
      id: 0,
      nameOfData: 'Mail',
      dataInfor: `${inforUser[0].mail}`,
      icon: <MailIcon style={style.icon} fill={theme['color-info-500']} />
    },
    {
      id: 1,
      nameOfData: 'Phone',
      dataInfor: '0357***570',
      icon: <PhoneIcon style={style.icon} fill={theme['color-info-500']} />
    },
    {
      id: 2,
      nameOfData: 'Gender',
      dataInfor: 'Male',
      icon: <GenderIcon style={style.icon} fill={theme['color-info-500']} />
    }
  ];

  return (
    <Layout style={style.container}>
      <TopNavigation alignment="center" title="Profile" accessoryRight={renderBellAction} />
      <Divider />
      <Layout style={style.avatarContainer}>
        <Layout style={style.avatar}>
          <Image
            style={{ height: '90%', resizeMode: 'contain' }}
            source={require('@src/assets/images/avatar.png')}
          />
        </Layout>
        <Text category="h4">{`${inforUser[0].name}`}</Text>
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
