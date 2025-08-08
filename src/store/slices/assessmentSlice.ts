/**
 * Assessment slice for managing assessment state
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AssessmentState, AssessmentSession, AssessmentResult, Certificate, Question } from '@/types';

const initialState: AssessmentState = {
  currentSession: null,
  results: [],
  certificates: [],
  isLoading: false,
  error: null,
};

const assessmentSlice = createSlice({
  name: 'assessment',
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Set error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Start assessment session
    startSession: (state, action: PayloadAction<AssessmentSession>) => {
      state.currentSession = action.payload;
      state.error = null;
    },

    // Update current question index
    setCurrentQuestion: (state, action: PayloadAction<number>) => {
      if (state.currentSession) {
        state.currentSession.currentQuestionIndex = action.payload;
      }
    },

    // Answer question
    answerQuestion: (state, action: PayloadAction<{ questionIndex: number; answer: number }>) => {
      if (state.currentSession) {
        state.currentSession.answers[action.payload.questionIndex] = action.payload.answer;
      }
    },

    // End session
    endSession: (state) => {
      if (state.currentSession) {
        state.currentSession.isActive = false;
      }
    },

    // Clear session
    clearSession: (state) => {
      state.currentSession = null;
    },

    // Add result
    addResult: (state, action: PayloadAction<AssessmentResult>) => {
      state.results.push(action.payload);
      state.currentSession = null;
    },

    // Set results
    setResults: (state, action: PayloadAction<AssessmentResult[]>) => {
      state.results = action.payload;
    },

    // Add certificate
    addCertificate: (state, action: PayloadAction<Certificate>) => {
      state.certificates.push(action.payload);
    },

    // Set certificates
    setCertificates: (state, action: PayloadAction<Certificate[]>) => {
      state.certificates = action.payload;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Reset assessment state
    resetAssessment: (state) => {
      state.currentSession = null;
      state.results = [];
      state.certificates = [];
      state.error = null;
      state.isLoading = false;
    },
  },
});

export const {
  setLoading,
  setError,
  startSession,
  setCurrentQuestion,
  answerQuestion,
  endSession,
  clearSession,
  addResult,
  setResults,
  addCertificate,
  setCertificates,
  clearError,
  resetAssessment,
} = assessmentSlice.actions;

export default assessmentSlice.reducer;