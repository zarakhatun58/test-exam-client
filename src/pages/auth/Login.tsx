import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLoginMutation, useRegisterMutation, useForgotPasswordMutation, useResetPasswordMutation, useVerifyOTPMutation } from '@/store/api/authApi';
import { loginSuccess } from '@/store/slices/authSlice';
import { toast } from '@/hooks/use-toast';
import { UserRole } from '@/types';

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  role: UserRole; // 'student' | 'admin' | 'supervisor'
}

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
const [verifyOTP] = useVerifyOTPMutation();

  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);

  // Form states
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState<RegisterForm>({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetData, setResetData] = useState({ token: '', password: '', confirmPassword: '' });

  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
   const [otp, setOtp] = useState('');
  // RTK Query mutations
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [register, { isLoading: isRegistering }] = useRegisterMutation();
  const [forgotPassword, { isLoading: isForgotLoading }] = useForgotPasswordMutation();
  const [resetPassword, { isLoading: isResetLoading }] = useResetPasswordMutation();

  // Form submit handlers
  const onLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login(loginData).unwrap();
      dispatch(loginSuccess(result.data)); // dispatch correct action

      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });

      navigate('/assessment');
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.data?.message || 'Invalid credentials',
        variant: "destructive",
      });
    }
  };


 const onRegisterSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const response = await register(registerData).unwrap();

    // Show toast regardless of 200 or 201
    toast({
      title: "OTP Sent",
      description: response?.message || "Please check your email to verify your account.",
    });

    // Always open OTP modal if registration or OTP resend succeeds
    setIsOTPModalOpen(true);

  } catch (error: any) {
    toast({
      title: "Registration Failed",
      description: error.data?.message || 'Registration failed',
      variant: "destructive",
    });
  }
};


  const onForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword({ email: forgotEmail }).unwrap();

      toast({
        title: "Email Sent",
        description: "Please check your email for password reset instructions.",
      });

      setIsForgotPasswordOpen(false);
      setForgotEmail('');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.data?.message || 'Failed to send reset email',
        variant: "destructive",
      });
    }
  };

  const onResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resetData.password !== resetData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords don't match",
        variant: "destructive",
      });
      return;
    }

    try {
      await resetPassword(resetData).unwrap();

      toast({
        title: "Password Reset",
        description: "Your password has been reset successfully.",
      });

      setIsResetPasswordOpen(false);
      setResetData({ token: '', password: '', confirmPassword: '' });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.data?.message || 'Failed to reset password',
        variant: "destructive",
      });
    }
  };
//  const handleVerifyOTP = async () => {
//     try {
//       const res = await verifyOTP({ email: registerData.email, otp }).unwrap();
//       if (res.success) {
//         // store tokens if needed
//         localStorage.setItem('accessToken', res.data.accessToken);
//         localStorage.setItem('refreshToken', res.data.refreshToken);

//         setIsOTPModalOpen(false);
//         navigate('/');
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };
  
const handleVerifyOTP = async () => {
  try {
    const res = await verifyOTP({ email: registerData.email, otp }).unwrap();

    if (res.data?.accessToken && res.data?.refreshToken) {
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);

      toast({
        title: "Verification Successful",
        description: "Your account has been verified and you're now logged in.",
      });

      setIsOTPModalOpen(false);
      navigate('/');
    }
  } catch (err: any) {
    toast({
      title: "OTP Verification Failed",
      description: err.data?.message || 'Invalid OTP',
      variant: "destructive",
    });
  }
};




  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Welcome to Test_School</h2>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login" className="space-y-4">
            <form onSubmit={onLoginSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto text-sm text-primary hover:underline"
                  onClick={() => setIsForgotPasswordOpen(true)}
                >
                  Forgot password?
                </Button>
              </div>

              <Button type="submit" className="w-full" disabled={isLoggingIn}>
                {isLoggingIn ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </TabsContent>

          {/* Sign Up Tab */}
          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={onRegisterSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="signup-name">Name</Label>
                <Input
                  id="signup-name"
                  type="text"
                  value={registerData.name}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>

              {/* Role */}
              <div className="space-y-2">
                <Label htmlFor="signup-role">Role</Label>
                <select
                  id="signup-role"
                  className="w-full border rounded-md p-2"
                  value={registerData.role}
                  onChange={(e) => setRegisterData(prev => ({
                    ...prev,
                    role: e.target.value as UserRole
                  }))}
                  required
                >
                  <option value="">Select Role</option>
                  {(['admin', 'student', 'supervisor'] as UserRole[]).map((role) => (
                    <option key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </option>
                  ))}
                </select>
              </div>


              <Button type="submit" className="w-full" disabled={isRegistering}>
                {isRegistering ? 'Creating account...' : 'Sign Up'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {/* Reset Password Button */}
        <Button
          variant="link"
          className="w-full mt-4 text-sm"
          onClick={() => setIsResetPasswordOpen(true)}
        >
          Have a reset token? Reset password
        </Button>
      </div>

      {/* Forgot Password Modal */}
      <Dialog open={isForgotPasswordOpen} onOpenChange={setIsForgotPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Forgot Password</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you a link to reset your password.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={onForgotSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="forgot-email">Email</Label>
              <Input
                id="forgot-email"
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsForgotPasswordOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isForgotLoading}>
                {isForgotLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Reset Password Modal */}
      <Dialog open={isResetPasswordOpen} onOpenChange={setIsResetPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Enter your reset token and new password.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={onResetSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-token">Reset Token</Label>
              <Input
                id="reset-token"
                type="text"
                value={resetData.token}
                onChange={(e) => setResetData(prev => ({ ...prev, token: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reset-password">New Password</Label>
              <Input
                id="reset-password"
                type="password"
                value={resetData.password}
                onChange={(e) => setResetData(prev => ({ ...prev, password: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reset-confirmpassword">Confirm Password</Label>
              <Input
                id="reset-confirmpassword"
                type="password"
                value={resetData.confirmPassword}
                onChange={(e) => setResetData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                required
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsResetPasswordOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isResetLoading}>
                {isResetLoading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {isOTPModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Enter OTP</h2>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="border p-2 w-full mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsOTPModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyOTP}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Login;