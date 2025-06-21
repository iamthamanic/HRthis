import React from 'react';
import { Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuthStore } from '../state/auth';

// Screens
import { LoginScreen } from '../screens/LoginScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { RequestLeaveScreen } from '../screens/RequestLeaveScreen';
import { TimeRecordsScreen } from '../screens/TimeRecordsScreen';
import { MyRequestsScreen } from '../screens/MyRequestsScreen';
import { DocumentsScreen } from '../screens/DocumentsScreen';
import { SickLeaveScreen } from '../screens/SickLeaveScreen';
import { CalendarScreen } from '../screens/CalendarScreen';
import { BenefitsScreen } from '../screens/BenefitsScreen';
import { CoinHistoryScreen } from '../screens/CoinHistoryScreen';
import { AdminCoinsScreen } from '../screens/AdminCoinsScreen';
import { TrainingOverviewScreen } from '../screens/TrainingOverviewScreen';
import { CreateTrainingScreen } from '../screens/CreateTrainingScreen';
import { TrainingDetailsScreen } from '../screens/TrainingDetailsScreen';
import { TakeLessonScreen } from '../screens/TakeLessonScreen';
import { TrainingManagementScreen } from '../screens/TrainingManagementScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          paddingTop: 8,
          paddingBottom: 8,
          height: 88,
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#6b7280',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Übersicht',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name="MyRequests"
        component={MyRequestsScreen}
        options={{
          title: 'Anträge',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>📝</Text>
          ),
        }}
      />
      <Tab.Screen
        name="TimeRecords"
        component={TimeRecordsScreen}
        options={{
          title: 'Zeiten',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>⏰</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          title: 'Kalender',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>📅</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Training"
        component={TrainingOverviewScreen}
        options={{
          title: 'Schulungen',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>📘</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Benefits"
        component={BenefitsScreen}
        options={{
          title: 'Benefits',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>🎁</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Documents"
        component={DocumentsScreen}
        options={{
          title: 'Dokumente',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>📄</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen 
            name="RequestLeave" 
            component={RequestLeaveScreen}
            options={{
              presentation: 'modal',
            }}
          />
          <Stack.Screen 
            name="SickLeave" 
            component={SickLeaveScreen}
            options={{
              presentation: 'modal',
            }}
          />
          <Stack.Screen 
            name="CoinHistory" 
            component={CoinHistoryScreen}
          />
          <Stack.Screen 
            name="AdminCoins" 
            component={AdminCoinsScreen}
          />
          <Stack.Screen 
            name="CreateTraining" 
            component={CreateTrainingScreen}
            options={{
              presentation: 'modal',
            }}
          />
          <Stack.Screen 
            name="TrainingDetails" 
            component={TrainingDetailsScreen}
          />
          <Stack.Screen 
            name="TakeLesson" 
            component={TakeLessonScreen}
          />
          <Stack.Screen 
            name="TrainingManagement" 
            component={TrainingManagementScreen}
          />

        </>
      )}
    </Stack.Navigator>
  );
};