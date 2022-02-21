import React, { useState, useEffect } from 'react';
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
  Card,
  Button,
  IndexPath,
  Select,
  SelectItem
} from '@ui-kitten/components';
import { StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, RootStackParamListPassID } from '@src/navigations/Navigation';
import { ROUTES } from '@src/navigations/routes';
import {
  BellIcon,
  FilterIcon,
  PlusIcon,
  SearchIcon,
  ActiveIcon,
  UnActiveIcon
} from '@src/components/Icons';
import { TeamInforCard } from '@src/components/Team';
import { useAppSelector, useAppDispatch } from '@src/hooks/reduxHooks';
import { fetchGetTeams } from '@src/features/team/teamSlice';

//data show filter
const sortOption = ['No', 'Oldest team', 'Newest team', 'Name from A to Z', 'Name from Z to A'];
const statusOption = ['No', 'Only active teams', 'Only inactive teams'];

export const TeamScreen = () => {
  const navigationPassID = useNavigation<NativeStackNavigationProp<RootStackParamListPassID>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();

  //ROOT STATE
  const teams = useAppSelector(state => state.team.teams);
  const isFetching = useAppSelector(state => state.team.isFetchingGetTeams);

  //param state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(100);
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
    dispatch(fetchGetTeams({ page: 1, limit: 100, search, sort: null, status: null }));
  }, [dispatch, search]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    dispatch(fetchGetTeams({ page, limit, search, sort, status }));
    !isFetching && setRefreshing(false);
  }, [dispatch, page, limit, search, sort, status, isFetching]);

  //funt handle
  const handleAccessDetail = (idOfDetail: number) => {
    console.log(idOfDetail);
    navigationPassID.navigate(ROUTES.teamDetail, { id: idOfDetail });
  };

  const toggleFilter = () => {
    setFilterVisible(!filterVisible);
  };

  const displayValueSortFilter = sortOption[selectedIndexFilterSort.row];
  const displayValueStatusFilter = statusOption[selectedIndexFilterStatus.row];

  //funt render icon action
  const renderBellAction = () => {
    return (
      <TopNavigationAction icon={BellIcon} onPress={() => navigation.navigate(ROUTES.notice)} />
    );
  };
  const renderSearchIconAction = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          dispatch(fetchGetTeams({ page, limit, search, sort, status }));
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
          navigation.navigate(ROUTES.createTeam);
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
      <TopNavigation alignment="center" title="Teams" accessoryRight={renderBellAction} />
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
            Number of Teams: {`${teams.length}`}
          </Text>
          <FilterIconAction />
        </Layout>
        <Modal
          visible={visible}
          backdropStyle={styles.backdrop}
          onBackdropPress={() => setVisible(false)}
        >
          <Card disabled={true} style={{ width: 350, borderRadius: 10 }}>
            <Text category={'h6'} style={{ fontStyle: 'italic' }}>
              Sort
            </Text>
            <Select
              style={{ marginBottom: 10 }}
              value={displayValueSortFilter}
              selectedIndex={selectedIndexFilterSort}
              onSelect={index => {
                const indexSelect = index as IndexPath;
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
                dispatch(fetchGetTeams({ page, limit, search, sort, status }));
              }}
            >
              SUBMIT
            </Button>
          </Card>
        </Modal>
      </Layout>
      <Layout style={{ height: '70%', paddingHorizontal: 15 }}>
        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={styles.teamList}
        >
          {teams.map((item, index) => {
            return <TeamInforCard key={index} data={item} onPress={handleAccessDetail} />;
          })}
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
