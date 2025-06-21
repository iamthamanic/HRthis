import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuthStore } from '../state/auth';
import { useLeavesStore } from '../state/leaves';
import { cn } from '../utils/cn';

export const SickLeaveScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const { submitLeaveRequest, isLoading } = useLeavesStore();
  
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
        type: 'SICK'
      });

      Alert.alert(
        'Krankmeldung eingereicht',
        'Ihre Krankmeldung wurde erfolgreich eingereicht. Gute Besserung!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Fehler', 'Die Krankmeldung konnte nicht eingereicht werden.');
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
            Krankmeldung
          </Text>
        </View>

        <View className="bg-white rounded-xl p-6 shadow-sm space-y-6">
          <View className="items-center py-4">
            <Text className="text-6xl mb-2">🏥</Text>
            <Text className="text-lg font-semibold text-gray-900">
              Krankmeldung einreichen
            </Text>
            <Text className="text-gray-600 text-center">
              Melden Sie Ihre Krankheit schnell und einfach
            </Text>
          </View>

          {/* Date Selection */}
          <View>
            <Text className="text-base font-semibold text-gray-900 mb-3">
              Zeitraum der Krankheit
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
                <Text className="text-sm text-gray-600 mb-2">Bis (voraussichtlich)</Text>
                <Pressable
                  onPress={() => setShowEndPicker(true)}
                  className="border border-gray-300 rounded-lg px-4 py-3"
                >
                  <Text className="text-base">{formatDate(endDate)}</Text>
                </Pressable>
              </View>
            </View>

            <View className="mt-3 p-3 bg-red-50 rounded-lg">
              <Text className="text-red-800 font-medium">
                Dauer: {calculateDays()} Tag{calculateDays() !== 1 ? 'e' : ''}
              </Text>
            </View>
          </View>

          {/* Comment */}
          <View>
            <Text className="text-base font-semibold text-gray-900 mb-3">
              Zusätzliche Informationen (optional)
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 h-24"
              placeholder="z.B. Symptome, Arzttermin geplant..."
              value={comment}
              onChangeText={setComment}
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Info Box */}
          <View className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <Text className="text-yellow-800 text-sm font-medium mb-2">
              📋 Wichtige Hinweise:
            </Text>
            <Text className="text-yellow-700 text-sm">
              • Reichen Sie ein ärztliches Attest spätestens am 3. Krankheitstag ein{'\n'}
              • Informieren Sie zusätzlich Ihren direkten Vorgesetzten{'\n'}
              • Bei längerer Krankheit: Folgebescheinigungen rechtzeitig einreichen
            </Text>
          </View>

          {/* Submit Button */}
          <Pressable
            onPress={handleSubmit}
            disabled={isLoading}
            className={cn(
              "bg-red-600 rounded-lg py-4 items-center",
              isLoading && "opacity-50"
            )}
          >
            <Text className="text-white font-semibold text-base">
              {isLoading ? 'Wird eingereicht...' : 'Krankmeldung einreichen'}
            </Text>
          </Pressable>
        </View>

        {/* Date Pickers */}
        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            maximumDate={new Date()}
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