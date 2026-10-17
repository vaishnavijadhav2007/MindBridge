import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  AlertTriangle, 
  Trash2, 
  Check, 
  X, 
  Info,
  Heart
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { WellnessConsentState } from '../../types/assessment';

interface ConsentPrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  consentState: WellnessConsentState;
  onSaveConsent: (consent: Partial<WellnessConsentState>) => Promise<void>;
  onPurgeData: () => Promise<void>;
}

export const ConsentPrivacyModal: React.FC<ConsentPrivacyModalProps> = ({
  isOpen,
  onClose,
  consentState,
  onSaveConsent,
  onPurgeData,
}) => {
  const [allowAi, setAllowAi] = useState<boolean>(consentState.allowAiSynthesis);
  const [allowStorage, setAllowStorage] = useState<boolean>(consentState.allowAssessmentStorage);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [confirmPurge, setConfirmPurge] = useState<boolean>(false);
  const [isPurging, setIsPurging] = useState<boolean>(false);

  const handleOptIn = async () => {
    setIsSaving(true);
    try {
      await onSaveConsent({
        hasConsented: true,
        allowAiSynthesis: allowAi,
        allowAssessmentStorage: allowStorage,
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const handleWithdrawConsent = async () => {
    setIsSaving(true);
    try {
      await onSaveConsent({
        hasConsented: false,
        allowAiSynthesis: false,
        allowAssessmentStorage: false,
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const handlePurgeAll = async () => {
    setIsPurging(true);
    try {
      await onPurgeData();
      setConfirmPurge(false);
      onClose();
    } finally {
      setIsPurging(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Wellness Analysis Privacy & Consent"
      maxWidth="lg"
    >
      <div className="space-y-6 text-[#403B35]">
        
        {/* Intro Banner */}
        <div className="p-4 rounded-2xl bg-[#E9EFE7] border border-[#D7E2D3] flex items-start gap-3.5">
          <ShieldCheck className="w-6 h-6 text-[#829675] shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-[#56664F] text-base">Your Privacy & Autonomy Come First</h4>
            <p className="text-[#687861] mt-1 leading-relaxed text-xs sm:text-sm">
              MindBridge provides supportive, educational mental wellness reflections and coping tools. We never sell your data or share your personal assessments with third parties.
            </p>
          </div>
        </div>

        {/* 4 Pillars of Data Transparency */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
          <div className="p-3.5 rounded-xl bg-[#F3EBDD]/50 border border-[#E4DACA] space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-[#56664F]">
              <Lock className="w-3.5 h-3.5 text-[#829675]" />
              <span>What We Collect</span>
            </div>
            <p className="text-[#77736B]">
              Only the self-reported mood ratings, sleep scores, and questionnaire answers you voluntarily submit.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F3EBDD]/50 border border-[#E4DACA] space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-[#56664F]">
              <Sparkles className="w-3.5 h-3.5 text-[#829675]" />
              <span>AI Processing with Gemini</span>
            </div>
            <p className="text-[#77736B]">
              Gemini AI synthesizes empathetic summaries securely through Supabase Edge Functions. Your name and identity are never exposed.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F3EBDD]/50 border border-[#E4DACA] space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-[#56664F]">
              <Heart className="w-3.5 h-3.5 text-[#829675]" />
              <span>Non-Diagnostic Disclaimer</span>
            </div>
            <p className="text-[#77736B]">
              Screening tools (PHQ-9, GAD-7, PSS-4, WHO-5) are for self-reflection and coping guidance, not clinical diagnosis.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F3EBDD]/50 border border-[#E4DACA] space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-[#56664F]">
              <Trash2 className="w-3.5 h-3.5 text-[#829675]" />
              <span>Full Control & Purge</span>
            </div>
            <p className="text-[#77736B]">
              You can withdraw consent or permanently erase your assessment and analysis history at any time with one click.
            </p>
          </div>
        </div>

        {/* Preferences Toggles */}
        <div className="space-y-3 pt-2 border-t border-[#E4DACA]">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#829675]">
            Custom Permissions
          </h4>

          <label className="flex items-start gap-3 p-3 rounded-xl border border-[#E4DACA] bg-[#FFFCF6] hover:bg-[#F3EBDD]/30 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={allowAi}
              onChange={(e) => setAllowAi(e.target.checked)}
              className="mt-1 rounded text-[#829675] focus:ring-[#829675] h-4 w-4"
            />
            <div className="text-xs">
              <span className="font-semibold text-[#403B35] block">Enable Gemini AI Narrative Synthesis</span>
              <span className="text-[#77736B]">
                Allow the AI Companion to generate personalized, empathetic reflections based on your scores and mood check-ins.
              </span>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-xl border border-[#E4DACA] bg-[#FFFCF6] hover:bg-[#F3EBDD]/30 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={allowStorage}
              onChange={(e) => setAllowStorage(e.target.checked)}
              className="mt-1 rounded text-[#829675] focus:ring-[#829675] h-4 w-4"
            />
            <div className="text-xs">
              <span className="font-semibold text-[#403B35] block">Save Screening History to My Account</span>
              <span className="text-[#77736B]">
                Retain your past PHQ-9, GAD-7, and WHO-5 scores so you can track your emotional progress over time.
              </span>
            </div>
          </label>
        </div>

        {/* Dangerous Zone / Purge Data */}
        <div className="p-4 rounded-xl border border-red-200 bg-red-50/50 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-800 font-semibold">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>Erase Assessment & Analysis Data</span>
            </div>
            {!confirmPurge ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmPurge(true)}
                className="text-red-700 border-red-300 hover:bg-red-100 text-xs py-1 px-2.5"
              >
                Delete All Records
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setConfirmPurge(false)}
                  className="text-xs py-1 px-2 text-[#77736B]"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  isLoading={isPurging}
                  onClick={handlePurgeAll}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs py-1 px-2.5"
                >
                  Yes, Erase Everything
                </Button>
              </div>
            )}
          </div>
          <p className="text-red-700/80 text-[11px]">
            Permanently deletes all your screening answers, past PHQ-9 / GAD-7 records, and AI analysis reports from your account.
          </p>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#E4DACA]">
          {consentState.hasConsented ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleWithdrawConsent}
              isLoading={isSaving}
              className="w-full sm:w-auto text-xs text-[#77736B]"
            >
              Withdraw Consent & Disable
            </Button>
          ) : (
            <div className="text-[11px] text-[#77736B]">
              You can change your mind at any time.
            </div>
          )}

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
              className="text-xs"
            >
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={isSaving}
              onClick={handleOptIn}
              leftIcon={<Check className="w-4 h-4" />}
              className="text-xs"
            >
              {consentState.hasConsented ? 'Save Preferences' : 'I Consent & Enable Analysis'}
            </Button>
          </div>
        </div>

      </div>
    </Modal>
  );
};
