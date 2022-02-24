import React, { useCallback, useEffect, useState } from 'react';
import {
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
  Divider,
  useTheme,
  Avatar,
  Toggle,
  Button,
  Modal,
  Card,
  Input,
  Select,
  SelectItem,
  IndexPath,
  Spinner
} from '@ui-kitten/components';
import { ROUTES } from '@src/navigations/routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, RootStackParamListPassID } from '@src/navigations/Navigation';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StyleSheet, ScrollView, RefreshControl, Alert, TouchableOpacity } from 'react-native';
import {
  BackIcon,
  EditIcon,
  SaveIcon,
  TeamIcon,
  MessageIcon,
  ClockIcon,
  TeamLeaderIcon,
  PlusIcon,
  SearchIcon,
  IncomeIcon,
  PersonIcon,
  CreditIcon
} from '@src/components/Icons';
import { useAppDispatch, useAppSelector } from '@src/hooks/reduxHooks';

import InputText from '@src/components/InputText';
import {
  MemberCardMini,
  MemberCardMiniAddUserToProject,
  MemberCardMiniAddUserToTeam,
  MemberCardMiniChangeLeader
} from '@src/components/Member';
import MESSAGES from '@src/configs/constant/messages';
import { fetchGetUsers } from '@src/features/user/userSlice';
import { fetchAddUserToProject, fetchGetProjectDetail } from '@src/features/project/projectSlice';
import { fetchGetTeamDetail, fetchGetTeams } from '@src/features/team/teamSlice';
import { TeamInforCardSearchToAddUserToProject } from '@src/components/Team';

export const AddUserToProjectScreen = () => {
  const navigationPassID = useNavigation<NativeStackNavigationProp<RootStackParamListPassID>>();
  const route = useRoute<RouteProp<RootStackParamListPassID>>();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const projectID = route.params.id;
  //ROOT STATE
  const teams = useAppSelector(state => state.team.teams);
  const teamDetail = useAppSelector(state => state.team.team);
  const usersOfTeam = useAppSelector(state => state.team.team.userTeams);
  const fetchAddUserToProjectMsg = useAppSelector(state => state.project.fetchAddUserToProjectMsg);
  const isFetchingAddUserToProject = useAppSelector(
    state => state.project.isFetchingAddUserToProject
  );
  // const users = teamDetail.userTeams;

  //state add user
  const [projectUserWage, setProjectUserWage] = useState<number>(0);
  const [projectUserRole, setProjectUserRole] = useState('Member');
  const [modalStatusAddUser, setModalStatusAddUser] = useState(false);

  //state search team
  //param state
  const [projectSearchTeam, setProjectSearchTeam] = useState('');
  //handle funct

  const renderSearchIconAction = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          dispatch(
            fetchGetUsers({ page: 1, limit: 100, search: projectSearchTeam, sort: 2, status: 1 })
          );
        }}
      >
        <SearchIcon fill="grey" style={styles.icon} />
      </TouchableOpacity>
    );
  };
  const navigateBack = () => {
    navigationPassID.goBack();
  };
  const renderBackAction = () => <TopNavigationAction icon={BackIcon} onPress={navigateBack} />;

  const handleFetchTeamDetailByID = (id: number) => {
    dispatch(fetchGetTeamDetail(id));
  };

  const handleAddUserToProjectWithAlert = (userId: number) =>
    Alert.alert('Add user', 'Confirm add user to project', [
      {
        text: 'Yes',
        onPress: () => {
          setModalStatusAddUser(true);
          dispatch(
            fetchAddUserToProject({
              projectId: projectID,
              userId: userId,
              role: projectUserRole,
              wage: projectUserWage
            })
          );
          console.log('helelo');
        }
      },
      {
        text: 'No',
        onPress: () => {
          setModalStatusAddUser(false);
        },
        style: 'cancel'
      }
    ]);
  const ModalNotiAddUserStatus = () => {
    return (
      <Modal
        visible={modalStatusAddUser}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setModalStatusAddUser(false)}
      >
        <Card disabled={true} style={{ width: 350 }}>
          <Layout style={{ alignItems: 'center' }}>
            {isFetchingAddUserToProject ? (
              <Spinner />
            ) : (
              <Text style={{ marginBottom: 10 }}>{`${fetchAddUserToProjectMsg}`}</Text>
            )}
          </Layout>
          {fetchAddUserToProjectMsg === MESSAGES.ADD_SUCCESS && (
            <>
              <Button
                onPress={() => {
                  setModalStatusAddUser(false);
                  handleSetDefaultAddUserState();
                }}
              >
                ADD MORE
              </Button>
            </>
          )}
          <Button
            style={{ marginTop: 10 }}
            onPress={() => {
              setModalStatusAddUser(false);
              fetchAddUserToProjectMsg === MESSAGES.ADD_SUCCESS && navigateBack();
              dispatch(fetchGetProjectDetail(projectID));
            }}
          >
            BACK
          </Button>
        </Card>
      </Modal>
    );
  };
  const handleSetDefaultAddUserState = () => {
    dispatch(fetchGetUsers({ page: 1, limit: 100, search: '', sort: 2, status: 1 }));
    setProjectSearchTeam('');
    setProjectUserWage(0);
    setProjectUserRole('Member');
  };
  useEffect(() => {
    dispatch(
      fetchGetTeams({ page: 1, limit: 100, search: projectSearchTeam, sort: null, status: 1 })
    );
  }, [dispatch, projectSearchTeam]);
  return (
    <Layout style={styles.container}>
      <TopNavigation
        alignment="center"
        title="Add user to project"
        // accessoryRight={renderEditAction}
        accessoryLeft={renderBackAction}
      />
      <Divider />
      <InputText
        label="Role: "
        style={styles.input}
        placeholder="Role of user"
        accessoryLeft={PersonIcon}
        value={projectUserRole}
        onChangeText={setProjectUserRole}
        keyboardType="default"
      />
      <InputText
        label="Wage: "
        style={styles.input}
        accessoryLeft={CreditIcon}
        value={projectUserWage}
        onChangeText={wage => setProjectUserWage(parseInt(wage, 10))}
        keyboardType="numeric"
      />
      <Layout style={{ flexDirection: 'row' }}>
        <Text style={{ paddingLeft: 10, marginTop: 10 }}>Team:</Text>
        {/* <Layout style={{ justifyContent: 'center', marginLeft: 30 }}>
          <Text appearance={'hint'} style={{ marginTop: 10, fontStyle: 'italic', fontSize: 14 }}>
            (Press an user to Submit)
          </Text>
        </Layout> */}
      </Layout>
      <Input
        value={projectSearchTeam}
        placeholder="Place your Text"
        accessoryRight={renderSearchIconAction}
        onChangeText={nextValue => setProjectSearchTeam(nextValue)}
      />
      <Layout style={{ height: 150 }}>
        <ScrollView
          contentContainerStyle={{
            alignItems: 'center',
            marginTop: 10,
            backgroundColor: theme['color-primary-transparent-300']
          }}
        >
          {teams.map((item, index) => {
            return (
              <TeamInforCardSearchToAddUserToProject
                key={index}
                data={item}
                onPress={handleFetchTeamDetailByID}
              />
            );
          })}
        </ScrollView>
      </Layout>
      <Text style={{ paddingLeft: 10, marginTop: 10 }}>
        User of team "{`${teamDetail.name}`}": {`${usersOfTeam?.length}`}
      </Text>
      <Layout style={{ height: 150 }}>
        <ScrollView
          contentContainerStyle={{
            alignItems: 'center',
            marginTop: 10,
            backgroundColor: theme['color-primary-transparent-300']
          }}
        >
          {usersOfTeam?.map((item, index) => {
            return (
              <MemberCardMiniAddUserToProject
                Data={item}
                key={index}
                onPress={handleAddUserToProjectWithAlert}
              />
            );
          })}
        </ScrollView>
      </Layout>
      <ModalNotiAddUserStatus />
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 10 },
  avatarContainer: {
    height: 220,
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  avatar: {
    height: 100,
    width: 100,
    borderWidth: 2,
    borderRadius: 50,
    borderColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: { height: 25, width: 25, marginRight: 5 },
  iconBig: { height: 35, width: 35 },
  input: {
    borderRadius: 3
  },
  deleteBtn: {
    width: '100%',
    height: 60,
    borderRadius: 5,
    marginTop: 40
  },
  submitButton: {
    paddingTop: 20,
    height: 100,
    backgroundColor: 'transparent'
  },
  button: {
    width: '100%',
    height: 60,
    borderRadius: 5
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  }
});
