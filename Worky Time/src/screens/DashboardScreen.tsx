import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../state/auth';
import { useLeavesStore } from '../state/leaves';
import { useTimeRecordsStore } from '../state/timeRecords';
import { useCoinsStore } from '../state/coins';
import { useTrainingStore } from '../state/training';

export const DashboardScreen = () => {
  const navigation = useNavigation();
  const { user, organization, logout } = useAuthStore();
  const { getVacationBalance } = useLeavesStore();
  const { getTimeRecords } = useTimeRecordsStore();
  const { getUserCoins } = useCoinsStore();
  const { getTrainingsForUser, getUserProgress } = useTrainingStore();

  const vacationBalance = user ? getVacationBalance(user.id) : null;
  const userCoins = user ? getUserCoins(user.id) : null;
  const todayRecords = user ? getTimeRecords(user.id).filter(record => 
    record.date === new Date().toISOString().split('T')[0]
  ) : [];
  const userTrainings = user ? getTrainingsForUser(user.id) : [];

  const todayRecord = todayRecords[0];
  
  // Calculate training stats
  const pendingTrainings = user ? userTrainings.filter(training => {
    const progress = getUserProgress(user.id, training.id);
    return !progress || progress.status === 'NOT_STARTED' || progress.status === 'IN_PROGRESS';
  }).length : 0;

  const quickActions = [
    {
      title: 'Urlaub beantragen',
      description: 'Neuen Urlaubsantrag stellen',
      icon: '🏖️',
      onPress: () => (navigation as any).navigate('RequestLeave')
    },
    {
      title: 'Krankmeldung',
      description: 'Krankheit melden',
      icon: '🏥',
      onPress: () => (navigation as any).navigate('SickLeave')
    },
    {
      title: 'Team Kalender',
      description: 'Urlaubs- & Krankheitszeiten',
      icon: '📅',
      onPress: () => (navigation as any).navigate('Calendar')
    },
    {
      title: 'Schulungen',
      description: 'Weiterbildungen & Trainings',
      icon: '📘',
      onPress: () => (navigation as any).navigate('Training')
    },
    {
      title: 'Arbeitszeiten',
      description: 'Zeiterfassung einsehen',
      icon: '⏰',
      onPress: () => (navigation as any).navigate('TimeRecords')
    }
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4 py-6">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-2xl font-bold text-gray-900">
              Hallo, {user?.name?.split(' ')[0]}!
            </Text>
            <Text className="text-gray-600">
              {organization?.name}
            </Text>
          </View>
          <Pressable 
            onPress={logout}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            <Text className="text-gray-700">Abmelden</Text>
          </Pressable>
        </View>

        {/* Quick Stats */}
        <View className="flex-row flex-wrap gap-3 mb-6">
          <View className="flex-1 min-w-0 bg-white p-4 rounded-xl shadow-sm">
            <Text className="text-sm text-gray-500 mb-1">Urlaubstage</Text>
            <Text className="text-xl font-bold text-blue-600">
              {vacationBalance?.remainingDays || 0}
            </Text>
            <Text className="text-xs text-gray-500">
              von {vacationBalance?.totalDays || 0}
            </Text>
          </View>
          
          <View className="flex-1 min-w-0 bg-white p-4 rounded-xl shadow-sm">
            <Text className="text-sm text-gray-500 mb-1">Coins</Text>
            <Text className="text-xl font-bold text-yellow-600">
              🪙 {userCoins?.availableCoins || 0}
            </Text>
            <Text className="text-xs text-gray-500">
              Verfügbar
            </Text>
          </View>
          
          <View className="flex-1 min-w-0 bg-white p-4 rounded-xl shadow-sm">
            <Text className="text-sm text-gray-500 mb-1">Schulungen</Text>
            <Text className="text-xl font-bold text-purple-600">
              📘 {pendingTrainings}
            </Text>
            <Text className="text-xs text-gray-500">
              Offen
            </Text>
          </View>
          
          <View className="flex-1 min-w-0 bg-white p-4 rounded-xl shadow-sm">
            <Text className="text-sm text-gray-500 mb-1">Heute</Text>
            <Text className="text-xl font-bold text-green-600">
              {todayRecord ? `${todayRecord.totalHours}h` : '-'}
            </Text>
            <Text className="text-xs text-gray-500">
              Arbeitszeit
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <Text className="text-lg font-semibold text-gray-900 mb-4">
          Schnellzugriff
        </Text>
        
        <View className="space-y-3">
          {quickActions.map((action, index) => (
            <Pressable
              key={index}
              onPress={action.onPress}
              className="bg-white p-4 rounded-xl shadow-sm flex-row items-center"
            >
              <View className="w-12 h-12 bg-blue-50 rounded-lg items-center justify-center mr-4">
                <Text className="text-2xl">{action.icon}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900">
                  {action.title}
                </Text>
                <Text className="text-sm text-gray-500">
                  {action.description}
                </Text>
              </View>
              <Text className="text-gray-400 text-lg">›</Text>
            </Pressable>
          ))}
        </View>

        {/* Admin Panel */}
        {(user?.role === 'ADMIN' || user?.role === 'SUPERADMIN') && (
          <View className="mt-6 space-y-3">
            <View className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <Text className="text-orange-800 font-medium text-center">
                👑 HR-Administrator
              </Text>
            </View>
            
            <Pressable
              onPress={() => (navigation as any).navigate('AdminCoins')}
              className="bg-white p-4 rounded-xl shadow-sm flex-row items-center"
            >
              <View className="w-12 h-12 bg-orange-50 rounded-lg items-center justify-center mr-4">
                <Text className="text-2xl">🏆</Text>
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900">
                  Coin Verwaltung
                </Text>
                <Text className="text-sm text-gray-500">
                  Coins verteilen & Anträge bearbeiten
                </Text>
              </View>
              <Text className="text-gray-400 text-lg">›</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};