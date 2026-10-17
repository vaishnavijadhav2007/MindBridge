import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Heart } from 'lucide-react';
import { Logo } from '../common/Logo';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading, isConfigured } = useAuth();
  const location = useLocation();

  // If Supabase is configured and currently initializing session, show calming loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3EBDD] flex flex-col items-center justify-center p-6 text-[#403B35]">
        <div className="flex flex-col items-center space-y-4 max-w-sm text-center">
          <Logo size="lg" />
          <div className="w-10 h-10 rounded-2xl bg-[#E9EFE7] border border-[#D7E2D3] flex items-center justify-center animate-pulse">
            <Heart className="w-5 h-5 text-[#829675] fill-[#829675]/30 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-[#403B35]">
              Connecting your safe space...
            </h2>
            <p className="text-xs text-[#77736B]">
              Securing session and mindful data.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If Supabase is configured and no authenticated user exists, redirect to login
  if (isConfigured && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render protected child routes
  return children ? <>{children}</> : <Outlet />;
};
