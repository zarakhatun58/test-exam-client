/**
 * Timer slice for managing assessment timer
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TimerState } from '@/types';

const initialState: TimerState = {
  timeRemaining: 0,
  isRunning: false,
  isWarning: false,
  isCritical: false,
};

const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    // Start timer
    startTimer: (state, action: PayloadAction<number>) => {
      state.timeRemaining = action.payload;
      state.isRunning = true;
      state.isWarning = false;
      state.isCritical = false;
    },

    // Stop timer
    stopTimer: (state) => {
      state.isRunning = false;
      state.timeRemaining = 0;
      state.isWarning = false;
      state.isCritical = false;
    },

    // Pause timer
    pauseTimer: (state) => {
      state.isRunning = false;
    },

    // Resume timer
    resumeTimer: (state) => {
      state.isRunning = true;
    },

    // Tick timer (decrease by 1 second)
    tick: (state) => {
      if (state.isRunning && state.timeRemaining > 0) {
        state.timeRemaining -= 1;
        
        // Set warning and critical states
        const warningThreshold = 300; // 5 minutes
        const criticalThreshold = 60; // 1 minute
        
        state.isWarning = state.timeRemaining <= warningThreshold && state.timeRemaining > criticalThreshold;
        state.isCritical = state.timeRemaining <= criticalThreshold;
        
        // Auto-stop when time is up
        if (state.timeRemaining <= 0) {
          state.isRunning = false;
          state.timeRemaining = 0;
        }
      }
    },

    // Set time remaining
    setTimeRemaining: (state, action: PayloadAction<number>) => {
      state.timeRemaining = action.payload;
    },

    // Reset timer
    resetTimer: (state) => {
      state.timeRemaining = 0;
      state.isRunning = false;
      state.isWarning = false;
      state.isCritical = false;
    },
    setWarning: (state, action: PayloadAction<boolean>) => {
      state.isWarning = action.payload;
    },
    setCritical: (state, action: PayloadAction<boolean>) => {
      state.isCritical = action.payload;
    },
  },
});

export const {
  startTimer,
  stopTimer,
  pauseTimer,
  resumeTimer,
  tick,
  setTimeRemaining,
  resetTimer,
  setWarning,
  setCritical,
} = timerSlice.actions;

export default timerSlice.reducer;