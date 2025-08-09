import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setTimeRemaining, stopTimer, setWarning, setCritical } from '@/store/slices/timerSlice';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, AlertTriangle } from 'lucide-react';

interface AssessmentTimerProps {
  totalTime: number; // in seconds
  onTimeUp: () => void;
}

const AssessmentTimer: React.FC<AssessmentTimerProps> = ({ totalTime, onTimeUp }) => {
  const dispatch = useDispatch();
  const { timeRemaining, isRunning, isWarning, isCritical } = useSelector((state: RootState) => state.timer);

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      const interval = setInterval(() => {
        dispatch(setTimeRemaining(timeRemaining - 1));
        
        // Set warning at 25% time remaining
        if (timeRemaining <= totalTime * 0.25 && timeRemaining > totalTime * 0.1) {
          dispatch(setWarning(true));
        }
        
        // Set critical at 10% time remaining
        if (timeRemaining <= totalTime * 0.1) {
          dispatch(setCritical(true));
        }
      }, 1000);

      return () => clearInterval(interval);
    } else if (timeRemaining === 0) {
      dispatch(stopTimer());
      onTimeUp();
    }
  }, [dispatch, timeRemaining, isRunning, totalTime, onTimeUp]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = (): string => {
    if (isCritical) return 'text-destructive';
    if (isWarning) return 'text-warning';
    return 'text-foreground';
  };

  return (
    <div className="space-y-4">
      <div className={`flex items-center gap-2 text-lg font-semibold ${getTimerColor()}`}>
        <Clock className="h-5 w-5" />
        <span>Time Remaining: {formatTime(timeRemaining)}</span>
      </div>
      
      {isWarning && !isCritical && (
        <Alert className="border-warning bg-warning/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Warning: You have less than 25% time remaining. Please manage your time carefully.
          </AlertDescription>
        </Alert>
      )}
      
      {isCritical && (
        <Alert className="border-destructive bg-destructive/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Critical: You have less than 10% time remaining. The test will auto-submit when time runs out.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default AssessmentTimer;