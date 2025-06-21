import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuthStore } from '../state/auth';
import { useLeavesStore } from '../state/leaves';
import { cn } from '../utils/cn';

export const RequestLeaveScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const { submitLeaveRequest, isLoading } = useLeavesStore();
  
  const [leaveType, setLeaveType] = useState<'VACATION' | 'SICK'>('VACATION');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [comment, setComment] = useState('');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleSubmit = async () => {
    if (!user) return;

    if (startDate > endDate) {
      Alert.alert('Fehler', 'Das Enddatum muss nach dem Startdatum liegen.');
      return;
    }

    try {
      await submitLeaveRequest({
        userId: user.id,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        comment,
        status: 'PENDING',
        type: leaveType
      });

      Alert.alert(
        'Erfolgreich eingereicht',
        'Ihr Antrag wurde erfolgreich eingereicht und wird bearbeitet.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Fehler', 'Der Antrag konnte nicht eingereicht werden.');
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('de-DE');
  };

  const calculateDays = () => {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4 py-6">
        <View className="flex-row items-center mb-6">
          <Pressable onPress={() => navigation.goBack()} className="mr-4">
            <Text className="text-blue-600 text-lg">‹ Zurück</Text>
          </Pressable>
          <Text className="text-xl font-bold text-gray-900">
            Antrag stellen
          </Text>
        </View>

        <View className="bg-white rounded-xl p-6 shadow-sm space-y-6">
          {/* Leave Type Selection */}
          <View>
            <Text className="text-base font-semibold text-gray-900 mb-3">
              Art des Antrags
            </Text>
            <View className="flex-row space-x-3">
              <Pressable
                onPress={() => setLeaveType('VACATION')}
                className={cn(
                  "flex-1 p-4 rounded-lg border-2",
                  leaveType === 'VACATION' 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-gray-200 bg-white"
                )}
              >
                <Text className="text-center font-medium">🏖️ Urlaub</Text>
              </Pressable>
              <Pressable
                onPress={() => setLeaveType('SICK')}
                className={cn(
                  "flex-1 p-4 rounded-lg border-2",
                  leaveType === 'SICK' 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-gray-200 bg-white"
                )}
              >
                <Text className="text-center font-medium">🏥 Krankheit</Text>
              </Pressable>
            </View>
          </View>

          {/* Date Selection */}
          <View>
            <Text className="text-base font-semibold text-gray-900 mb-3">
              Zeitraum
            </Text>
            
            <View className="space-y-3">
              <View>
                <Text className="text-sm text-gray-600 mb-2">Von</Text>
                <Pressable
                  onPress={() => setShowStartPicker(true)}
                  className="border border-gray-300 rounded-lg px-4 py-3"
                >
                  <Text className="text-base">{formatDate(startDate)}</Text>
                </Pressable>
              </View>

              <View>
                <Text className="text-sm text-gray-600 mb-2">Bis</Text>
                <Pressable
                  onPress={() => setShowEndPicker(true)}
                  className="border border-gray-300 rounded-lg px-4 py-3"
                >
                  <Text className="text-base">{formatDate(endDate)}</Text>
                </Pressable>
              </View>
            </View>

            <View className="mt-3 p-3 bg-blue-50 rounded-lg">
              <Text className="text-blue-800 font-medium">
                Dauer: {calculateDays()} Tag{calculateDays() !== 1 ? 'e' : ''}
              </Text>
            </View>
          </View>

          {/* Comment */}
          <View>
            <Text className="text-base font-semibold text-gray-900 mb-3">
              Kommentar (optional)
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 h-24"
              placeholder="Zusätzliche Informationen..."
              value={comment}
              onChangeText={setComment}
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Submit Button */}
          <Pressable
            onPress={handleSubmit}
            disabled={isLoading}
            className={cn(
              "bg-blue-600 rounded-lg py-4 items-center",
              isLoading && "opacity-50"
            )}
          >
            <Text className="text-white font-semibold text-base">
              {isLoading ? 'Wird eingereicht...' : 'Antrag einreichen'}
            </Text>
          </Pressable>
        </View>

        {/* Date Pickers */}
        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedDate) => {
              setShowStartPicker(false);
              if (selectedDate) {
                setStartDate(selectedDate);
                if (selectedDate > endDate) {
                  setEndDate(selectedDate);
                }
              }
            }}
          />
        )}

        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            minimumDate={startDate}
            onChange={(event, selectedDate) => {
              setShowEndPicker(false);
              if (selectedDate) {
                setEndDate(selectedDate);
              }
            }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};