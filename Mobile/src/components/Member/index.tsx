import React from 'react';
import { Layout, Text } from '@ui-kitten/components';
import { StyleSheet, TouchableOpacity } from 'react-native';
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
  Data: {
    name: string;
    email: string;
    isActive: boolean;
    phone: string;
    uni: string;
    id: number;
    field: string;
  };
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
    <TouchableOpacity style={styles.memberCardContainer}>
      <Layout
        style={{ flexDirection: 'row', backgroundColor: 'transparent', justifyContent: 'center' }}
      >
        <Layout style={{ backgroundColor: 'transparent', justifyContent: 'center' }}>{Icon}</Layout>
        <Text category={'h5'} style={{}}>{`${Data.name}`}</Text>
      </Layout>
      <Text style={{}}>Feild: {`${Data.field}`}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  memberDetailContainer: { height: 60, width: '100%', marginBottom: 15 },
  memberCardContainer: {
    height: 70,
    backgroundColor: '#e3c3c1',
    width: '100%',
    borderRadius: 5,
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    paddingLeft: 20,
    marginBottom: 10
  }
});
