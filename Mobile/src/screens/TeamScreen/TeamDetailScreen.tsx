import React, { useEffect, useState } from 'react';
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
  Input
} from '@ui-kitten/components';
import { ROUTES } from '@src/navigations/routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamListPassID } from '@src/navigations/Navigation';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StyleSheet, ScrollView, RefreshControl, Alert, TouchableOpacity } from 'react-native';
import {
  BackIcon,
  EditIcon,
  SaveIcon,
  TeamIcon,
  MessageIcon,
  TeamLeaderIcon,
  PlusIcon,
  SearchIcon
} from '@src/components/Icons';
import { useAppDispatch, useAppSelector } from '@src/hooks/reduxHooks';
import {
  fetchAddUserToTeam,
  fetchChangeTeamStatus,
  fetchDeleteTeam,
  fetchGetTeamDetail,
  fetchUpdateTeam,
  fetchUpdateUserFromTeam
} from '@src/features/team/teamSlice';
import InputText from '@src/components/InputText';
import {
  MemberCardMini,
  MemberCardMiniAddUserToTeam,
  MemberCardMiniChangeLeader
} from '@src/components/Member';
import MESSAGES from '@src/configs/constant/messages';
import { fetchGetUsers } from '@src/features/user/userSlice';

export const TeamDetailScreen = () => {
  const navigationPassID = useNavigation<NativeStackNavigationProp<RootStackParamListPassID>>();
  const route = useRoute<RouteProp<RootStackParamListPassID>>();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const teamID = route.params.id;

  //ROOT STATE
  const teamDetail = useAppSelector(state => state.team.team);
  const users = useAppSelector(state => state.user.users);
  const usersOfTeam = teamDetail.userTeams;
  const isLoadingFetchGetTeamInfor = useAppSelector(state => state.team.isFetchingGetTeam);

  //SCREEN STATE
  // const [selectedIndex, setSelectedIndex] = React.useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [description, setDescription] = useState(teamDetail?.description);
  const [name, setName] = useState(teamDetail?.name);
  const [activeStatus, setActiveStatus] = useState(teamDetail?.isActive);
  const [selectedStatusActive, setSelectedStatusActive] = useState(false);
  const [modalDeleteStatus, setModalDeleteStatus] = useState(false);
  const [modalAddUser, setModalAddUser] = useState(false);
  const [modalStatusAddUser, setModalStatusAddUser] = useState(false);

  const [search, setSearch] = useState('');

  //handle funct
  const onCheckedChange = (isChecked: boolean) => {
    setSelectedStatusActive(isChecked);
    dispatch(fetchChangeTeamStatus({ teamID: teamID, isActive: isChecked }));
    setActiveStatus(isChecked);
  };

  const teamLeader = usersOfTeam?.filter(user => user?.isOwner === true);
  // const

  const handleAccessDetail = (idOfDetail: number) => {
    navigationPassID.navigate(ROUTES.memberDetail, { id: idOfDetail });
  };

  const handleDeleteTeamWithAlert = () =>
    Alert.alert('Delete', 'Confirm delete team', [
      {
        text: 'Yes',
        onPress: () => {
          dispatch(fetchDeleteTeam(teamID));
          setModalDeleteStatus(true);
        }
      },
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel'
      }
    ]);

  const handleAddUserToTeamWithAlert = (userId: number) =>
    Alert.alert('Add user', 'Confirm add user to team', [
      {
        text: 'Yes',
        onPress: () => {
          dispatch(
            fetchAddUserToTeam({ teamID: teamID, userId: userId, role: 'Member', isOwner: false })
          );
          setModalStatusAddUser(true);
          setModalAddUser(false);
        }
      },
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel'
      }
    ]);
  const handleChangeLeader = (userId: number) =>
    Alert.alert('Change team leader', 'Confirm change team leader', [
      {
        text: 'Yes',
        onPress: () => {
          dispatch(
            fetchUpdateUserFromTeam({
              teamID: teamID,
              userId: userId,
              role: 'Member',
              isOwner: true
            })
          );
        }
      },
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel'
      }
    ]);

  //funt render Icon action
  const navigateBack = () => {
    navigationPassID.goBack();
  };
  const renderEditAction = () => {
    return (
      <TopNavigationAction
        icon={!isEdit ? EditIcon : SaveIcon}
        onPress={() => {
          setIsEdit(!isEdit);
          dispatch(fetchGetTeamDetail(teamID));
          isEdit && dispatch(fetchUpdateTeam({ teamID, name, description }));
        }}
      />
    );
  };
  const renderBackAction = () => <TopNavigationAction icon={BackIcon} onPress={navigateBack} />;
  const PlusIconAction = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          console.log('hello');
          setModalAddUser(true);
        }}
      >
        <PlusIcon fill="grey" style={styles.iconBig} />
      </TouchableOpacity>
    );
  };
  const renderSearchIconAction = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          dispatch(fetchGetUsers({ page: 1, limit: 100, search: search, sort: 2, status: 1 }));
        }}
      >
        <SearchIcon fill="grey" style={styles.icon} />
      </TouchableOpacity>
    );
  };
  //Initial Effect
  useEffect(() => {
    dispatch(fetchGetTeamDetail(teamID));
  }, [dispatch, teamID]);

  useEffect(() => {
    setName(teamDetail.name);
    setDescription(teamDetail.description);
    setActiveStatus(teamDetail.isActive);
    setSelectedStatusActive(teamDetail.isActive ? true : false);
  }, [teamDetail.description, teamDetail.isActive, teamDetail.name]);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    dispatch(fetchGetTeamDetail(teamID));
    !isLoadingFetchGetTeamInfor && setRefreshing(false);
  }, [dispatch, isLoadingFetchGetTeamInfor, teamID]);
  return (
    <Layout style={styles.container}>
      <TopNavigation
        alignment="center"
        title="Team Detail"
        accessoryRight={renderEditAction}
        accessoryLeft={renderBackAction}
      />
      <Divider />
      {!isEdit && (
        <Layout style={styles.avatarContainer}>
          <Layout style={styles.avatar}>
            <Avatar
              style={[styles.avatar, { resizeMode: 'contain', borderWidth: 0 }]}
              source={{
                uri: teamDetail?.avatar
              }}
            />
          </Layout>

          <Text category="h4">Name: {`${teamDetail.name}`}</Text>
          <Text appearance="hint" style={{ fontSize: 16, fontStyle: 'italic' }}>
            Created at: {`${teamDetail?.createdAt?.slice(0, 10)}`}
          </Text>
          <Text appearance="hint" category="h6" style={{ fontSize: 16, fontStyle: 'italic' }}>
            "{`${teamDetail.description}`}"
          </Text>
        </Layout>
      )}

      <Divider />
      <Layout style={{ flex: 1 }}>
        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ justifyContent: 'center' }}
          nestedScrollEnabled
        >
          <Layout style={{ alignItems: 'center', marginTop: 10 }}>
            <Toggle checked={selectedStatusActive} onChange={onCheckedChange}>
              {`${activeStatus ? 'Active' : 'Inactive'}`}
            </Toggle>
          </Layout>
          {isEdit && (
            <>
              <InputText
                label="Name: "
                style={styles.input}
                placeholder="Name of team"
                accessoryLeft={TeamIcon}
                value={name}
                onChangeText={setName}
                keyboardType="default"
              />
              <InputText
                label="Description: "
                style={styles.input}
                placeholder="Lastname"
                accessoryLeft={MessageIcon}
                value={description}
                onChangeText={setDescription}
                keyboardType="default"
              />
            </>
          )}
          <InputText
            label="Leader: "
            style={styles.input}
            accessoryLeft={TeamLeaderIcon}
            value={
              teamLeader?.length
                ? `${teamLeader![0]?.user?.firstName}` + ` ${teamLeader![0]?.user?.lastName}`
                : 'Null'
            }
            keyboardType="default"
            disabled={true}
          />
          {isEdit && (
            <Layout style={{ height: 200 }}>
              <ScrollView
                nestedScrollEnabled
                contentContainerStyle={{
                  alignItems: 'center',
                  marginTop: 10,
                  backgroundColor: theme['color-primary-transparent-300']
                }}
              >
                {!!usersOfTeam &&
                  usersOfTeam.map((item, index) => {
                    return (
                      <MemberCardMiniChangeLeader
                        Data={item}
                        key={index}
                        onPress={handleChangeLeader}
                      />
                    );
                  })}
              </ScrollView>
            </Layout>
          )}

          {!isEdit && (
            <>
              <Layout
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingRight: 7,
                  marginTop: 10
                }}
              >
                <Text style={{ paddingLeft: 10 }}>Users of team: {`${usersOfTeam?.length}`}</Text>
                <PlusIconAction />
              </Layout>
              {usersOfTeam?.length !== 0 && (
                <>
                  <Layout style={{ height: 200 }}>
                    <ScrollView
                      nestedScrollEnabled
                      contentContainerStyle={{
                        // maxHeight: 200,
                        backgroundColor: theme['color-primary-transparent-300'],
                        alignItems: 'center',
                        borderRadius: 10
                      }}
                    >
                      {usersOfTeam?.map((item, index) => {
                        return (
                          <MemberCardMini
                            teamID={teamID}
                            Data={item}
                            key={index}
                            onPress={handleAccessDetail}
                          />
                        );
                      })}
                    </ScrollView>
                  </Layout>
                </>
              )}
            </>
          )}
          {!isEdit && (
            <Layout style={{ marginBottom: 15, alignItems: 'flex-end', paddingHorizontal: 11 }}>
              <Modal
                visible={modalAddUser}
                backdropStyle={styles.backdrop}
                onBackdropPress={() => setModalAddUser(false)}
              >
                <Card disabled={true} style={{ width: 350, borderRadius: 10 }}>
                  <Layout style={{ alignItems: 'center' }}>
                    <Text style={{ marginBottom: 10 }}>Add more user to team</Text>
                  </Layout>
                  <Input
                    value={search}
                    placeholder="Place your Text"
                    accessoryRight={renderSearchIconAction}
                    onChangeText={nextValue => setSearch(nextValue)}
                  />
                  <Layout style={{ height: 250 }}>
                    <ScrollView
                      contentContainerStyle={{
                        alignItems: 'center',
                        marginTop: 10,
                        backgroundColor: theme['color-primary-transparent-300']
                      }}
                    >
                      {users.map((item, index) => {
                        return (
                          <MemberCardMiniAddUserToTeam
                            Data={item}
                            key={index}
                            onPress={handleAddUserToTeamWithAlert}
                          />
                        );
                      })}
                    </ScrollView>
                  </Layout>
                </Card>
              </Modal>
              <Modal
                visible={modalStatusAddUser}
                backdropStyle={styles.backdrop}
                onBackdropPress={() => setModalStatusAddUser(false)}
              >
                <Card disabled={true} style={{ width: 350 }}>
                  <Layout style={{ alignItems: 'center' }}>
                    <Text style={{ marginBottom: 10 }}>{`${MESSAGES.ADD_SUCCESS}`}</Text>
                  </Layout>
                  <Button
                    onPress={() => {
                      setModalAddUser(true);
                      setModalStatusAddUser(false);
                    }}
                  >
                    ADD MORE
                  </Button>
                  <Button
                    style={{ marginTop: 10 }}
                    onPress={() => {
                      setModalAddUser(false);
                      setModalStatusAddUser(false);
                      dispatch(fetchGetUsers(null));
                    }}
                  >
                    BACK
                  </Button>
                </Card>
              </Modal>
            </Layout>
          )}

          {isEdit && (
            <>
              <Button
                style={styles.deleteBtn}
                // appearance="outline"
                status="danger"
                onPress={() => {
                  handleDeleteTeamWithAlert();
                }}
              >
                DELETE TEAM
              </Button>
              <Modal
                visible={modalDeleteStatus}
                backdropStyle={styles.backdrop}
                // onBackdropPress={() => setModalStatus(false)}
              >
                <Card disabled={true}>
                  <Layout style={{ alignItems: 'center' }}>
                    <Text style={{ marginBottom: 10 }}>{`${MESSAGES.DELETE_SUCCESS}`}</Text>
                  </Layout>
                  <Button
                    onPress={() => {
                      setModalDeleteStatus(false);
                      navigateBack();
                    }}
                  >
                    BACK TO TEAMS SCREEN
                  </Button>
                </Card>
              </Modal>
            </>
          )}
        </ScrollView>
      </Layout>
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
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  }
});
