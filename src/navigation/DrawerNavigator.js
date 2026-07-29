import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/FamilyScreen';
import BottomTabNavigator from './BottomTabNavigator';
import OrderScreen from '../screens/OrderScreen';
import BrowseScreen from '../screens/BrowseScreen';
import FamilyScreen from '../screens/FamilyScreen';
import StoreScreen from '../screens/StoreScreen';

import CustomDrawer from '../screens/CustomDrawer';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      id="drawer"
      screenOptions={{
        drawerStyle: {
          height: '85%',
          alignContent: 'center',
          marginTop: 50,
          marginBottom: 20,
          borderRadius: 10,
        },
      }}
    >
      <Drawer.Screen
        name="Tabs"
        component={BottomTabNavigator}
        options={{ headerShown: false, drawerLabel: 'Home' }}
      />
      <Drawer.Screen
        name="Browse"
        component={BrowseScreen}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="Family"
        component={FamilyScreen}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="Orders"
        component={OrderScreen}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="Store"
        component={StoreScreen}
        options={{ headerShown: false }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
