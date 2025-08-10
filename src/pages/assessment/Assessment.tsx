import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '@/store';
import {
  useStartAssessmentMutation,
  useSubmitAnswerMutation,
  useSubmitAssessmentMutation,
  useGetCurrentSessionQuery,
  useCanTakeAssessmentQuery,
  useGetAssessmentStatsQuery,
  useGetQuestionsByLevelQuery
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
import { AssessmentStep, AssessmentSession, Question, AssessmentLevel } from '@/types';
import { getQuestionsByStep, calculateResult } from '@/data/questions';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Play, BookOpen } from 'lucide-react';
import AssessmentTimer from '@/components/assessment/AssessmentTimer';
import QuestionCard from '@/components/assessment/QuestionCard';
import StepProgress, { StepInfo } from '@/components/assessment/StepProgress';

const QUESTIONS_PER_STEP = 44;

const Assessment: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
   const [level, setLevel] = useState<AssessmentLevel>('A1');
 const { data, error:questionError, isLoading:questionLoading } = useGetQuestionsByLevelQuery({ level, limit: 100 });
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  // Calculate current step based on question index
  const currentStep = (Math.floor(currentIndex / QUESTIONS_PER_STEP) + 1) as AssessmentStep;
  const [selectedStep, setSelectedStep] = useState<AssessmentStep>(1);
  const { data: statsData, isLoading: statsLoading } = useGetAssessmentStatsQuery();
  // const currentStep: AssessmentStep = statsData?.data?.currentLevel ? selectedStep : 1;
  const completedSteps: AssessmentStep[] = statsData?.data?.completedSteps || [];
  // Assume currentLevel is part of stats data or null if not started
  const currentLevel: AssessmentLevel | null = statsData?.data?.currentLevel || null;
  const { user } = useSelector((state: RootState) => state.auth);
  const { currentSession, isLoading: sessionLoading, error } = useSelector((state: RootState) => state.assessment);
  const [startAssessment, { isLoading: startingAssessment }] = useStartAssessmentMutation();

  const { data: canTakeData, isLoading: canTakeLoading } = useCanTakeAssessmentQuery({ step: selectedStep });

  const { timeRemaining } = useSelector((state: RootState) => state.timer);


  const [hasStarted, setHasStarted] = useState(false);

  const [submitAnswer] = useSubmitAnswerMutation();
  const [submitAssessment] = useSubmitAssessmentMutation();

  const { data: currentSessionData } = useGetCurrentSessionQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });


  const stepsData: StepInfo[] = [
    {
      step: 1,
      title: 'Step 1: Foundation',
      levels: ['A1', 'A2'] as AssessmentLevel[],  // <-- assertion here
      description: 'Basic digital competency assessment',
    },
    {
      step: 2,
      title: 'Step 2: Intermediate',
      levels: ['B1', 'B2'] as AssessmentLevel[],
      description: 'Intermediate digital skills evaluation',
    },
    {
      step: 3,
      title: 'Step 3: Advanced',
      levels: ['C1', 'C2'] as AssessmentLevel[],
      description: 'Advanced competency certification',
    },
  ];
//  useEffect(() => {
//     async function fetchQuestions() {
//       const res = await fetch('/api/questions'); // Your backend endpoint here
//       const data: Question[] = await res.json();
//       setQuestions(data);
//     }
//     fetchQuestions();
//   }, []);

  const totalQuestions = questions.length;

  if (totalQuestions === 0) return <div>Loading questions...</div>;

  const currentQuestion = questions[currentIndex];

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

      // Call backend to start assessment, get session
      const response = await startAssessment({ step: selectedStep }).unwrap();

      if (!response?.data) {
        throw new Error('No session data received');
      }

      // Dispatch the real session data from backend
      dispatch(startSession(response.data));
      dispatch(setTimeRemaining(response.data.timeLimit));
      dispatch(startTimer(response.data.timeLimit));
      setHasStarted(true);

      toast({
        title: "Assessment Started",
        description: `Step ${selectedStep} assessment has begun. Good luck!`,
      });
    } catch (error: any) {
      dispatch(setError(error.data?.message || error.message || 'Failed to start assessment'));
      toast({
        title: "Error",
        description: error.data?.message || error.message || 'Failed to start assessment',
        variant: "destructive",
      });
    } finally {
      dispatch(setLoading(false));
    }
  };
    if (answers.length !== questions.length) {
    setAnswers(new Array(questions.length).fill(null));
  }

  const handleAnswerChange = async (answer: number) => {
    if (!currentSession) return;

    try {
      // Update local state immediately for responsiveness
      dispatch(answerQuestion({
        questionIndex: currentSession.currentQuestionIndex,
        answer,
      }));

      // Submit answer to backend
      await submitAnswer({
        sessionId: currentSession.id,
        questionIndex: currentSession.currentQuestionIndex,
        answer,
      }).unwrap();

    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.data?.message || "Failed to save answer",
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

      // Submit assessment answers to backend
      const response = await submitAssessment({
        sessionId: currentSession.id,
        answers: currentSession.answers,
      }).unwrap();

      // Assuming response.data contains the assessment result from backend
      const result = response.data;

      dispatch(addResult(result));
      dispatch(endSession());
      dispatch(resetTimer());
      dispatch(setLoading(false));

      toast({
        title: "Assessment Completed",
        description: `Your assessment has been submitted successfully! ${result.certification || ''}`,
      });

      navigate('/assessment/results');
    } catch (error: any) {
      dispatch(setLoading(false));
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
   {questions.map((question, idx) => (
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
   ))}
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
        currentStep={currentStep}
        completedSteps={completedSteps}
        currentLevel={currentLevel}
        steps={stepsData}
      />

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {[1, 2, 3].map((step) => {
          const canTake = step === 1 || completedSteps.includes((step - 1) as AssessmentStep);
          const isCompleted = completedSteps.includes(step as AssessmentStep);
          console.log(`Step ${step} - canTake: ${canTake}, isCompleted: ${isCompleted}`);

          return (
            <Card
              key={step}
              className={`cursor-pointer transition-all hover:shadow-lg ${selectedStep === step ? 'ring-2 ring-primary' : ''
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
      {!canTakeData?.data?.canTake && (
        <p style={{ color: 'red' }}>
          {canTakeData?.data?.reason || 'You cannot take this assessment step right now.'}
        </p>
      )}
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
          disabled={startingAssessment || !canTakeData?.data?.canTake}
          className="px-8"
        >
          <Play className="h-5 w-5 mr-2" />
          {startingAssessment ? 'Starting...' : `Start Step ${selectedStep} Assessment`}
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