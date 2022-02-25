import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text } from '@ui-kitten/components';
import React from 'react';
import { ITeam } from '@src/models/team';
import { Layout } from '@ui-kitten/components';
import { activeStatusCard, inActiveStatusCard } from '@src/theme/customTheme';

interface ITeamInforCardProps {
  onPress: (id: number) => void;
  data: ITeam;
}

export const TeamInforCard = ({ onPress, data }: ITeamInforCardProps) => {
  return (
    <TouchableOpacity
      style={[styles.TeamInforCard, !data.isActive && { backgroundColor: inActiveStatusCard }]}
      onPress={() => onPress(data.id!)}
    >
      <Layout
        style={{ flexDirection: 'row', backgroundColor: 'transparent', justifyContent: 'center' }}
      >
        <Layout
          style={{
            backgroundColor: 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 5
          }}
        >
          <Image
            style={styles.avatar}
            source={{
              uri: data?.avatar
            }}
          />
        </Layout>
        <Layout
          style={{ backgroundColor: 'transparent', justifyContent: 'center', marginLeft: 10 }}
        >
          <Text category={'h5'} style={{ fontWeight: 'bold' }}>{`${data.name}`}</Text>
        </Layout>
      </Layout>
      <Text style={{ fontStyle: 'italic' }}>
        Status: {`${data.isActive ? 'Active' : 'Inactive'}`}
      </Text>
      {/* <Text style={{}}>Created at: {`${data.createdAt!.slice(0, 10)}`}</Text> */}
      <Text style={{ fontStyle: 'italic' }}>Description: {`${data.description}`}</Text>
    </TouchableOpacity>
  );
};

export const TeamInforCardSearchToAddUserToProject = ({ onPress, data }: ITeamInforCardProps) => {
  return (
    <TouchableOpacity style={styles.TeamInforCardAddUserProject} onPress={() => onPress(data.id!)}>
      <Layout style={{ backgroundColor: 'transparent', justifyContent: 'center' }}>
        <Text category={'h5'} style={{ fontWeight: 'bold' }}>{`${data.name}`}</Text>
      </Layout>
      {/* <Text style={{}}>Created at: {`${data.createdAt!.slice(0, 10)}`}</Text> */}
      <Text style={{ fontStyle: 'italic' }}>Description: {`${data.description}`}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  TeamInforCard: {
    height: 120,
    backgroundColor: activeStatusCard,
    width: '100%',
    borderRadius: 5,
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    marginBottom: 10
  },
  TeamInforCardAddUserProject: {
    height: 60,
    backgroundColor: activeStatusCard,
    width: '95%',
    borderRadius: 5,
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    marginBottom: 10
  },
  avatar: {
    height: 35,
    width: 35,
    resizeMode: 'contain'
  }
});
