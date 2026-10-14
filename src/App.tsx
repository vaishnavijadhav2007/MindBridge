import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WellnessProvider } from './context/WellnessContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { DashboardOverviewPage } from './pages/dashboard/DashboardOverviewPage';
import { MoodTrackerPage } from './pages/dashboard/MoodTrackerPage';
import { AICompanionPage } from './pages/dashboard/AICompanionPage';
import { WellnessPlanPage } from './pages/dashboard/WellnessPlanPage';
import { TherapistsPage } from './pages/dashboard/TherapistsPage';
import { SettingsPage } from './pages/dashboard/SettingsPage';

import { WellnessActivityRouter } from './components/wellness/WellnessActivityRouter';

export const App: React.FC = () => {
  return (
    <WellnessProvider>
      <BrowserRouter>
        <WellnessActivityRouter />
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Authentication Pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Dashboard Application Shell */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardOverviewPage />} />
            <Route path="mood" element={<MoodTrackerPage />} />
            <Route path="companion" element={<AICompanionPage />} />
            <Route path="wellness-plan" element={<WellnessPlanPage />} />
            <Route path="therapists" element={<TherapistsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </WellnessProvider>
  );
};

export default App;
