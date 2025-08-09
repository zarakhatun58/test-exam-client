import React from 'react';
import { AssessmentStep, AssessmentLevel } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Lock } from 'lucide-react';

interface StepProgressProps {
  currentStep: AssessmentStep;
  completedSteps: AssessmentStep[];
  currentLevel: AssessmentLevel | null;
}

const StepProgress: React.FC<StepProgressProps> = ({
  currentStep,
  completedSteps,
  currentLevel,
}) => {
  const steps = [
    {
      step: 1 as AssessmentStep,
      title: 'Step 1: Foundation',
      levels: ['A1', 'A2'],
      description: 'Basic digital competency assessment',
    },
    {
      step: 2 as AssessmentStep,
      title: 'Step 2: Intermediate',
      levels: ['B1', 'B2'],
      description: 'Intermediate digital skills evaluation',
    },
    {
      step: 3 as AssessmentStep,
      title: 'Step 3: Advanced',
      levels: ['C1', 'C2'],
      description: 'Advanced competency certification',
    },
  ];

  const getStepStatus = (step: AssessmentStep) => {
    if (completedSteps.includes(step)) return 'completed';
    if (step === currentStep) return 'current';
    if (step === 1) return 'available';
    if (step === 2 && completedSteps.includes(1)) return 'available';
    if (step === 3 && completedSteps.includes(2)) return 'available';
    return 'locked';
  };

  const getStepIcon = (step: AssessmentStep) => {
    const status = getStepStatus(step);
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
          {steps.map((stepInfo, index) => (
            <React.Fragment key={stepInfo.step}>
              <div className="flex flex-col items-center text-center space-y-2">
                {getStepIcon(stepInfo.step)}
                <div>
                  <h3 className="font-semibold text-sm">{stepInfo.title}</h3>
                  <p className="text-xs text-muted-foreground">{stepInfo.description}</p>
                  <div className="flex gap-1 mt-1">
                    {stepInfo.levels.map((level) => (
                      <Badge
                        key={level}
                        variant={currentLevel === level ? "default" : "outline"}
                        className="text-xs"
                      >
                        {level}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className="flex-1 h-px bg-border mx-4" />
              )}
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StepProgress;