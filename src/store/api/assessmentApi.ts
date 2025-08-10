/**
 * RTK Query API for assessment operations
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../index';
import { 
  ApiResponse, 
  PaginatedResponse,
  AssessmentSession,
  AssessmentResult,
  Certificate,
  Question,
  Competency,
  AssessmentStep,
  AssessmentLevel 
} from '@/types';

// Base query with authentication
// const baseQuery = fetchBaseQuery({
//   baseUrl: '/api/assessment',
//   prepareHeaders: (headers, { getState }) => {
//     const token = (getState() as RootState).auth.accessToken;
//     if (token) {
//       headers.set('authorization', `Bearer ${token}`);
//     }
//     return headers;
//   },
// });

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:4000/api/assessment',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const assessmentApi = createApi({
  reducerPath: 'assessmentApi',
  baseQuery,
  tagTypes: ['Assessment', 'Result', 'Certificate', 'Question', 'Competency'],
  endpoints: (builder) => ({
    // Get competencies
    getCompetencies: builder.query<ApiResponse<Competency[]>, void>({
      query: () => '/competencies',
      providesTags: ['Competency'],
    }),

    // Start assessment
    startAssessment: builder.mutation<
      ApiResponse<AssessmentSession>,
      { step: AssessmentStep }
    >({
      query: (data) => ({
        url: '/start',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Assessment'],
    }),

    // Get current session
    getCurrentSession: builder.query<ApiResponse<AssessmentSession>, void>({
      query: () => '/session',
      providesTags: ['Assessment'],
    }),

    // Submit answer
    submitAnswer: builder.mutation<
      ApiResponse<string>,
      { sessionId: string; questionIndex: number; answer: number }
    >({
      query: (data) => ({
        url: '/answer',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Assessment'],
    }),

    // Submit assessment
    submitAssessment: builder.mutation<
      ApiResponse<AssessmentResult>,
      { sessionId: string; answers: (number | null)[] }
    >({
      query: (data) => ({
        url: '/submit',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Assessment', 'Result', 'Certificate'],
    }),

    // Get assessment results
    getResults: builder.query<ApiResponse<AssessmentResult[]>, void>({
      query: () => '/results',
      providesTags: ['Result'],
    }),

    // Get specific result
    getResult: builder.query<ApiResponse<AssessmentResult>, string>({
      query: (id) => `/results/${id}`,
      providesTags: ['Result'],
    }),

    // Get certificates
    getCertificates: builder.query<ApiResponse<Certificate[]>, void>({
      query: () => '/certificates',
      providesTags: ['Certificate'],
    }),

    // Generate certificate
    generateCertificate: builder.mutation<
      ApiResponse<Certificate>,
      { level: AssessmentLevel }
    >({
      query: (data) => ({
        url: '/certificate/generate',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Certificate'],
    }),

    // Download certificate
    downloadCertificate: builder.query<Blob, string>({
      query: (certificateId) => ({
        url: `/certificate/${certificateId}/download`,
        responseHandler: (response) => response.blob(),
      }),
    }),

    // Get questions by level (for preview/study)
    getQuestionsByLevel: builder.query<
      ApiResponse<Question[]>,
      { level: AssessmentLevel; limit?: number }
    >({
      query: ({ level, limit = 10 }) => `/questions/${level}?limit=${limit}`,
      providesTags: ['Question'],
    }),

    // Get assessment statistics
    getAssessmentStats: builder.query<
      ApiResponse<{
        totalAttempts: number;
        averageScore: number;
        bestScore: number;
        currentLevel: AssessmentLevel | null;
        completedSteps: AssessmentStep[];
      }>,
      void
    >({
      query: () => '/stats',
      providesTags: ['Result'],
    }),

    // Check if user can take assessment
    canTakeAssessment: builder.query<
      ApiResponse<{ canTake: boolean; reason?: string; nextAvailableStep?: AssessmentStep }>,
      { step: AssessmentStep }
    >({
      query: ({ step }) => `/can-take/${step}`,
      providesTags: ['Assessment', 'Result'],
    }),
  }),
});

export const {
  useGetCompetenciesQuery,
  useStartAssessmentMutation,
  useGetCurrentSessionQuery,
  useSubmitAnswerMutation,
  useSubmitAssessmentMutation,
  useGetResultsQuery,
  useGetResultQuery,
  useGetCertificatesQuery,
  useGenerateCertificateMutation,
  useLazyDownloadCertificateQuery,
  useGetQuestionsByLevelQuery,
  useGetAssessmentStatsQuery,
  useCanTakeAssessmentQuery,
} = assessmentApi;