import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuthStore } from '../state/auth';
import { useTrainingStore } from '../state/training';
import { Training, TrainingLesson, TrainingProgress } from '../types/training';
import { cn } from '../utils/cn';

export const TrainingDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuthStore();
  const { 
    getTrainingById, 
    getLessonsForTraining, 
    getUserProgress, 
    completeLesson,
    completeTraining 
  } = useTrainingStore();
  
  const trainingId = (route.params as any)?.trainingId;
  const [training, setTraining] = useState<Training | null>(null);
  const [lessons, setLessons] = useState<TrainingLesson[]>([]);
  const [progress, setProgress] = useState<TrainingProgress | null>(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

  useEffect(() => {
    if (trainingId && user) {
      const trainingData = getTrainingById(trainingId);
      const lessonsData = getLessonsForTraining(trainingId);
      const progressData = getUserProgress(user.id, trainingId);
      
      setTraining(trainingData || null);
      setLessons(lessonsData);
      setProgress(progressData || null);
      
      // Set current lesson based on progress
      if (progressData && progressData.currentLessonId) {
        const lessonIndex = lessonsData.findIndex(l => l.id === progressData.currentLessonId);
        if (lessonIndex >= 0) {
          setCurrentLessonIndex(lessonIndex);
        }
      }
    }
  }, [trainingId, user, getTrainingById, getLessonsForTraining, getUserProgress]);

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

  const getProgressPercentage = () => {
    if (!progress || !lessons.length) return 0;
    if (progress.status === 'COMPLETED') return 100;
    if (progress.status === 'NOT_STARTED') return 0;
    
    return Math.floor((progress.completedLessons.length / lessons.length) * 100);
  };

  const isLessonCompleted = (lessonId: string) => {
    return progress?.completedLessons.includes(lessonId) || false;
  };

  const isLessonAvailable = (lessonIndex: number) => {
    if (lessonIndex === 0) return true;
    const previousLesson = lessons[lessonIndex - 1];
    return isLessonCompleted(previousLesson.id);
  };

  const handleStartLesson = (lesson: TrainingLesson, index: number) => {
    if (!user || !training) return;
    
    if (!isLessonAvailable(index)) {
      Alert.alert(
        'Lektion nicht verfügbar',
        'Sie müssen die vorherige Lektion abschließen, bevor Sie mit dieser fortfahren können.'
      );
      return;
    }
    
    (navigation as any).navigate('TakeLesson', { 
      trainingId: training.id, 
      lessonId: lesson.id,
      lessonIndex: index 
    });
  };

  const handleCompleteTraining = () => {
    if (!user || !training) return;
    
    Alert.alert(
      'Schulung abschließen',
      'Sind Sie sicher, dass Sie die Schulung als abgeschlossen markieren möchten?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Abschließen',
          onPress: () => {
            // In real app, would calculate final score based on quiz results
            const finalScore = 85; // Mock score
            completeTraining(user.id, training.id, finalScore);
            
            Alert.alert(
              'Glückwunsch!',
              `Sie haben die Schulung "${training.title}" erfolgreich abgeschlossen!`,
              [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
          }
        }
      ]
    );
  };

  const canCompleteTraining = () => {
    return lessons.length > 0 && 
           lessons.every(lesson => isLessonCompleted(lesson.id)) &&
           progress?.status !== 'COMPLETED';
  };

  if (!training) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <Text className="text-4xl mb-4">❓</Text>
        <Text className="text-lg font-semibold text-gray-900 mb-2">
          Schulung nicht gefunden
        </Text>
        <Text className="text-gray-600 text-center px-8 mb-4">
          Die angeforderte Schulung konnte nicht geladen werden.
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
            Schulungsdetails
          </Text>
        </View>

        {/* Training Header */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <View className="flex-row items-start mb-4">
            <Text className="text-4xl mr-4">
              {getCategoryIcon(training.category)}
            </Text>
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-900 mb-2">
                {training.title}
              </Text>
              <Text className="text-gray-600 leading-6 mb-3">
                {training.description}
              </Text>
              
              <View className="flex-row items-center space-x-4">
                <View className={cn(
                  "px-3 py-1 rounded-full",
                  getStatusColor(progress?.status)
                )}>
                  <Text className="text-sm font-medium">
                    {getStatusText(progress?.status)}
                  </Text>
                </View>
                
                {training.isMandatory && (
                  <View className="bg-orange-100 px-3 py-1 rounded-full">
                    <Text className="text-sm font-medium text-orange-800">
                      Pflicht
                    </Text>
                  </View>
                )}
                
                <Text className="text-sm text-gray-500">
                  📅 {training.estimatedDuration} Min.
                </Text>
              </View>
            </View>
          </View>

          {/* Progress Bar */}
          {progress && progress.status !== 'NOT_STARTED' && (
            <View>
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-sm font-medium text-gray-700">Fortschritt</Text>
                <Text className="text-sm text-gray-600">{getProgressPercentage()}%</Text>
              </View>
              <View className="h-3 bg-gray-200 rounded-full">
                <View 
                  className="h-3 bg-blue-500 rounded-full"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </View>
              
              {progress.lastActivityAt && (
                <Text className="text-xs text-gray-500 mt-2">
                  Zuletzt bearbeitet: {new Date(progress.lastActivityAt).toLocaleDateString('de-DE')}
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Lessons List */}
        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            📋 Lektionen ({lessons.length})
          </Text>
          
          {lessons.length === 0 ? (
            <View className="py-8 items-center">
              <Text className="text-4xl mb-2">📝</Text>
              <Text className="text-gray-600 text-center">
                Für diese Schulung sind noch keine Lektionen verfügbar.
              </Text>
            </View>
          ) : (
            <View className="space-y-3">
              {lessons.map((lesson, index) => {
                const isCompleted = isLessonCompleted(lesson.id);
                const isAvailable = isLessonAvailable(index);
                const isCurrent = progress?.currentLessonId === lesson.id;
                
                return (
                  <Pressable
                    key={lesson.id}
                    onPress={() => handleStartLesson(lesson, index)}
                    disabled={!isAvailable}
                    className={cn(
                      "p-4 rounded-lg border",
                      isCompleted ? "border-green-200 bg-green-50" :
                      isCurrent ? "border-blue-200 bg-blue-50" :
                      isAvailable ? "border-gray-200 bg-white" :
                      "border-gray-200 bg-gray-50"
                    )}
                  >
                    <View className="flex-row items-center">
                      <View className={cn(
                        "w-8 h-8 rounded-full mr-3 items-center justify-center",
                        isCompleted ? "bg-green-500" :
                        isCurrent ? "bg-blue-500" :
                        isAvailable ? "bg-gray-200" : "bg-gray-100"
                      )}>
                        <Text className={cn(
                          "text-sm font-bold",
                          isCompleted || isCurrent ? "text-white" : "text-gray-500"
                        )}>
                          {isCompleted ? '✓' : index + 1}
                        </Text>
                      </View>
                      
                      <View className="flex-1">
                        <Text className={cn(
                          "font-semibold mb-1",
                          isAvailable ? "text-gray-900" : "text-gray-400"
                        )}>
                          {lesson.title}
                        </Text>
                        <Text className={cn(
                          "text-sm",
                          isAvailable ? "text-gray-600" : "text-gray-400"
                        )}>
                          {lesson.description}
                        </Text>
                        
                        {lesson.quiz && (
                          <View className="flex-row items-center mt-2">
                            <Text className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">
                              📝 Quiz enthalten
                            </Text>
                          </View>
                        )}
                      </View>
                      
                      <View className="items-end">
                        {isCompleted && (
                          <Text className="text-xs text-green-600 font-medium">
                            Abgeschlossen
                          </Text>
                        )}
                        {isCurrent && !isCompleted && (
                          <Text className="text-xs text-blue-600 font-medium">
                            Aktuell
                          </Text>
                        )}
                        {!isAvailable && (
                          <Text className="text-xs text-gray-400">
                            Gesperrt
                          </Text>
                        )}
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>

        {/* Complete Training Button */}
        {canCompleteTraining() && (
          <Pressable
            onPress={handleCompleteTraining}
            className="bg-green-600 rounded-lg py-4 items-center mb-6"
          >
            <Text className="text-white font-semibold text-base">
              🎉 Schulung abschließen
            </Text>
          </Pressable>
        )}

        {/* Training Info */}
        <View className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <Text className="text-blue-800 font-medium mb-2">
            📋 Wichtige Informationen
          </Text>
          <Text className="text-blue-700 text-sm leading-5">
            • Arbeiten Sie die Lektionen in der vorgegebenen Reihenfolge ab{'\n'}
            • {training.isMandatory ? 'Diese Schulung ist verpflichtend' : 'Diese Schulung ist freiwillig'}{'\n'}
            • Bei Fragen wenden Sie sich an die Personalabteilung{'\n'}
            • Ihr Fortschritt wird automatisch gespeichert
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};