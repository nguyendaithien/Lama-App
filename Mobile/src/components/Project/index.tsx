import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text, useTheme } from '@ui-kitten/components';
import React from 'react';
import { ITeam } from '@src/models/team';
import { Layout } from '@ui-kitten/components';
import { activeStatusCard, inActiveStatusCard } from '@src/theme/customTheme';
import { IProject, EProjectStatus } from '@src/models/project';
interface IProjectInforCardProps {
  onPress: (id: number) => void;
  data: IProject;
}

export const ProjectInforCard = ({ onPress, data }: IProjectInforCardProps) => {
  const theme = useTheme();
  const CanceledBgr = theme['color-danger-400'];
  const InProgressBgr = theme['color-primary-400'];
  const CompletedBgr = theme['color-primary-transparent-300'];

  return (
    <TouchableOpacity
      style={[
        styles.ProjectInforCard,
        {
          backgroundColor:
            data.status === EProjectStatus.IN_PROGRESS
              ? InProgressBgr
              : data.status === EProjectStatus.COMPLETED
              ? CompletedBgr
              : CanceledBgr
        }
      ]}
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
      <Text style={{ fontStyle: 'italic' }}>Status: {`${data.status}`}</Text>
      <Text style={{ fontStyle: 'italic' }}>Income: {`${data.income}`} VND</Text>
      {/* <Text style={{}}>Created at: {`${data.createdAt!.slice(0, 10)}`}</Text> */}
      <Text style={{ fontStyle: 'italic' }}>Description: {`${data.description}`}</Text>
      <Text style={{ fontStyle: 'italic' }}>
        Start-time: {`${data.startTime?.slice(0, 10)}`} - End-Time:{' '}
        {`${data.endTime?.slice(0, 10)}`}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  ProjectInforCard: {
    height: 160,
    width: '100%',
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
