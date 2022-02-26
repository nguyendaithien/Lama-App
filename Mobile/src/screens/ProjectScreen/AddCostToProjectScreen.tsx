import React, { useState } from 'react';
import {
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
  Divider,
  Button,
  Modal,
  Card,
  Spinner
} from '@ui-kitten/components';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamListPassID } from '@src/navigations/Navigation';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StyleSheet, Alert } from 'react-native';
import { BackIcon, MessageIcon, CreditIcon } from '@src/components/Icons';
import { useAppDispatch, useAppSelector } from '@src/hooks/reduxHooks';

import InputText from '@src/components/InputText';

import MESSAGES from '@src/configs/constant/messages';
import { fetchAddCostToProject, fetchGetProjectDetail } from '@src/features/project/projectSlice';

export const AddCostToProjectScreen = () => {
  const navigationPassID = useNavigation<NativeStackNavigationProp<RootStackParamListPassID>>();
  const route = useRoute<RouteProp<RootStackParamListPassID>>();
  const dispatch = useAppDispatch();
  const projectID = route.params.id;
  //ROOT STATE

  const fetchAddCostToProjectMsg = useAppSelector(state => state.project.fetchAddCostToProjectMsg);
  const isFetchingAddCostToProject = useAppSelector(
    state => state.project.isFetchingAddCostToProject
  );
  // const users = teamDetail.userTeams;

  //state add cost
  const [titleOfCostAddToPj, setTitleOfCostAddToPj] = useState('');
  const [valueOfCostAddToPj, setValueOfCostAddToPj] = useState(0);
  const [modalStatusAddCost, setModalStatusAddCost] = useState(false);

  const navigateBack = () => {
    navigationPassID.goBack();
  };
  const renderBackAction = () => <TopNavigationAction icon={BackIcon} onPress={navigateBack} />;

  const handleDetectFullFill = () => {
    return titleOfCostAddToPj && valueOfCostAddToPj ? true : false;
  };
  const handleAddUserToProjectWithAlert = () =>
    Alert.alert('Add user', 'Confirm add user to project', [
      {
        text: 'Yes',
        onPress: () => {
          setModalStatusAddCost(true);
          dispatch(
            fetchAddCostToProject({
              projectId: projectID,
              title: titleOfCostAddToPj,
              value: valueOfCostAddToPj
            })
          );
        }
      },
      {
        text: 'No',
        onPress: () => {
          setModalStatusAddCost(false);
        },
        style: 'cancel'
      }
    ]);
  const SubmitBotton = () => {
    return (
      <Layout style={styles.submitButton}>
        <Button
          style={styles.button}
          onPress={() => {
            handleAddUserToProjectWithAlert();
          }}
          status="primary"
          size="giant"
        >
          SUBMIT
        </Button>
      </Layout>
    );
  };
  const ModalNotiAddCostStatus = () => {
    return (
      <Modal
        visible={modalStatusAddCost}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setModalStatusAddCost(false)}
      >
        <Card disabled={true} style={{ width: 350 }}>
          <Layout style={{ alignItems: 'center' }}>
            {isFetchingAddCostToProject ? (
              <Spinner />
            ) : (
              <Text style={{ marginBottom: 10 }}>{`${fetchAddCostToProjectMsg}`}</Text>
            )}
          </Layout>
          {fetchAddCostToProjectMsg === MESSAGES.ADD_SUCCESS && (
            <>
              <Button
                onPress={() => {
                  setModalStatusAddCost(false);
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
              setModalStatusAddCost(false);
              fetchAddCostToProjectMsg === MESSAGES.ADD_SUCCESS && navigateBack();
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
    setTitleOfCostAddToPj('');
    setValueOfCostAddToPj(0);
  };

  return (
    <Layout style={styles.container}>
      <TopNavigation
        alignment="center"
        title="Add user to project"
        accessoryLeft={renderBackAction}
      />
      <Divider />
      <InputText
        label="Title: "
        style={styles.input}
        placeholder="Title of cost"
        accessoryLeft={MessageIcon}
        value={titleOfCostAddToPj}
        onChangeText={setTitleOfCostAddToPj}
        keyboardType="default"
      />
      <InputText
        label="Value: "
        style={styles.input}
        placeholder="Value of cost"
        accessoryLeft={CreditIcon}
        value={valueOfCostAddToPj}
        onChangeText={value => {
          setValueOfCostAddToPj(parseInt(value, 10));
        }}
        keyboardType="numeric"
      />
      {handleDetectFullFill() && <SubmitBotton />}
      <ModalNotiAddCostStatus />
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
