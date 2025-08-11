import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './View/LoginScreen';
import SignUpScreen from './View/SingUpScreen';
import MainMenuScreen from './View/MainMenu';
import AlarmListScreen from './View/AlarmListScreen';
import AddAlarmScreen from './View/AddAlarm';
import AddFamilyMemberScreen from './View/AddFamilyMember';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="SingUp" component={SignUpScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="MainMenu" component={MainMenuScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="AlarmList" component={AlarmListScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="AddAlarm" component={AddAlarmScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="AddFamilyMember" component={AddFamilyMemberScreen} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

