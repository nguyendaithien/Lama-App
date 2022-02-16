import React from 'react';
import { Layout, Text } from '@ui-kitten/components';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { IUser } from '@src/models/user';
// import { BellIcon, PhoneIcon, MailIcon, LocationIcon, GenderIcon } from '@src/components/Icons';
interface InforProps {
  Icon: React.ReactElement;
  Data: {
    nameOfData: string;
    dataInfor: string;
  };
}
interface IconProps {
  Icon: React.ReactElement;
}
interface IMemberCardProps {
  Icon: React.ReactElement;
  Data: IUser;
  onPress: (id: number) => void;
}
export const DataInforRender = ({ Icon, Data }: InforProps) => {
  return (
    <Layout style={styles.memberDetailContainer}>
      <Layout style={{ flexDirection: 'row', marginBottom: 5 }}>
        <Layout style={{ backgroundColor: 'transparent', justifyContent: 'center' }}>{Icon}</Layout>
        <Text
          style={{ fontWeight: 'bold' }}
          category="h6"
        >{`${Data.nameOfData.toUpperCase()}`}</Text>
      </Layout>
      <Text appearance="hint" style={{ fontStyle: 'italic' }}>
        {' '}
        {`${Data.dataInfor}`}
      </Text>
    </Layout>
  );
};

export const MemberCard = ({ Icon, Data, onPress }: IMemberCardProps) => {
  return (
    <TouchableOpacity
      style={[styles.memberCardContainer, !Data.isActive && { backgroundColor: '#dbdbdb' }]}
      onPress={() => onPress(Data.id!)}
    >
      <Layout
        style={{ flexDirection: 'row', backgroundColor: 'transparent', justifyContent: 'center' }}
      >
        <Layout
          style={{
            backgroundColor: 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 10
          }}
        >
          <Image
            style={styles.avatar}
            source={{
              uri: Data?.avatar
            }}
          />
        </Layout>
        <Layout style={{ backgroundColor: 'transparent', justifyContent: 'center' }}>
          <Text category={'h5'} style={{ justifyContent: 'center' }}>{`${
            Data?.firstName
          } ${Data.lastName!}`}</Text>
        </Layout>
      </Layout>
      {Data.userTeams![0]?.team?.name && (
        <Text style={{}}>Team Name: {`${Data.userTeams![0]?.team?.name}`}</Text>
      )}
      <Text>Status: {`${Data.isActive ? 'Active' : 'Inactive'}`}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  memberDetailContainer: { height: 60, width: '100%', marginBottom: 15 },
  memberCardContainer: {
    height: 100,
    backgroundColor: '#e3c3c1',
    width: '100%',
    borderRadius: 5,
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    paddingLeft: 20,
    marginBottom: 10
  },
  avatar: {
    height: 40,
    width: 40,
    // marginRight: 10,
    resizeMode: 'contain'
  }
});
