/**
 * Dashboard sidebar navigation
 */

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Trophy, 
  FileText, 
  User, 
  LogOut,
  BarChart,
  Settings,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppSelector, useAppDispatch } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { useLogoutMutation } from '@/store/api/authApi';
import { useToast } from '@/hooks/use-toast';

const DashboardSidebar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { user } = useAppSelector((state) => state.auth);
  const [logoutMutation] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
      dispatch(logout());
      navigate('/');
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      // Even if the API call fails, we should still log out locally
      dispatch(logout());
      navigate('/');
    }
  };

  const navigationItems = [
    {
      path: '/dashboard',
      icon: User,
      label: 'Profile',
      end: true
    },
    {
      path: '/dashboard/assessment',
      icon: BookOpen,
      label: 'Take Assessment'
    },
    {
      path: '/dashboard/results',
      icon: BarChart,
      label: 'Results'
    },
    {
      path: '/dashboard/certificates',
      icon: Award,
      label: 'Certificates'
    }
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-xl font-bold text-sidebar-foreground">
            Test_School
          </h1>
          <p className="text-sm text-sidebar-foreground/70">
            Assessment Platform
          </p>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-sidebar-primary rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <div>
              <p className="font-medium text-sidebar-foreground">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-sidebar-foreground/70 capitalize">
                {user?.role}
              </p>
            </div>
          </div>
          
          {user?.currentLevel && (
            <div className="mt-3">
              <span className={`level-badge level-${user.currentLevel.toLowerCase()}`}>
                Level {user.currentLevel}
              </span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Admin Link */}
        {user?.role === 'admin' && (
          <div className="p-4 border-t border-sidebar-border">
            <NavLink
              to="/admin"
              className="flex items-center space-x-3 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span>Admin Panel</span>
            </NavLink>
          </div>
        )}

        {/* Logout */}
        <div className="p-4 border-t border-sidebar-border">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;