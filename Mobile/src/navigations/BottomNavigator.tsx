import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomNavigation, BottomNavigationTab } from '@ui-kitten/components';
import { HomeScreen } from '@src/screens/HomeScreen';
import { ProjectScreen } from '@src/screens/ProjectScreen';
import { ProjectDetailScreen } from '@src/screens/ProjectScreen/ProjectDetailScreen';
import { TeamScreen } from '@src/screens/TeamScreen';
import { TeamDetailScreen } from '@src/screens/TeamScreen/TeamDetailScreen';
import { MemberScreen } from '@src/screens/MemberScreen';
import { MoreScreen } from '@src/screens/MoreScreen';
import { ROUTES } from './routes';
import { HomeIcon, ProjectIcon, PersonIcon, TeamIcon, MoreIcon } from '@src/components/Icons';
import { MemberDetailScreen } from '@src/screens/MemberScreen/MemberScreenDetail';
import { CreateMemberScreen } from '@src/screens/MemberScreen/CreateMemberScreen';

const Stack = createNativeStackNavigator();
const BottomStack = createBottomTabNavigator();

const ProjectScreenStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={ROUTES.project}>
    <Stack.Screen name={ROUTES.project} component={ProjectScreen} />
    <Stack.Screen name={ROUTES.teamDetail} component={ProjectDetailScreen} />
  </Stack.Navigator>
);

const TeamScreenStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={ROUTES.team}>
    <Stack.Screen name={ROUTES.team} component={TeamScreen} />
    <Stack.Screen name={ROUTES.teamDetail} component={TeamDetailScreen} />
  </Stack.Navigator>
);

const MemberScreenStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={ROUTES.member}>
    <Stack.Screen name={ROUTES.member} component={MemberScreen} />
    <Stack.Screen name={ROUTES.memberDetail} component={MemberDetailScreen} />
    <Stack.Screen name={ROUTES.createMember} component={CreateMemberScreen} />
  </Stack.Navigator>
);

const BottomTabBar = ({ navigation, state }: any) => (
  <BottomNavigation
    selectedIndex={state.index}
    onSelect={index => navigation.navigate(state.routeNames[index])}
  >
    <BottomNavigationTab icon={HomeIcon} />
    <BottomNavigationTab icon={ProjectIcon} />
    <BottomNavigationTab icon={TeamIcon} />
    <BottomNavigationTab icon={PersonIcon} />
    <BottomNavigationTab icon={MoreIcon} />
  </BottomNavigation>
);

const routers = [
  { name: ROUTES.home, component: HomeScreen },
  { name: ROUTES.projectStack, component: ProjectScreenStack },
  { name: ROUTES.teamStack, component: TeamScreenStack },
  { name: ROUTES.memberStack, component: MemberScreenStack },
  { name: ROUTES.more, component: MoreScreen }
];

export const BottomNavigator = () => (
  <BottomStack.Navigator
    tabBar={props => <BottomTabBar {...props} />}
    screenOptions={{ headerShown: false }}
  >
    {routers.map((item, index) => (
      <BottomStack.Screen key={item.name} name={item.name} component={item.component} />
    ))}
  </BottomStack.Navigator>
);
