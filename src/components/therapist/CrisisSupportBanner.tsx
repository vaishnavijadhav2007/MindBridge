import React, { useState } from 'react';
import { PhoneCall, AlertTriangle, ShieldAlert, ChevronDown, ChevronUp, ExternalLink, Heart } from 'lucide-react';

export const CrisisSupportBanner: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-2xl border border-[#DEC9EA] bg-[#F9F3FB] text-[#403B35] p-4 sm:p-5 shadow-soft-sm transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#EFE4F5] text-[#7C3AED] flex items-center justify-center shrink-0 mt-0.5 border border-[#DEC9EA]">
            <Heart className="w-5 h-5 text-[#829675] fill-[#829675]/20" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#7C3AED]">
                Need Urgent Support?
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#EFE4F5] text-[#6D28D9] font-medium border border-[#DDD0E8]">
                24/7 Helplines (India)
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#5B554D] mt-1 leading-relaxed">
              This directory is for scheduled outpatient appointments and is <strong>not an emergency service</strong>. If you or someone you know is in immediate distress, free and confidential support is available right now.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFFCF6] border border-[#DEC9EA] text-xs font-medium text-[#7C3AED] hover:bg-[#F3EBF7] transition-colors shrink-0"
        >
          <span>{isExpanded ? 'Hide Helplines' : 'View Verified Helplines'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-[#DEC9EA]/70 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Tele-MANAS */}
          <div className="p-3 bg-[#FFFCF6] rounded-xl border border-[#DEC9EA] space-y-1">
            <div className="font-semibold text-[#403B35]">Tele-MANAS (Govt. of India)</div>
            <div className="text-[#7C3AED] font-bold text-sm tracking-wide">14416 / 1800 891 4416</div>
            <p className="text-[11px] text-[#77736B]">
              24/7 toll-free mental health support in Marathi, Hindi, Telugu, and English.
            </p>
          </div>

          {/* KIRAN */}
          <div className="p-3 bg-[#FFFCF6] rounded-xl border border-[#DEC9EA] space-y-1">
            <div className="font-semibold text-[#403B35]">KIRAN Mental Health</div>
            <div className="text-[#7C3AED] font-bold text-sm tracking-wide">1800 599 0019</div>
            <p className="text-[11px] text-[#77736B]">
              National 24/7 helpline by Ministry of Social Justice and Empowerment.
            </p>
          </div>

          {/* Vandrevala Foundation */}
          <div className="p-3 bg-[#FFFCF6] rounded-xl border border-[#DEC9EA] space-y-1">
            <div className="font-semibold text-[#403B35]">Vandrevala Foundation</div>
            <div className="text-[#7C3AED] font-bold text-sm tracking-wide">+91 9999 666 555</div>
            <p className="text-[11px] text-[#77736B]">
              Free 24/7 psychological counseling via phone call or WhatsApp.
            </p>
          </div>

          {/* Emergency 112 */}
          <div className="p-3 bg-[#FFFCF6] rounded-xl border border-[#DEC9EA] space-y-1">
            <div className="font-semibold text-[#403B35]">National Emergency Number</div>
            <div className="text-[#C0392B] font-bold text-sm tracking-wide">112 / 108</div>
            <p className="text-[11px] text-[#77736B]">
              Immediate emergency police, medical, and ambulance response across Maharashtra.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
