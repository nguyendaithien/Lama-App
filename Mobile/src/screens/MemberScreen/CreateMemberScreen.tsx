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
  Card
} from '@ui-kitten/components';
import { StyleSheet } from 'react-native';
import { PersonIcon, BackIcon, EmailIcon, PhoneIcon } from '@src/components/Icons';
import InputText from '@src/components/InputText';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamListPassID } from '@src/navigations/Navigation';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@src/hooks/reduxHooks';
import { fetchCreateNewUser } from '@src/features/user/userSlice';
import MESSAGES from '@src/configs/constant/messages';

export const CreateMemberScreen = () => {
  const navigationPassID = useNavigation<NativeStackNavigationProp<RootStackParamListPassID>>();
  const dispatch = useAppDispatch();
  //root state
  const isCreatingNewUser = useAppSelector(state => state.user.isCreatingNewUser);
  const fetchCreateNewUserMsg = useAppSelector(state => state.user.fetchCreateNewUserMsg);
  //screen state
  const [modalStatus, setModalStatus] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  const navigateBack = () => {
    navigationPassID.goBack();
  };
  const BackAction = () => <TopNavigationAction icon={BackIcon} onPress={navigateBack} />;

  const SubmitBotton = () => {
    return (
      <Layout style={styles.submitButton}>
        <Button
          style={styles.button}
          onPress={() => {
            getFetchCreateUser();
          }}
          status="primary"
          size="giant"
        >
          SUBMIT
        </Button>
      </Layout>
    );
  };
  async function getFetchCreateUser() {
    try {
      await dispatch(fetchCreateNewUser({ email, firstName, lastName, phone: phoneNumber }));
      setModalStatus(true);
      fetchCreateNewUserMsg === MESSAGES.CREATE_SUCCESS && handleCleanPlaceHolder();
      // setCreateNewUserMsg(createNewUserMsgRootState);
    } catch (error) {
      console.log(error);
    }
  }
  const handleDetectFullFill = () => {
    return firstName && lastName && email && phoneNumber ? true : false;
  };

  const handleCleanPlaceHolder = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhoneNumber('');
  };

  return (
    <Layout style={styles.container}>
      <TopNavigation alignment="center" title="Create Member" accessoryLeft={BackAction} />
      <Divider />
      <Layout>
        <Layout style={{ alignItems: 'center' }}>
          <Text category={'h6'} style={{ fontStyle: 'italic', marginTop: 10, paddingLeft: 10 }}>
            Fill all information to submit
          </Text>
        </Layout>
        <InputText
          label="Fullname"
          placeholder="First name"
          accessoryLeft={PersonIcon}
          secureTextEntry={false}
          value={firstName}
          onChangeText={setFirstName}
          keyboardType="default"
        />
        <InputText
          placeholder="Last name"
          accessoryLeft={PersonIcon}
          value={lastName}
          onChangeText={setLastName}
          keyboardType="default"
        />
        <InputText
          label="Email"
          placeholder="Email"
          accessoryLeft={EmailIcon}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <InputText
          label="Phone number"
          placeholder="Phone number"
          accessoryLeft={PhoneIcon}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="numeric"
        />
      </Layout>

      <Layout>
        <Modal
          visible={modalStatus}
          backdropStyle={styles.backdrop}
          onBackdropPress={() => setModalStatus(false)}
        >
          <Card disabled={true} style={{ width: 350, borderRadius: 10 }}>
            <Layout style={{ alignItems: 'center' }}>
              {fetchCreateNewUserMsg !== null &&
              fetchCreateNewUserMsg !== MESSAGES.CREATE_SUCCESS ? (
                <Text style={{ marginBottom: 10 }}>Phone invalid</Text>
              ) : (
                <Text style={{ marginBottom: 10 }}>{`${fetchCreateNewUserMsg}`}</Text>
              )}
            </Layout>
            {fetchCreateNewUserMsg === MESSAGES.CREATE_SUCCESS && (
              <Button
                style={{ marginBottom: 10 }}
                onPress={() => {
                  setModalStatus(false);
                  handleCleanPlaceHolder();
                }}
              >
                ADD MORE USER
              </Button>
            )}
            <Button
              onPress={() => {
                setModalStatus(false);
                fetchCreateNewUserMsg === MESSAGES.CREATE_SUCCESS && navigateBack();
              }}
            >
              BACK
            </Button>
          </Card>
        </Modal>
      </Layout>
      <Layout style={{ justifyContent: 'center', alignItems: 'center' }}>
        {isCreatingNewUser && <Spinner status="primary" />}
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
