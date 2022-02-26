import React, { useState } from 'react';
import {
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
  Divider,
  Button,
  Spinner,
  Modal,
  Card,
  Datepicker
} from '@ui-kitten/components';
import { StyleSheet } from 'react-native';
import {
  MessageIcon,
  BackIcon,
  IncomeIcon,
  CalendarIcon,
  ProjectIcon
} from '@src/components/Icons';
import InputText from '@src/components/InputText';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamListPassID } from '@src/navigations/Navigation';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@src/hooks/reduxHooks';
import MESSAGES from '@src/configs/constant/messages';
import { fetchCreateNewProject } from '@src/features/project/projectSlice';

export const CreateProjectScreen = () => {
  const navigationPassID = useNavigation<NativeStackNavigationProp<RootStackParamListPassID>>();
  const dispatch = useAppDispatch();

  //root state
  const isCreatingNewProject = useAppSelector(state => state.project.isFetchingCreateNewProject);
  const fetchCreateNewProjectMsg = useAppSelector(state => state.project.fetchCreateNewProjectMsg);

  //screen state
  const [projectName, setProjectName] = useState<string>('');
  const [projectDescription, setProjectDescription] = useState<string>('');
  const [projectIncome, setProjectIncome] = useState<number>(0);
  const [projectStartTime, setProjectStartTime] = React.useState<Date | null>();
  const [projectEndTime, setProjectEndTime] = React.useState<Date | null>();

  const [modalStatus, setModalStatus] = useState<boolean>(false);

  //handle funt
  const navigateBack = () => {
    navigationPassID.goBack();
  };
  async function getFetchCreateProject() {
    try {
      await dispatch(
        fetchCreateNewProject({
          name: projectName,
          description: projectDescription,
          income: projectIncome,
          startTime: projectStartTime?.toISOString(),
          endTime: projectEndTime?.toISOString()
        })
      );
      setModalStatus(true);
      fetchCreateNewProjectMsg === MESSAGES.CREATE_SUCCESS && handleCleanPlaceHolder();
    } catch (error) {
      console.log(error);
    }
  }

  const handleDetectFullFill = () => {
    return projectName && projectDescription && projectIncome && projectStartTime && projectEndTime
      ? true
      : false;
  };

  const handleCleanPlaceHolder = () => {
    setProjectName('');
    setProjectDescription('');
    setProjectIncome(0);
    setProjectEndTime(null);
    setProjectStartTime(null);
  };

  //render icon action
  const BackAction = () => <TopNavigationAction icon={BackIcon} onPress={navigateBack} />;

  const SubmitBotton = () => {
    return (
      <Layout style={styles.submitButton}>
        <Button
          style={styles.button}
          onPress={() => {
            getFetchCreateProject();
          }}
          status="primary"
          size="giant"
        >
          SUBMIT
        </Button>
      </Layout>
    );
  };

  return (
    <Layout style={styles.container}>
      <TopNavigation alignment="center" title="Create Project" accessoryLeft={BackAction} />
      <Divider />
      <Layout>
        <Layout style={{ alignItems: 'center' }}>
          <Text category={'h6'} style={{ fontStyle: 'italic', marginTop: 10, paddingLeft: 10 }}>
            Fill all information to submit
          </Text>
        </Layout>
        <InputText
          label="Name: "
          placeholder="Name of project"
          accessoryLeft={ProjectIcon}
          secureTextEntry={false}
          value={projectName}
          onChangeText={name => {
            console.log(name);
            setProjectName(name);
          }}
          keyboardType="default"
        />
        <InputText
          label="Description: "
          placeholder="Description"
          accessoryLeft={MessageIcon}
          value={projectDescription}
          onChangeText={description => {
            console.log(description);
            setProjectDescription(description);
          }}
          keyboardType="default"
        />
        <InputText
          label="Income: "
          placeholder="Income"
          accessoryLeft={IncomeIcon}
          value={projectIncome}
          onChangeText={nextValue => {
            console.log(nextValue);
            setProjectIncome(parseInt(nextValue, 10));
          }}
          keyboardType="numeric"
        />
        <Layout>
          <Text style={{ paddingLeft: 10, marginTop: 15 }}>Start time: </Text>

          <Datepicker
            accessoryLeft={CalendarIcon}
            date={projectStartTime}
            onSelect={nextDate => {
              console.log(nextDate);
              console.log(projectStartTime);
              setProjectStartTime(nextDate);
            }}
            min={new Date(2010, 1, 1)}
            max={new Date(2050, 1, 1)}
            placeholder="DD/MM/YYYY"
          />
        </Layout>
        <Layout>
          <Text style={{ paddingLeft: 10, marginTop: 15 }}>End time: </Text>

          <Datepicker
            accessoryLeft={CalendarIcon}
            date={projectEndTime}
            onSelect={date => {
              console.log(date);
              console.log(date?.toISOString());
              setProjectEndTime(date);
            }}
            min={new Date(2010, 1, 1)}
            max={new Date(2050, 1, 1)}
            placeholder="DD/MM/YYYY"
          />
        </Layout>
      </Layout>
      {modalStatus && (
        <Layout style={{ minHeight: 192 }}>
          <Modal
            visible={modalStatus}
            backdropStyle={styles.backdrop}
            onBackdropPress={() => setModalStatus(false)}
          >
            <Card disabled={true}>
              <Layout style={{ alignItems: 'center' }}>
                <Text style={{ marginBottom: 10 }}>{`${fetchCreateNewProjectMsg}`}</Text>
              </Layout>
              {fetchCreateNewProjectMsg === MESSAGES.CREATE_SUCCESS && (
                <Button
                  style={{ marginBottom: 10 }}
                  onPress={() => {
                    setModalStatus(false);
                    handleCleanPlaceHolder();
                  }}
                >
                  ADD MORE PROJECT
                  {/* OKE */}
                </Button>
              )}
              <Button
                onPress={() => {
                  setModalStatus(false);
                  fetchCreateNewProjectMsg && navigateBack();
                }}
              >
                BACK
              </Button>
            </Card>
          </Modal>
        </Layout>
      )}
      <Layout style={{ justifyContent: 'center', alignItems: 'center' }}>
        {isCreatingNewProject && <Spinner status="primary" />}
      </Layout>
      {handleDetectFullFill() && <SubmitBotton />}
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  teamList: {
    justifyContent: 'center'
  },
  icon: { height: 25, width: 25, marginRight: 5 },
  iconBig: { height: 35, width: 35, marginRight: 5 },
  text: {
    fontSize: 42
  },
  plusContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingHorizontal: 15,
    marginTop: 5
  },
  numberTeam_Filter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 10,
    marginTop: 10
  },
  searchContainer: {
    height: 70,
    width: '100%',
    marginVertical: 15,
    paddingHorizontal: 20,
    justifyContent: 'space-between'
  },
  //
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
