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
  IndexPath
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
  MemberCardMiniAddUserToTeam,
  MemberCardMiniChangeLeader
} from '@src/components/Member';
import MESSAGES from '@src/configs/constant/messages';
import { fetchGetUsers } from '@src/features/user/userSlice';
import {
  fetchAddUserToProject,
  fetchChangeProjectStatus,
  fetchDeleteProject,
  fetchGetProjectDetail,
  fetchUpdateCostFromProject,
  fetchUpdateProject,
  fetchUpdateUserFromProject
} from '@src/features/project/projectSlice';
import { ProjectStatus } from '@src/models/project';
import { UserWithRemoveFromProject } from '@src/components/Member/UserProject';
import { fetchUpdateUserFromTeam } from '@src/features/team/teamSlice';
import { CostWithRemoveFromProject } from '@src/components/cost';

export const ProjectDetailScreen = () => {
  const navigationPassID = useNavigation<NativeStackNavigationProp<RootStackParamListPassID>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamListPassID>>();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const projectID = route.params.id;

  //ROOT STATE
  const projectDetail = useAppSelector(state => state.project.project);
  const users = useAppSelector(state => state.user.users);
  const usersOfProject = projectDetail.userProjects;
  const costsOfProject = projectDetail.costs;

  const isLoadingFetchGetProjectInfor = useAppSelector(state => state.project.isFetchingGetProject);

  //SCREEN STATE
  const [refreshing, setRefreshing] = useState(false);
  const [isEditProject, setIsEditProject] = useState<boolean>(false);
  const [modalDeleteStatus, setModalDeleteStatus] = useState(false);
  const [projectIncome, setProjectIncome] = useState(projectDetail?.income);
  const [projectStatus, setProjectStatus] = useState<string | undefined>(projectDetail?.status);
  const [projectStartTime, setProjectStartTime] = useState(projectDetail?.startTime);
  const [projectEndTime, setProjectEndTime] = useState(projectDetail?.endTime);
  const [projectName, setProjectName] = useState(projectDetail?.name);
  const [projectDescription, setProjectDescription] = useState(projectDetail?.description);
  const [selectedProjectStatusIndex, setSelectedProjectStatusIndex] = React.useState(
    new IndexPath(0)
  );

  //edit user state
  const [userIdUpdate, setUserIdUpdate] = useState(0);
  const [roleOfUserFromProject, setRoleOfUserFromProject] = useState('Member');
  const [wageOfUserFromProject, setWageOfUserFromProject] = useState(0);
  const [modalEditUserFromProject, setModalEditUserFromProject] = useState(false);

  //edit cost state
  const [costIdUpdate, setCostIdUpdate] = useState(0);
  const [titleOfCostFromProject, setTitleOfCostFromProject] = useState('');
  const [valueOfCostFromProject, setValueOfCostFromProject] = useState(0);
  const [modalEditCostFromProject, setModalEditCostFromProject] = useState(false);

  //HANDLE FUNT
  const handleAccessAddUserToProjectScreen = (projectId: number) => {
    navigationPassID.navigate(ROUTES.projectAddUser, { id: projectId });
  };

  const handleAccessAddCostToProjectScreen = (projectId: number) => {
    navigationPassID.navigate(ROUTES.projectAddCost, { id: projectId });
  };

  const handleDeleteProjectWithAlert = () =>
    Alert.alert('Delete', 'Confirm delete project', [
      {
        text: 'Yes',
        onPress: () => {
          dispatch(fetchDeleteProject(projectID));
          setModalDeleteStatus(true);
        }
      },
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel'
      }
    ]);

  const handleAccessUpdateUserFromProject = ({
    wage,
    userId,
    role
  }: {
    wage: number;
    userId: number;
    role: string;
  }) => {
    setModalEditUserFromProject(true);
    // console.log('hell');
    setUserIdUpdate(userId);
    setWageOfUserFromProject(wage);
    setRoleOfUserFromProject(role);
  };

  const handleAccessUpdateCostFromProject = ({
    title,
    projectCostId,
    value
  }: {
    projectCostId: number;
    title: string;
    value: number;
  }) => {
    setModalEditCostFromProject(true);
    // console.log('hell');
    setTitleOfCostFromProject(title);
    setCostIdUpdate(projectCostId);
    setValueOfCostFromProject(value);
  };

  const handleUpdateUserFromProjectWithAlert = () => {
    Alert.alert('Update user', 'Confirm update user', [
      {
        text: 'Yes',
        onPress: () => {
          dispatch(
            fetchUpdateUserFromProject({
              role: roleOfUserFromProject,
              userId: userIdUpdate,
              wage: wageOfUserFromProject,
              projectId: projectID
            })
          );
          setModalEditUserFromProject(false);
        }
      },
      {
        text: 'No',
        onPress: () => {
          console.log('Cancel Pressed');
          setModalEditUserFromProject(true);
        },
        style: 'cancel'
      }
    ]);
  };
  const handleUpdateCostFromProjectWithAlert = () => {
    Alert.alert('Update Cost', 'Confirm update cost', [
      {
        text: 'Yes',
        onPress: () => {
          dispatch(
            fetchUpdateCostFromProject({
              projectCostId: costIdUpdate,
              projectId: projectID,
              title: titleOfCostFromProject,
              value: valueOfCostFromProject
            })
          );
          setModalEditCostFromProject(false);
        }
      },
      {
        text: 'No',
        onPress: () => {
          console.log('Cancel Pressed');
          setModalEditCostFromProject(true);
        },
        style: 'cancel'
      }
    ]);
  };

  const handleTotalCosts = () => {
    let totalCostsValue = 0;
    costsOfProject?.forEach(cost => (totalCostsValue = totalCostsValue + cost?.value!));
    return totalCostsValue;
  };

  const handleTotalWageOfUser = () => {
    let totalWageOfUser = 0;
    usersOfProject?.forEach(user => (totalWageOfUser = totalWageOfUser + user?.wage!));
    return totalWageOfUser;
  };
  const handleFormatMoney = (money: number) => {
    return money?.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + ' VND';
  };
  //RENDER Icon action and Component
  const navigateBack = () => {
    navigationPassID.goBack();
  };
  const renderEditAction = () => {
    return (
      <TopNavigationAction
        icon={!isEditProject ? EditIcon : SaveIcon}
        onPress={() => {
          setIsEditProject(!isEditProject);
          dispatch(fetchGetProjectDetail(projectID));
          isEditProject &&
            dispatch(
              fetchUpdateProject({
                projectId: projectID,
                name: projectName,
                description: projectDescription,
                income: projectIncome,
                startTime: projectStartTime,
                endTime: projectEndTime
              })
            );
          isEditProject &&
            dispatch(fetchChangeProjectStatus({ projectId: projectID, status: projectStatus }));
        }}
      />
    );
  };
  const renderBackAction = () => <TopNavigationAction icon={BackIcon} onPress={navigateBack} />;
  const PlusIconActionAddUserToProject = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          // setModalAddUser(true);
          handleAccessAddUserToProjectScreen(projectID);
        }}
      >
        <PlusIcon fill="grey" style={styles.iconBig} />
      </TouchableOpacity>
    );
  };

  const PlusIconActionAddCostToProject = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          // setModalAddUser(true);
          handleAccessAddCostToProjectScreen(projectID);
        }}
      >
        <PlusIcon fill="grey" style={styles.iconBig} />
      </TouchableOpacity>
    );
  };

  const UsersOfProjectComponent = () => {
    return (
      <>
        <Layout
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingRight: 5,
            marginTop: 5
          }}
        >
          <Text style={{ paddingLeft: 10 }}>
            Members: {`${usersOfProject?.length}`}{' '}
            {` (Total wages: ${handleFormatMoney(handleTotalWageOfUser())})`}
          </Text>
          <PlusIconActionAddUserToProject />
        </Layout>

        {usersOfProject?.length !== 0 && (
          <>
            <Layout style={{ height: 150 }}>
              <ScrollView
                nestedScrollEnabled
                contentContainerStyle={{
                  // maxHeight: 200,
                  backgroundColor: theme['color-primary-transparent-300'],
                  alignItems: 'center',
                  borderRadius: 10
                }}
              >
                {usersOfProject?.map((item, index) => {
                  return (
                    <UserWithRemoveFromProject
                      projectId={projectID}
                      Data={item}
                      key={index}
                      onPress={handleAccessUpdateUserFromProject}
                    />
                  );
                })}
              </ScrollView>
            </Layout>
          </>
        )}
        <Modal
          visible={modalEditUserFromProject}
          backdropStyle={styles.backdrop}
          onBackdropPress={() => setModalEditUserFromProject(false)}
        >
          <Card disabled={true} style={{ width: 350, borderRadius: 10 }}>
            <InputText
              label="Role: "
              style={styles.input}
              placeholder="Role of user"
              accessoryLeft={PersonIcon}
              value={roleOfUserFromProject}
              onChangeText={setRoleOfUserFromProject}
              keyboardType="default"
            />
            <InputText
              label="Wage: "
              style={styles.input}
              placeholder="Wage"
              accessoryLeft={CreditIcon}
              value={wageOfUserFromProject}
              onChangeText={wage => {
                setWageOfUserFromProject(parseInt(wage, 10));
              }}
              keyboardType="numeric"
            />

            <Button
              style={{ marginTop: 5 }}
              onPress={() => {
                handleUpdateUserFromProjectWithAlert();
              }}
            >
              SUBMIT
            </Button>
          </Card>
        </Modal>
      </>
    );
  };

  //Handle cost of project
  const CostsOfProjectComponent = () => {
    return (
      <>
        <Divider />
        <Layout
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingRight: 5,
            marginTop: 10
          }}
        >
          <Text style={{ paddingLeft: 10 }}>
            Costs: {`${costsOfProject?.length}`}{' '}
            {`( Total: ${handleFormatMoney(handleTotalCosts())})`}
          </Text>
          <PlusIconActionAddCostToProject />
        </Layout>

        {costsOfProject?.length !== 0 && (
          <>
            <Layout style={{ height: 150 }}>
              <ScrollView
                nestedScrollEnabled
                contentContainerStyle={{
                  // maxHeight: 200,
                  backgroundColor: theme['color-primary-transparent-300'],
                  alignItems: 'center',
                  borderRadius: 10
                }}
              >
                {costsOfProject?.map((item, index) => {
                  return (
                    <CostWithRemoveFromProject
                      projectId={projectID}
                      Data={item}
                      key={index}
                      onPress={handleAccessUpdateCostFromProject}
                    />
                  );
                })}
              </ScrollView>
            </Layout>
          </>
        )}
        <Modal
          visible={modalEditCostFromProject}
          backdropStyle={styles.backdrop}
          onBackdropPress={() => setModalEditCostFromProject(false)}
        >
          <Card disabled={true} style={{ width: 350, borderRadius: 10 }}>
            <InputText
              label="Title: "
              style={styles.input}
              placeholder="Title of cost"
              accessoryLeft={MessageIcon}
              value={titleOfCostFromProject}
              onChangeText={setTitleOfCostFromProject}
              keyboardType="default"
            />
            <InputText
              label="Value: "
              style={styles.input}
              placeholder="Value of cost"
              accessoryLeft={CreditIcon}
              value={valueOfCostFromProject}
              onChangeText={value => {
                setValueOfCostFromProject(parseInt(value, 10));
              }}
              keyboardType="numeric"
            />

            <Button
              style={{ marginTop: 5 }}
              onPress={() => {
                handleUpdateCostFromProjectWithAlert();
              }}
            >
              SUBMIT
            </Button>
          </Card>
        </Modal>
      </>
    );
  };
  //Initial Effect
  useEffect(() => {
    dispatch(fetchGetProjectDetail(projectID));
    // dispatch(fetchGetUsers({ page: 1, limit: 100, search: projectSearchUser, sort: 2, status: 1 }));
  }, [dispatch, projectID]);

  useEffect(() => {
    setProjectName(projectDetail.name);
    setProjectDescription(projectDetail.description);
    setProjectIncome(projectDetail.income);
    setProjectStartTime(projectDetail.startTime);
    setProjectEndTime(projectDetail.endTime);
    setProjectStatus(projectDetail.status);
  }, [
    projectDetail.description,
    projectDetail.endTime,
    projectDetail.income,
    projectDetail.name,
    projectDetail.startTime,
    projectDetail.status
  ]);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    dispatch(fetchGetProjectDetail(projectID));
    !isLoadingFetchGetProjectInfor && setRefreshing(false);
  }, [dispatch, isLoadingFetchGetProjectInfor, projectID]);
  return (
    <Layout style={styles.container}>
      <TopNavigation
        alignment="center"
        title="Project Detail"
        accessoryRight={renderEditAction}
        accessoryLeft={renderBackAction}
      />
      <Divider />
      {!isEditProject && (
        <Layout style={styles.avatarContainer}>
          <Layout style={styles.avatar}>
            <Avatar
              style={[styles.avatar, { resizeMode: 'contain', borderWidth: 0 }]}
              source={{
                uri: projectDetail?.avatar
              }}
            />
          </Layout>

          <Text category="h4">Name: {`${projectDetail.name}`}</Text>
          <Layout style={{ flexDirection: 'row' }}>
            <Text appearance="hint" style={{ fontSize: 16, fontStyle: 'italic', marginRight: 5 }}>
              Start : {`${projectDetail?.startTime?.slice(0, 10)}`} -
            </Text>
            <Text appearance="hint" style={{ fontSize: 16, fontStyle: 'italic' }}>
              End : {`${projectDetail?.endTime?.slice(0, 10)}`}
            </Text>
          </Layout>
          <Text appearance="hint" category="h6" style={{ fontSize: 16, fontStyle: 'italic' }}>
            "{`${projectDetail.description}`}"
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
          {!isEditProject && (
            <Text style={{ marginTop: 10, paddingLeft: 10, fontWeight: 'bold' }}>
              Profit:{'  '}
              {`${
                handleFormatMoney(
                  projectIncome ? projectIncome - handleTotalCosts() - handleTotalWageOfUser() : 0
                )
                // !!projectIncome && projectIncome - handleTotalCosts() - handleTotalWageOfUser()
              }`}
            </Text>
          )}
          {isEditProject && (
            <>
              <InputText
                label="Name: "
                style={styles.input}
                placeholder="Name of team"
                accessoryLeft={TeamIcon}
                value={projectName}
                onChangeText={setProjectName}
                keyboardType="default"
              />
              <InputText
                label="Description: "
                style={styles.input}
                placeholder="Description"
                accessoryLeft={MessageIcon}
                value={projectDescription}
                onChangeText={setProjectDescription}
                keyboardType="default"
              />
            </>
          )}
          <Layout>
            <Text style={{ paddingLeft: 10, marginVertical: 10 }}>Status:</Text>
            <Select
              value={projectStatus}
              selectedIndex={selectedProjectStatusIndex}
              disabled={!isEditProject}
              onSelect={index => {
                const indexSelect = index as IndexPath;
                setProjectStatus(ProjectStatus[indexSelect.row]);
                setSelectedProjectStatusIndex(indexSelect);
              }}
            >
              {ProjectStatus.map((item, index) => {
                return <SelectItem title={item} key={index} />;
              })}
            </Select>
          </Layout>
          <InputText
            label="Income <VND>: "
            placeholder="Income"
            accessoryLeft={IncomeIcon}
            value={`${projectIncome}`}
            disabled={!isEditProject}
            onChangeText={nextValue => {
              setProjectIncome(parseInt(nextValue, 10));
            }}
            keyboardType="numeric"
          />

          {!isEditProject && <UsersOfProjectComponent />}
          {!isEditProject && <CostsOfProjectComponent />}
          {isEditProject && (
            <>
              <Button
                style={styles.deleteBtn}
                // appearance="outline"
                status="danger"
                onPress={() => {
                  handleDeleteProjectWithAlert();
                  // console.log('1');
                }}
              >
                DELETE PROJECT
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
  iconBig: { height: 35, width: 35, marginRight: 2 },
  input: {
    borderRadius: 3
  },
  deleteBtn: {
    width: '100%',
    height: 60,
    borderRadius: 5,
    marginTop: 200
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
