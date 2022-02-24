import React from 'react';
import { Layout, Text, useTheme } from '@ui-kitten/components';
import { StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { IProjectCost, IProjectUser } from '@src/models/project';
import { useAppDispatch } from '@src/hooks/reduxHooks';
import { DeleteIcon } from '../Icons';
import {
  fetchRemoveCostFromProject,
  fetchRemoveUserFromProject
} from '@src/features/project/projectSlice';

interface IProjectCostPropsEdit {
  // teamID: number;
  projectId: number;
  Data: IProjectCost;
  onPress: ({
    title,
    projectCostId,
    value
  }: {
    projectCostId: number;
    title: string;
    value: number;
  }) => void;
}

interface IProjectMemberProps {
  // teamID: number;
  projectId: number;
  Data: IProjectUser;
  onPress: (id: number) => void;
}

export const CostCardMiniAddUserToProject = ({ Data, onPress }: IProjectMemberProps) => {
  const theme = useTheme();
  const user = Data.user;
  return (
    <TouchableOpacity
      style={[
        styles.UserProjectContainer,
        {
          backgroundColor: theme['color-primary-400']
        }
      ]}
      onPress={() => onPress(user!.id!)}
    >
      <Layout
        style={{
          flexDirection: 'row',
          backgroundColor: 'transparent',
          justifyContent: 'space-between'
        }}
      >
        <Layout style={{ backgroundColor: 'transparent', justifyContent: 'center' }}>
          <Text style={{ fontStyle: 'italic' }}> {`${user?.firstName} ${user?.lastName} `}</Text>
        </Layout>
      </Layout>
    </TouchableOpacity>
  );
};
export const CostWithRemoveFromProject = ({ projectId, Data, onPress }: IProjectCostPropsEdit) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const handleFormatMoney = (money: number) => {
    return money?.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + ' VND';
  };
  const RenderDeleteCostFromProjectAction = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          createRemoveUserFromTeamAlert();
        }}
      >
        <DeleteIcon fill={theme['color-primary-900']} style={styles.icon} />
      </TouchableOpacity>
    );
  };
  const createRemoveUserFromTeamAlert = () =>
    Alert.alert('Remove', 'Confirm remove cost from project', [
      {
        text: 'Yes',
        onPress: () => dispatch(fetchRemoveCostFromProject({ projectId, projectCostId: Data?.id! }))
      },
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel'
      }
    ]);
  return (
    <TouchableOpacity
      style={[styles.UserMiniCardContainer, { backgroundColor: theme['color-primary-400'] }]}
      onPress={() => onPress({ title: Data?.title!, projectCostId: Data?.id!, value: Data.value! })}
    >
      <Layout
        style={{
          flexDirection: 'row',
          backgroundColor: 'transparent',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 10
        }}
      >
        <Layout style={{ backgroundColor: 'transparent', justifyContent: 'center' }}>
          <Text style={{ fontStyle: 'italic' }}>
            {' '}
            {`${Data.title} - Value: ${handleFormatMoney(Data?.value!)}`}
          </Text>
        </Layout>
        <RenderDeleteCostFromProjectAction />
      </Layout>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  memberDetailContainer: { height: 60, width: '100%', marginBottom: 15 },
  memberCardContainer: {
    height: 100,
    width: '100%',
    borderRadius: 5,
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    paddingLeft: 10,
    marginBottom: 10
  },
  UserProjectContainer: {
    height: 50,
    width: '95%',
    borderRadius: 5,
    justifyContent: 'space-evenly',
    // paddingHorizontal: 10,
    marginVertical: 5
  },
  UserMiniCardContainer: {
    height: 40,
    width: '95%',
    borderRadius: 5,
    justifyContent: 'space-evenly',
    // paddingHorizontal: 10,
    marginVertical: 3.5
  },
  avatar: {
    height: 40,
    width: 40,
    // marginRight: 10,
    resizeMode: 'contain'
  },
  icon: { height: 30, width: 30 }
});
