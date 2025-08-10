import React from 'react';
import { Question } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  onAnswerChange: (answer: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswerChange,
  onNext,
  onPrevious,
  isFirst,
  isLast,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Exam Header */}
      <div className="bg-white border-b border-gray-200 p-4 mb-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Test_School Digital Competency Assessment
            </div>
            <div className="text-sm font-medium">
              Step {question.level[0] === 'A' ? '1' : question.level[0] === 'B' ? '2' : '3'} - Level {question.level}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Question</div>
            <div className="text-lg font-bold">{questionNumber} / {totalQuestions}</div>
          </div>
        </div>
      </div>

      {/* Question Card */}
      <Card className="w-full max-w-4xl mx-auto shadow-lg">
        <CardHeader className="bg-blue-50 border-b">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl text-blue-900">
              Question {questionNumber}
            </CardTitle>
            <Badge variant="outline" className="bg-white border-blue-200">
              Level {question.level} - {question.competency}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          <div className="text-lg font-medium leading-relaxed text-gray-800 bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
            {question.text}
          </div>
          
          <RadioGroup
            value={selectedAnswer?.toString() || ''}
            onValueChange={(value) => onAnswerChange(parseInt(value))}
            className="space-y-4"
          >
            {question.options.map((option, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 rounded-lg border-2 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} className="mt-1" />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-base leading-relaxed">
                  <span className="font-semibold text-blue-600 mr-2">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
          
          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={isFirst}
              className="px-6"
            >
              ← Previous
            </Button>
            
            <Button
              onClick={onNext}
              disabled={selectedAnswer === null}
              className="px-6 bg-blue-600 hover:bg-blue-700"
            >
              {isLast ? 'Submit Assessment →' : 'Next Question →'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionCard;