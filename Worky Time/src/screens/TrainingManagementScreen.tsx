import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../state/auth';
import { useTrainingStore } from '../state/training';
import { Training } from '../types/training';
import { cn } from '../utils/cn';

export const TrainingManagementScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const { trainings, getTrainingStatistics } = useTrainingStore();
  
  const [selectedTab, setSelectedTab] = useState<'overview' | 'statistics'>('overview');

  const getCategoryIcon = (category: Training['category']) => {
    switch (category) {
      case 'ONBOARDING':
        return '👋';
      case 'COMPLIANCE':
        return '⚖️';
      case 'SKILLS':
        return '💡';
      case 'SAFETY':
        return '🛡️';
      default:
        return '📚';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE');
  };

  if (user?.role !== 'ADMIN' && user?.role !== 'SUPERADMIN') {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <Text className="text-4xl mb-4">🚫</Text>
        <Text className="text-lg font-semibold text-gray-900 mb-2">
          Zugang verweigert
        </Text>
        <Text className="text-gray-600 text-center px-8 mb-4">
          Diese Funktion ist nur für Administratoren verfügbar.
        </Text>
        <Pressable 
          onPress={() => navigation.goBack()}
          className="bg-blue-600 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-medium">Zurück</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4 py-6">
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center">
            <Pressable onPress={() => navigation.goBack()} className="mr-4">
              <Text className="text-blue-600 text-lg">‹ Zurück</Text>
            </Pressable>
            <Text className="text-xl font-bold text-gray-900">
              Schulungs-Management
            </Text>
          </View>
          <Pressable 
            onPress={() => (navigation as any).navigate('CreateTraining')}
            className="bg-blue-600 px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-medium">+ Neu</Text>
          </Pressable>
        </View>

        {/* Admin Badge */}
        <View className="bg-orange-100 border border-orange-200 rounded-lg p-3 mb-6">
          <Text className="text-orange-800 font-medium text-center">
            👑 Administrator Panel
          </Text>
        </View>

        {/* Tab Navigation */}
        <View className="flex-row bg-white rounded-lg p-1 mb-6 shadow-sm">
          <Pressable
            onPress={() => setSelectedTab('overview')}
            className={cn(
              "flex-1 py-3 px-4 rounded-md",
              selectedTab === 'overview' ? "bg-blue-500" : "bg-transparent"
            )}
          >
            <Text className={cn(
              "text-center font-medium",
              selectedTab === 'overview' ? "text-white" : "text-gray-700"
            )}>
              Übersicht
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setSelectedTab('statistics')}
            className={cn(
              "flex-1 py-3 px-4 rounded-md",
              selectedTab === 'statistics' ? "bg-blue-500" : "bg-transparent"
            )}
          >
            <Text className={cn(
              "text-center font-medium",
              selectedTab === 'statistics' ? "text-white" : "text-gray-700"
            )}>
              Statistiken
            </Text>
          </Pressable>
        </View>

        {selectedTab === 'overview' ? (
          /* Training Overview */
          <View className="space-y-4">
            <Text className="text-lg font-semibold text-gray-900">
              📚 Alle Schulungen ({trainings.length})
            </Text>
            
            {trainings.map((training) => (
              <Pressable
                key={training.id}
                onPress={() => (navigation as any).navigate('TrainingDetails', { trainingId: training.id })}
                className="bg-white rounded-xl p-4 shadow-sm"
              >
                <View className="flex-row items-start justify-between mb-3">
                  <View className="flex-1">
                    <View className="flex-row items-center mb-2">
                      <Text className="text-2xl mr-3">
                        {getCategoryIcon(training.category)}
                      </Text>
                      <View className="flex-1">
                        <Text className="text-lg font-semibold text-gray-900">
                          {training.title}
                        </Text>
                        <Text className="text-sm text-gray-500">
                          Erstellt am {formatDate(training.createdAt)}
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  <View className="items-end">
                    <View className={cn(
                      "px-2 py-1 rounded-full mb-1",
                      training.isActive ? "bg-green-100" : "bg-gray-100"
                    )}>
                      <Text className={cn(
                        "text-xs font-medium",
                        training.isActive ? "text-green-800" : "text-gray-800"
                      )}>
                        {training.isActive ? 'Aktiv' : 'Inaktiv'}
                      </Text>
                    </View>
                    
                    {training.isMandatory && (
                      <View className="bg-orange-100 px-2 py-1 rounded-full">
                        <Text className="text-xs font-medium text-orange-800">
                          Pflicht
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                
                <Text className="text-gray-600 mb-3 leading-5">
                  {training.description}
                </Text>
                
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-gray-500">
                    🎯 {training.targetAudience === 'ALL' ? 'Alle Mitarbeiter' : 
                        training.targetAudience === 'DEPARTMENT' ? 'Bestimmte Abteilungen' : 
                        'Einzelne Personen'}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    ⏱️ {training.estimatedDuration} Min.
                  </Text>
                </View>
              </Pressable>
            ))}
            
            {trainings.length === 0 && (
              <View className="bg-white rounded-xl p-8 items-center shadow-sm">
                <Text className="text-4xl mb-4">📚</Text>
                <Text className="text-lg font-semibold text-gray-900 mb-2">
                  Keine Schulungen vorhanden
                </Text>
                <Text className="text-gray-600 text-center mb-4">
                  Erstellen Sie die erste Schulung für Ihr Team.
                </Text>
                <Pressable 
                  onPress={() => (navigation as any).navigate('CreateTraining')}
                  className="bg-blue-600 px-6 py-3 rounded-lg"
                >
                  <Text className="text-white font-medium">Erste Schulung erstellen</Text>
                </Pressable>
              </View>
            )}
          </View>
        ) : (
          /* Statistics View */
          <View className="space-y-4">
            <Text className="text-lg font-semibold text-gray-900">
              📊 Schulungsstatistiken
            </Text>
            
            {trainings.map((training) => {
              const stats = getTrainingStatistics(training.id);
              const completionRate = stats.totalUsers > 0 ? 
                Math.round((stats.completed / stats.totalUsers) * 100) : 0;
              
              return (
                <View key={training.id} className="bg-white rounded-xl p-4 shadow-sm">
                  <View className="flex-row items-center mb-4">
                    <Text className="text-2xl mr-3">
                      {getCategoryIcon(training.category)}
                    </Text>
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-gray-900">
                        {training.title}
                      </Text>
                      <Text className="text-sm text-gray-500">
                        Abschlussrate: {completionRate}%
                      </Text>
                    </View>
                  </View>
                  
                  {/* Progress Bar */}
                  <View className="mb-4">
                    <View className="h-2 bg-gray-200 rounded-full">
                      <View 
                        className="h-2 bg-green-500 rounded-full"
                        style={{ width: `${completionRate}%` }}
                      />
                    </View>
                  </View>
                  
                  {/* Statistics Grid */}
                  <View className="flex-row flex-wrap gap-3">
                    <View className="flex-1 min-w-0 p-3 bg-gray-50 rounded-lg">
                      <Text className="text-sm text-gray-500">Teilnehmer</Text>
                      <Text className="text-lg font-bold text-gray-900">
                        {stats.totalUsers}
                      </Text>
                    </View>
                    
                    <View className="flex-1 min-w-0 p-3 bg-green-50 rounded-lg">
                      <Text className="text-sm text-gray-500">Abgeschlossen</Text>
                      <Text className="text-lg font-bold text-green-600">
                        {stats.completed}
                      </Text>
                    </View>
                    
                    <View className="flex-1 min-w-0 p-3 bg-blue-50 rounded-lg">
                      <Text className="text-sm text-gray-500">In Bearbeitung</Text>
                      <Text className="text-lg font-bold text-blue-600">
                        {stats.inProgress}
                      </Text>
                    </View>
                    
                    <View className="flex-1 min-w-0 p-3 bg-orange-50 rounded-lg">
                      <Text className="text-sm text-gray-500">Nicht begonnen</Text>
                      <Text className="text-lg font-bold text-orange-600">
                        {stats.notStarted}
                      </Text>
                    </View>
                  </View>
                  
                  {stats.averageScore > 0 && (
                    <View className="mt-3 p-3 bg-purple-50 rounded-lg">
                      <Text className="text-sm text-gray-500">Durchschnittsnote</Text>
                      <Text className="text-lg font-bold text-purple-600">
                        {Math.round(stats.averageScore)}%
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
            
            {trainings.length === 0 && (
              <View className="bg-white rounded-xl p-8 items-center shadow-sm">
                <Text className="text-4xl mb-4">📊</Text>
                <Text className="text-lg font-semibold text-gray-900 mb-2">
                  Keine Statistiken verfügbar
                </Text>
                <Text className="text-gray-600 text-center">
                  Erstellen Sie Schulungen, um Statistiken zu sehen.
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};