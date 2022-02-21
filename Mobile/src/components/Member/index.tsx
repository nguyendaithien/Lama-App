import React from 'react';
import { Layout, Text, useTheme } from '@ui-kitten/components';
import { Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { IUser } from '@src/models/user';
import { activeStatusCard, inActiveStatusCard } from '@src/theme/customTheme';
import { ITeamHaveUsers } from '@src/models/team';
import { DeleteIcon } from '@src/components/Icons';
import { useAppDispatch } from '@src/hooks/reduxHooks';
import { fetchRemoveUserFromTeam } from '@src/features/team/teamSlice';

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
  Data: IUser;
  onPress: (id: number) => void;
}

interface IMemberCardMiniProps {
  teamID?: number;
  Data: ITeamHaveUsers;
  onPress: (id: number) => void;
}

interface IMemberCardMiniAddUserToTeamProps {
  // teamID: number;
  Data: IUser;
  onPress: (id: number) => void;
}
export const MemberCardMiniAddUserToTeam = ({
  Data,
  onPress
}: IMemberCardMiniAddUserToTeamProps) => {
  return (
    <TouchableOpacity style={[styles.memberMiniCardContainer]} onPress={() => onPress(Data.id!)}>
      <Layout
        style={{
          flexDirection: 'row',
          backgroundColor: 'transparent',
          justifyContent: 'space-between'
        }}
      >
        <Layout style={{ backgroundColor: 'transparent', justifyContent: 'center' }}>
          <Text style={{ fontStyle: 'italic' }}> {`${Data.firstName} ${Data.lastName} `}</Text>
        </Layout>
      </Layout>
    </TouchableOpacity>
  );
};

export const MemberCardMiniChangeLeader = ({ Data, onPress }: IMemberCardMiniProps) => {
  const theme = useTheme();
  const user = Data.user;
  return (
    <TouchableOpacity
      style={[
        styles.memberMiniCardContainer,
        Data.isOwner && { backgroundColor: theme['color-primary-600'] }
      ]}
      onPress={() => onPress(user?.id!)}
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

export const MemberCardMini = ({ teamID, Data, onPress }: IMemberCardMiniProps) => {
  const theme = useTheme();
  const user = Data.user;
  const dispatch = useAppDispatch();
  const RenderDeleteUserFromTeamAction = () => {
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
    Alert.alert('Remove', 'Confirm remove user from team', [
      {
        text: 'Yes',
        onPress: () => dispatch(fetchRemoveUserFromTeam({ teamID, userId: Data?.user?.id }))
      },
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel'
      }
    ]);
  return (
    <TouchableOpacity
      style={[
        styles.memberMiniCardContainer,
        Data.isOwner && { backgroundColor: theme['color-primary-600'] }
      ]}
      onPress={() => onPress(Data?.user!.id!)}
    >
      <Layout
        style={{
          flexDirection: 'row',
          backgroundColor: 'transparent',
          justifyContent: 'space-between'
        }}
      >
        <Layout style={{ backgroundColor: 'transparent', justifyContent: 'center' }}>
          <Text style={{ fontStyle: 'italic' }}>
            {' '}
            {`${user?.firstName} ${user?.lastName} - (${
              Data.isOwner === true ? 'Leader' : 'Member'
            })`}
          </Text>
        </Layout>
        <RenderDeleteUserFromTeamAction />
      </Layout>
    </TouchableOpacity>
  );
};

export const MemberCard = ({ Data, onPress }: IMemberCardProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.memberCardContainer,
        !Data.isActive && { backgroundColor: inActiveStatusCard }
      ]}
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
          <Text category={'h5'} style={{ justifyContent: 'center', fontWeight: 'bold' }}>{`${
            Data?.firstName
          } ${Data.lastName!}`}</Text>
        </Layout>
      </Layout>
      <Text style={{ fontStyle: 'italic' }}>
        Status: {`${Data.isActive ? 'Active' : 'Inactive'}`}
      </Text>
      <Text style={{ fontStyle: 'italic' }}>
        Team: {`${Data.userTeams![0]?.team?.name ? Data.userTeams![0]?.team?.name : 'null'}`}
      </Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  memberDetailContainer: { height: 60, width: '100%', marginBottom: 15 },
  memberCardContainer: {
    height: 100,
    backgroundColor: activeStatusCard,
    width: '100%',
    borderRadius: 5,
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    paddingLeft: 10,
    marginBottom: 10
  },
  memberMiniCardContainer: {
    height: 50,
    backgroundColor: activeStatusCard,
    width: '95%',
    borderRadius: 5,
    justifyContent: 'space-evenly',
    // paddingHorizontal: 10,
    marginVertical: 5
  },
  avatar: {
    height: 40,
    width: 40,
    // marginRight: 10,
    resizeMode: 'contain'
  },
  icon: { height: 30, width: 30 }
});
