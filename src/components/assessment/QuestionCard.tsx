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
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">
            Question {questionNumber} of {totalQuestions}
          </CardTitle>
          <Badge variant="outline" className="ml-2">
            Level {question.level}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-lg font-medium leading-relaxed">
          {question.text}
        </div>
        
        <RadioGroup
          value={selectedAnswer?.toString() || ''}
          onValueChange={(value) => onAnswerChange(parseInt(value))}
          className="space-y-3"
        >
          {question.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <RadioGroupItem value={index.toString()} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-base">
                {String.fromCharCode(65 + index)}. {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
        
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={isFirst}
          >
            Previous
          </Button>
          
          <Button
            onClick={onNext}
            disabled={selectedAnswer === null}
            className="ml-auto"
          >
            {isLast ? 'Submit Assessment' : 'Next Question'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;