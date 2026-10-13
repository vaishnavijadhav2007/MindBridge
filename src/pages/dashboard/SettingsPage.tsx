import React, { useState } from 'react';
import { Settings, User, Bell, Shield, Download, Trash2, CheckCircle2 } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useWellness } from '../../context/WellnessContext';

export const SettingsPage: React.FC = () => {
  const { userProfile, showToast } = useWellness();
  const [userName, setUserName] = useState(userProfile.name);
  const [dailyReminders, setDailyReminders] = useState(true);
  const [reflectionPromptReminders, setReflectionPromptReminders] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Profile preferences updated.');
  };

  const handleExportData = () => {
    showToast('Exported demo mood data as JSON.');
  };

  const handleResetData = () => {
    showToast('Local demo state reset to default.');
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#403B35] tracking-tight">
          Account & Wellness Settings
        </h1>
        <p className="text-sm text-[#77736B] mt-1">
          Customize your experience, manage mindful reminders, and maintain personal privacy.
        </p>
      </div>

      {/* Profile Section */}
      <Card padding="lg" className="border-[#E4DACA] bg-[#FFFCF6] space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[#F0E8DC]">
          <div className="w-10 h-10 rounded-xl bg-[#E9EFE7] text-[#829675] flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-base text-[#403B35]">Profile Information</h3>
            <p className="text-xs text-[#77736B]">How you appear in your private wellness sanctuary</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Display Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <Input
              label="Email Address"
              value={userProfile.email}
              disabled
              helperText="Demo account email"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="primary" size="sm" type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </Card>

      {/* Mindful Reminders */}
      <Card padding="lg" className="border-[#E4DACA] bg-[#FFFCF6] space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[#F0E8DC]">
          <div className="w-10 h-10 rounded-xl bg-[#FAF3E7] text-[#C59B7E] flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-base text-[#403B35]">Mindful Notifications</h3>
            <p className="text-xs text-[#77736B]">Gentle nudges to pause and check in with your mind</p>
          </div>
        </div>

        <div className="space-y-4 text-sm text-[#403B35]">
          <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl hover:bg-[#F3EBDD]/40 transition-colors">
            <div>
              <div className="font-medium">Daily 9:00 AM Morning Check-in Prompt</div>
              <div className="text-xs text-[#77736B]">A gentle invitation to log your starting mood of the day.</div>
            </div>
            <input
              type="checkbox"
              checked={dailyReminders}
              onChange={(e) => setDailyReminders(e.target.checked)}
              className="w-4 h-4 rounded text-[#829675] border-[#E4DACA] focus:ring-[#829675]"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl hover:bg-[#F3EBDD]/40 transition-colors">
            <div>
              <div className="font-medium">Evening Wind-Down & Breathing Reminder</div>
              <div className="text-xs text-[#77736B]">Suggestions to disconnect from screens 30 minutes before sleep.</div>
            </div>
            <input
              type="checkbox"
              checked={reflectionPromptReminders}
              onChange={(e) => setReflectionPromptReminders(e.target.checked)}
              className="w-4 h-4 rounded text-[#829675] border-[#E4DACA] focus:ring-[#829675]"
            />
          </label>
        </div>
      </Card>

      {/* Data & Privacy */}
      <Card padding="lg" className="border-[#E4DACA] bg-[#FFFCF6] space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[#F0E8DC]">
          <div className="w-10 h-10 rounded-xl bg-[#E9EFE7] text-[#56664F] flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-base text-[#403B35]">Privacy & Data Control</h3>
            <p className="text-xs text-[#77736B]">You maintain complete ownership of your reflection logs</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportData}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export My Wellness History
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleResetData}
            leftIcon={<Trash2 className="w-4 h-4 text-red-500" />}
            className="text-red-700 border-red-300 hover:bg-red-50"
          >
            Reset Demo Data
          </Button>
        </div>
      </Card>
    </div>
  );
};
