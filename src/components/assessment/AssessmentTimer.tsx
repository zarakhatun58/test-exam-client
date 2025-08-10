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
    <div className="fixed top-4 right-4 z-50">
      <div className={`bg-white rounded-lg shadow-lg border-2 p-4 min-w-[200px] ${
        isCritical ? 'border-red-500 bg-red-50' : 
        isWarning ? 'border-yellow-500 bg-yellow-50' : 
        'border-blue-500 bg-blue-50'
      }`}>
        <div className="text-center">
          <div className="text-xs text-gray-600 uppercase tracking-wide mb-1">
            Time Remaining
          </div>
          <div className={`text-2xl font-bold ${getTimerColor()}`}>
            {formatTime(timeRemaining)}
          </div>
          <div className="flex items-center justify-center gap-1 mt-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-xs text-gray-500">
              {isCritical ? 'CRITICAL' : isWarning ? 'WARNING' : 'NORMAL'}
            </span>
          </div>
        </div>
      </div>
      
      {isWarning && !isCritical && (
        <Alert className="mt-2 border-yellow-500 bg-yellow-50 text-yellow-800">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Less than 25% time remaining
          </AlertDescription>
        </Alert>
      )}
      
      {isCritical && (
        <Alert className="mt-2 border-red-500 bg-red-50 text-red-800">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Auto-submit in progress!
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default AssessmentTimer;