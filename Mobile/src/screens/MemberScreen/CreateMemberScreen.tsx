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
import { EditIcon, PersonIcon, BackIcon, EmailIcon, PhoneIcon } from '@src/components/Icons';
import InputText from '@src/components/InputText';
import { ROUTES } from '@src/navigations/routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, RootStackParamListPassID } from '@src/navigations/Navigation';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@src/hooks/reduxHooks';
import {
  fetchGetUserInforByID,
  fetchGetUsers,
  fetchCreateNewUser
} from '@src/features/user/userSlice';
import MESSAGES from '@src/configs/constant/messages';

export const CreateMemberScreen = () => {
  const navigationPassID = useNavigation<NativeStackNavigationProp<RootStackParamListPassID>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();

  const [modalStatus, setModalStatus] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const fetchCreateNewUserMsg = useAppSelector(state => state.user.fetchCreateNewUserMsg);
  const isCreatingNewUser = useAppSelector(state => state.user.isCreatingNewUser);

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
            console.log('hello');
            dispatch(fetchCreateNewUser({ email, firstName, lastName, phone: phoneNumber }));
            fetchCreateNewUserMsg === MESSAGES.CREATE_SUCCESS && handleCleanPlaceHolder();
            setModalStatus(true);
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
    return firstName && lastName && email && phoneNumber ? true : false;
  };

  const handleDetectEmptyInfor = () => {
    return !firstName && !lastName && !email && !phoneNumber ? true : false;
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
      {modalStatus && (
        <Layout style={{ minHeight: 192 }}>
          <Modal
            visible={modalStatus}
            backdropStyle={styles.backdrop}
            onBackdropPress={() => setModalStatus(false)}
          >
            <Card disabled={true}>
              <Text style={{ marginBottom: 10 }}>Create new user successful 😻</Text>
              <Button
                style={{ marginBottom: 10 }}
                onPress={() => {
                  setModalStatus(false);
                }}
              >
                ADD ANOTHER USER
              </Button>
              <Button
                onPress={() => {
                  setModalStatus(false);
                  navigateBack();
                }}
              >
                BACK TO USERS SCREEN
              </Button>
            </Card>
          </Modal>
        </Layout>
      )}
      <Layout style={{ justifyContent: 'center', alignItems: 'center' }}>
        {isCreatingNewUser && <Spinner status="primary" />}
      </Layout>
      {handleDetectFullFill() && <SubmitBotton />}
      {fetchCreateNewUserMsg !== null && fetchCreateNewUserMsg !== MESSAGES.CREATE_SUCCESS && (
        <Layout style={{ alignItems: 'center', marginTop: 10 }}>
          <Text style={{ fontStyle: 'italic' }} status={'danger'}>{`${fetchCreateNewUserMsg.slice(
            6
          )}`}</Text>
        </Layout>
      )}
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
