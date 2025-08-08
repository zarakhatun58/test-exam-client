/**
 * RTK Query API for admin operations
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../index';
import { 
  ApiResponse, 
  PaginatedResponse,
  PaginationParams,
  User,
  AssessmentResult,
  Question,
  Competency,
  DashboardStats,
  AssessmentLevel 
} from '@/types';

// Base query with authentication
const baseQuery = fetchBaseQuery({
  baseUrl: '/api/admin',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery,
  tagTypes: ['User', 'Question', 'Competency', 'Result', 'Stats'],
  endpoints: (builder) => ({
    // Dashboard Statistics
    getDashboardStats: builder.query<ApiResponse<DashboardStats>, void>({
      query: () => '/dashboard/stats',
      providesTags: ['Stats'],
    }),

    // User Management
    getUsers: builder.query<
      ApiResponse<PaginatedResponse<User>>,
      PaginationParams & { role?: string }
    >({
      query: ({ page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', search, role }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          sortBy,
          sortOrder,
        });
        if (search) params.append('search', search);
        if (role) params.append('role', role);
        
        return `/users?${params.toString()}`;
      },
      providesTags: ['User'],
    }),

    // Get single user
    getUser: builder.query<ApiResponse<User>, string>({
      query: (id) => `/users/${id}`,
      providesTags: ['User'],
    }),

    // Update user
    updateUser: builder.mutation<
      ApiResponse<User>,
      { id: string; data: Partial<User> }
    >({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User', 'Stats'],
    }),

    // Delete user
    deleteUser: builder.mutation<ApiResponse<string>, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User', 'Stats'],
    }),

    // Block/Unblock user
    toggleUserBlock: builder.mutation<
      ApiResponse<User>,
      { id: string; isBlocked: boolean }
    >({
      query: ({ id, isBlocked }) => ({
        url: `/users/${id}/block`,
        method: 'PATCH',
        body: { isBlocked },
      }),
      invalidatesTags: ['User'],
    }),

    // Question Management
    getQuestions: builder.query<
      ApiResponse<PaginatedResponse<Question>>,
      PaginationParams & { level?: AssessmentLevel; competencyId?: string }
    >({
      query: ({ page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', search, level, competencyId }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          sortBy,
          sortOrder,
        });
        if (search) params.append('search', search);
        if (level) params.append('level', level);
        if (competencyId) params.append('competencyId', competencyId);
        
        return `/questions?${params.toString()}`;
      },
      providesTags: ['Question'],
    }),

    // Create question
    createQuestion: builder.mutation<ApiResponse<Question>, Omit<Question, 'id' | 'createdAt'>>({
      query: (data) => ({
        url: '/questions',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Question'],
    }),

    // Update question
    updateQuestion: builder.mutation<
      ApiResponse<Question>,
      { id: string; data: Partial<Question> }
    >({
      query: ({ id, data }) => ({
        url: `/questions/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Question'],
    }),

    // Delete question
    deleteQuestion: builder.mutation<ApiResponse<string>, string>({
      query: (id) => ({
        url: `/questions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Question'],
    }),

    // Bulk create questions
    bulkCreateQuestions: builder.mutation<
      ApiResponse<{ created: number; errors: string[] }>,
      Question[]
    >({
      query: (questions) => ({
        url: '/questions/bulk',
        method: 'POST',
        body: { questions },
      }),
      invalidatesTags: ['Question'],
    }),

    // Competency Management
    getCompetencies: builder.query<
      ApiResponse<PaginatedResponse<Competency>>,
      PaginationParams
    >({
      query: ({ page = 1, limit = 10, sortBy = 'name', sortOrder = 'asc', search }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          sortBy,
          sortOrder,
        });
        if (search) params.append('search', search);
        
        return `/competencies?${params.toString()}`;
      },
      providesTags: ['Competency'],
    }),

    // Create competency
    createCompetency: builder.mutation<ApiResponse<Competency>, Omit<Competency, 'id'>>({
      query: (data) => ({
        url: '/competencies',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Competency'],
    }),

    // Update competency
    updateCompetency: builder.mutation<
      ApiResponse<Competency>,
      { id: string; data: Partial<Competency> }
    >({
      query: ({ id, data }) => ({
        url: `/competencies/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Competency'],
    }),

    // Delete competency
    deleteCompetency: builder.mutation<ApiResponse<string>, string>({
      query: (id) => ({
        url: `/competencies/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Competency'],
    }),

    // Assessment Results Management
    getAssessmentResults: builder.query<
      ApiResponse<PaginatedResponse<AssessmentResult>>,
      PaginationParams & { userId?: string; step?: number; level?: AssessmentLevel }
    >({
      query: ({ page = 1, limit = 10, sortBy = 'completedAt', sortOrder = 'desc', search, userId, step, level }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          sortBy,
          sortOrder,
        });
        if (search) params.append('search', search);
        if (userId) params.append('userId', userId);
        if (step) params.append('step', step.toString());
        if (level) params.append('level', level);
        
        return `/results?${params.toString()}`;
      },
      providesTags: ['Result'],
    }),

    // Get detailed result
    getAssessmentResult: builder.query<ApiResponse<AssessmentResult>, string>({
      query: (id) => `/results/${id}`,
      providesTags: ['Result'],
    }),

    // Export data
    exportUsers: builder.query<Blob, { format: 'csv' | 'excel' }>({
      query: ({ format }) => ({
        url: `/export/users?format=${format}`,
        responseHandler: (response) => response.blob(),
      }),
    }),

    exportResults: builder.query<Blob, { format: 'csv' | 'excel' }>({
      query: ({ format }) => ({
        url: `/export/results?format=${format}`,
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetUsersQuery,
  useGetUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useToggleUserBlockMutation,
  useGetQuestionsQuery,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
  useBulkCreateQuestionsMutation,
  useGetCompetenciesQuery,
  useCreateCompetencyMutation,
  useUpdateCompetencyMutation,
  useDeleteCompetencyMutation,
  useGetAssessmentResultsQuery,
  useGetAssessmentResultQuery,
  useLazyExportUsersQuery,
  useLazyExportResultsQuery,
} = adminApi;