import React from 'react';
import { TestQuestion } from '../../types/learning';
import { cn } from '../../utils/cn';

// UI Constants
const BORDER_STYLES = {
  selected: "border-blue-500 bg-blue-50",
  default: "border-gray-200 hover:border-gray-300"
} as const;

interface QuestionTypeProps {
  question: TestQuestion;
  selectedAnswer: string | string[];
  onAnswerSelect: (answer: string | string[]) => void;
  isAnswered: boolean;
}

export const MultipleChoiceQuestion: React.FC<QuestionTypeProps> = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  isAnswered
}) => (
  <div className="space-y-3">
    {question.options?.map((option, index) => (
      <label
        key={index}
        className={cn(
          "flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all",
          selectedAnswer === option ? BORDER_STYLES.selected : BORDER_STYLES.default
        )}
      >
        <input
          type="radio"
          name="answer"
          value={option}
          checked={selectedAnswer === option}
          onChange={(e) => onAnswerSelect(e.target.value)}
          className="mr-3"
          disabled={isAnswered}
        />
        <span className="text-lg">{option}</span>
      </label>
    ))}
  </div>
);

export const ImageSelectionQuestion: React.FC<QuestionTypeProps> = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  isAnswered
}) => (
  <div className="grid grid-cols-2 gap-4">
    {question.options?.map((option, index) => (
      <div
        key={index}
        className={cn(
          "border-2 rounded-lg p-4 cursor-pointer transition-all",
          selectedAnswer === option ? BORDER_STYLES.selected : BORDER_STYLES.default
        )}
        onClick={() => !isAnswered && onAnswerSelect(option)}
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

interface SortingQuestionProps extends QuestionTypeProps {
  draggedItems: string[];
  dropZones: (string | null)[];
  onDragStart: (e: React.DragEvent, item: string) => void;
  onDrop: (e: React.DragEvent, dropIndex: number) => void;
  onDragOver: (e: React.DragEvent) => void;
}

export const SortingQuestion: React.FC<SortingQuestionProps> = ({
  question,
  draggedItems,
  dropZones,
  onDragStart,
  onDrop,
  onDragOver,
  isAnswered
}) => (
  <div className="space-y-6">
    <div className="text-lg font-medium mb-4">
      Sortiere die folgenden Elemente in die richtige Reihenfolge:
    </div>
    
    {/* Draggable items */}
    <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg min-h-[60px]">
      {draggedItems.map((item, index) => (
        <div
          key={index}
          draggable={!isAnswered}
          onDragStart={(e) => onDragStart(e, item)}
          className={cn(
            "px-4 py-2 bg-white border-2 border-gray-300 rounded-lg cursor-move shadow-sm",
            !isAnswered && "hover:border-blue-300"
          )}
        >
          {item}
        </div>
      ))}
    </div>
    
    {/* Drop zones */}
    <div className="space-y-2">
      {question.options?.map((_, index) => (
        <div
          key={index}
          onDrop={(e) => onDrop(e, index)}
          onDragOver={onDragOver}
          className={cn(
            "min-h-[50px] border-2 border-dashed border-gray-300 rounded-lg p-3 flex items-center",
            dropZones[index] && "bg-blue-50 border-blue-300"
          )}
        >
          <span className="mr-3 font-medium text-gray-500">{index + 1}.</span>
          <span className="text-lg">
            {dropZones[index] || "Hier ablegen..."}
          </span>
        </div>
      ))}
    </div>
  </div>
);