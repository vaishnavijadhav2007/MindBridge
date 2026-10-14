import React from 'react';
import { MapPin, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const LocationNoticeBanner: React.FC = () => {
  return (
    <div className="rounded-2xl border border-[#D7E2D3] bg-[#E9EFE7]/50 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#829675] text-[#FFFCF6] flex items-center justify-center shrink-0 mt-0.5 shadow-soft-sm">
          <MapPin className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-[#56664F]">
              Verified Directory Scope
            </span>
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-[#FFFCF6] text-[#56664F] font-semibold border border-[#D7E2D3] shadow-soft-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-[#829675]" />
              <span>Pune District, Maharashtra</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#403B35] mt-1 leading-relaxed">
            All listed clinics and practitioners have addresses strictly verified within <strong>Pune District boundaries</strong> (including Pune City, Pimpri-Chinchwad, Hinjawadi, Kothrud, Aundh, Baner, Wakad, and Hadapsar).
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 text-xs text-[#56664F] bg-[#FFFCF6]/80 px-3 py-2 rounded-xl border border-[#D7E2D3]">
        <CheckCircle2 className="w-4 h-4 text-[#829675] shrink-0" />
        <span>No device GPS required • Filter by locality below</span>
      </div>
    </div>
  );
};
