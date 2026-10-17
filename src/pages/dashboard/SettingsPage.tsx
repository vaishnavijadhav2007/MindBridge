import React, { useState, useEffect } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Download, 
  Trash2, 
  CheckCircle2, 
  Lock, 
  ShieldCheck, 
  Database, 
  AlertTriangle,
  Languages
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { useWellness } from '../../context/WellnessContext';
import { useAuth } from '../../context/AuthContext';
import { SupabaseStatusBadge } from '../../components/dev/SupabaseStatusBadge';

export const SettingsPage: React.FC = () => {
  const { userProfile, showToast, exportData, purgeData } = useWellness();
  const { user, profile, updateProfile, isConfigured } = useAuth();

  const [userName, setUserName] = useState(profile?.display_name || userProfile.name);
  const [preferredLang, setPreferredLang] = useState(profile?.preferred_language || 'English');
  const [dailyReminders, setDailyReminders] = useState(true);
  const [reflectionPromptReminders, setReflectionPromptReminders] = useState(false);
  
  // Privacy & Consent Settings
  const [storeJournalConsent, setStoreJournalConsent] = useState(profile?.store_journal_consent ?? true);
  const [storeChatConsent, setStoreChatConsent] = useState(profile?.store_chat_consent ?? false);

  // Deletion Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isPurging, setIsPurging] = useState(false);

  // Sync profile when auth state updates
  useEffect(() => {
    if (profile) {
      if (profile.display_name) setUserName(profile.display_name);
      if (profile.preferred_language) setPreferredLang(profile.preferred_language);
      if (profile.store_journal_consent !== undefined) setStoreJournalConsent(profile.store_journal_consent);
      if (profile.store_chat_consent !== undefined) setStoreChatConsent(profile.store_chat_consent);
    }
  }, [profile]);

  // Save profile changes
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (user && isConfigured) {
      await updateProfile({
        display_name: userName,
        preferred_language: preferredLang,
        store_journal_consent: storeJournalConsent,
        store_chat_consent: storeChatConsent,
      });
    }

    showToast('Profile and preferences updated.');
  };

  // Export all user data as downloadable JSON
  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const exportPayload = await exportData();
      if (!exportPayload) {
        showToast('Export failed. Please try again.');
        return;
      }

      // Trigger client-side JSON download
      const jsonStr = JSON.stringify(exportPayload, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const dateStr = new Date().toISOString().split('T')[0];
      const link = document.createElement('a');
      link.href = url;
      link.download = `mindbridge-wellness-export-${dateStr}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast('Wellness history exported as JSON file.');
    } catch {
      showToast('Failed to generate export file.');
    } finally {
      setIsExporting(false);
    }
  };

  // Purge all data permanently
  const handleConfirmPurge = async () => {
    setIsPurging(true);
    try {
      await purgeData();
    } catch {
      showToast('Error removing account records.');
    } finally {
      setIsPurging(false);
      setIsDeleteModalOpen(false);
    }
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

      {/* Backend & Security Status Badge */}
      <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 text-xs ${
        isConfigured
          ? 'bg-[#E9EFE7]/60 border-[#829675]/40 text-[#42523D]'
          : 'bg-[#FAF6EE] border-[#E4DACA] text-[#77736B]'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
            isConfigured ? 'bg-[#829675] text-white' : 'bg-[#E4DACA] text-[#403B35]'
          }`}>
            <Database className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-[#403B35] text-sm">
              {isConfigured ? 'Connected to Supabase PostgreSQL' : 'Local Demo Architecture'}
            </div>
            <div className="text-[11px] text-[#77736B]">
              {isConfigured 
                ? 'Row Level Security (RLS) actively isolates your data. Zero third-party tracker scripts.' 
                : 'Running in resilient offline mode with encrypted browser state.'}
            </div>
          </div>
        </div>

        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
          isConfigured
            ? 'bg-[#E9EFE7] border-[#829675] text-[#56664F]'
            : 'bg-[#F3EBDD] border-[#E4DACA] text-[#77736B]'
        }`}>
          {isConfigured ? 'Production Database' : 'Demo Mode'}
        </span>
      </div>

      {/* Live connection probe — runs a real request, shows actual result */}
      <div className="flex items-center gap-3">
        <SupabaseStatusBadge />
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
              placeholder="e.g., Alex"
            />
            <Input
              label="Email Address"
              value={user?.email || userProfile.email}
              disabled
              helperText={user ? 'Authenticated via Supabase Auth' : 'Demo account email'}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#403B35] mb-1.5 flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-[#829675]" />
              <span>Preferred Language (Pune & Regional Support)</span>
            </label>
            <select
              value={preferredLang}
              onChange={(e) => setPreferredLang(e.target.value)}
              className="w-full sm:w-1/2 bg-[#FFFCF6] border border-[#E4DACA] focus:border-[#829675] rounded-xl px-3 py-2 text-sm text-[#403B35] outline-none transition-colors"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi (हिंदी)</option>
              <option value="Marathi">Marathi (मराठी)</option>
              <option value="Telugu">Telugu (తెలుగు)</option>
            </select>
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

      {/* Data & Privacy Controls */}
      <Card padding="lg" className="border-[#E4DACA] bg-[#FFFCF6] space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[#F0E8DC]">
          <div className="w-10 h-10 rounded-xl bg-[#E9EFE7] text-[#56664F] flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-base text-[#403B35]">Privacy & Data Control (GDPR Compliant)</h3>
            <p className="text-xs text-[#77736B]">You maintain complete ownership of your reflection logs</p>
          </div>
        </div>

        {/* Explicit Privacy Consent Toggles */}
        <div className="space-y-3.5 bg-[#FAF6EE] p-4 rounded-2xl border border-[#E4DACA]">
          <div className="text-xs font-semibold text-[#403B35] flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#829675]" />
            <span>Granular Storage Consent</span>
          </div>

          <label className="flex items-start justify-between gap-3 cursor-pointer p-2.5 rounded-xl bg-[#FFFCF6] border border-[#E4DACA]/70 hover:border-[#829675] transition-colors">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-[#403B35]">Store Written Journal Reflections</span>
              <p className="text-[11px] text-[#77736B] leading-relaxed">
                When enabled, your free-form reflection notes are stored privately in your database record. If disabled, notes remain in-session only.
              </p>
            </div>
            <input
              type="checkbox"
              checked={storeJournalConsent}
              onChange={(e) => setStoreJournalConsent(e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-[#829675] border-[#E4DACA] focus:ring-[#829675]"
            />
          </label>

          <label className="flex items-start justify-between gap-3 cursor-pointer p-2.5 rounded-xl bg-[#FFFCF6] border border-[#E4DACA]/70 hover:border-[#829675] transition-colors">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-[#403B35]">Store AI Companion Conversation Logs</span>
              <p className="text-[11px] text-[#77736B] leading-relaxed">
                When enabled, your conversations with the MindBridge companion are saved under your private account. When disabled, sessions are completely ephemeral.
              </p>
            </div>
            <input
              type="checkbox"
              checked={storeChatConsent}
              onChange={(e) => setStoreChatConsent(e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-[#829675] border-[#E4DACA] focus:ring-[#829675]"
            />
          </label>
        </div>

        {/* Export and Delete buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportData}
            disabled={isExporting}
            leftIcon={<Download className="w-4 h-4 text-[#829675]" />}
          >
            {isExporting ? 'Preparing Export...' : 'Export My Wellness History (JSON)'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDeleteModalOpen(true)}
            leftIcon={<Trash2 className="w-4 h-4 text-red-500" />}
            className="text-red-700 border-red-300 hover:bg-red-50"
          >
            Delete All My Account Data
          </Button>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Permanently Delete All Your Data?"
        subtitle="This action is irreversible and adheres to data privacy standards."
        maxWidth="sm"
      >
        <div className="space-y-4 pt-2">
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>
              All check-in history, wellness logs, saved activities, feedback records, and chat transcripts will be erased permanently from the servers.
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isPurging}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleConfirmPurge}
              disabled={isPurging}
              className="bg-red-600 hover:bg-red-700 text-white border-transparent"
              leftIcon={<Trash2 className="w-4 h-4" />}
            >
              {isPurging ? 'Deleting...' : 'Yes, Delete Everything'}
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
