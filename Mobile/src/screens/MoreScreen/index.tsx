import React from 'react';
import { Pressable, SafeAreaView, Alert } from 'react-native';
import {
  Divider,
  Layout,
  StyleService,
  Toggle,
  TopNavigation,
  useStyleSheet,
  useTheme,
  Text,
  TopNavigationAction
} from '@ui-kitten/components';
// import { BackIcon } from '@src/components/Icons';
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
          <Text style={styles.text}>Màu chủ đạo</Text>
          <Toggle
            style={styles.toggle}
            checked={isDarkTheme}
            onChange={handleToggleTheme}
            status="primary"
          >
            {isDarkTheme ? 'Dark mode' : 'Light mode'}
          </Toggle>
        </Pressable>
        <Pressable
          style={[styles.item, borderBottomColor]}
          onPress={() => navigation.navigate(ROUTES.about)}
        >
          <Text style={styles.text}>Thông tin</Text>
        </Pressable>
        <Pressable
          style={[styles.item, borderBottomColor]}
          onPress={() => navigation.navigate(ROUTES.about)}
        >
          <Text style={styles.text}>Liên hệ & Hỗ trợ</Text>
        </Pressable>
        <Pressable
          style={[styles.item, borderBottomColor]}
          onPress={() => navigation.navigate(ROUTES.changePassword)}
        >
          <Text style={styles.text}>Đổi mật khẩu</Text>
        </Pressable>

        <Pressable style={[styles.item, borderBottomColor]} onPress={createLogoutAlert}>
          <Text style={styles.text}>Đăng xuất</Text>
        </Pressable>
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
  text: {
    fontSize: 20,
    fontWeight: 'bold'
  }
});
