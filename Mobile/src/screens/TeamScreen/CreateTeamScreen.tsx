import React, { useEffect, useState } from 'react';
import {
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
  Divider,
  useTheme,
  Input,
  OverflowMenu,
  MenuItem,
  Button,
  Spinner,
  Modal,
  Card
} from '@ui-kitten/components';
import { StyleSheet } from 'react-native';
import { MessageIcon, BackIcon, TeamIcon } from '@src/components/Icons';
import InputText from '@src/components/InputText';
import { ROUTES } from '@src/navigations/routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, RootStackParamListPassID } from '@src/navigations/Navigation';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@src/hooks/reduxHooks';
import MESSAGES from '@src/configs/constant/messages';
import { fetchCreateNewTeam, selectCreateNewUserMsg } from '@src/features/team/teamSlice';

export const CreateTeamScreen = () => {
  const navigationPassID = useNavigation<NativeStackNavigationProp<RootStackParamListPassID>>();
  const dispatch = useAppDispatch();
  //root state
  // const fetchCreateNewUserMsg = useAppSelector(state => state.user.fetchCreateNewUserMsg);
  const isCreatingNewTeam = useAppSelector(state => state.user.isCreatingNewUser);
  const createNewTeamMsg = useAppSelector(state => state.team.fetchCreateNewTeamMsg);

  // const fetchCreateNewUserMsg = useAppSelector(state => state.user.fetchCreateNewUserMsg);
  //screen state
  const [modalStatus, setModalStatus] = useState<boolean>(false);
  const [teamName, setTeamName] = useState<string>('');
  const [teamDescription, setTeamDescription] = useState<string>('');
  const [isShowingError, setIsShowingError] = useState(false);
  const navigateBack = () => {
    navigationPassID.goBack();
  };
  async function getFetchCreateTeam() {
    try {
      await dispatch(fetchCreateNewTeam({ name: teamName, description: teamDescription }));
      setModalStatus(true);
      createNewTeamMsg === MESSAGES.CREATE_SUCCESS && handleCleanPlaceHolder();
      setIsShowingError(true);
      setTimeout(() => {
        setIsShowingError(false);
        // setCreateNewTeamMsg(null);
      }, 6000);
    } catch (error) {
      console.log(error);
    }
  }
  const BackAction = () => <TopNavigationAction icon={BackIcon} onPress={navigateBack} />;

  const SubmitBotton = () => {
    return (
      <Layout style={styles.submitButton}>
        <Button
          style={styles.button}
          onPress={() => {
            getFetchCreateTeam();
          }}
          status="primary"
          size="giant"
        >
          SUBMIT
        </Button>
      </Layout>
    );
  };

  const handleDetectFullFill = () => {
    return teamName && teamDescription ? true : false;
  };

  const handleDetectEmptyInfor = () => {
    return !teamName && !teamDescription ? true : false;
  };
  // const handleMessageCreate = () => {
  //   setFetchCreateNewUserMsg(useAppSelector(state => state.user.fetchCreateNewUserMsg));
  //   return;
  // };
  const HandleShowError = () => {
    return (
      <Layout style={{ alignItems: 'center', marginTop: 10 }}>
        <Text style={{ fontStyle: 'italic' }} status={'danger'}>{`${createNewTeamMsg}`}</Text>
      </Layout>
    );
  };

  const handleCleanPlaceHolder = () => {
    setTeamName('');
    setTeamDescription('');
  };

  return (
    <Layout style={styles.container}>
      <TopNavigation alignment="center" title="Create Team" accessoryLeft={BackAction} />
      <Divider />
      <Layout>
        <Layout style={{ alignItems: 'center' }}>
          <Text category={'h6'} style={{ fontStyle: 'italic', marginTop: 10, paddingLeft: 10 }}>
            Fill all information to submit
          </Text>
        </Layout>
        <InputText
          label="Name: "
          placeholder="Name of team"
          accessoryLeft={TeamIcon}
          secureTextEntry={false}
          value={teamName}
          onChangeText={setTeamName}
          keyboardType="default"
        />
        <InputText
          label="Description: "
          placeholder="Description"
          accessoryLeft={MessageIcon}
          value={teamDescription}
          onChangeText={setTeamDescription}
          keyboardType="default"
        />
      </Layout>

      <Layout>
        <Modal
          visible={modalStatus}
          backdropStyle={styles.backdrop}
          onBackdropPress={() => setModalStatus(false)}
        >
          <Card style={{ width: '95%' }} disabled={true}>
            <Layout style={{ alignItems: 'center' }}>
              {isCreatingNewTeam ? (
                <Spinner />
              ) : (
                <Text style={{ marginBottom: 10 }}>{`${createNewTeamMsg}`}</Text>
              )}
            </Layout>
            {createNewTeamMsg === MESSAGES.CREATE_SUCCESS && (
              <Button
                style={styles.button}
                onPress={() => {
                  setModalStatus(false);
                  handleCleanPlaceHolder();
                }}
              >
                ADD MORE TEAM
                {/* OKE */}
              </Button>
            )}

            <Button
              onPress={() => {
                setModalStatus(false);
                createNewTeamMsg === MESSAGES.CREATE_SUCCESS && navigateBack();
              }}
            >
              BACK
            </Button>
          </Card>
        </Modal>
      </Layout>

      <Layout style={{ justifyContent: 'center', alignItems: 'center' }}>
        {isCreatingNewTeam && <Spinner status="primary" />}
      </Layout>
      {handleDetectFullFill() && <SubmitBotton />}
      {isShowingError && <HandleShowError />}
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
    height: 50,
    borderRadius: 5,
    marginBottom: 20
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  }
});
