import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import {useAuthStore} from '../store/authStore';

// Auth Screens
import LoginScreen from '../screens/common/LoginScreen';
import SignupScreen from '../screens/common/SignupScreen';

// Patient Screens
import PatientHomeScreen from '../screens/patient/PatientHomeScreen';
import ProviderDirectoryScreen from '../screens/patient/ProviderDirectoryScreen';
import PatientAppointmentsScreen from '../screens/patient/PatientAppointmentsScreen';
import PatientMessagesScreen from '../screens/patient/PatientMessagesScreen';
import HealthTrackerScreen from '../screens/patient/HealthTrackerScreen';
import SelfHelpToolsScreen from '../screens/patient/SelfHelpToolsScreen';
import EmergencyProtocolScreen from '../screens/patient/EmergencyProtocolScreen';

// Provider Screens
import ProviderDashboardScreen from '../screens/provider/ProviderDashboardScreen';
import ProviderPatientsScreen from '../screens/provider/ProviderPatientsScreen';
import PatientDetailsScreen from '../screens/provider/PatientDetailsScreen';
import ProviderMessagesScreen from '../screens/provider/ProviderMessagesScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function PatientTabs() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName: string = 'home';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Providers') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Appointments') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Messages') {
            iconName = focused ? 'mail' : 'mail-outline';
          } else if (route.name === 'Tracker') {
            iconName = focused ? 'heart' : 'heart-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1E40AF',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#1E40AF',
        },
        headerTintColor: '#fff',
      })}>
      <Tab.Screen name="Home" component={PatientHomeScreen} />
      <Tab.Screen name="Providers" component={ProviderDirectoryScreen} />
      <Tab.Screen name="Appointments" component={PatientAppointmentsScreen} />
      <Tab.Screen name="Messages" component={PatientMessagesScreen} />
      <Tab.Screen name="Tracker" component={HealthTrackerScreen} />
    </Tab.Navigator>
  );
}

function ProviderTabs() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName: string = 'home';

          if (route.name === 'Dashboard') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Patients') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Messages') {
            iconName = focused ? 'mail' : 'mail-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1E40AF',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#1E40AF',
        },
        headerTintColor: '#fff',
      })}>
      <Tab.Screen name="Dashboard" component={ProviderDashboardScreen} />
      <Tab.Screen name="Patients" component={ProviderPatientsScreen} />
      <Tab.Screen name="Messages" component={ProviderMessagesScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const {isAuthenticated, profile} = useAuthStore();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        ) : profile?.role === 'patient' ? (
          <>
            <Stack.Screen name="PatientTabs" component={PatientTabs} />
            <Stack.Screen
              name="SelfHelpTools"
              component={SelfHelpToolsScreen}
              options={{headerShown: true, title: 'Self-Help Tools'}}
            />
            <Stack.Screen
              name="EmergencyProtocol"
              component={EmergencyProtocolScreen}
              options={{headerShown: true, title: 'Emergency Resources'}}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="ProviderTabs" component={ProviderTabs} />
            <Stack.Screen
              name="PatientDetails"
              component={PatientDetailsScreen}
              options={{headerShown: true, title: 'Patient Details'}}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
