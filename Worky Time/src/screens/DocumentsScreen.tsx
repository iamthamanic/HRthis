import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export const DocumentsScreen = () => {
  const navigation = useNavigation();

  const mockDocuments = [
    {
      id: '1',
      title: 'Lohnabrechnung November 2024',
      category: 'LOHN',
      date: '2024-11-30',
      icon: '💰'
    },
    {
      id: '2',
      title: 'Lohnabrechnung Oktober 2024',
      category: 'LOHN',
      date: '2024-10-31',
      icon: '💰'
    },
    {
      id: '3',
      title: 'Arbeitsvertrag',
      category: 'VERTRAG',
      date: '2024-01-15',
      icon: '📄'
    },
    {
      id: '4',
      title: 'Betriebsvereinbarung Homeoffice',
      category: 'SONSTIGES',
      date: '2024-03-01',
      icon: '🏠'
    }
  ];

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'LOHN':
        return 'Lohnabrechnung';
      case 'VERTRAG':
        return 'Vertrag';
      default:
        return 'Sonstiges';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4 py-6">
        <View className="flex-row items-center mb-6">
          <Pressable onPress={() => navigation.goBack()} className="mr-4">
            <Text className="text-blue-600 text-lg">‹ Zurück</Text>
          </Pressable>
          <Text className="text-xl font-bold text-gray-900">
            Dokumente
          </Text>
        </View>

        <View className="space-y-3">
          {mockDocuments.map((doc) => (
            <Pressable key={doc.id} className="bg-white rounded-xl p-4 shadow-sm">
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-blue-50 rounded-lg items-center justify-center mr-4">
                  <Text className="text-2xl">{doc.icon}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-gray-900 mb-1">
                    {doc.title}
                  </Text>
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-gray-500">
                      {getCategoryText(doc.category)}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      {formatDate(doc.date)}
                    </Text>
                  </View>
                </View>
                <Text className="text-gray-400 text-lg ml-2">›</Text>
              </View>
            </Pressable>
          ))}
        </View>

        <View className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <Text className="text-blue-800 text-sm">
            📄 Neue Dokumente werden automatisch von der Personalabteilung hinzugefügt.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};