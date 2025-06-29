import React from 'react';
import { cn } from '../../utils/cn';

interface QuizControlsProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  isAnswered: boolean;
  showExplanation: boolean;
  isLastQuestion: boolean;
  onAnswer: () => void;
  onNext: () => void;
  canAnswer: boolean;
}

export const QuizControls: React.FC<QuizControlsProps> = ({
  currentQuestionIndex,
  totalQuestions,
  isAnswered,
  showExplanation,
  isLastQuestion,
  onAnswer,
  onNext,
  canAnswer
}) => (
  <div className="flex justify-between items-center mt-8">
    {/* Progress indicator */}
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">
        Frage {currentQuestionIndex + 1} von {totalQuestions}
      </span>
      <div className="w-32 bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
        />
      </div>
    </div>

    {/* Action buttons */}
    <div className="flex space-x-3">
      {!isAnswered && (
        <button
          onClick={onAnswer}
          disabled={!canAnswer}
          className={cn(
            "px-6 py-2 rounded-lg font-medium transition-all",
            canAnswer
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          )}
        >
          Antworten
        </button>
      )}

      {showExplanation && (
        <button
          onClick={onNext}
          className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all"
        >
          {isLastQuestion ? 'Quiz beenden' : 'Nächste Frage'}
        </button>
      )}
    </div>
  </div>
);

interface QuizHeaderProps {
  questionNumber: number;
  totalQuestions: number;
  question: string;
  points: number;
}

export const QuizHeader: React.FC<QuizHeaderProps> = ({
  questionNumber,
  totalQuestions,
  question,
  points
}) => (
  <div className="mb-8">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-xl font-bold text-gray-900">
        Frage {questionNumber} von {totalQuestions}
      </h3>
      <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
        {points} Punkte
      </span>
    </div>
    
    <p className="text-lg text-gray-700 leading-relaxed">
      {question}
    </p>
  </div>
);

interface QuizExplanationProps {
  explanation?: string;
  isCorrect: boolean;
}

export const QuizExplanation: React.FC<QuizExplanationProps> = ({
  explanation,
  isCorrect
}) => (
  <div className={cn(
    "mt-6 p-4 rounded-lg border-l-4",
    isCorrect 
      ? "bg-green-50 border-green-500" 
      : "bg-red-50 border-red-500"
  )}>
    <div className="flex items-center mb-2">
      <span className={cn(
        "text-lg font-medium",
        isCorrect ? "text-green-800" : "text-red-800"
      )}>
        {isCorrect ? "✓ Richtig!" : "✗ Falsch"}
      </span>
    </div>
    
    {explanation && (
      <p className={cn(
        "text-sm",
        isCorrect ? "text-green-700" : "text-red-700"
      )}>
        {explanation}
      </p>
    )}
  </div>
);