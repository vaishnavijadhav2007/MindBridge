import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Smile, 
  Sparkles, 
  CheckSquare, 
  UserCheck, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Home, 
  Bell, 
  ChevronRight,
  Heart
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { Toast } from '../common/Toast';
import { useWellness } from '../../context/WellnessContext';

export const DashboardLayout: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { userProfile, showToast } = useWellness();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/dashboard/mood', label: 'Mood Tracker', icon: Smile },
    { to: '/dashboard/companion', label: 'AI Companion', icon: Sparkles },
    { to: '/dashboard/wellness-plan', label: 'My Wellness Plan', icon: CheckSquare },
    { to: '/dashboard/therapists', label: 'Find a Therapist', icon: UserCheck },
    { to: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    showToast('Signed out of demo session.');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F3EBDD] text-[#403B35] flex flex-col md:flex-row font-sans">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-[#FFFCF6] border-r border-[#E4DACA] shrink-0 sticky top-0 h-screen justify-between py-6 px-4 shadow-soft-sm">
        
        <div className="space-y-6">
          {/* Logo */}
          <div className="px-2 pt-1 pb-3">
            <Logo size="md" showTagline />
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5" aria-label="Sidebar Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => `
                    flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-sm font-medium transition-all duration-200
                    ${isActive
                      ? 'bg-[#E9EFE7] text-[#56664F] font-semibold shadow-soft-sm border border-[#D7E2D3]'
                      : 'text-[#77736B] hover:text-[#403B35] hover:bg-[#F3EBDD]/60'
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#829675]' : 'text-[#77736B]'}`} />
                      <span className="flex-1">{item.label}</span>
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#829675]" />}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar: User card & Back to landing */}
        <div className="space-y-3 pt-6 border-t border-[#E4DACA]">
          <NavLink
            to="/"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-[#77736B] hover:text-[#403B35] hover:bg-[#F3EBDD]/70 transition-colors"
          >
            <Home className="w-4 h-4 text-[#829675]" />
            <span>Return to Landing Page</span>
          </NavLink>

          <div className="bg-[#F3EBDD]/70 border border-[#E4DACA] rounded-2xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#829675] text-[#FFFCF6] font-semibold text-xs flex items-center justify-center shrink-0 shadow-soft-sm">
                SC
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-[#403B35] truncate">{userProfile.name}</div>
                <div className="text-[11px] text-[#77736B] truncate">Demo Member</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-[#77736B] hover:text-[#403B35] hover:bg-[#E4DACA] rounded-lg transition-colors"
              title="Log Out"
              aria-label="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </aside>

      {/* MOBILE HEADER & DRAWER */}
      <div className="md:hidden sticky top-0 z-40 bg-[#FFFCF6]/95 backdrop-blur-md border-b border-[#E4DACA] px-4 py-3.5 flex items-center justify-between">
        <Logo size="sm" />
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-xl text-[#403B35] hover:bg-[#F3EBDD] transition-colors"
            aria-label="Open mobile navigation menu"
          >
            {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-[#403B35]/40 backdrop-blur-sm">
          <div className="bg-[#FFFCF6] w-4/5 max-w-xs h-full p-6 flex flex-col justify-between shadow-soft-lg animate-in slide-in-from-left duration-200">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#E4DACA]">
                <Logo size="sm" />
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1.5 rounded-lg text-[#77736B] hover:bg-[#F3EBDD]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={({ isActive }) => `
                        flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-sm font-medium transition-all
                        ${isActive
                          ? 'bg-[#E9EFE7] text-[#56664F] font-semibold border border-[#D7E2D3]'
                          : 'text-[#77736B] hover:text-[#403B35] hover:bg-[#F3EBDD]/60'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            <div className="space-y-3 pt-6 border-t border-[#E4DACA]">
              <NavLink
                to="/"
                onClick={() => setMobileSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-xs text-[#77736B]"
              >
                <Home className="w-4 h-4 text-[#829675]" />
                <span>Return to Landing Page</span>
              </NavLink>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#F3EBDD] text-xs font-medium text-[#403B35] hover:bg-[#EAE1D2]"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* Top Header Bar for Desktop */}
        <header className="hidden md:flex items-center justify-between h-20 px-8 border-b border-[#E4DACA]/60 bg-[#F3EBDD]/60 backdrop-blur-sm sticky top-0 z-30">
          <div className="flex items-center gap-2 text-xs text-[#77736B]">
            <NavLink to="/dashboard" className="hover:text-[#403B35]">MindBridge</NavLink>
            <ChevronRight className="w-3.5 h-3.5 text-[#A39D93]" />
            <span className="text-[#403B35] font-medium capitalize">
              {location.pathname === '/dashboard' ? 'Overview' : location.pathname.replace('/dashboard/', '').replace('-', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFFCF6] border border-[#E4DACA] text-xs text-[#56664F] shadow-soft-sm">
              <span className="w-2 h-2 rounded-full bg-[#829675] animate-pulse" />
              <span>Streak: <strong>{userProfile.streakDays} Days Mindful</strong></span>
            </div>

            <NavLink
              to="/"
              className="text-xs text-[#77736B] hover:text-[#403B35] px-3 py-1.5 rounded-xl hover:bg-[#EAE1D2] transition-colors"
            >
              Landing Page
            </NavLink>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      <Toast />
    </div>
  );
};
