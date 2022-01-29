import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomNavigation, BottomNavigationTab } from '@ui-kitten/components';
import { HomeScreen } from '@src/screens/HomeScreen';
import { ProjectScreen } from '@src/screens/ProjectScreen';
import { TeamScreen } from '@src/screens/TeamScreen';
import { ProfileScreen } from '@src/screens/ProfileScreen';
import { MoreScreen } from '@src/screens/MoreScreen';
import { ROUTES } from './routes';
import { HomeIcon, ProjectIcon, ProfileIcon, TeamIcon, MoreIcon } from '@src/components/Icons';
// const Stack = createNativeStackNavigator();

const BottomStack = createBottomTabNavigator();

// const HomeScreenStack = () => (
//   <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={ROUTES.home}>
//     <Stack.Screen name={ROUTES.home} component={HomeScreen} />
//   </Stack.Navigator>
// );

const BottomTabBar = ({ navigation, state }: any) => (
  <BottomNavigation
    selectedIndex={state.index}
    onSelect={index => navigation.navigate(state.routeNames[index])}
  >
    <BottomNavigationTab title={ROUTES.home} icon={HomeIcon} />
    <BottomNavigationTab title={ROUTES.project} icon={ProjectIcon} />
    <BottomNavigationTab title={ROUTES.team} icon={TeamIcon} />
    <BottomNavigationTab title={ROUTES.profile} icon={ProfileIcon} />
    <BottomNavigationTab title={ROUTES.more} icon={MoreIcon} />
  </BottomNavigation>
);

const routers = [
  { name: ROUTES.home, component: HomeScreen },
  { name: ROUTES.project, component: ProjectScreen },
  { name: ROUTES.team, component: TeamScreen },
  { name: ROUTES.profile, component: ProfileScreen },
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
