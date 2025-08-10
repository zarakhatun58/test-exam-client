import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '@/store';
import { 
  useStartAssessmentMutation, 
  useSubmitAnswerMutation, 
  useSubmitAssessmentMutation,
  useGetCurrentSessionQuery,
  useCanTakeAssessmentQuery
} from '@/store/api/assessmentApi';
import { 
  startSession, 
  setCurrentQuestion, 
  answerQuestion, 
  endSession,
  addResult,
  setLoading,
  setError
} from '@/store/slices/assessmentSlice';
import { startTimer, setTimeRemaining, resetTimer } from '@/store/slices/timerSlice';
import { AssessmentStep, AssessmentSession, Question } from '@/types';
import { getQuestionsByStep, calculateResult } from '@/data/questions';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Play, BookOpen } from 'lucide-react';
import AssessmentTimer from '@/components/assessment/AssessmentTimer';
import QuestionCard from '@/components/assessment/QuestionCard';
import StepProgress from '@/components/assessment/StepProgress';

const Assessment: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user } = useSelector((state: RootState) => state.auth);
  const { currentSession, isLoading, error } = useSelector((state: RootState) => state.assessment);
  const { timeRemaining } = useSelector((state: RootState) => state.timer);
  
  const [selectedStep, setSelectedStep] = useState<AssessmentStep>(1);
  const [hasStarted, setHasStarted] = useState(false);
  
  const [startAssessment] = useStartAssessmentMutation();
  const [submitAnswer] = useSubmitAnswerMutation();
  const [submitAssessment] = useSubmitAssessmentMutation();
  
  const { data: currentSessionData } = useGetCurrentSessionQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  
  const { data: canTakeData } = useCanTakeAssessmentQuery({ step: selectedStep });

  useEffect(() => {
    if (currentSessionData?.data) {
      dispatch(startSession(currentSessionData.data));
      setHasStarted(true);
      const timeLeft = Math.max(0, 
        (new Date(currentSessionData.data.startTime).getTime() + currentSessionData.data.timeLimit * 1000) - 
        new Date().getTime()
      ) / 1000;
      dispatch(setTimeRemaining(Math.floor(timeLeft)));
      dispatch(startTimer());
    }
  }, [currentSessionData, dispatch]);

  const handleStartAssessment = async () => {
    try {
      dispatch(setLoading(true));
      
      // Generate questions for the selected step
      const questions = getQuestionsByStep(selectedStep);
      const timeLimit = questions.length * 60; // 1 minute per question
      
      // Create mock session
      const mockSession: AssessmentSession = {
        id: `session_${Date.now()}`,
        userId: user!.id,
        step: selectedStep,
        questions,
        answers: new Array(questions.length).fill(null),
        startTime: new Date().toISOString(),
        timeLimit,
        currentQuestionIndex: 0,
        status: 'in_progress'
      };
      
      dispatch(startSession(mockSession));
      dispatch(setTimeRemaining(timeLimit));
      dispatch(startTimer(timeLimit));
      setHasStarted(true);
      
      toast({
        title: "Assessment Started",
        description: `Step ${selectedStep} assessment has begun. Good luck!`,
      });
    } catch (error: any) {
      dispatch(setError(error.data?.message || 'Failed to start assessment'));
      toast({
        title: "Error",
        description: error.data?.message || 'Failed to start assessment',
        variant: "destructive",
      });
    }
  };

  const handleAnswerChange = async (answer: number) => {
    if (!currentSession) return;
    
    try {
      dispatch(answerQuestion({ 
        questionIndex: currentSession.currentQuestionIndex, 
        answer 
      }));
      
      await submitAnswer({
        sessionId: currentSession.id,
        questionIndex: currentSession.currentQuestionIndex,
        answer,
      }).unwrap();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to save answer",
        variant: "destructive",
      });
    }
  };

  const handleNext = () => {
    if (!currentSession) return;
    
    if (currentSession.currentQuestionIndex < currentSession.questions.length - 1) {
      dispatch(setCurrentQuestion(currentSession.currentQuestionIndex + 1));
    } else {
      handleSubmitAssessment();
    }
  };

  const handlePrevious = () => {
    if (!currentSession) return;
    
    if (currentSession.currentQuestionIndex > 0) {
      dispatch(setCurrentQuestion(currentSession.currentQuestionIndex - 1));
    }
  };

  const handleSubmitAssessment = async () => {
    if (!currentSession) return;
    
    try {
      dispatch(setLoading(true));
      
      // Calculate results using the questions and answers
      const result = calculateResult(
        currentSession.answers.map(a => a || 0), 
        currentSession.questions, 
        currentSession.step
      );
      
      // Create mock result
      const assessmentResult = {
        id: `result_${Date.now()}`,
        userId: user!.id,
        sessionId: currentSession.id,
        step: currentSession.step,
        score: result.score,
        totalQuestions: result.totalQuestions,
        percentage: result.percentage,
        certification: result.certification,
        canProceed: result.canProceed,
        completedAt: new Date().toISOString(),
        timeSpent: currentSession.timeLimit - timeRemaining
      };
      
      dispatch(addResult(assessmentResult));
      dispatch(endSession());
      dispatch(resetTimer());
      
      toast({
        title: "Assessment Completed",
        description: `Your assessment has been submitted successfully! ${result.certification}`,
      });
      
      navigate('/assessment/results');
    } catch (error: any) {
      dispatch(setError(error.data?.message || 'Failed to submit assessment'));
      toast({
        title: "Error",
        description: error.data?.message || 'Failed to submit assessment',
        variant: "destructive",
      });
    }
  };

  const handleTimeUp = () => {
    toast({
      title: "Time's Up!",
      description: "Your assessment is being submitted automatically.",
      variant: "destructive",
    });
    handleSubmitAssessment();
  };

  if (!user) {
    return (
      <Alert className="max-w-md mx-auto mt-8">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Please log in to access the assessment.
        </AlertDescription>
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert className="max-w-md mx-auto mt-8" variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // Assessment in progress
  if (hasStarted && currentSession) {
    const currentQuestion = currentSession.questions[currentSession.currentQuestionIndex];
    const selectedAnswer = currentSession.answers[currentSession.currentQuestionIndex];

    return (
      <div className="relative min-h-screen">
        <AssessmentTimer 
          totalTime={currentSession.timeLimit}
          onTimeUp={handleTimeUp}
        />
        
        <QuestionCard
          question={currentQuestion}
          questionNumber={currentSession.currentQuestionIndex + 1}
          totalQuestions={currentSession.questions.length}
          selectedAnswer={selectedAnswer}
          onAnswerChange={handleAnswerChange}
          onNext={handleNext}
          onPrevious={handlePrevious}
          isFirst={currentSession.currentQuestionIndex === 0}
          isLast={currentSession.currentQuestionIndex === currentSession.questions.length - 1}
        />
      </div>
    );
  }

  // Assessment selection/start screen
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Test_School Competency Assessment</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Assess your digital skills through our structured 3-step evaluation process
        </p>
      </div>

      <StepProgress 
        currentStep={selectedStep}
        completedSteps={user.completedSteps}
        currentLevel={user.currentLevel}
      />

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {[1, 2, 3].map((step) => {
          const canTake = step === 1 || user.completedSteps.includes((step - 1) as AssessmentStep);
          const isCompleted = user.completedSteps.includes(step as AssessmentStep);
          
          return (
            <Card 
              key={step} 
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedStep === step ? 'ring-2 ring-primary' : ''
              } ${!canTake ? 'opacity-50' : ''}`}
              onClick={() => canTake && setSelectedStep(step as AssessmentStep)}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Step {step}
                  {isCompleted && <span className="text-xs bg-success text-success-foreground px-2 py-1 rounded">Completed</span>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">
                    {step === 1 && 'Foundation (A1-A2)'}
                    {step === 2 && 'Intermediate (B1-B2)'}
                    {step === 3 && 'Advanced (C1-C2)'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    44 questions • 44 minutes
                  </p>
                  {!canTake && (
                    <p className="text-xs text-destructive">
                      Complete previous step to unlock
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center space-y-4">
        <Alert className="max-w-md mx-auto">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Once started, you cannot pause the assessment. Make sure you have enough time to complete it.
          </AlertDescription>
        </Alert>
        
        <Button 
          size="lg" 
          onClick={handleStartAssessment}
          disabled={isLoading || !canTakeData?.data?.canTake}
          className="px-8"
        >
          <Play className="h-5 w-5 mr-2" />
          {isLoading ? 'Starting...' : `Start Step ${selectedStep} Assessment`}
        </Button>
        
        {canTakeData?.data && !canTakeData.data.canTake && (
          <p className="text-sm text-destructive">
            {canTakeData.data.reason}
          </p>
        )}
      </div>
    </div>
  );
};

export default Assessment;