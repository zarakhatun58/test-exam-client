/**
 * Core types for the Test_School Assessment Platform
 */

// Assessment Levels
export type AssessmentLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

// Assessment Steps
export type AssessmentStep = 1 | 2 | 3;

// User Roles
export type UserRole = 'student' | 'admin' | 'supervisor';

// User interface
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  currentLevel: AssessmentLevel | null;
  completedSteps: AssessmentStep[];
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

// Authentication state
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  accessToken: string | null;
  refreshToken: string | null;
}

// Question interface
export interface Question {
  id: string;
  competencyId?: string;
  competency?: string;
  level: AssessmentLevel;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  createdAt?: string;
}

// Competency interface
export interface Competency {
  id: string;
  name: string;
  description: string;
  code: string; // e.g., "COMP001"
}

// Assessment Result interface
export interface AssessmentResult {
  id: string;
  userId: string;
  sessionId?: string;
  step: AssessmentStep;
  questions?: Question[];
  answers?: number[];
  score: number;
  percentage: number;
  levelAchieved?: AssessmentLevel | null;
  certification?: string;
  timeSpent: number;
  completedAt: string;
  canProceed: boolean;
}

// Assessment Session interface
export interface AssessmentSession {
  id: string;
  userId: string;
  step: AssessmentStep;
  questions: Question[];
  currentQuestionIndex: number;
  answers: (number | null)[];
  startTime: string;
  timeLimit: number; // in seconds
  isActive?: boolean;
  status?: string;
}

// Certificate interface
export interface Certificate {
  id: string;
  userId: string;
  level: AssessmentLevel;
  issuedAt: string;
  certificateUrl?: string;
}

// Assessment State
export interface AssessmentState {
  currentSession: AssessmentSession | null;
  results: AssessmentResult[];
  certificates: Certificate[];
  isLoading: boolean;
  error: string | null;
}

// Admin Dashboard types
export interface DashboardStats {
  totalUsers: number;
  totalAssessments: number;
  passRate: number;
  levelDistribution: Record<AssessmentLevel, number>;
  averageScore: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface ForgotPasswordForm {
  email: string;
}

export interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
  token: string;
}

export interface OTPVerificationForm {
  otp: string;
}

// Timer types
export interface TimerState {
  timeRemaining: number;
  isRunning: boolean;
  isWarning: boolean;
  isCritical: boolean;
}

// Assessment Config
export interface AssessmentConfig {
  questionsPerStep: number;
  timePerQuestion: number; // in seconds
  passingThresholds: {
    step1: {
      fail: number;
      a1: number;
      a2: number;
      proceed: number;
    };
    step2: {
      fail: number;
      b1: number;
      b2: number;
      proceed: number;
    };
    step3: {
      fail: number;
      c1: number;
      c2: number;
    };
  };
}

// Score calculation result
export interface ScoreResult {
  score: number;
  percentage: number;
  levelAchieved: AssessmentLevel | null;
  canProceed: boolean;
  message: string;
}