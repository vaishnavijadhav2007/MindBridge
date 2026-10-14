import React from 'react';
import { Info } from 'lucide-react';

export const DemoNoticeBanner: React.FC = () => {
  return (
    <div className="rounded-2xl border border-[#E8DBCA] bg-[#FAF3E7]/70 p-3.5 sm:p-4 text-xs text-[#6B5A47] flex items-start gap-3">
      <Info className="w-4 h-4 text-[#C59B7E] shrink-0 mt-0.5" />
      <div className="space-y-0.5 leading-relaxed">
        <span className="font-semibold text-[#403B35]">
          Demo Data — Not Real Professionals:
        </span>{' '}
        This directory displays sample profiles and simulated contact methods to demonstrate the Pune district search and multi-language filtering experience. When integrated into production, listings will link directly to verified clinical registries (RCI & MMC).
      </div>
    </div>
  );
};
