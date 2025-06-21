import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuthStore } from '../state/auth';
import { useTrainingStore } from '../state/training';
import { TrainingLesson, TrainingContent, TrainingQuestion, TrainingAttempt } from '../types/training';
import { cn } from '../utils/cn';

export const TakeLessonScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuthStore();
  const { 
    getLessonsForTraining, 
    completeLesson, 
    submitQuizAttempt,
    getUserAttempts 
  } = useTrainingStore();
  
  const { trainingId, lessonId, lessonIndex } = route.params as any;
  const [lesson, setLesson] = useState<TrainingLesson | null>(null);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  useEffect(() => {
    const lessons = getLessonsForTraining(trainingId);
    const currentLesson = lessons.find(l => l.id === lessonId);
    setLesson(currentLesson || null);
    
    if (currentLesson?.quiz) {
      setQuizAnswers(new Array(currentLesson.quiz.questions.length).fill(-1));
    }
  }, [trainingId, lessonId, getLessonsForTraining]);

  const handleNextContent = () => {
    if (!lesson) return;
    
    if (currentContentIndex < lesson.content.length - 1) {
      setCurrentContentIndex(currentContentIndex + 1);
    } else if (lesson.quiz) {
      setShowQuiz(true);
    } else {
      handleCompleteLesson();
    }
  };

  const handlePrevContent = () => {
    if (currentContentIndex > 0) {
      setCurrentContentIndex(currentContentIndex - 1);
    } else if (showQuiz) {
      setShowQuiz(false);
      setCurrentContentIndex(lesson?.content.length ? lesson.content.length - 1 : 0);
    }
  };

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...quizAnswers];
    newAnswers[questionIndex] = answerIndex;
    setQuizAnswers(newAnswers);
  };

  const handleSubmitQuiz = () => {
    if (!lesson?.quiz || !user) return;
    
    // Check if all questions are answered
    if (quizAnswers.includes(-1)) {
      Alert.alert('Unvollständig', 'Bitte beantworten Sie alle Fragen.');
      return;
    }
    
    // Calculate score
    let correctAnswers = 0;
    lesson.quiz.questions.forEach((question, index) => {
      if (quizAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const score = Math.round((correctAnswers / lesson.quiz.questions.length) * 100);
    const passed = score >= lesson.quiz.passingScore;
    
    // Get previous attempts
    const previousAttempts = getUserAttempts(user.id, lesson.quiz.id);
    const attemptNumber = previousAttempts.length + 1;
    
    // Submit attempt
    const attempt: Omit<TrainingAttempt, 'id'> = {
      userId: user.id,
      quizId: lesson.quiz.id,
      answers: quizAnswers,
      score,
      passed,
      attemptNumber,
      completedAt: new Date().toISOString()
    };
    
    submitQuizAttempt(attempt);
    setQuizScore(score);
    setQuizSubmitted(true);
    
    if (passed) {
      handleCompleteLesson();
    } else {
      Alert.alert(
        'Quiz nicht bestanden',
        `Sie haben ${score}% erreicht. Mindestens ${lesson.quiz.passingScore}% sind erforderlich. Sie können es erneut versuchen.`,
        [
          { text: 'Erneut versuchen', onPress: () => retakeQuiz() },
          { text: 'Später', onPress: () => navigation.goBack() }
        ]
      );
    }
  };

  const retakeQuiz = () => {
    setQuizAnswers(new Array(lesson?.quiz?.questions.length || 0).fill(-1));
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  const handleCompleteLesson = () => {
    if (!user) return;
    
    completeLesson(user.id, trainingId, lessonId);
    
    Alert.alert(
      'Lektion abgeschlossen!',
      'Sie haben diese Lektion erfolgreich abgeschlossen.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  const renderContent = (content: TrainingContent) => {
    switch (content.type) {
      case 'TEXT':
        return (
          <ScrollView className="flex-1 p-6">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              {content.title}
            </Text>
            <Text className="text-gray-700 leading-6">
              {content.content}
            </Text>
          </ScrollView>
        );
      
      case 'PDF':
        return (
          <View className="flex-1 p-6 items-center justify-center">
            <Text className="text-4xl mb-4">📄</Text>
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              {content.title}
            </Text>
            <Text className="text-gray-600 text-center mb-4">
              PDF-Dokument
            </Text>
            <Pressable className="bg-blue-600 px-6 py-3 rounded-lg">
              <Text className="text-white font-medium">Dokument öffnen</Text>
            </Pressable>
          </View>
        );
      
      case 'VIDEO':
        return (
          <View className="flex-1 p-6 items-center justify-center">
            <Text className="text-4xl mb-4">🎥</Text>
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              {content.title}
            </Text>
            <Text className="text-gray-600 text-center mb-4">
              Video-Inhalt
            </Text>
            <Pressable className="bg-red-600 px-6 py-3 rounded-lg">
              <Text className="text-white font-medium">Video abspielen</Text>
            </Pressable>
          </View>
        );
      
      case 'LINK':
        return (
          <View className="flex-1 p-6 items-center justify-center">
            <Text className="text-4xl mb-4">🔗</Text>
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              {content.title}
            </Text>
            <Text className="text-gray-600 text-center mb-4">
              Externer Link
            </Text>
            <Pressable className="bg-green-600 px-6 py-3 rounded-lg">
              <Text className="text-white font-medium">Link öffnen</Text>
            </Pressable>
          </View>
        );
      
      default:
        return (
          <View className="flex-1 p-6 items-center justify-center">
            <Text className="text-gray-600">Unbekannter Inhaltstyp</Text>
          </View>
        );
    }
  };

  const renderQuiz = () => {
    if (!lesson?.quiz) return null;
    
    return (
      <ScrollView className="flex-1 p-6">
        <View className="flex-row items-center mb-6">
          <Text className="text-2xl mr-3">📝</Text>
          <View>
            <Text className="text-lg font-semibold text-gray-900">
              Quiz: {lesson.title}
            </Text>
            <Text className="text-sm text-gray-600">
              Mindestens {lesson.quiz.passingScore}% zum Bestehen
            </Text>
          </View>
        </View>
        
        {lesson.quiz.questions.map((question, questionIndex) => (
          <View key={question.id} className="mb-6 p-4 bg-white rounded-lg shadow-sm">
            <Text className="text-base font-semibold text-gray-900 mb-3">
              {questionIndex + 1}. {question.question}
            </Text>
            
            <View className="space-y-2">
              {question.options.map((option, optionIndex) => (
                <Pressable
                  key={optionIndex}
                  onPress={() => handleQuizAnswer(questionIndex, optionIndex)}
                  disabled={quizSubmitted}
                  className={cn(
                    "p-3 rounded-lg border",
                    quizAnswers[questionIndex] === optionIndex
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white",
                    quizSubmitted && optionIndex === question.correctAnswer && "border-green-500 bg-green-50",
                    quizSubmitted && quizAnswers[questionIndex] === optionIndex && optionIndex !== question.correctAnswer && "border-red-500 bg-red-50"
                  )}
                >
                  <Text className={cn(
                    "font-medium",
                    quizAnswers[questionIndex] === optionIndex ? "text-blue-900" : "text-gray-700",
                    quizSubmitted && optionIndex === question.correctAnswer && "text-green-900",
                    quizSubmitted && quizAnswers[questionIndex] === optionIndex && optionIndex !== question.correctAnswer && "text-red-900"
                  )}>
                    {String.fromCharCode(65 + optionIndex)}. {option}
                  </Text>
                </Pressable>
              ))}
            </View>
            
            {quizSubmitted && question.explanation && (
              <View className="mt-3 p-3 bg-gray-50 rounded-lg">
                <Text className="text-sm text-gray-700">
                  💡 {question.explanation}
                </Text>
              </View>
            )}
          </View>
        ))}
        
        {!quizSubmitted && (
          <Pressable
            onPress={handleSubmitQuiz}
            disabled={quizAnswers.includes(-1)}
            className={cn(
              "bg-purple-600 rounded-lg py-4 items-center mt-4",
              quizAnswers.includes(-1) && "opacity-50"
            )}
          >
            <Text className="text-white font-semibold">
              Quiz abschicken
            </Text>
          </Pressable>
        )}
        
        {quizSubmitted && (
          <View className="mt-4 p-4 bg-white rounded-lg shadow-sm">
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              Ergebnis: {quizScore}%
            </Text>
            {quizScore >= (lesson.quiz.passingScore || 70) ? (
              <Text className="text-green-600 font-medium">
                ✅ Bestanden! Sie können mit der nächsten Lektion fortfahren.
              </Text>
            ) : (
              <Text className="text-red-600 font-medium">
                ❌ Nicht bestanden. Sie können es erneut versuchen.
              </Text>
            )}
          </View>
        )}
      </ScrollView>
    );
  };

  if (!lesson) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <Text className="text-4xl mb-4">❓</Text>
        <Text className="text-lg font-semibold text-gray-900 mb-2">
          Lektion nicht gefunden
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

  const currentContent = lesson.content[currentContentIndex];
  const isLastContent = currentContentIndex === lesson.content.length - 1;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between p-4 bg-white shadow-sm">
          <Pressable onPress={() => navigation.goBack()}>
            <Text className="text-blue-600 text-lg">‹ Zurück</Text>
          </Pressable>
          
          <View className="flex-1 mx-4">
            <Text className="text-base font-semibold text-gray-900 text-center">
              {lesson.title}
            </Text>
            <Text className="text-sm text-gray-500 text-center">
              {showQuiz ? 'Quiz' : `${currentContentIndex + 1} von ${lesson.content.length}`}
            </Text>
          </View>
          
          <View className="w-16" /> {/* Spacer for centering */}
        </View>

        {/* Progress Bar */}
        {!showQuiz && (
          <View className="px-4 py-2 bg-white">
            <View className="h-2 bg-gray-200 rounded-full">
              <View 
                className="h-2 bg-blue-500 rounded-full"
                style={{ width: `${((currentContentIndex + 1) / lesson.content.length) * 100}%` }}
              />
            </View>
          </View>
        )}

        {/* Content */}
        <View className="flex-1">
          {showQuiz ? renderQuiz() : renderContent(currentContent)}
        </View>

        {/* Navigation Buttons */}
        {!showQuiz && (
          <View className="flex-row justify-between p-4 bg-white border-t border-gray-200">
            <Pressable
              onPress={handlePrevContent}
              disabled={currentContentIndex === 0}
              className={cn(
                "px-6 py-3 rounded-lg",
                currentContentIndex === 0 
                  ? "bg-gray-100" 
                  : "bg-gray-200"
              )}
            >
              <Text className={cn(
                "font-medium",
                currentContentIndex === 0 ? "text-gray-400" : "text-gray-700"
              )}>
                ‹ Zurück
              </Text>
            </Pressable>
            
            <Pressable
              onPress={handleNextContent}
              className="bg-blue-600 px-6 py-3 rounded-lg"
            >
              <Text className="text-white font-medium">
                {isLastContent ? (lesson.quiz ? 'Zum Quiz' : 'Abschließen') : 'Weiter ›'}
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};