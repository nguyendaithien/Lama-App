import React, { useState } from 'react';
import { Pressable, Alert, TouchableOpacity } from 'react-native';
import {
  Divider,
  Layout,
  StyleService,
  Toggle,
  TopNavigation,
  useTheme,
  Text,
  TopNavigationAction,
  Modal,
  Card
} from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@src/navigations/Navigation';
import { useAppDispatch, useAppSelector } from '@src/hooks/reduxHooks';
import { selectThemeType, toggleThemeType } from '@src/features/app/appSlice';
import { fetchLogout } from '@src/features/auth/authenSlice';
import { ROUTES } from '@src/navigations/routes';
import { BellIcon } from '@src/components/Icons';

export const MoreScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const theme = useTheme();

  const [modalInforOfAppStatus, setModalInforOfAppStatus] = useState(false);
  const [modalHelpOfAppStatus, setModalHelpOfAppStatus] = useState(false);
  const borderBottomColor = { borderBottomColor: theme['color-primary-default'] };
  const isDarkTheme = useAppSelector(selectThemeType) === 'dark';

  const handleToggleTheme = () => dispatch(toggleThemeType());

  const BellAction = () => {
    return (
      <TopNavigationAction icon={BellIcon} onPress={() => navigation.navigate(ROUTES.notice)} />
    );
  };
  const createLogoutAlert = () =>
    Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất', [
      { text: 'Có', onPress: () => dispatch(fetchLogout(null)) },
      {
        text: 'Không',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel'
      }
    ]);
  const ModalInforOfAppComponents = () => {
    return (
      <Modal
        visible={modalInforOfAppStatus}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setModalInforOfAppStatus(false)}
      >
        <Card>
          <Text>Name: Project management</Text>
          <Text>Version: 1.0</Text>
        </Card>
      </Modal>
    );
  };
  const ModalHelpOfAppComponents = () => {
    return (
      <Modal
        visible={modalHelpOfAppStatus}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setModalHelpOfAppStatus(false)}
      >
        <Card>
          <Layout style={{ alignItems: 'center' }}>
            <Text>Product of 411 Lib Team- HUST</Text>
          </Layout>
          <Text>Contact: daobakhanhbk@gmail.com</Text>
        </Card>
      </Modal>
    );
  };
  return (
    <Layout style={{ flex: 1 }}>
      <TopNavigation title="More" alignment="center" accessoryRight={BellAction} />
      <Divider />
      <Layout style={styles.container}>
        {/* <Divider /> */}
        <Pressable
          onPress={handleToggleTheme}
          style={[styles.item, styles.toggleLayout, borderBottomColor]}
        >
          <Text style={styles.text}>Appearance</Text>
          <Toggle
            style={styles.toggle}
            checked={isDarkTheme}
            onChange={handleToggleTheme}
            status="primary"
          >
            {isDarkTheme ? 'Dark mode' : 'Light mode'}
          </Toggle>
        </Pressable>
        <TouchableOpacity
          style={[styles.item, borderBottomColor]}
          onPress={() => {
            // navigation.navigate(ROUTES.about);
            setModalInforOfAppStatus(true);
          }}
        >
          <Text style={styles.text}>Information</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.item, borderBottomColor]}
          onPress={() => {
            setModalHelpOfAppStatus(true);
            // navigation.navigate(ROUTES.about);
          }}
        >
          <Text style={styles.text}>Help</Text>
        </TouchableOpacity>

        <Pressable style={[styles.item, borderBottomColor]} onPress={createLogoutAlert}>
          <Text style={styles.text}>Sign out</Text>
        </Pressable>
        <ModalInforOfAppComponents />
        <ModalHelpOfAppComponents />
      </Layout>
    </Layout>
  );
};
const styles = StyleService.create({
  container: {
    flex: 1,
    paddingHorizontal: 20
  },
  item: {
    width: '100%',
    height: 70,
    borderBottomWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: 15
  },
  toggleLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  toggle: {
    width: 100
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold'
  }
});
