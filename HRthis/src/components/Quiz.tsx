import React from 'react';
import { TestQuestion, TestResult } from '../types/learning';
import { useDragAndDrop } from './quiz/useDragAndDrop';
import { useQuiz } from './quiz/useQuiz';
import { QuizContent } from './quiz/QuizContent';

interface QuizProps {
  videoId: string;
  questions: TestQuestion[];
  onComplete: (result: TestResult) => void;
}

export const Quiz: React.FC<QuizProps> = ({ videoId, questions, onComplete }) => {
  const { draggedItems, dropZones, initializeSorting, handleDragStart, handleDrop, handleDragOver } = useDragAndDrop();
  
  const {
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
  } = useQuiz({ 
    videoId, 
    questions, 
    onComplete, 
    dropZones, 
    initializeSorting, 
    handleDrop 
  });

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <QuizContent
        currentQuestion={currentQuestion}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        selectedAnswer={selectedAnswer}
        setSelectedAnswer={setSelectedAnswer}
        isAnswered={isAnswered}
        showExplanation={showExplanation}
        isLastQuestion={isLastQuestion}
        isCorrect={isCorrect}
        canAnswer={canAnswer}
        onAnswer={handleAnswer}
        onNext={nextQuestion}
        onDrop={onDrop}
        draggedItems={draggedItems}
        dropZones={dropZones}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
      />
    </div>
  );
};