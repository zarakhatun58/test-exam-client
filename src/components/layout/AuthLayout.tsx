/**
 * Authentication layout component
 */

import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAppSelector } from '@/store';

const AuthLayout: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-surface">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">
              Test_School
            </h1>
            <p className="text-muted-foreground">
              Digital Competency Assessment Platform
            </p>
          </div>

          {/* Auth Form Container */}
          <div className="assessment-card">
            <Outlet />
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              © 2025 Test_School. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;