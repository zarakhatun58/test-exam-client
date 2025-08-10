/**
 * RTK Query API for authentication
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../index';
import {
  ApiResponse,
  User,
  LoginForm,
  RegisterForm,
  ForgotPasswordForm,
  ResetPasswordForm,
  OTPVerificationForm
} from '@/types';

// Base query with authentication
// const baseQuery = fetchBaseQuery({
//   baseUrl: '/api/auth',
//   prepareHeaders: (headers, { getState }) => {
//     const token = (getState() as RootState).auth.accessToken;
//     if (token) {
//       headers.set('authorization', `Bearer ${token}`);
//     }
//     return headers;
//   },
// });

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:4000/api/auth',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});


export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    // Login
    login: builder.mutation<
      ApiResponse<{ user: User; accessToken: string; refreshToken: string }>,
      LoginForm
    >({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    // Register
    register: builder.mutation<
      ApiResponse<{ user: User; accessToken: string; refreshToken: string }>,
      RegisterForm
    >({
      query: (userData) => ({
        url: '/register',
        method: 'POST',
        body: userData,
      }),
    }),

    // Verify OTP
    verifyOTP: builder.mutation<
      ApiResponse<{ user: User; accessToken: string; refreshToken: string }>,
      { email: string; otp: string }
    >({
      query: (data) => ({
        url: '/verify-otp',
        method: 'POST',
        body: data,
      }),
    }),


    // Resend OTP
    resendOTP: builder.mutation<ApiResponse<string>, { email: string }>({
      query: (data) => ({
        url: '/resend-otp',
        method: 'POST',
        body: data,
      }),
    }),

    // Forgot Password
    forgotPassword: builder.mutation<ApiResponse<string>, ForgotPasswordForm>({
      query: (data) => ({
        url: '/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),

    // Reset Password
    resetPassword: builder.mutation<ApiResponse<string>, ResetPasswordForm>({
      query: ({ token, ...data }) => ({
        url: `/reset-password/${token}`,
        method: 'POST',
        body: data,
      }),
    }),

    // Refresh Token
    refreshToken: builder.mutation<
      ApiResponse<{ accessToken: string; refreshToken: string }>,
      { refreshToken: string }
    >({
      query: (data) => ({
        url: '/refresh',
        method: 'POST',
        body: data,
      }),
    }),

    // Get current user profile
    getProfile: builder.query<ApiResponse<User>, void>({
      query: () => '/profile',
      providesTags: ['User'],
    }),

    // Update profile
    updateProfile: builder.mutation<ApiResponse<User>, Partial<User>>({
      query: (data) => ({
        url: '/profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    // Logout
    logout: builder.mutation<ApiResponse<string>, void>({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyOTPMutation,
  useResendOTPMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useRefreshTokenMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useLogoutMutation,
} = authApi;