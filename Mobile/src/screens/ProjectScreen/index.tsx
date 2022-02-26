import React, { useEffect, useState } from 'react';
import {
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
  Divider,
  Input,
  Modal,
  Button,
  Select,
  Card,
  IndexPath,
  SelectItem
} from '@ui-kitten/components';
import { StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, RootStackParamListPassID } from '@src/navigations/Navigation';
import { ROUTES } from '@src/navigations/routes';
import { BellIcon, FilterIcon, PlusIcon, SearchIcon } from '@src/components/Icons';
import { ProjectInforCard } from '@src/components/Project';
import { useAppDispatch, useAppSelector } from '@src/hooks/reduxHooks';
import { fetchGetProjects } from '@src/features/project/projectSlice';

//data show filter
const sortOption = [
  'No',
  'Oldest project',
  'Newest project',
  'Name from A to Z',
  'Name from Z to A',
  'Income increase',
  'Income decrease'
];
const statusOption = [
  'No',
  'Only canceled projects',
  'Only in progess projects',
  'Only completed projects'
];

export const ProjectScreen = () => {
  const navigationPassID = useNavigation<NativeStackNavigationProp<RootStackParamListPassID>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();

  //Root state
  const projects = useAppSelector(state => state.project.projects);
  const isFetching = useAppSelector(state => state.project.isFetchingGetProjects);

  //param state
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<number | null>(null);
  const [status, setStatus] = useState<number | null>(null);

  //filter state
  const [filterVisible, setFilterVisible] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [selectedIndexFilterSort, setSelectedIndexFilterSort] = useState(new IndexPath(0));
  const [selectedIndexFilterStatus, setSelectedIndexFilterStatus] = useState(new IndexPath(0));
  const [visibleFilter, setVisibleFilter] = useState(false);

  //funt handle
  const handleAccessDetail = (idOfDetail: number) => {
    console.log(idOfDetail);
    navigationPassID.navigate(ROUTES.projectDetail, { id: idOfDetail });
  };

  const displayValueSortFilter = sortOption[selectedIndexFilterSort.row];
  const displayValueStatusFilter = statusOption[selectedIndexFilterStatus.row];

  const toggleFilter = () => {
    setFilterVisible(!filterVisible);
  };
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
          navigation.navigate(ROUTES.projectCreate);
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
          setVisibleFilter(true);
        }}
      >
        <FilterIcon fill="grey" style={styles.icon} />
      </TouchableOpacity>
    );
  };
  //
  useEffect(() => {
    dispatch(fetchGetProjects({ page: 1, limit: 100, search, sort: null, status: null }));
  }, [dispatch, search]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    dispatch(fetchGetProjects({ page: 1, limit: 100, search, sort: null, status: null }));
    !isFetching && setRefreshing(false);
  }, [dispatch, search, isFetching]);

  return (
    <Layout style={styles.container}>
      <TopNavigation alignment="center" title="Projects" accessoryRight={renderBellAction} />
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
            Number of Projects: {`${projects.length}`}
          </Text>
          <FilterIconAction />
        </Layout>
        <Modal
          visible={visibleFilter}
          backdropStyle={styles.backdrop}
          onBackdropPress={() => setVisibleFilter(false)}
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
                setVisibleFilter(false);
                dispatch(fetchGetProjects({ page: 1, limit: 100, search, sort, status }));
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
          {projects.map((item, index) => {
            return <ProjectInforCard key={index} data={item} onPress={handleAccessDetail} />;
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
