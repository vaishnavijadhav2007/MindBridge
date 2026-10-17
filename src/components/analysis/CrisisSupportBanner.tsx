import React from 'react';
import { Phone, Heart, ExternalLink, AlertCircle, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CrisisSupportBannerProps {
  reason?: string;
  onDismiss?: () => void;
}

export const CrisisSupportBanner: React.FC<CrisisSupportBannerProps> = ({ reason, onDismiss }) => {
  return (
    <div 
      className="p-5 sm:p-6 rounded-3xl bg-[#FFF8F6] border-2 border-[#E8B4A2] shadow-soft space-y-4 animate-fade-in"
      role="alert"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#E8B4A2]/30 flex items-center justify-center shrink-0 text-[#B85D43]">
            <Heart className="w-5 h-5 fill-[#B85D43]/20" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-[#8C3A27] tracking-tight">
              We Care Deeply About Your Safety & Well-Being
            </h3>
            <p className="text-xs sm:text-sm text-[#A65B49] mt-0.5">
              {reason || 'Your recent responses indicate you may be navigating a heavy or overwhelming period right now.'}
            </p>
          </div>
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-xs text-[#A65B49] hover:text-[#8C3A27] underline shrink-0 px-2 py-1"
          >
            Acknowledge
          </button>
        )}
      </div>

      <div className="p-3.5 rounded-2xl bg-white/70 border border-[#E8B4A2]/50 text-xs sm:text-sm text-[#403B35] leading-relaxed">
        You do not have to carry this alone. Confidential, compassionate, and free mental health support is available right now across India. Please consider reaching out to one of these verified resources:
      </div>

      {/* Helpline Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        {/* Tele-MANAS */}
        <a
          href="tel:14416"
          className="p-3.5 rounded-2xl bg-white border border-[#E8B4A2] hover:border-[#B85D43] hover:shadow-soft transition-all duration-200 group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-xs text-[#B85D43] font-semibold mb-1">
              <span>National 24/7 Helpline</span>
              <Phone className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-base font-bold text-[#8C3A27]">
              Tele-MANAS
            </div>
            <div className="text-xs text-[#77736B] mt-0.5">
              Govt. of India mental health support in multiple Indian languages.
            </div>
          </div>
          <div className="mt-3 text-sm font-semibold text-[#B85D43] flex items-center gap-1.5">
            <span>Call 14416</span>
            <span className="text-[11px] text-[#A65B49] font-normal">(or 1800-891-4416)</span>
          </div>
        </a>

        {/* KIRAN Helpline */}
        <a
          href="tel:18005990019"
          className="p-3.5 rounded-2xl bg-white border border-[#E8B4A2] hover:border-[#B85D43] hover:shadow-soft transition-all duration-200 group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-xs text-[#B85D43] font-semibold mb-1">
              <span>Toll-Free 24/7</span>
              <Phone className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-base font-bold text-[#8C3A27]">
              KIRAN Helpline
            </div>
            <div className="text-xs text-[#77736B] mt-0.5">
              Psychological first aid, anxiety & distress management.
            </div>
          </div>
          <div className="mt-3 text-sm font-semibold text-[#B85D43] flex items-center gap-1.5">
            <span>Call 1800-599-0019</span>
          </div>
        </a>

        {/* Vandrevala Foundation */}
        <a
          href="tel:9999666555"
          className="p-3.5 rounded-2xl bg-white border border-[#E8B4A2] hover:border-[#B85D43] hover:shadow-soft transition-all duration-200 group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between text-xs text-[#B85D43] font-semibold mb-1">
              <span>Counseling 24/7</span>
              <Phone className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-base font-bold text-[#8C3A27]">
              Vandrevala Foundation
            </div>
            <div className="text-xs text-[#77736B] mt-0.5">
              Free, professional crisis intervention via call and WhatsApp.
            </div>
          </div>
          <div className="mt-3 text-sm font-semibold text-[#B85D43] flex items-center gap-1.5">
            <span>Call +91 9999 666 555</span>
          </div>
        </a>

      </div>

      {/* Directory Link */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#E8B4A2]/40 text-xs">
        <span className="text-[#8C3A27] font-medium">
          If you are in immediate physical danger, please dial <strong>112</strong> immediately.
        </span>
        <Link
          to="/dashboard/therapists"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#56664F] hover:text-[#403B35] underline"
        >
          <span>Connect with a licensed therapist in Pune District</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
};
