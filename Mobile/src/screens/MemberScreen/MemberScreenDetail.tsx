import React, { useEffect, useState, useCallback } from 'react';
import {
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
  Divider,
  useTheme,
  Toggle,
  Avatar
} from '@ui-kitten/components';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamListPassID } from '@src/navigations/Navigation';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StyleSheet, Image, ScrollView, RefreshControl } from 'react-native';
import {
  PhoneIcon,
  // MailIcon,
  LocationIcon,
  TeamIcon,
  SaveIcon,
  BackIcon,
  MessageIcon,
  ClockIcon,
  EditIcon,
  EmailIcon,
  PersonIcon
} from '@src/components/Icons';
import InputText from '@src/components/InputText';
// import { DataInforRender } from '@src/components/Member';
import { useAppDispatch, useAppSelector } from '@src/hooks/reduxHooks';
import {
  fetchChangeStatusUser,
  fetchGetUserInforByID,
  fetchUpdateUser,
  selectUserInfor
} from '@src/features/user/userSlice';

export const MemberDetailScreen = () => {
  const theme = useTheme();
  const navigationPassID = useNavigation<NativeStackNavigationProp<RootStackParamListPassID>>();
  const route = useRoute<RouteProp<RootStackParamListPassID>>();
  const memberID = route.params.id;
  const dispatch = useAppDispatch();

  //rootstate

  const userInfor = useAppSelector(selectUserInfor);
  const isLoadingFetchUserInfor = useAppSelector(state => state.user.isFetchingGetUserInforByID);

  //screen state
  const [refreshing, setRefreshing] = useState(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [firstName, setFirstName] = useState(userInfor?.firstName);
  const [lastName, setLastName] = useState(userInfor?.lastName);
  const [email, setEmail] = useState(userInfor?.email);
  const [phone, setPhone] = useState(userInfor?.phone);
  const [activeStatus, setActiveStatus] = useState(userInfor?.isActive);
  // const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [selectedStatusActive, setSelectedStatusActive] = useState(false);

  const handleSetValueWhenFetch = useCallback(() => {
    setFirstName(userInfor.firstName);
    setLastName(userInfor.lastName);
    setEmail(userInfor.email);
    setPhone(userInfor.phone);
    setActiveStatus(userInfor.isActive);
    // setSelectedIndex(userInfor.isActive ? 0 : 1);
    setSelectedStatusActive(userInfor.isActive ? true : false);
  }, [
    userInfor.email,
    userInfor.firstName,
    userInfor.isActive,
    userInfor.lastName,
    userInfor.phone
  ]);
  const onCheckedChange = (isChecked: boolean) => {
    setSelectedStatusActive(isChecked);
    dispatch(fetchChangeStatusUser({ id: memberID, isActive: isChecked }));
    setActiveStatus(isChecked);
  };
  //
  useEffect(() => {
    dispatch(fetchGetUserInforByID(memberID));
    handleSetValueWhenFetch();
  }, [dispatch, handleSetValueWhenFetch, memberID]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    handleSetValueWhenFetch();
    dispatch(fetchGetUserInforByID(memberID));
    !isLoadingFetchUserInfor && setRefreshing(false);
  }, [dispatch, handleSetValueWhenFetch, isLoadingFetchUserInfor, memberID]);

  //renderIconAction
  const renderEditAction = () => {
    return (
      <TopNavigationAction
        icon={!isEdit ? EditIcon : SaveIcon}
        onPress={() => {
          setIsEdit(!isEdit);
          dispatch(fetchGetUserInforByID(memberID));
          isEdit && dispatch(fetchUpdateUser({ id: memberID, firstName, lastName, email, phone }));
          handleSetValueWhenFetch();
        }}
      />
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
        title="Profile"
        accessoryRight={renderEditAction}
        accessoryLeft={renderBackAction}
      />
      <Divider />
      <Layout style={styles.avatarContainer}>
        <Layout style={styles.avatar}>
          <Avatar
            style={[styles.avatar, { resizeMode: 'contain', borderWidth: 0 }]}
            source={{
              uri: userInfor?.avatar
            }}
          />
        </Layout>
        <Text category="h4">{`${userInfor.firstName} ${userInfor.lastName} - ID: ${userInfor.id}`}</Text>
        <Layout style={{ flexDirection: 'row' }}>
          <LocationIcon fill={theme['color-info-500']} style={styles.icon} />
          <Text status="primary"> Hai Ba Trung, Ha Noi</Text>
        </Layout>
      </Layout>
      <Divider />
      <Layout style={{ height: '60%' }}>
        <ScrollView
          contentContainerStyle={{ justifyContent: 'center' }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <Layout style={{ alignItems: 'center', marginTop: 10 }}>
            <Toggle checked={selectedStatusActive} onChange={onCheckedChange}>
              {`${activeStatus ? 'Active' : 'Inactive'}`}
            </Toggle>
          </Layout>
          {isEdit && (
            <>
              <InputText
                label="Fisrtname: "
                style={styles.input}
                placeholder="Firstname"
                accessoryLeft={PersonIcon}
                value={firstName}
                onChangeText={setFirstName}
                keyboardType="default"
              />
              <InputText
                label="Lastname: "
                style={styles.input}
                placeholder="Lastname"
                accessoryLeft={PersonIcon}
                value={lastName}
                onChangeText={setLastName}
                keyboardType="default"
              />
            </>
          )}

          <InputText
            label="Email: "
            style={styles.input}
            disabled={!isEdit}
            placeholder="Họ tên"
            accessoryLeft={EmailIcon}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <InputText
            label="Phone: "
            style={styles.input}
            disabled={!isEdit}
            placeholder="Phone"
            accessoryLeft={PhoneIcon}
            value={phone}
            onChangeText={setPhone}
            keyboardType="numeric"
          />
          <InputText
            label="Team: "
            style={styles.input}
            disabled={true}
            placeholder="User team"
            accessoryLeft={TeamIcon}
            value={
              userInfor.userTeams?.length
                ? `${userInfor.userTeams![0]?.team?.name}` + ` - (${userInfor.userTeams![0]?.role})`
                : 'Null'
            }
            onChangeText={setPhone}
            keyboardType="numeric"
          />
          <InputText
            label="Created at: "
            style={styles.input}
            disabled={true}
            placeholder="Create at"
            accessoryLeft={ClockIcon}
            value={userInfor?.createdAt?.slice(0, 10)}
            keyboardType="numeric"
          />
        </ScrollView>
      </Layout>
    </Layout>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 10 },
  profileContainer: {},
  avatarContainer: {
    height: 200,
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  avatar: {
    height: 120,
    width: 120,
    borderWidth: 2,
    borderRadius: 70,
    borderColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: { height: 25, width: 25, marginRight: 5 },
  input: {
    borderRadius: 3
  }
});
