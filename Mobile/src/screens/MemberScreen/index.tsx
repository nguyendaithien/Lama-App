import React, { useEffect, useState } from 'react';
import {
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
  Divider,
  Input,
  Modal,
  Card,
  Button,
  IndexPath,
  Select,
  SelectItem
} from '@ui-kitten/components';
import { StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { BellIcon, FilterIcon, PlusIcon, SearchIcon } from '@src/components/Icons';
import { ROUTES } from '@src/navigations/routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, RootStackParamListPassID } from '@src/navigations/Navigation';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@src/hooks/reduxHooks';
import { MemberCard } from '@src/components/Member';
import { fetchGetUsers } from '@src/features/user/userSlice';

//data show filter
const sortOption = [
  'No',
  'Oldest user',
  'Newest user',
  'First name from A to Z',
  'First name from Z to A'
];
const statusOption = ['No', 'Only active users', 'Only inactive users'];

export const MemberScreen = () => {
  const navigationPassID = useNavigation<NativeStackNavigationProp<RootStackParamListPassID>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();

  //redux state
  const isLoading = useAppSelector(state => state.user.isFetchingGetUsers);
  const users = useAppSelector(state => state.user.users);

  //SCREEN STATE

  //state query
  const page = 1;
  const limit = 100;
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<number | null>(null);
  const [status, setStatus] = useState<number | null>(null);

  //filter state
  const [filterVisible, setFilterVisible] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [selectedIndexFilterSort, setSelectedIndexFilterSort] = useState(new IndexPath(0));
  const [selectedIndexFilterStatus, setSelectedIndexFilterStatus] = useState(new IndexPath(0));
  const [visible, setVisible] = useState(false);

  //
  useEffect(() => {
    dispatch(fetchGetUsers({ page: 1, limit: 100, search, sort: null, status: null }));
  }, [dispatch, search]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    dispatch(fetchGetUsers({ page, limit, search, sort, status }));
    !isLoading && setRefreshing(false);
  }, [dispatch, page, limit, search, sort, status, isLoading]);

  //funct handle
  const handleAccessDetail = (idOfDetail: number) => {
    navigationPassID.navigate(ROUTES.memberDetail, { id: idOfDetail });
  };

  const toggleFilter = () => {
    setFilterVisible(!filterVisible);
  };
  const displayValueSortFilter = sortOption[selectedIndexFilterSort.row];
  const displayValueStatusFilter = statusOption[selectedIndexFilterStatus.row];

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
          dispatch(fetchGetUsers({ page, limit, search, sort, status }));
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
          setVisible(true);
        }}
      >
        <FilterIcon fill="grey" style={styles.icon} />
      </TouchableOpacity>
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
          <FilterIconAction />
        </Layout>
        <Modal
          visible={visible}
          backdropStyle={styles.backdrop}
          onBackdropPress={() => setVisible(false)}
        >
          <Card disabled={true} style={{ width: 350 }}>
            <Text category={'h6'} style={{ fontStyle: 'italic' }}>
              Sort
            </Text>
            <Select
              style={{ marginBottom: 10 }}
              value={displayValueSortFilter}
              selectedIndex={selectedIndexFilterSort}
              onSelect={index => {
                const indexSelect = index as IndexPath;
                console.log(index);
                setSelectedIndexFilterSort(indexSelect);
                setSort(indexSelect.row);
              }}
            >
              {sortOption.map((item, index) => {
                return <SelectItem title={item} key={index} />;
              })}
            </Select>
            <Text category={'h6'} style={{ fontStyle: 'italic' }}>
              Status
            </Text>
            <Select
              style={{ marginBottom: 10 }}
              selectedIndex={selectedIndexFilterStatus}
              value={displayValueStatusFilter}
              onSelect={index => {
                const indexSelect = index as IndexPath;
                setSelectedIndexFilterStatus(indexSelect);
                setStatus(indexSelect.row);
              }}
            >
              {statusOption.map((item, index) => {
                return <SelectItem title={item} key={index} />;
              })}
            </Select>

            <Button
              style={{ marginTop: 5 }}
              onPress={() => {
                setVisible(false);
                dispatch(fetchGetUsers({ page, limit, search, sort, status }));
              }}
            >
              SUBMIT
            </Button>
          </Card>
        </Modal>
      </Layout>
      <Layout style={{ height: '70%', paddingHorizontal: 15 }}>
        <ScrollView
          contentContainerStyle={styles.teamList}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {users?.length ? (
            users.map((item, index) => {
              return <MemberCard key={index} Data={item} onPress={handleAccessDetail} />;
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
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  }
});
