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
  MenuItem
} from '@ui-kitten/components';
import { StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import {
  BellIcon,
  FilterIcon,
  PlusIcon,
  SearchIcon,
  ActiveIcon,
  UnActiveIcon,
  PersonIcon
} from '@src/components/Icons';
import { ROUTES } from '@src/navigations/routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, RootStackParamListPassID } from '@src/navigations/Navigation';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@src/hooks/reduxHooks';
import { MemberCard } from '@src/components/Member';
import { fetchGetUserInforByID, fetchGetUsers } from '@src/features/user/userSlice';

export const MemberScreen = () => {
  const navigationPassID = useNavigation<NativeStackNavigationProp<RootStackParamListPassID>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();

  //state
  const [filterVisible, setFilterVisible] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [paramGetUsers, setParamGetUsers] = React.useState({
    page: 1,
    limit: 100,
    search: '',
    sort: null,
    status: null
  });
  //state query
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(100);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState(null);
  const [status, setStatus] = useState(null);
  //redux state
  const isLoading = useAppSelector(state => state.user.isFetchingGetUsers);
  const users = useAppSelector(state => state.user.users);

  //
  useEffect(() => {
    dispatch(fetchGetUsers({ page, limit, search, sort, status }));
  }, [dispatch, limit, page, paramGetUsers, search, sort, status]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    dispatch(fetchGetUsers(paramGetUsers));
    !isLoading && setRefreshing(false);
  }, [dispatch, paramGetUsers, isLoading]);
  //
  const handleAccessDetail = (idOfDetail: number) => {
    navigationPassID.navigate(ROUTES.memberDetail, { id: idOfDetail });
  };

  const toggleFilter = () => {
    setFilterVisible(!filterVisible);
  };

  //render Icon Action
  const renderBellAction = () => {
    return (
      <TopNavigationAction icon={BellIcon} onPress={() => navigation.navigate(ROUTES.notice)} />
    );
  };
  const renderSearchIconAction = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          console.log('hello');
          dispatch(fetchGetUsers({ page, limit, search, sort, status }));
          setSearch('');
        }}
      >
        <SearchIcon fill="grey" style={styles.icon} />
      </TouchableOpacity>
    );
  };
  const PlusIconAction = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          console.log('hello');
          setSearch('');
          navigation.navigate(ROUTES.createMember);
        }}
      >
        <PlusIcon fill="grey" style={styles.iconBig} />
      </TouchableOpacity>
    );
  };
  const FilterIconAction = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          toggleFilter();
        }}
      >
        <FilterIcon fill="grey" style={styles.icon} />
      </TouchableOpacity>
    );
  };
  const RenderRightActions = () => {
    return (
      <Layout>
        <OverflowMenu
          anchor={FilterIconAction}
          visible={filterVisible}
          onBackdropPress={toggleFilter}
        >
          <MenuItem accessoryLeft={ActiveIcon} title="Active" />
          <MenuItem accessoryLeft={UnActiveIcon} title="Inactive" />
        </OverflowMenu>
      </Layout>
    );
  };
  return (
    <Layout style={styles.container}>
      <TopNavigation alignment="center" title="Members" accessoryRight={renderBellAction} />
      <Divider />
      <Layout style={styles.searchContainer}>
        <Input
          value={search}
          placeholder="Place your Text"
          accessoryRight={renderSearchIconAction}
          onChangeText={nextValue => setSearch(nextValue)}
        />
        <Layout style={styles.numberTeam_Filter}>
          <Text appearance="hint" style={{ fontStyle: 'italic' }}>
            Number of Members: {`${users?.length ? users?.length : 0}`}
          </Text>
          <RenderRightActions />
        </Layout>
      </Layout>
      <Layout style={{ height: '70%', paddingHorizontal: 15 }}>
        <ScrollView
          contentContainerStyle={styles.teamList}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {users?.length ? (
            users.map((item, index) => {
              return (
                <MemberCard
                  Icon={
                    <PersonIcon fill={'grey'} style={{ height: 25, width: 25, marginRight: 10 }} />
                  }
                  key={index}
                  Data={item}
                  onPress={handleAccessDetail}
                />
              );
            })
          ) : (
            <Text />
          )}
        </ScrollView>
      </Layout>
      <Layout style={styles.plusContainer}>
        <PlusIconAction />
      </Layout>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  }
});
