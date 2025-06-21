import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuthStore } from '../state/auth';
import { useTrainingStore } from '../state/training';
import { Training, AIGenerationRequest } from '../types/training';
import { cn } from '../utils/cn';

export const CreateTrainingScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const { createTraining, generateTrainingContent, isLoading } = useTrainingStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Training['category']>('SKILLS');
  const [targetAudience, setTargetAudience] = useState<Training['targetAudience']>('ALL');
  const [estimatedDuration, setEstimatedDuration] = useState('60');
  const [isMandatory, setIsMandatory] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)); // 90 days from now
  const [hasEndDate, setHasEndDate] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [useAI, setUseAI] = useState(false);
  
  // AI Generation fields
  const [aiTopic, setAiTopic] = useState('');
  const [aiDifficulty, setAiDifficulty] = useState<'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'>('INTERMEDIATE');
  const [aiLessonCount, setAiLessonCount] = useState('3');
  const [aiIncludeQuiz, setAiIncludeQuiz] = useState(true);

  const categories = [
    { key: 'ONBOARDING', label: 'Onboarding', icon: '👋' },
    { key: 'COMPLIANCE', label: 'Compliance', icon: '⚖️' },
    { key: 'SKILLS', label: 'Fähigkeiten', icon: '💡' },
    { key: 'SAFETY', label: 'Sicherheit', icon: '🛡️' },
    { key: 'OTHER', label: 'Sonstiges', icon: '📚' }
  ];

  const targetAudiences = [
    { key: 'ALL', label: 'Alle Mitarbeiter', icon: '👥' },
    { key: 'DEPARTMENT', label: 'Bestimmte Abteilungen', icon: '🏢' },
    { key: 'SPECIFIC_USERS', label: 'Einzelne Personen', icon: '👤' }
  ];

  const difficulties = [
    { key: 'BEGINNER', label: 'Anfänger', description: 'Grundlagen und Einführung' },
    { key: 'INTERMEDIATE', label: 'Fortgeschritten', description: 'Erweiterte Kenntnisse' },
    { key: 'ADVANCED', label: 'Experte', description: 'Spezialisiertes Wissen' }
  ];

  const handleGenerateContent = async () => {
    if (!aiTopic.trim()) {
      Alert.alert('Fehler', 'Bitte geben Sie ein Thema für die KI-Generierung ein.');
      return;
    }

    try {
      const request: AIGenerationRequest = {
        topic: aiTopic,
        description: description || `Schulung zu ${aiTopic}`,
        targetAudience: targetAudience,
        duration: parseInt(estimatedDuration) || 60,
        difficulty: aiDifficulty,
        includeQuiz: aiIncludeQuiz,
        lessonCount: parseInt(aiLessonCount) || 3
      };

      const generatedContent = await generateTrainingContent(request);
      
      // Update form with generated content
      if (!title) setTitle(generatedContent.title);
      if (!description) setDescription(generatedContent.description);
      
      Alert.alert(
        'Inhalt generiert!',
        'Die KI hat erfolgreich Schulungsinhalte erstellt. Sie können diese nun überprüfen und bei Bedarf anpassen.',
        [
          { text: 'Weiter bearbeiten', style: 'default' },
          { 
            text: 'Schulung erstellen', 
            style: 'default',
            onPress: () => handleCreateTraining(generatedContent)
          }
        ]
      );
    } catch (error) {
      Alert.alert('Fehler', 'Inhalt konnte nicht generiert werden. Bitte versuchen Sie es erneut.');
    }
  };

  const handleCreateTraining = async (generatedContent?: any) => {
    if (!user) return;

    if (!title.trim() || !description.trim()) {
      Alert.alert('Fehler', 'Bitte füllen Sie alle Pflichtfelder aus.');
      return;
    }

    if (parseInt(estimatedDuration) <= 0) {
      Alert.alert('Fehler', 'Die geschätzte Dauer muss größer als 0 sein.');
      return;
    }

    try {
      const trainingData: Omit<Training, 'id' | 'createdAt'> = {
        title: title.trim(),
        description: description.trim(),
        targetAudience,
        startDate: startDate.toISOString().split('T')[0],
        endDate: hasEndDate ? endDate.toISOString().split('T')[0] : undefined,
        isActive: true,
        isMandatory,
        createdBy: user.id,
        estimatedDuration: parseInt(estimatedDuration),
        category
      };

      await createTraining(trainingData);
      
      Alert.alert(
        'Erfolgreich erstellt!',
        'Die Schulung wurde erfolgreich erstellt.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Fehler', 'Die Schulung konnte nicht erstellt werden.');
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('de-DE');
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
        <View className="flex-row items-center mb-6">
          <Pressable onPress={() => navigation.goBack()} className="mr-4">
            <Text className="text-blue-600 text-lg">‹ Zurück</Text>
          </Pressable>
          <Text className="text-xl font-bold text-gray-900">
            Neue Schulung erstellen
          </Text>
        </View>

        <View className="space-y-6">
          {/* AI Generation Toggle */}
          <View className="bg-gradient-to-r from-purple-400 to-blue-500 rounded-xl p-6 shadow-sm">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-1">
                <Text className="text-white text-lg font-semibold mb-1">
                  🤖 KI-Schulungseditor
                </Text>
                <Text className="text-white/80 text-sm">
                  Lassen Sie KI automatisch Lektionen und Tests erstellen
                </Text>
              </View>
              <Switch
                value={useAI}
                onValueChange={setUseAI}
                trackColor={{ false: '#ffffff33', true: '#ffffff66' }}
                thumbColor={useAI ? '#ffffff' : '#ffffff99'}
              />
            </View>
          </View>

          {/* AI Configuration */}
          {useAI && (
            <View className="bg-white rounded-xl p-6 shadow-sm space-y-4">
              <Text className="text-lg font-semibold text-gray-900 mb-2">
                KI-Konfiguration
              </Text>
              
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Thema für KI-Generierung
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3"
                  placeholder="z.B. Datenschutz, Office 365, Projektmanagement"
                  value={aiTopic}
                  onChangeText={setAiTopic}
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Schwierigkeitsgrad
                </Text>
                <View className="space-y-2">
                  {difficulties.map((diff) => (
                    <Pressable
                      key={diff.key}
                      onPress={() => setAiDifficulty(diff.key as any)}
                      className={cn(
                        "p-3 rounded-lg border",
                        aiDifficulty === diff.key
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-white"
                      )}
                    >
                      <Text className={cn(
                        "font-medium mb-1",
                        aiDifficulty === diff.key ? "text-blue-900" : "text-gray-900"
                      )}>
                        {diff.label}
                      </Text>
                      <Text className="text-sm text-gray-600">
                        {diff.description}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View className="flex-row space-x-4">
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Anzahl Lektionen
                  </Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg px-4 py-3"
                    placeholder="3"
                    value={aiLessonCount}
                    onChangeText={setAiLessonCount}
                    keyboardType="numeric"
                  />
                </View>
                <View className="flex-1 justify-center">
                  <View className="flex-row items-center">
                    <Switch
                      value={aiIncludeQuiz}
                      onValueChange={setAiIncludeQuiz}
                      className="mr-3"
                    />
                    <Text className="text-sm font-medium text-gray-700">
                      Tests einschließen
                    </Text>
                  </View>
                </View>
              </View>

              <Pressable
                onPress={handleGenerateContent}
                disabled={isLoading || !aiTopic.trim()}
                className={cn(
                  "bg-purple-600 rounded-lg py-4 items-center",
                  (isLoading || !aiTopic.trim()) && "opacity-50"
                )}
              >
                <Text className="text-white font-semibold">
                  {isLoading ? '🤖 Generiere Inhalte...' : '✨ Inhalte generieren'}
                </Text>
              </Pressable>
            </View>
          )}

          {/* Basic Information */}
          <View className="bg-white rounded-xl p-6 shadow-sm space-y-4">
            <Text className="text-lg font-semibold text-gray-900">
              Grundinformationen
            </Text>
            
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Titel *
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3"
                placeholder="z.B. DSGVO Grundlagen"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Beschreibung *
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 h-24"
                placeholder="Beschreiben Sie die Schulung und ihre Ziele..."
                value={description}
                onChangeText={setDescription}
                multiline
                textAlignVertical="top"
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Kategorie
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row space-x-3">
                  {categories.map((cat) => (
                    <Pressable
                      key={cat.key}
                      onPress={() => setCategory(cat.key as any)}
                      className={cn(
                        "px-4 py-2 rounded-lg border",
                        category === cat.key
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-white"
                      )}
                    >
                      <Text className={cn(
                        "font-medium",
                        category === cat.key ? "text-blue-900" : "text-gray-700"
                      )}>
                        {cat.icon} {cat.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Geschätzte Dauer (Minuten)
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3"
                placeholder="60"
                value={estimatedDuration}
                onChangeText={setEstimatedDuration}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Target Audience */}
          <View className="bg-white rounded-xl p-6 shadow-sm space-y-4">
            <Text className="text-lg font-semibold text-gray-900">
              Zielgruppe
            </Text>
            
            <View className="space-y-3">
              {targetAudiences.map((audience) => (
                <Pressable
                  key={audience.key}
                  onPress={() => setTargetAudience(audience.key as any)}
                  className={cn(
                    "p-3 rounded-lg border flex-row items-center",
                    targetAudience === audience.key
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white"
                  )}
                >
                  <Text className="text-2xl mr-3">{audience.icon}</Text>
                  <Text className={cn(
                    "font-medium",
                    targetAudience === audience.key ? "text-blue-900" : "text-gray-900"
                  )}>
                    {audience.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Settings */}
          <View className="bg-white rounded-xl p-6 shadow-sm space-y-4">
            <Text className="text-lg font-semibold text-gray-900">
              Einstellungen
            </Text>
            
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="font-medium text-gray-900">Pflichtschulung</Text>
                <Text className="text-sm text-gray-500">
                  Mitarbeiter müssen diese Schulung absolvieren
                </Text>
              </View>
              <Switch
                value={isMandatory}
                onValueChange={setIsMandatory}
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Startdatum
              </Text>
              <Pressable
                onPress={() => setShowStartPicker(true)}
                className="border border-gray-300 rounded-lg px-4 py-3"
              >
                <Text>{formatDate(startDate)}</Text>
              </Pressable>
            </View>

            <View className="flex-row items-center justify-between">
              <View>
                <Text className="font-medium text-gray-900">Enddatum festlegen</Text>
                <Text className="text-sm text-gray-500">
                  Schulung nur bis zu einem bestimmten Datum verfügbar
                </Text>
              </View>
              <Switch
                value={hasEndDate}
                onValueChange={setHasEndDate}
              />
            </View>

            {hasEndDate && (
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Enddatum
                </Text>
                <Pressable
                  onPress={() => setShowEndPicker(true)}
                  className="border border-gray-300 rounded-lg px-4 py-3"
                >
                  <Text>{formatDate(endDate)}</Text>
                </Pressable>
              </View>
            )}
          </View>

          {/* Create Button */}
          <Pressable
            onPress={() => handleCreateTraining()}
            disabled={isLoading}
            className={cn(
              "bg-blue-600 rounded-lg py-4 items-center",
              isLoading && "opacity-50"
            )}
          >
            <Text className="text-white font-semibold text-base">
              {isLoading ? 'Wird erstellt...' : 'Schulung erstellen'}
            </Text>
          </Pressable>
        </View>

        {/* Date Pickers */}
        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            minimumDate={new Date()}
            onChange={(event, selectedDate) => {
              setShowStartPicker(false);
              if (selectedDate) {
                setStartDate(selectedDate);
                if (selectedDate > endDate) {
                  setEndDate(new Date(selectedDate.getTime() + 90 * 24 * 60 * 60 * 1000));
                }
              }
            }}
          />
        )}

        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
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