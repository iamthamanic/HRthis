import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../state/auth';
import { useTimeRecordsStore } from '../state/timeRecords';
import { TimeRecord } from '../types';
import { cn } from '../utils/cn';

export const TimeRecordsScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const { getTimeRecords, getTimeRecordsForPeriod } = useTimeRecordsStore();
  
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [selectedPeriod, setSelectedPeriod] = useState(new Date());
  
  const [timeRecords, setTimeRecords] = useState<TimeRecord[]>([]);

  useEffect(() => {
    if (!user) return;

    let records: TimeRecord[] = [];
    const today = new Date();
    
    if (viewMode === 'week') {
      // Get current week
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday
      
      records = getTimeRecordsForPeriod(
        user.id,
        startOfWeek.toISOString().split('T')[0],
        endOfWeek.toISOString().split('T')[0]
      );
    } else {
      // Get current month
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      records = getTimeRecordsForPeriod(
        user.id,
        startOfMonth.toISOString().split('T')[0],
        endOfMonth.toISOString().split('T')[0]
      );
    }
    
    setTimeRecords(records);
  }, [user, viewMode, selectedPeriod, getTimeRecordsForPeriod]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit'
    });
  };

  const getTotalHours = () => {
    return timeRecords.reduce((sum, record) => sum + record.totalHours, 0).toFixed(1);
  };

  const getStatusColor = (record: TimeRecord) => {
    if (record.totalHours < 7) return 'text-red-600';
    if (record.totalHours > 9) return 'text-orange-600';
    return 'text-green-600';
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4 py-6">
        <View className="flex-row items-center mb-6">
          <Pressable onPress={() => navigation.goBack()} className="mr-4">
            <Text className="text-blue-600 text-lg">‹ Zurück</Text>
          </Pressable>
          <Text className="text-xl font-bold text-gray-900">
            Arbeitszeiten
          </Text>
        </View>

        {/* View Mode Toggle */}
        <View className="flex-row bg-white rounded-lg p-1 mb-6 shadow-sm">
          <Pressable
            onPress={() => setViewMode('week')}
            className={cn(
              "flex-1 py-2 px-4 rounded-md",
              viewMode === 'week' ? "bg-blue-500" : "bg-transparent"
            )}
          >
            <Text className={cn(
              "text-center font-medium",
              viewMode === 'week' ? "text-white" : "text-gray-700"
            )}>
              Woche
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setViewMode('month')}
            className={cn(
              "flex-1 py-2 px-4 rounded-md",
              viewMode === 'month' ? "bg-blue-500" : "bg-transparent"
            )}
          >
            <Text className={cn(
              "text-center font-medium",
              viewMode === 'month' ? "text-white" : "text-gray-700"
            )}>
              Monat
            </Text>
          </Pressable>
        </View>

        {/* Summary Card */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-900 mb-2">
            Zusammenfassung
          </Text>
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-600">Gesamtstunden</Text>
            <Text className="text-2xl font-bold text-blue-600">
              {getTotalHours()}h
            </Text>
          </View>
          <View className="flex-row justify-between items-center mt-2">
            <Text className="text-gray-600">Arbeitstage</Text>
            <Text className="text-lg font-semibold text-gray-900">
              {timeRecords.length}
            </Text>
          </View>
        </View>

        {/* Time Records List */}
        <View className="space-y-3">
          {timeRecords.map((record) => (
            <View key={record.id} className="bg-white rounded-xl p-4 shadow-sm">
              <View className="flex-row justify-between items-start mb-2">
                <Text className="text-base font-semibold text-gray-900">
                  {formatDate(record.date)}
                </Text>
                <Text className={cn("text-base font-bold", getStatusColor(record))}>
                  {record.totalHours}h
                </Text>
              </View>
              
              <View className="flex-row justify-between text-sm text-gray-600">
                <View>
                  <Text className="text-gray-500">Ankunft</Text>
                  <Text className="font-medium">{record.timeIn}</Text>
                </View>
                <View>
                  <Text className="text-gray-500">Abgang</Text>
                  <Text className="font-medium">{record.timeOut || '-'}</Text>
                </View>
                <View>
                  <Text className="text-gray-500">Pause</Text>
                  <Text className="font-medium">{record.breakMinutes}min</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {timeRecords.length === 0 && (
          <View className="bg-white rounded-xl p-8 items-center shadow-sm">
            <Text className="text-4xl mb-4">⏰</Text>
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              Keine Einträge
            </Text>
            <Text className="text-gray-600 text-center">
              Für den ausgewählten Zeitraum sind keine Arbeitszeiten verfügbar.
            </Text>
          </View>
        )}

        {/* Info Note */}
        <View className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <Text className="text-blue-800 text-sm">
            💡 Die Zeitdaten werden automatisch von Ihrem Zeiterfassungssystem synchronisiert.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};