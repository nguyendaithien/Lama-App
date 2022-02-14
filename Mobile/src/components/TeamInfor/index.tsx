import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@ui-kitten/components';
import React from 'react';
import { ITeam } from '@src/models/teams';
import { Layout } from '@ui-kitten/components';

interface ITeamInforProps {
  Icon: React.ReactElement;
  onPress: (id: number) => void;
  data: ITeam;
}

export const TeamInfor = ({ Icon, onPress, data }: ITeamInforProps) => {
  return (
    <TouchableOpacity
      style={styles.teamInfor}
      onPress={() => {
        console.log(`current ID of Detail: ${data.id}`);
        onPress(data.id!);
      }}
    >
      <Layout
        style={{ flexDirection: 'row', backgroundColor: 'transparent', justifyContent: 'center' }}
      >
        <Layout style={{ backgroundColor: 'transparent', justifyContent: 'center' }}>{Icon}</Layout>
        <Text category={'h5'} style={{}}>{`${data.name}`}</Text>
        <Layout style={{ backgroundColor: 'transparent', justifyContent: 'center' }}>
          <Text> - (ID: {`${data.id}`})</Text>
        </Layout>
      </Layout>
      <Text style={{}}>Created at: {`${data.created_at!.slice(0, 10)}`}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  teamInfor: {
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
