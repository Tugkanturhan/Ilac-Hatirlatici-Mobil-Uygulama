//MainMenu.js

import React from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity // <-- Added TouchableOpacity here
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function MainMenuScreen({ navigation }) {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/*
          Using `StatusBar.currentHeight` can help handle the status bar height
          differently across Android and iOS if needed, though SafeAreaView
          often manages this for you.
        */}
        <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />

        {/* Top Bar */}
        <View style={styles.topbar}>
          {/* Logo/Icon on the left */}
          <TouchableOpacity style={styles.topbarLogo}>
            <Ionicons name="medical" size={28} color="white" />
          </TouchableOpacity>

          {/* Title in the center */}
          <View style={styles.topbarTitle}>
            <Text style={styles.titleText}>İlaç Takip</Text>
          </View>

          {/* Settings icon on the right */}
          <TouchableOpacity style={styles.topbarSettings}>
            <Ionicons name="settings" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Content Area */}
        <View style={styles.content}>
          {/* Picture/Summary Container */}
          <View style={styles.pictureContainer}>
            <Ionicons name="calendar" size={50} color="#4CAF50" />
            <Text style={styles.pictureText}>Bugün 3 İlacınız Var</Text>
          </View>

          {/* Upcoming Alarms Section */}
          <View style={styles.upcomingAlarms}> {/* Renamed for consistency */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Yaklaşan Alarmlar</Text>
              <TouchableOpacity>
                <Text style={styles.seeAll}>Tümünü Gör</Text>
              </TouchableOpacity>
            </View>

            {/* Sample alarm items */}
            <View style={styles.alarmItem}>
              <Ionicons name="alarm" size={24} color="#4CAF50" />
              <View style={styles.alarmDetails}>
                <Text style={styles.alarmMedicine}>Parol 500 mg</Text>
                <Text style={styles.alarmTime}>08:00</Text>
              </View>
            </View>

            <View style={styles.alarmItem}>
              <Ionicons name="alarm" size={24} color="#4CAF50" />
              <View style={styles.alarmDetails}>
                <Text style={styles.alarmMedicine}>Aferin Fort</Text>
                <Text style={styles.alarmTime}>13:30</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bottom Bar */}
        <View style={styles.bottomBar}>
          {/* Alarms Button */}
          <TouchableOpacity
            style={styles.bottomButton}
            onPress={() => navigation.navigate('AlarmList') }
          >
            <Ionicons name="list" size={28} color="white" />
            <Text style={styles.buttonLabel}>Alarmlar</Text>
          </TouchableOpacity>

          {/* Add Button */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddAlarm')}
          >
            <Ionicons name="add" size={40} color="white" />
          </TouchableOpacity>

          {/* History Button */}
          <TouchableOpacity style={styles.bottomButton}>
            <MaterialIcons name="history" size={28} color="white" />
            <Text style={styles.buttonLabel}>Geçmiş</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  topbar: {
    height: 80, // A fixed height
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    elevation: 4, // Android shadow
    paddingTop: 10, // Adjust for StatusBar if needed, SafeAreaView usually handles this
    // iOS shadow properties
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  topbarLogo: {
    width: 50,
    height: 50,
    backgroundColor: '#388E3C',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topbarTitle: {
    flex: 1, // Takes up available space
    marginHorizontal: 15,
    alignItems: 'center',
  },
  titleText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  topbarSettings: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1, // Takes up remaining space
    padding: 20,
  },
  pictureContainer: { // Renamed for consistency
    height: 180,
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  pictureText: {
    marginTop: 10,
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: '500',
  },
  upcomingAlarms: { // Renamed for consistency
    flex: 1, // Takes up remaining space within content
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAll: {
    color: '#4CAF50',
    fontSize: 14,
  },
  alarmItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  alarmDetails: {
    marginLeft: 15,
  },
  alarmMedicine: {
    fontSize: 16,
    color: '#333',
  },
  alarmTime: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },
  bottomBar: {
    height: 80, // A fixed height
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0', // Lighter border for better contrast
    // iOS shadow properties for the bottom bar
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 }, // Shadow going upwards
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Android shadow
  },
  bottomButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70, // Fixed width for consistent button size
  },
  buttonLabel: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
  },
  addButton: {
    width: 70,
    height: 70,
    borderRadius: 35, // Half of width/height for a perfect circle
    backgroundColor: '#388E3C', // A slightly darker green for distinction
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30, // Pushes it up from the bottom bar
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

/*

import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './View/LoginScreen';
import SignUpScreen from './View/SingUpScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SingUp" component={SignUpScreen} />
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


*/