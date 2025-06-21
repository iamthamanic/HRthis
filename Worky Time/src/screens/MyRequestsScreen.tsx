import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../state/auth';
import { useLeavesStore } from '../state/leaves';
import { LeaveRequest } from '../types';
import { cn } from '../utils/cn';

export const MyRequestsScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const { getLeaveRequests } = useLeavesStore();
  
  const [requests, setRequests] = useState<LeaveRequest[]>([]);

  useEffect(() => {
    if (user) {
      const userRequests = getLeaveRequests(user.id);
      setRequests(userRequests.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    }
  }, [user, getLeaveRequests]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'Genehmigt';
      case 'REJECTED':
        return 'Abgelehnt';
      default:
        return 'Ausstehend';
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'VACATION' ? '🏖️' : '🏥';
  };

  const getTypeText = (type: string) => {
    return type === 'VACATION' ? 'Urlaub' : 'Krankheit';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE');
  };

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4 py-6">
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center">
            <Pressable onPress={() => navigation.goBack()} className="mr-4">
              <Text className="text-blue-600 text-lg">‹ Zurück</Text>
            </Pressable>
            <Text className="text-xl font-bold text-gray-900">
              Meine Anträge
            </Text>
          </View>
          <Pressable 
            onPress={() => navigation.navigate('RequestLeave' as never)}
            className="bg-blue-600 px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-medium">+ Neu</Text>
          </Pressable>
        </View>

        <View className="space-y-4">
          {requests.map((request) => (
            <View key={request.id} className="bg-white rounded-xl p-4 shadow-sm">
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-row items-center">
                  <Text className="text-2xl mr-3">{getTypeIcon(request.type)}</Text>
                  <View>
                    <Text className="text-base font-semibold text-gray-900">
                      {getTypeText(request.type)}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      {formatDate(request.startDate)} - {formatDate(request.endDate)}
                    </Text>
                  </View>
                </View>
                <View className={cn(
                  "px-3 py-1 rounded-full",
                  getStatusColor(request.status)
                )}>
                  <Text className="text-xs font-medium">
                    {getStatusText(request.status)}
                  </Text>
                </View>
              </View>
              
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-sm text-gray-600">
                  Dauer: {calculateDays(request.startDate, request.endDate)} Tag
                  {calculateDays(request.startDate, request.endDate) !== 1 ? 'e' : ''}
                </Text>
                <Text className="text-xs text-gray-500">
                  Eingereicht am {formatDate(request.createdAt.split('T')[0])}
                </Text>
              </View>

              {request.comment && (
                <View className="p-3 bg-gray-50 rounded-lg">
                  <Text className="text-sm text-gray-700">
                    "{request.comment}"
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {requests.length === 0 && (
          <View className="bg-white rounded-xl p-8 items-center shadow-sm">
            <Text className="text-4xl mb-4">📝</Text>
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              Keine Anträge
            </Text>
            <Text className="text-gray-600 text-center mb-4">
              Sie haben noch keine Urlaubs- oder Krankmeldungen eingereicht.
            </Text>
            <Pressable 
              onPress={() => navigation.navigate('RequestLeave' as never)}
              className="bg-blue-600 px-6 py-3 rounded-lg"
            >
              <Text className="text-white font-medium">Ersten Antrag stellen</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};