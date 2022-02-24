import React from 'react';
import { Layout, Text, useTheme } from '@ui-kitten/components';
import { StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { IProjectUser } from '@src/models/project';
import { useAppDispatch } from '@src/hooks/reduxHooks';
import { DeleteIcon } from '../Icons';
import { fetchRemoveUserFromProject } from '@src/features/project/projectSlice';

interface IProjectMemberPropsEditUser {
  // teamID: number;
  projectId: number;
  Data: IProjectUser;
  onPress: ({ wage, userId, role }: { wage: number; userId: number; role: string }) => void;
}

interface IProjectMemberProps {
  // teamID: number;
  projectId: number;
  Data: IProjectUser;
  onPress: (id: number) => void;
}

export const MemberCardMiniAddUserToProject = ({ Data, onPress }: IProjectMemberProps) => {
  const theme = useTheme();
  const user = Data.user;
  return (
    <TouchableOpacity
      style={[
        styles.addUserToProjectContainer,
        {
          backgroundColor: user?.isActive
            ? theme['color-primary-400']
            : theme['color-primary-transparent-300']
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
export const UserWithRemoveFromProject = ({
  projectId,
  Data,
  onPress
}: IProjectMemberPropsEditUser) => {
  const theme = useTheme();
  const user = Data.user;
  const dispatch = useAppDispatch();
  const handleFormatMoney = (money: number) => {
    return money?.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + ' VND';
  };
  const RenderDeleteUserFromProjectAction = () => {
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
    Alert.alert('Remove', 'Confirm remove user from project', [
      {
        text: 'Yes',
        onPress: () => dispatch(fetchRemoveUserFromProject({ projectId, userId: user?.id! }))
      },
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel'
      }
    ]);
  return (
    <TouchableOpacity
      style={[styles.memberMiniCardContainer, { backgroundColor: theme['color-primary-400'] }]}
      onPress={() => onPress({ wage: Data.wage!, userId: user?.id!, role: Data.role! })}
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
          <Text style={{ fontStyle: 'italic', flexWrap: 'wrap' }}>
            {`${user?.firstName} ${user?.lastName} - (${Data?.role})`}
          </Text>
          <Text>{`Wage: ${handleFormatMoney(Data?.wage!)}`}</Text>
        </Layout>
        <RenderDeleteUserFromProjectAction />
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
  addUserToProjectContainer: {
    height: 50,
    width: '95%',
    borderRadius: 5,
    justifyContent: 'space-evenly',
    // paddingHorizontal: 10,
    marginVertical: 5
  },
  memberMiniCardContainer: {
    height: 50,
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
