import React from 'react';
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
  UnActiveIcon,
  TeamIcon
} from '@src/components/Icons';
import { StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { teamlist } from '@src/_mocks/teamList';
import { TeamInfor } from '@src/components/TeamInfor';
import { useAppSelector } from '@src/hooks/reduxHooks';

export const TeamScreen = () => {
  const navigationPassID = useNavigation<NativeStackNavigationProp<RootStackParamListPassID>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  //root state
  // const teams = useAppSelector();
  //screen state
  const [search, setSearch] = React.useState('');
  const [filterVisible, setFilterVisible] = React.useState(false);

  //funt handle
  const handleAccessDetail = (idOfDetail: number) => {
    navigationPassID.navigate(ROUTES.teamDetail, { id: idOfDetail });
  };

  const toggleFilter = () => {
    setFilterVisible(!filterVisible);
  };

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
          console.log('hello');
          setSearch('');
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
            Number of Teams: {`${teamlist.length}`}
          </Text>
          <RenderRightActions />
        </Layout>
      </Layout>
      <Layout style={{ height: '70%', paddingHorizontal: 15 }}>
        <ScrollView contentContainerStyle={styles.teamList}>
          {teamlist.map((item, index) => {
            return (
              <TeamInfor
                Icon={<TeamIcon fill={'grey'} style={{ height: 25, width: 25, marginRight: 10 }} />}
                key={index}
                data={item}
                onPress={handleAccessDetail}
              />
            );
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
  }
});
