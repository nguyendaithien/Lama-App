import React, { useState } from 'react';
import { TouchableWithoutFeedback, Image, TouchableOpacity } from 'react-native';
import {
  Button,
  Layout,
  StyleService,
  Text,
  useStyleSheet,
  Icon,
  Spinner,
  Modal
} from '@ui-kitten/components';
import { KeyboardAvoidingView } from '@src/components/KeyboardAvoidingView';
import InputText from '@src/components/InputText';
// import { LinearLayout } from '@src/components/LinearLayout';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@src/navigations/Navigation';
import { MailIcon, LockIcon } from '@src/components/Icons';
// import { fetchLogin } from '@src/features/auth/authenSlice';
// import { useAppDispatch, useAppSelector } from '@src/hooks/reduxHooks';
interface IFormData {
  username: string;
  password: string;
}

const LogoImage = () => {
  return (
    <Image
      style={{ height: 100, resizeMode: 'contain' }}
      source={require('@src/assets/images/doge.png')}
    />
  );
};

export const LoginScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  //   const dispatch = useAppDispatch();
  //   const loginMsg = useAppSelector(state => state.auth.fetchLoginMsg);
  //   const loading = useAppSelector(state => state.auth.isFetchingLogin);
  const loginMsg = 'Login Success';
  const loading = true;

  const styles = useStyleSheet(themedStyles);

  const onPasswordIconPress = (): void => {
    setPasswordVisible(!passwordVisible);
  };

  const renderPasswordIcon = (props: any) => (
    <TouchableWithoutFeedback onPress={onPasswordIconPress}>
      <Icon {...props} name={passwordVisible ? 'eye-off-outline' : 'eye-outline'} />
    </TouchableWithoutFeedback>
  );

  //   const handleLoginButton = async () => {
  //     dispatch(fetchLogin({ email: username, password: password }));
  //   };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Layout style={styles.headerContainer}>
        <LogoImage />
        {/* <Text style={styles.signInLabel} category="h4">
          SIGN IN
        </Text> */}
      </Layout>
      <Layout style={styles.formContainer}>
        <InputText
          label="Account"
          placeholder="Email or username"
          accessoryLeft={MailIcon}
          secureTextEntry={false}
          value={username}
          onChangeText={setUsername}
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
        <Layout
          style={{
            marginTop: 15,
            justifyContent: 'flex-end',
            height: 20,
            backgroundColor: 'transparent'
          }}
        >
          <TouchableOpacity style={{ position: 'absolute', right: 0 }}>
            <Text status="primary">Forgot Password?</Text>
          </TouchableOpacity>
        </Layout>
        {/* {loginMsg && (
          <Text
            style={[styles.errorText, { display: loginMsg ? 'flex' : 'none' }]}
            status={'danger'}
            category="c1"
          >
            {loginMsg}
          </Text>
        )}
        <Layout style={{ alignItems: 'center', marginTop: 30 }}>
          <Modal visible={loading} backdropStyle={styles.backdrop}>
            <Spinner style={styles.loading} size="giant" />
          </Modal>
        </Layout> */}
      </Layout>

      <Layout style={styles.signInButton}>
        <Button
          style={styles.button}
          //   onPress={handleLoginButton}
          onPress={() => navigation.navigate('Main')}
          status="primary"
          size="giant"
        >
          ĐĂNG NHẬP
        </Button>
        <Layout
          style={{
            marginTop: 30,
            flexDirection: 'row',
            backgroundColor: 'transparent',
            justifyContent: 'center'
          }}
        >
          <Text>Don't have an acccount?</Text>
          <TouchableOpacity
            style={{ marginLeft: 10 }}
            onPress={() => navigation.navigate('Đăng ký')}
          >
            <Text status="primary">Sign up</Text>
          </TouchableOpacity>
        </Layout>
      </Layout>
    </KeyboardAvoidingView>
  );
};

const themedStyles = StyleService.create({
  container: {
    flex: 1,
    padding: 10
    // backgroundColor: 'background-basic-color-1'
    // backgroundColor: 'grey'
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '35%',
    width: '100%',
    backgroundColor: 'transparent',
    borderTopRightRadius: 110
  },
  formContainer: {
    height: '35%',
    // paddingTop: 20,
    backgroundColor: 'transparent'
  },
  warnning: {
    marginLeft: 20
  },
  signInLabel: {
    position: 'absolute',
    bottom: 10
  },
  signInButton: {
    paddingTop: 20,
    height: 200,
    backgroundColor: 'transparent'
  },
  button: {
    width: '100%',
    height: 60,
    borderRadius: 5
  },
  errorText: {
    width: '100%',
    textAlign: 'center',
    marginTop: 15
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  loading: {}
});
