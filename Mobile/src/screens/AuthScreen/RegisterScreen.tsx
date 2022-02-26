import React, { useState } from 'react';
import {
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
  Divider,
  Button,
  Icon,
  Modal,
  Card,
  Spinner
} from '@ui-kitten/components';
import { TouchableWithoutFeedback, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, RootStackParamListPassID } from '@src/navigations/Navigation';
import { ROUTES } from '@src/navigations/routes';
import {
  BellIcon,
  PersonIcon,
  EmailIcon,
  PhoneIcon,
  BackIcon,
  LockIcon
} from '@src/components/Icons';
import { useAppDispatch, useAppSelector } from '@src/hooks/reduxHooks';
import { fetchRegister } from '@src/features/auth/authenSlice';
import InputText from '@src/components/InputText';
import MESSAGES from '@src/configs/constant/messages';

export const RegisterScreen = () => {
  const navigationPassID = useNavigation<NativeStackNavigationProp<RootStackParamListPassID>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();

  //ROOT STATE
  const fetchRegisterMsg = useAppSelector(state => state.auth.fetchRegisterMsg);
  const isRegisterMsg = useAppSelector(state => state.auth.isFetchingRegister);
  //SCREEN STATE
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  //state modal
  const [visibleModalStatusRegister, setVisibleModalStatusRegister] = useState(false);

  //Render Icon

  const renderBellAction = () => {
    return (
      <TopNavigationAction icon={BellIcon} onPress={() => navigation.navigate(ROUTES.notice)} />
    );
  };
  const navigateBack = () => {
    navigationPassID.goBack();
  };
  const renderBackAction = () => <TopNavigationAction icon={BackIcon} onPress={navigateBack} />;

  const renderPasswordIcon = (props: any) => (
    <TouchableWithoutFeedback onPress={onPasswordIconPress}>
      <Icon {...props} name={passwordVisible ? 'eye-off-outline' : 'eye-outline'} />
    </TouchableWithoutFeedback>
  );
  //handle funt
  const onPasswordIconPress = (): void => {
    setPasswordVisible(!passwordVisible);
  };

  const handleAddUserToTeamWithAlert = () =>
    Alert.alert('Register', 'Confirm Register', [
      {
        text: 'Yes',
        onPress: () => {
          dispatch(
            fetchRegister({
              email: email,
              firstName: firstName,
              lastName: lastName,
              phone: phoneNumber,
              password: password
            })
          );
          setVisibleModalStatusRegister(true);
        }
      },
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel'
      }
    ]);
  const handleDetectFullFill = () => {
    return email || firstName || lastName || phoneNumber || password ? true : false;
  };
  //Component
  const SubmitBotton = () => {
    return (
      <Layout style={styles.submitButton}>
        <Button
          style={styles.button}
          onPress={() => {
            handleAddUserToTeamWithAlert();
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
      <TopNavigation
        alignment="center"
        title="Register"
        accessoryRight={renderBellAction}
        accessoryLeft={renderBackAction}
      />
      <Divider />
      <Layout style={{ alignItems: 'center' }}>
        <Text category={'h6'} style={{ fontStyle: 'italic', marginTop: 10, paddingLeft: 10 }}>
          Fill all information to submit
        </Text>
      </Layout>
      <InputText
        label="Email"
        placeholder="Email"
        accessoryLeft={EmailIcon}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <InputText
        label="Password"
        placeholder="Password"
        accessoryRight={renderPasswordIcon}
        accessoryLeft={LockIcon}
        secureTextEntry={!passwordVisible}
        value={password}
        onChangeText={setPassword}
      />
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
        label="Phone number"
        placeholder="Phone number"
        accessoryLeft={PhoneIcon}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="numeric"
      />
      {handleDetectFullFill() && <SubmitBotton />}
      <Modal
        visible={visibleModalStatusRegister}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setVisibleModalStatusRegister(false)}
      >
        <Card disabled={true} style={{ width: 350, borderRadius: 10 }}>
          <Layout style={{ alignItems: 'center' }}>
            {isRegisterMsg ? (
              <Spinner />
            ) : (
              <Text
                status={'danger'}
                style={[styles.msgText, { display: fetchRegisterMsg ? 'flex' : 'none' }]}
              >{`${
                fetchRegisterMsg === MESSAGES.REGISTER_SUCCESS
                  ? fetchRegisterMsg
                  : fetchRegisterMsg.slice(0, 14) === '[body] "phone"'
                  ? 'Phone number invalid'.toUpperCase()
                  : fetchRegisterMsg.slice(7).toUpperCase()
              }`}</Text>
            )}
          </Layout>
          <Button
            style={{ marginTop: 5 }}
            onPress={() => {
              setVisibleModalStatusRegister(false);
              fetchRegisterMsg === MESSAGES.REGISTER_SUCCESS && navigateBack();
            }}
          >
            {fetchRegisterMsg === MESSAGES.REGISTER_SUCCESS ? 'BACK' : 'AGAIN'}
          </Button>
        </Card>
      </Modal>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },

  icon: { height: 20, width: 20, marginRight: 5 },
  text: {
    fontSize: 42
  },
  textBold: { fontWeight: 'bold' },
  textItalic: {
    fontStyle: 'italic'
  },
  msgText: {
    width: '100%',
    textAlign: 'center',
    marginHorizontal: 5
  },
  button: {
    width: '100%',
    height: 60,
    borderRadius: 5
  },
  submitButton: {
    paddingTop: 20,
    height: 100,
    backgroundColor: 'transparent'
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  cardListContainer: { backgroundColor: 'transparent', alignItems: 'center', marginTop: 10 }
});
