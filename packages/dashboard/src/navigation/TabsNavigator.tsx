import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeNavigator from './HomeNavigator';
import CalendarNavigator from './CalendarNavigator';
import StatisticsNavigator from './StatisticsNavigator';
import AccountNavigator from './AccountNavigator';

export type TabsParamList = {
  HomeNavigator: undefined;
  CalendarNavigator: undefined;
  StatisticsNavigator: undefined;
  AccountNavigator: undefined;
};

const Tabs = createBottomTabNavigator<TabsParamList>();

const TabsNavigator = () => {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6750A4',
        tabBarStyle: {backgroundColor: '#F6EDFF'},
      }}>
      <Tabs.Screen
        name="HomeNavigator"
        component={HomeNavigator}
        options={{
          title: 'Home',
          tabBarIcon: ({color, size}) => <Icon name="home" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="CalendarNavigator"
        component={CalendarNavigator}
        options={{
          title: 'Calendar',
          tabBarIcon: ({color, size}) => <Icon name="calendar" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="StatisticsNavigator"
        component={StatisticsNavigator}
        options={{
          title: 'Statistics',
          tabBarIcon: ({color, size}) => <Icon name="chart-box" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="AccountNavigator"
        component={AccountNavigator}
        options={{
          title: 'Account',
          tabBarIcon: ({color, size}) => <Icon name="account" color={color} size={size} />,
        }}
      />
    </Tabs.Navigator>
  );
};

export default TabsNavigator;

