import { TestQuestion, TestAnswer, TestResult } from '../../types/learning';

export const checkAnswer = (
  question: TestQuestion,
  selectedAnswer: string | string[],
  dropZones?: (string | null)[]
): boolean => {
  switch (question.type) {
    case 'multiple-choice':
    case 'image-selection':
      return selectedAnswer === question.correctAnswer;
    
    case 'sorting':
      const correctOrder = question.correctAnswer as string[];
      return JSON.stringify(dropZones) === JSON.stringify(correctOrder);
    
    case 'drag-drop':
      return Array.isArray(selectedAnswer) && 
             Array.isArray(question.correctAnswer) &&
             selectedAnswer.sort().join(',') === (question.correctAnswer as string[]).sort().join(',');
    
    default:
      return false;
  }
};

export const calculateQuizResult = (
  questions: TestQuestion[],
  answers: TestAnswer[],
  userId: string,
  videoId: string
): TestResult => {
  const totalPoints = questions.reduce((acc, q) => acc + q.points, 0);
  const earnedPoints = answers.reduce((acc, answer) => {
    const question = questions.find(q => q.id === answer.questionId);
    return acc + (answer.correct ? (question?.points || 0) : 0);
  }, 0);

  const score = Math.round((earnedPoints / totalPoints) * 100);
  const passed = score >= 70; // 70% to pass

  return {
    id: `test_${Date.now()}`,
    userId,
    trainingId: videoId,
    score,
    passed,
    completedAt: new Date(),
    answers,
    earnedXP: passed ? Math.floor(score * 2) : Math.floor(score * 0.5),
    earnedCoins: passed ? Math.floor(score / 5) : Math.floor(score / 10)
  };
};

export const createTestAnswer = (
  question: TestQuestion,
  selectedAnswer: string | string[],
  timeSpent: number,
  isCorrect: boolean
): TestAnswer => ({
  questionId: question.id,
  userAnswer: selectedAnswer,
  correct: isCorrect,
  timeSpent
});