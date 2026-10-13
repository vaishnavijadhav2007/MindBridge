import React from 'react';
import { Phone, MessageSquare, HeartHandshake, ExternalLink, X, ShieldCheck } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

interface CrisisSupportPanelProps {
  onDismiss: () => void;
}

export const CrisisSupportPanel: React.FC<CrisisSupportPanelProps> = ({ onDismiss }) => {
  return (
    <Card
      padding="md"
      className="border-[#D48C70]/40 bg-[#FAF3EE] shadow-soft-md animate-in slide-in-from-top-3 duration-300 relative overflow-hidden"
    >
      <button
        onClick={onDismiss}
        className="absolute top-3 right-3 p-1.5 text-[#77736B] hover:text-[#403B35] rounded-xl hover:bg-[#F2E5DC] transition-colors"
        aria-label="Dismiss crisis panel"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#F4E3D7] text-[#B86B4F] flex items-center justify-center shrink-0 border border-[#E9CEBF]">
            <HeartHandshake className="w-5 h-5 text-[#B86B4F]" />
          </div>
          <div className="pr-6">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#B86B4F]">
              Support Is Available Right Now
            </div>
            <h3 className="text-base font-semibold text-[#403B35]">
              You don't have to carry this alone
            </h3>
            <p className="text-xs text-[#77736B] mt-0.5 leading-relaxed">
              If you or someone you know is going through a difficult time or having thoughts of self-harm, free and confidential support from caring human specialists is available 24 hours a day, 7 days a week.
            </p>
          </div>
        </div>

        {/* Hotlines Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* 988 Lifeline */}
          <div className="bg-[#FFFCF6] border border-[#E4DACA] rounded-xl p-3 flex items-start gap-3 shadow-soft-sm">
            <div className="p-2 rounded-xl bg-[#E9EFE7] text-[#829675] shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#403B35]">988 Suicide & Crisis Lifeline</div>
              <div className="text-xs text-[#77736B] mt-0.5">Call or text <strong className="text-[#829675]">988</strong> (USA & Canada)</div>
              <div className="text-[10px] text-[#A39D93]">Free • Confidential • 24/7 Support</div>
            </div>
          </div>

          {/* Crisis Text Line */}
          <div className="bg-[#FFFCF6] border border-[#E4DACA] rounded-xl p-3 flex items-start gap-3 shadow-soft-sm">
            <div className="p-2 rounded-xl bg-[#FAF3E7] text-[#C59B7E] shrink-0">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#403B35]">Crisis Text Line</div>
              <div className="text-xs text-[#77736B] mt-0.5">Text <strong className="text-[#C59B7E]">HOME</strong> to <strong>741741</strong></div>
              <div className="text-[10px] text-[#A39D93]">Free • 24/7 Text Support via SMS</div>
            </div>
          </div>

          {/* The Trevor Project */}
          <div className="bg-[#FFFCF6] border border-[#E4DACA] rounded-xl p-3 flex items-start gap-3 shadow-soft-sm">
            <div className="p-2 rounded-xl bg-[#E9EFE7] text-[#829675] shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#403B35]">The Trevor Project (LGBTQ+)</div>
              <div className="text-xs text-[#77736B] mt-0.5">Call <strong className="text-[#403B35]">1-866-488-7386</strong></div>
              <div className="text-[10px] text-[#A39D93]">Or text START to 678-678 (24/7)</div>
            </div>
          </div>

          {/* International Helplines */}
          <div className="bg-[#FFFCF6] border border-[#E4DACA] rounded-xl p-3 flex items-start gap-3 shadow-soft-sm">
            <div className="p-2 rounded-xl bg-[#FAF3E7] text-[#C59B7E] shrink-0">
              <ExternalLink className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#403B35]">International Helplines</div>
              <div className="text-xs text-[#77736B] mt-0.5">Worldwide directory of trusted crisis lines</div>
              <a
                href="https://findahelpline.com"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-[#829675] font-semibold hover:underline flex items-center gap-1 mt-0.5"
              >
                <span>Visit findahelpline.com</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="flex items-center justify-between pt-1 text-[11px] text-[#77736B]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#829675]" />
            MindBridge cares about your safety. These services are independent and confidential.
          </span>
          <button
            onClick={onDismiss}
            className="text-[#829675] hover:underline font-semibold"
          >
            Hide this panel
          </button>
        </div>

      </div>
    </Card>
  );
};
