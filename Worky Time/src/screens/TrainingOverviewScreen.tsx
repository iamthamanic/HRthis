import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../state/auth';
import { useTrainingStore } from '../state/training';
import { Training, TrainingProgress } from '../types/training';
import { cn } from '../utils/cn';

export const TrainingOverviewScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const { 
    getTrainingsForUser, 
    getUserProgress, 
    startTraining,
    getTrainingStatistics 
  } = useTrainingStore();
  
  const [userTrainings, setUserTrainings] = useState<Training[]>([]);
  const [progressData, setProgressData] = useState<{ [key: string]: TrainingProgress | undefined }>({});
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'MANDATORY' | 'COMPLETED' | 'PENDING'>('ALL');

  useEffect(() => {
    if (user) {
      const trainings = getTrainingsForUser(user.id);
      setUserTrainings(trainings);
      
      // Load progress for each training
      const progress: { [key: string]: TrainingProgress | undefined } = {};
      trainings.forEach(training => {
        progress[training.id] = getUserProgress(user.id, training.id);
      });
      setProgressData(progress);
    }
  }, [user, getTrainingsForUser, getUserProgress]);

  const getStatusColor = (status?: TrainingProgress['status']) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status?: TrainingProgress['status']) => {
    switch (status) {
      case 'COMPLETED':
        return 'Abgeschlossen';
      case 'IN_PROGRESS':
        return 'In Bearbeitung';
      case 'FAILED':
        return 'Nicht bestanden';
      default:
        return 'Nicht begonnen';
    }
  };

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

  const getCategoryText = (category: Training['category']) => {
    switch (category) {
      case 'ONBOARDING':
        return 'Onboarding';
      case 'COMPLIANCE':
        return 'Compliance';
      case 'SKILLS':
        return 'Fähigkeiten';
      case 'SAFETY':
        return 'Sicherheit';
      default:
        return 'Sonstiges';
    }
  };

  const getFilteredTrainings = () => {
    let filtered = userTrainings;
    
    switch (selectedFilter) {
      case 'MANDATORY':
        filtered = userTrainings.filter(t => t.isMandatory);
        break;
      case 'COMPLETED':
        filtered = userTrainings.filter(t => progressData[t.id]?.status === 'COMPLETED');
        break;
      case 'PENDING':
        filtered = userTrainings.filter(t => 
          !progressData[t.id] || 
          progressData[t.id]?.status === 'NOT_STARTED' || 
          progressData[t.id]?.status === 'IN_PROGRESS'
        );
        break;
      default:
        break;
    }
    
    return filtered.sort((a, b) => {
      // Mandatory trainings first
      if (a.isMandatory && !b.isMandatory) return -1;
      if (!a.isMandatory && b.isMandatory) return 1;
      
      // Then by status (not started/in progress first)
      const statusA = progressData[a.id]?.status || 'NOT_STARTED';
      const statusB = progressData[b.id]?.status || 'NOT_STARTED';
      
      if (statusA === 'COMPLETED' && statusB !== 'COMPLETED') return 1;
      if (statusA !== 'COMPLETED' && statusB === 'COMPLETED') return -1;
      
      return 0;
    });
  };

  const handleStartTraining = (training: Training) => {
    if (!user) return;
    
    const progress = progressData[training.id];
    
    if (progress?.status === 'COMPLETED') {
      Alert.alert(
        'Schulung bereits abgeschlossen',
        'Sie haben diese Schulung bereits erfolgreich abgeschlossen.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    if (!progress || progress.status === 'NOT_STARTED') {
      startTraining(user.id, training.id);
    }
    
    (navigation as any).navigate('TrainingDetails', { trainingId: training.id });
  };

  const getProgressPercentage = (training: Training) => {
    const progress = progressData[training.id];
    if (!progress) return 0;
    
    if (progress.status === 'COMPLETED') return 100;
    if (progress.status === 'NOT_STARTED') return 0;
    
    // Calculate based on completed lessons (simplified)
    return Math.min(progress.completedLessons.length * 25, 75); // Max 75% until final completion
  };

  const filteredTrainings = getFilteredTrainings();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4 py-6">
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-xl font-bold text-gray-900">
            📘 Schulungen
          </Text>
          
          {(user?.role === 'ADMIN' || user?.role === 'SUPERADMIN') && (
            <Pressable 
              onPress={() => (navigation as any).navigate('CreateTraining')}
              className="bg-blue-600 px-4 py-2 rounded-lg"
            >
              <Text className="text-white font-medium">+ Neu</Text>
            </Pressable>
          )}
        </View>

        {/* Filter Tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="mb-6"
          contentContainerStyle={{ paddingHorizontal: 4 }}
        >
          {[
            { key: 'ALL', label: 'Alle', count: userTrainings.length },
            { key: 'MANDATORY', label: 'Pflicht', count: userTrainings.filter(t => t.isMandatory).length },
            { key: 'PENDING', label: 'Offen', count: userTrainings.filter(t => 
              !progressData[t.id] || progressData[t.id]?.status !== 'COMPLETED'
            ).length },
            { key: 'COMPLETED', label: 'Abgeschlossen', count: userTrainings.filter(t => 
              progressData[t.id]?.status === 'COMPLETED'
            ).length }
          ].map((filter) => (
            <Pressable
              key={filter.key}
              onPress={() => setSelectedFilter(filter.key as any)}
              className={cn(
                "mr-3 px-4 py-2 rounded-full border",
                selectedFilter === filter.key
                  ? "bg-blue-500 border-blue-500"
                  : "bg-white border-gray-300"
              )}
            >
              <Text className={cn(
                "font-medium",
                selectedFilter === filter.key
                  ? "text-white"
                  : "text-gray-700"
              )}>
                {filter.label} ({filter.count})
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Training Cards */}
        <View className="space-y-4">
          {filteredTrainings.map((training) => {
            const progress = progressData[training.id];
            const progressPercentage = getProgressPercentage(training);
            
            return (
              <Pressable
                key={training.id}
                onPress={() => handleStartTraining(training)}
                className="bg-white rounded-xl p-4 shadow-sm"
              >
                <View className="flex-row items-start justify-between mb-3">
                  <View className="flex-1">
                    <View className="flex-row items-center mb-2">
                      <Text className="text-2xl mr-2">
                        {getCategoryIcon(training.category)}
                      </Text>
                      <View className="flex-1">
                        <Text className="text-lg font-semibold text-gray-900">
                          {training.title}
                        </Text>
                        <Text className="text-sm text-gray-500">
                          {getCategoryText(training.category)} • {training.estimatedDuration} Min.
                        </Text>
                      </View>
                    </View>
                    
                    <Text className="text-gray-600 mb-3 leading-5">
                      {training.description}
                    </Text>
                  </View>
                </View>
                
                {/* Progress Bar */}
                {progress && progress.status !== 'NOT_STARTED' && (
                  <View className="mb-3">
                    <View className="flex-row justify-between items-center mb-1">
                      <Text className="text-sm text-gray-600">Fortschritt</Text>
                      <Text className="text-sm text-gray-600">{progressPercentage}%</Text>
                    </View>
                    <View className="h-2 bg-gray-200 rounded-full">
                      <View 
                        className="h-2 bg-blue-500 rounded-full"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </View>
                  </View>
                )}
                
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center space-x-3">
                    <View className={cn(
                      "px-2 py-1 rounded-full",
                      getStatusColor(progress?.status)
                    )}>
                      <Text className="text-xs font-medium">
                        {getStatusText(progress?.status)}
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
                  
                  <Text className="text-blue-600 font-medium">
                    {progress?.status === 'COMPLETED' ? 'Erneut ansehen' : 
                     progress?.status === 'IN_PROGRESS' ? 'Fortsetzen' : 'Starten'}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        {filteredTrainings.length === 0 && (
          <View className="bg-white rounded-xl p-8 items-center shadow-sm">
            <Text className="text-4xl mb-4">📚</Text>
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              Keine Schulungen verfügbar
            </Text>
            <Text className="text-gray-600 text-center">
              {selectedFilter === 'ALL' 
                ? 'Es wurden noch keine Schulungen für Sie erstellt.'
                : 'Keine Schulungen entsprechen den ausgewählten Filtern.'}
            </Text>
          </View>
        )}

        {/* Admin Quick Stats */}
        {(user?.role === 'ADMIN' || user?.role === 'SUPERADMIN') && (
          <View className="mt-6 space-y-3">
            <Text className="text-lg font-semibold text-gray-900">
              👑 Administrator Übersicht
            </Text>
            
            <Pressable
              onPress={() => (navigation as any).navigate('TrainingManagement')}
              className="bg-white p-4 rounded-xl shadow-sm flex-row items-center"
            >
              <View className="w-12 h-12 bg-orange-50 rounded-lg items-center justify-center mr-4">
                <Text className="text-2xl">📊</Text>
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900">
                  Schulungs-Management
                </Text>
                <Text className="text-sm text-gray-500">
                  Fortschritt verwalten & Statistiken einsehen
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