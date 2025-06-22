import React, { useState, useEffect } from 'react';
import { TestQuestion, TestAnswer, TestResult } from '../types/learning';
import { useLearningStore } from '../state/learning';
import { useAuthStore } from '../state/auth';
import { cn } from '../utils/cn';

interface QuizProps {
  videoId: string;
  questions: TestQuestion[];
  onComplete: (result: TestResult) => void;
}

export const Quiz: React.FC<QuizProps> = ({ videoId, questions, onComplete }) => {
  const { user } = useAuthStore();
  const { submitTestResult } = useLearningStore();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<TestAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | string[]>('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [draggedItems, setDraggedItems] = useState<string[]>([]);
  const [dropZones, setDropZones] = useState<string[]>([]);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  useEffect(() => {
    setQuestionStartTime(Date.now());
    setSelectedAnswer('');
    setIsAnswered(false);
    setShowExplanation(false);
    
    // Initialize drag & drop for sorting questions
    if (currentQuestion.type === 'sorting' && currentQuestion.options) {
      setDraggedItems([...currentQuestion.options].sort(() => Math.random() - 0.5));
      setDropZones([]);
    }
  }, [currentQuestionIndex, currentQuestion]);

  const handleAnswer = () => {
    if (!user || isAnswered) return;

    const timeSpent = (Date.now() - questionStartTime) / 1000;
    const isCorrect = checkAnswer();
    
    const answer: TestAnswer = {
      questionId: currentQuestion.id,
      userAnswer: selectedAnswer,
      correct: isCorrect,
      timeSpent
    };

    setAnswers([...answers, answer]);
    setIsAnswered(true);
    setShowExplanation(true);
  };

  const checkAnswer = (): boolean => {
    switch (currentQuestion.type) {
      case 'multiple-choice':
        return selectedAnswer === currentQuestion.correctAnswer;
      
      case 'sorting':
        const correctOrder = currentQuestion.correctAnswer as string[];
        return JSON.stringify(dropZones) === JSON.stringify(correctOrder);
      
      case 'drag-drop':
        return Array.isArray(selectedAnswer) && 
               Array.isArray(currentQuestion.correctAnswer) &&
               selectedAnswer.sort().join(',') === (currentQuestion.correctAnswer as string[]).sort().join(',');
      
      case 'image-selection':
        return selectedAnswer === currentQuestion.correctAnswer;
      
      default:
        return false;
    }
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

    const totalPoints = questions.reduce((acc, q) => acc + q.points, 0);
    const earnedPoints = answers.reduce((acc, answer) => {
      const question = questions.find(q => q.id === answer.questionId);
      return acc + (answer.correct ? (question?.points || 0) : 0);
    }, 0);

    const score = Math.round((earnedPoints / totalPoints) * 100);
    const passed = score >= 70; // 70% to pass

    const result: TestResult = {
      id: `test_${Date.now()}`,
      userId: user.id,
      trainingId: videoId,
      score,
      passed,
      completedAt: new Date(),
      answers,
      earnedXP: passed ? Math.floor(score * 2) : Math.floor(score * 0.5),
      earnedCoins: passed ? Math.floor(score / 5) : Math.floor(score / 10)
    };

    submitTestResult(result);
    onComplete(result);
  };

  // Handle drag and drop
  const handleDragStart = (e: React.DragEvent, item: string) => {
    e.dataTransfer.setData('text/plain', item);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const draggedItem = e.dataTransfer.getData('text/plain');
    
    if (currentQuestion.type === 'sorting') {
      const newDropZones = [...dropZones];
      newDropZones[dropIndex] = draggedItem;
      setDropZones(newDropZones);
      
      const newDraggedItems = draggedItems.filter(item => item !== draggedItem);
      setDraggedItems(newDraggedItems);
      
      if (newDropZones.filter(Boolean).length === currentQuestion.options?.length) {
        setSelectedAnswer(newDropZones);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const renderQuestionInput = () => {
    switch (currentQuestion.type) {
      case 'multiple-choice':
        return (
          <div className="space-y-3">
            {currentQuestion.options?.map((option, index) => (
              <label
                key={index}
                className={cn(
                  "flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all",
                  selectedAnswer === option
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <input
                  type="radio"
                  name="answer"
                  value={option}
                  checked={selectedAnswer === option}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                  className="mr-3"
                  disabled={isAnswered}
                />
                <span className="text-lg">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'image-selection':
        return (
          <div className="grid grid-cols-2 gap-4">
            {currentQuestion.options?.map((option, index) => (
              <div
                key={index}
                className={cn(
                  "border-2 rounded-lg p-4 cursor-pointer transition-all",
                  selectedAnswer === option
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                )}
                onClick={() => !isAnswered && setSelectedAnswer(option)}
              >
                <img
                  src={`/quiz-images/${option}.jpg`}
                  alt={option}
                  className="w-full h-32 object-cover rounded mb-2"
                />
                <p className="text-center font-medium">{option}</p>
              </div>
            ))}
          </div>
        );

      case 'sorting':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">Zu sortierende Elemente:</h4>
              <div className="flex flex-wrap gap-2">
                {draggedItems.map((item, index) => (
                  <div
                    key={index}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item)}
                    className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg cursor-move border-2 border-blue-200 hover:bg-blue-200 transition-colors"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">Richtige Reihenfolge:</h4>
              <div className="space-y-2">
                {Array.from({ length: currentQuestion.options?.length || 0 }).map((_, index) => (
                  <div
                    key={index}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragOver={handleDragOver}
                    className={cn(
                      "border-2 border-dashed p-4 rounded-lg min-h-[60px] flex items-center",
                      dropZones[index]
                        ? "border-green-300 bg-green-50"
                        : "border-gray-300 bg-gray-50"
                    )}
                  >
                    {dropZones[index] ? (
                      <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg">
                        {dropZones[index]}
                      </div>
                    ) : (
                      <span className="text-gray-400">Position {index + 1}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'drag-drop':
        return (
          <div className="space-y-4">
            <p className="text-gray-600">Wählen Sie alle zutreffenden Antworten:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentQuestion.options?.map((option, index) => (
                <label
                  key={index}
                  className={cn(
                    "flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all",
                    Array.isArray(selectedAnswer) && selectedAnswer.includes(option)
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <input
                    type="checkbox"
                    value={option}
                    checked={Array.isArray(selectedAnswer) && selectedAnswer.includes(option)}
                    onChange={(e) => {
                      const current = Array.isArray(selectedAnswer) ? selectedAnswer : [];
                      if (e.target.checked) {
                        setSelectedAnswer([...current, option]);
                      } else {
                        setSelectedAnswer(current.filter(item => item !== option));
                      }
                    }}
                    className="mr-3"
                    disabled={isAnswered}
                  />
                  <span className="text-lg">{option}</span>
                </label>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">
            Frage {currentQuestionIndex + 1} von {questions.length}
          </span>
          <span className="text-sm text-gray-600">
            {currentQuestion.points} Punkte
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          {currentQuestion.question}
        </h3>

        {currentQuestion.mediaUrl && (
          <img
            src={currentQuestion.mediaUrl}
            alt="Question media"
            className="w-full max-w-md mx-auto rounded-lg mb-4"
          />
        )}

        {renderQuestionInput()}
      </div>

      {/* Explanation */}
      {showExplanation && currentQuestion.explanation && (
        <div className={cn(
          "p-4 rounded-lg mb-6",
          checkAnswer() ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
        )}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">
              {checkAnswer() ? '✅' : '❌'}
            </span>
            <div>
              <p className="font-medium mb-2">
                {checkAnswer() ? 'Richtig!' : 'Leider falsch'}
              </p>
              <p className="text-gray-700">{currentQuestion.explanation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between">
        <button
          disabled={currentQuestionIndex === 0}
          onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Zurück
        </button>

        {!isAnswered ? (
          <button
            onClick={handleAnswer}
            disabled={!selectedAnswer || (Array.isArray(selectedAnswer) && selectedAnswer.length === 0)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Antworten
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            {isLastQuestion ? 'Quiz beenden' : 'Weiter'}
          </button>
        )}
      </div>
    </div>
  );
};