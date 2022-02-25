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
  Modal,
  Button,
  Select,
  Card,
  IndexPath,
  SelectItem
} from '@ui-kitten/components';
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  RefreshControl
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, RootStackParamListPassID } from '@src/navigations/Navigation';
import { ROUTES } from '@src/navigations/routes';
import { BellIcon, PersonIcon, EmailIcon, PhoneIcon, BackIcon } from '@src/components/Icons';
import { useAppDispatch, useAppSelector } from '@src/hooks/reduxHooks';
import InputText from '@src/components/InputText';

export const RegisterScreen = () => {
  const navigationPassID = useNavigation<NativeStackNavigationProp<RootStackParamListPassID>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const theme = useTheme();

  //ROOT STATE

  //SCREEN STATE
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
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
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
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
