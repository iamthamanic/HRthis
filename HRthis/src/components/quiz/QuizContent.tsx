import React from 'react';
import { TestQuestion } from '../../types/learning';
import { MultipleChoiceQuestion, ImageSelectionQuestion, SortingQuestion } from './QuizQuestionTypes';
import { QuizControls, QuizHeader, QuizExplanation } from './QuizControls';

interface QuizContentProps {
  currentQuestion: TestQuestion;
  currentQuestionIndex: number;
  totalQuestions: number;
  selectedAnswer: string | string[];
  setSelectedAnswer: (answer: string | string[]) => void;
  isAnswered: boolean;
  showExplanation: boolean;
  isLastQuestion: boolean;
  isCorrect: boolean;
  canAnswer: boolean;
  onAnswer: () => void;
  onNext: () => void;
  onDrop: (e: React.DragEvent, dropIndex: number) => void;
  draggedItems: string[];
  dropZones: (string | null)[];
  onDragStart: (e: React.DragEvent, item: string) => void;
  onDragOver: (e: React.DragEvent) => void;
}

export const QuizContent: React.FC<QuizContentProps> = ({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  selectedAnswer,
  setSelectedAnswer,
  isAnswered,
  showExplanation,
  isLastQuestion,
  isCorrect,
  canAnswer,
  onAnswer,
  onNext,
  onDrop,
  draggedItems,
  dropZones,
  onDragStart,
  onDragOver
}) => {
  const renderQuestionInput = () => {
    switch (currentQuestion.type) {
      case 'multiple-choice':
        return (
          <MultipleChoiceQuestion
            question={currentQuestion}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={setSelectedAnswer}
            isAnswered={isAnswered}
          />
        );

      case 'image-selection':
        return (
          <ImageSelectionQuestion
            question={currentQuestion}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={setSelectedAnswer}
            isAnswered={isAnswered}
          />
        );

      case 'sorting':
        return (
          <SortingQuestion
            question={currentQuestion}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={setSelectedAnswer}
            isAnswered={isAnswered}
            draggedItems={draggedItems}
            dropZones={dropZones}
            onDragStart={onDragStart}
            onDrop={onDrop}
            onDragOver={onDragOver}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      <QuizHeader
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={totalQuestions}
        question={currentQuestion.question}
        points={currentQuestion.points}
      />

      {currentQuestion.mediaUrl && (
        <img
          src={currentQuestion.mediaUrl}
          alt="Question media"
          className="w-full max-w-md mx-auto rounded-lg mb-4"
        />
      )}

      {renderQuestionInput()}

      {showExplanation && currentQuestion.explanation && (
        <QuizExplanation
          explanation={currentQuestion.explanation}
          isCorrect={isCorrect}
        />
      )}

      <QuizControls
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={totalQuestions}
        isAnswered={isAnswered}
        showExplanation={showExplanation}
        isLastQuestion={isLastQuestion}
        onAnswer={onAnswer}
        onNext={onNext}
        canAnswer={canAnswer}
      />
    </>
  );
};