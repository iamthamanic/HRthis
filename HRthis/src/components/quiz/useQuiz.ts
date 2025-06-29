import { useState, useEffect } from 'react';
import { TestQuestion, TestAnswer, TestResult } from '../../types/learning';
import { useLearningStore } from '../../state/learning';
import { useAuthStore } from '../../state/auth';
import { checkAnswer, calculateQuizResult, createTestAnswer } from './QuizLogic';

interface UseQuizProps {
  videoId: string;
  questions: TestQuestion[];
  onComplete: (result: TestResult) => void;
  dropZones: (string | null)[];
  initializeSorting: (options: string[]) => void;
  handleDrop: (e: React.DragEvent, dropIndex: number) => (string | null)[];
}

export const useQuiz = ({ 
  videoId, 
  questions, 
  onComplete, 
  dropZones, 
  initializeSorting, 
  handleDrop 
}: UseQuizProps) => {
  const { user } = useAuthStore();
  const { submitTestResult } = useLearningStore();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<TestAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | string[]>('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  useEffect(() => {
    setQuestionStartTime(Date.now());
    setSelectedAnswer('');
    setIsAnswered(false);
    setShowExplanation(false);
    
    if (currentQuestion.type === 'sorting' && currentQuestion.options) {
      initializeSorting(currentQuestion.options);
    }
  }, [currentQuestionIndex, currentQuestion, initializeSorting]);

  const handleAnswer = () => {
    if (!user || isAnswered) return;

    const timeSpent = (Date.now() - questionStartTime) / 1000;
    const isCorrect = checkAnswer(currentQuestion, selectedAnswer, dropZones);
    const answer = createTestAnswer(currentQuestion, selectedAnswer, timeSpent, isCorrect);

    setAnswers([...answers, answer]);
    setIsAnswered(true);
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (isLastQuestion) {
      finishQuiz();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const finishQuiz = () => {
    if (!user) return;

    const result = calculateQuizResult(questions, answers, user.id, videoId);
    submitTestResult(result);
    onComplete(result);
  };

  const onDrop = (e: React.DragEvent, dropIndex: number) => {
    const newDropZones = handleDrop(e, dropIndex);
    if (currentQuestion.type === 'sorting' && newDropZones.filter(Boolean).length === currentQuestion.options?.length) {
      setSelectedAnswer(newDropZones.filter((zone): zone is string => Boolean(zone)));
    }
  };

  const canAnswer = Boolean(selectedAnswer && (
    !Array.isArray(selectedAnswer) || selectedAnswer.length > 0
  ));

  const isCorrect = showExplanation 
    ? checkAnswer(currentQuestion, selectedAnswer, dropZones)
    : false;

  return {
    currentQuestion,
    currentQuestionIndex,
    isLastQuestion,
    selectedAnswer,
    setSelectedAnswer,
    showExplanation,
    isAnswered,
    canAnswer,
    isCorrect,
    handleAnswer,
    nextQuestion,
    onDrop
  };
};