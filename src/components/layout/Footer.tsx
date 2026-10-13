import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Mail, AlertCircle } from 'lucide-react';
import { Logo } from '../common/Logo';
import { Modal } from '../common/Modal';

export const Footer: React.FC = () => {
  const [activePolicyModal, setActivePolicyModal] = useState<string | null>(null);

  return (
    <footer className="bg-[#EAE1D2] border-t border-[#E4DACA] text-[#403B35] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Logo size="md" showTagline />
            <p className="text-sm text-[#77736B] max-w-md leading-relaxed">
              MindBridge provides gentle, evidence-informed tools to help you reflect on your emotions, cultivate peace of mind, and access mental wellness support at your own pace.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#77736B]">
              <span className="inline-flex items-center gap-1">
                Made with <Heart className="w-3.5 h-3.5 text-[#829675] fill-[#829675]" /> for mindful living.
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#403B35]">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-[#77736B]">
              <li>
                <Link to="/" className="hover:text-[#829675] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <a href="#features" className="hover:text-[#829675] transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#829675] transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-[#829675] transition-colors">
                  Live Dashboard
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-[#829675] transition-colors">
                  Member Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#403B35]">
              Trust & Care
            </h4>
            <ul className="space-y-2 text-sm text-[#77736B]">
              <li>
                <button
                  onClick={() => setActivePolicyModal('contact')}
                  className="hover:text-[#829675] transition-colors text-left"
                >
                  Contact Support
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePolicyModal('privacy')}
                  className="hover:text-[#829675] transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePolicyModal('disclaimer')}
                  className="hover:text-[#829675] transition-colors text-left"
                >
                  Medical Disclaimer
                </button>
              </li>
              <li>
                <Link to="/dashboard/therapists" className="hover:text-[#829675] transition-colors">
                  Find Professional Care
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Mandatory Health Disclaimer Callout */}
        <div className="mt-10 pt-6 border-t border-[#DED4C2]">
          <div className="bg-[#FFFCF6] border border-[#E4DACA] rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
            <AlertCircle className="w-5 h-5 text-[#829675] shrink-0 mt-0.5" />
            <div className="text-xs text-[#77736B] leading-relaxed">
              <span className="font-semibold text-[#403B35]">Disclaimer: </span>
              MindBridge supports general mental wellness, daily reflection, and emotional tracking. It does not provide clinical diagnoses, psychiatric treatment, or medical advice and does not replace consultation with a qualified mental health healthcare provider. If you are experiencing thoughts of self-harm, severe distress, or a psychiatric crisis, please dial or text <strong className="text-[#403B35]">988</strong> (USA & Canada Suicide & Crisis Lifeline) or contact your nearest hospital emergency services immediately.
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#77736B]">
            <p>© {new Date().getFullYear()} MindBridge Wellness Inc. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#829675]" />
                Privacy First • No Data Selling
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Modals */}
      <Modal
        isOpen={activePolicyModal === 'contact'}
        onClose={() => setActivePolicyModal(null)}
        title="Contact MindBridge Support"
        subtitle="We're here to listen and help you make the most of your journey."
      >
        <div className="space-y-4 text-sm text-[#403B35]">
          <p>
            Have feedback, questions about our wellness tools, or need technical assistance?
          </p>
          <div className="bg-[#F3EBDD] p-4 rounded-xl border border-[#E4DACA] flex items-center gap-3">
            <Mail className="w-5 h-5 text-[#829675]" />
            <div>
              <div className="font-medium text-[#403B35]">Email our team:</div>
              <a href="mailto:support@mindbridge.wellness" className="text-[#829675] hover:underline font-medium">
                support@mindbridge.wellness
              </a>
            </div>
          </div>
          <p className="text-xs text-[#77736B]">
            Support hours: Monday – Friday, 9:00 AM – 6:00 PM EST. For urgent crisis support, please reach out to local emergency hotlines or 988.
          </p>
        </div>
      </Modal>

      <Modal
        isOpen={activePolicyModal === 'privacy'}
        onClose={() => setActivePolicyModal(null)}
        title="Privacy & Data Care"
        subtitle="Your thoughts and emotions belong to you alone."
      >
        <div className="space-y-3 text-sm text-[#403B35] max-h-96 overflow-y-auto pr-1">
          <p>
            At MindBridge, we hold emotional privacy sacred. We never sell or broker user wellness reflections, mood check-ins, or journal entries to third parties or advertisers.
          </p>
          <h5 className="font-semibold text-[#403B35] pt-2">Local & Secure Storage</h5>
          <p className="text-[#77736B]">
            Frontend demo interactions are stored solely in your local browser session and are never transmitted to external servers without your direct authorization.
          </p>
          <h5 className="font-semibold text-[#403B35] pt-2">Empowering Boundaries</h5>
          <p className="text-[#77736B]">
            You may export or erase your mood logs and reflection entries at any moment directly from your profile settings.
          </p>
        </div>
      </Modal>

      <Modal
        isOpen={activePolicyModal === 'disclaimer'}
        onClose={() => setActivePolicyModal(null)}
        title="Mental Wellness Disclaimer"
        subtitle="Understanding the scope of MindBridge"
      >
        <div className="space-y-3 text-sm text-[#403B35]">
          <p>
            MindBridge is a lifestyle and personal mindfulness tool designed to encourage emotional awareness, healthy daily routines, and stress reduction.
          </p>
          <p className="text-[#77736B]">
            Content, exercises, and guided prompts provided within MindBridge are for educational and self-care purposes only. They are not intended as psychotherapy, psychiatric treatment, or clinical intervention.
          </p>
          <div className="bg-[#E9EFE7] p-3.5 rounded-xl border border-[#D7E2D3] text-xs text-[#56664F]">
            If you or someone you know is in immediate crisis, free, confidential support is available 24/7. Call or text <strong>988</strong> in the US & Canada, or visit <strong>988lifeline.org</strong>.
          </div>
        </div>
      </Modal>
    </footer>
  );
};
