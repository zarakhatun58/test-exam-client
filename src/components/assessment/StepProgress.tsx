import React from 'react';
import { AssessmentStep, AssessmentLevel } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Lock } from 'lucide-react';

export interface StepInfo {
  step: AssessmentStep;
  title: string;
  levels: AssessmentLevel[];
  description: string;
}

interface StepProgressProps {
  currentStep: AssessmentStep;
  completedSteps: AssessmentStep[];
  currentLevel: AssessmentLevel | null;
  steps: StepInfo[];
}

const StepProgress: React.FC<StepProgressProps> = ({
  currentStep,
  completedSteps,
  currentLevel,
  steps,
}) => {
  // Determine if a step is available based on dependencies (previous steps completed)
  const isStepAvailable = (stepIndex: number): boolean => {
    if (stepIndex === 0) return true; // first step always available
    // Check if all previous steps are completed
    for (let i = 0; i < stepIndex; i++) {
      if (!completedSteps.includes(steps[i].step)) return false;
    }
    return true;
  };

  const getStepStatus = (stepIndex: number) => {
    const step = steps[stepIndex].step;
    if (completedSteps.includes(step)) return 'completed';
    if (step === currentStep) return 'current';
    if (isStepAvailable(stepIndex)) return 'available';
    return 'locked';
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-success" />;
      case 'current':
        return <Circle className="h-6 w-6 text-primary fill-primary" />;
      case 'available':
        return <Circle className="h-6 w-6 text-muted-foreground" />;
      default:
        return <Lock className="h-6 w-6 text-muted-foreground" />;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mb-6">
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          {steps.map((stepInfo, index) => {
            const status = getStepStatus(index);
            return (
              <React.Fragment key={stepInfo.step}>
                <div className="flex flex-col items-center text-center space-y-2">
                  {getStepIcon(status)}
                  <div>
                    <h3 className="font-semibold text-sm">{stepInfo.title}</h3>
                    <p className="text-xs text-muted-foreground">{stepInfo.description}</p>
                    <div className="flex gap-1 mt-1">
                      {stepInfo.levels.map((level) => (
                        <Badge
                          key={level}
                          variant={currentLevel === level ? 'default' : 'outline'}
                          className="text-xs"
                        >
                          {level}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {index < steps.length - 1 && <div className="flex-1 h-px bg-border mx-4" />}
              </React.Fragment>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default StepProgress;
