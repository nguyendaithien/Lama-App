import React, { useEffect, useState } from 'react';
import {
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
  Divider,
  useTheme
} from '@ui-kitten/components';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@src/navigations/Navigation';
import { ROUTES } from '@src/navigations/routes';
import {
  BellIcon,
  ActiveIcon,
  InactiveIcon,
  CompletedIcon,
  InprogressIcon,
  CanceledIcon
} from '@src/components/Icons';
import { useAppDispatch, useAppSelector } from '@src/hooks/reduxHooks';
import { fetchGetProjects } from '@src/features/project/projectSlice';
import { fetchGetUsers } from '@src/features/user/userSlice';
import { fetchGetTeams } from '@src/features/team/teamSlice';
import { EProjectStatus } from '@src/models/project';

export const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  //ROOT STATE
  const teams = useAppSelector(state => state.team.teams);
  const projects = useAppSelector(state => state.project.projects);
  const users = useAppSelector(state => state.user.users);

  //SCREEN STATE
  const [param, setParam] = useState({ page: 1, litmit: 100 });

  //Render Icon
  const renderBellAction = () => {
    return (
      <TopNavigationAction icon={BellIcon} onPress={() => navigation.navigate(ROUTES.notice)} />
    );
  };
  useEffect(() => {
    dispatch(fetchGetProjects(param));
    dispatch(fetchGetUsers(param));
    dispatch(fetchGetTeams(param));
  }, [dispatch, param]);
  interface IParamCardInfor {
    Icon: React.ReactElement;
    data: number;
    dataTitle: string;
  }
  const handleExtractActiveUsers = () => {
    const activeUsers = users.filter(user => user.isActive === true);
    return activeUsers.length;
  };

  const handleExtractInactiveUsers = () => {
    const activeUsers = users.filter(user => user.isActive === false);
    return activeUsers.length;
  };

  const handleExtractInactiveTeams = () => {
    const inactiveTeams = teams.filter(team => team.isActive === false);
    return inactiveTeams.length;
  };

  const handleExtractActiveTeams = () => {
    const activeTeams = teams.filter(team => team.isActive === true);
    return activeTeams.length;
  };

  const handleExtractCanceledProjects = () => {
    const canceledProjects = projects.filter(project => project.status === EProjectStatus.CANCELED);
    return canceledProjects.length;
  };

  const handleExtractInProgressProjects = () => {
    const inprogressProjects = projects.filter(
      project => project.status === EProjectStatus.IN_PROGRESS
    );
    return inprogressProjects.length;
  };

  const handleExtractCompletedProjects = () => {
    const completedProjects = projects.filter(
      project => project.status === EProjectStatus.COMPLETED
    );
    return completedProjects.length;
  };

  const InforCard = ({ Icon, data, dataTitle }: IParamCardInfor) => {
    return (
      <Layout
        style={[
          styles.cardMini,
          dataTitle === 'Canceled projects' && { backgroundColor: theme['color-danger-400'] },
          (dataTitle === 'Completed projects' ||
            dataTitle === 'Inactive teams' ||
            dataTitle === 'Inactive members') && {
            backgroundColor: theme['color-primary-transparent-400']
          },
          (dataTitle === 'Active teams' ||
            dataTitle === 'Active members' ||
            dataTitle === 'In progress projects') && {
            backgroundColor: theme['color-primary-400']
          }
        ]}
      >
        <Layout
          style={{
            flexDirection: 'row',
            backgroundColor: 'transparent',
            alignItems: 'center'
          }}
        >
          {/* <InactiveIcon fill={'grey'} style={styles.icon} /> */}
          {Icon}
          <Text style={styles.textItalic}>{`${dataTitle}`}:</Text>
        </Layout>
        <Text>{` ${data}`}</Text>
      </Layout>
    );
  };
  return (
    <Layout style={styles.container}>
      <TopNavigation alignment="center" title="Dashboard" accessoryRight={renderBellAction} />
      <Divider />
      <Layout style={{ paddingHorizontal: 20, paddingTop: 30 }}>
        <Layout
          style={[
            styles.cardContainer,
            { backgroundColor: theme['color-primary-transparent-300'] }
          ]}
        >
          <Text category={'h3'} style={styles.textBold}>
            Projects: {`${projects.length}`}
          </Text>
          <Layout style={styles.cardListContainer}>
            <InforCard
              Icon={<CompletedIcon fill={'grey'} style={styles.icon} />}
              data={handleExtractCompletedProjects()}
              dataTitle={'Completed projects'}
            />
            <InforCard
              Icon={<InprogressIcon fill={'grey'} style={styles.icon} />}
              data={handleExtractInProgressProjects()}
              dataTitle={'In progress projects'}
            />
            <InforCard
              Icon={<CanceledIcon fill={'grey'} style={styles.icon} />}
              data={handleExtractCanceledProjects()}
              dataTitle={'Canceled projects'}
            />
          </Layout>
        </Layout>
        <Layout
          style={[
            styles.cardContainer,
            { backgroundColor: theme['color-primary-transparent-300'], height: 150 }
          ]}
        >
          <Text category={'h3'} style={styles.textBold}>
            Teams: {`${teams.length}`}
          </Text>
          <Layout style={styles.cardListContainer}>
            <InforCard
              Icon={<ActiveIcon fill={'grey'} style={styles.icon} />}
              data={handleExtractActiveTeams()}
              dataTitle={'Active teams'}
            />
            <InforCard
              Icon={<InactiveIcon fill={'grey'} style={styles.icon} />}
              data={handleExtractInactiveTeams()}
              dataTitle={'Inactive teams'}
            />
          </Layout>
        </Layout>
        <Layout
          style={[
            styles.cardContainer,
            { backgroundColor: theme['color-primary-transparent-300'], height: 150 }
          ]}
        >
          <Text category={'h3'} style={styles.textBold}>
            Members: {`${users.length}`}
          </Text>
          <Layout style={styles.cardListContainer}>
            <InforCard
              Icon={<ActiveIcon fill={'grey'} style={styles.icon} />}
              data={handleExtractActiveUsers()}
              dataTitle={'Active members'}
            />
            <InforCard
              Icon={<InactiveIcon fill={'grey'} style={styles.icon} />}
              data={handleExtractInactiveUsers()}
              dataTitle={'Inactive members'}
            />
          </Layout>
        </Layout>
      </Layout>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  teamList: {
    justifyContent: 'center'
  },
  icon: { height: 20, width: 20, marginRight: 5 },
  iconBig: { height: 35, width: 35, marginRight: 5 },
  text: {
    fontSize: 42
  },
  textBold: { fontWeight: 'bold' },
  textItalic: {
    fontStyle: 'italic'
  },
  cardContainer: {
    height: 190,
    paddingHorizontal: 20,
    paddingTop: 10,
    borderRadius: 10,
    marginBottom: 15
  },
  cardMini: {
    paddingLeft: 30,
    paddingRight: 60,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 30,
    borderRadius: 5,
    width: '100%'
  },
  cardListContainer: { backgroundColor: 'transparent', alignItems: 'center', marginTop: 10 }
});
