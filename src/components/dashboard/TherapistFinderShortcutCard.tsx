import React from 'react';
import { Link } from 'react-router-dom';
import { UserCheck, MapPin, ArrowRight, ShieldCheck, Languages, Heart } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

export const TherapistFinderShortcutCard: React.FC = () => {
  return (
    <Card
      padding="lg"
      className="border-[#D7E2D3] bg-[#FFFCF6] shadow-soft-sm relative overflow-hidden"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        {/* Left Info */}
        <div className="space-y-3 max-w-xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E9EFE7] text-[#56664F] border border-[#D7E2D3]">
              <UserCheck className="w-3.5 h-3.5 text-[#829675]" />
              <span>Professional Care Directory</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-[#FAF6EE] text-[#5B554D] font-medium border border-[#E4DACA]">
              <MapPin className="w-3 h-3 text-[#829675]" />
              <span>Pune District, Maharashtra</span>
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-semibold text-[#403B35] tracking-tight">
            You Don't Have to Figure It Out Alone
          </h3>

          <p className="text-xs sm:text-sm text-[#77736B] leading-relaxed">
            Connect with licensed Clinical Psychologists, Psychiatrists, and Counselors verified strictly within Pune District. Filter by your preferred locality and language (English, Marathi, Hindi, Telugu).
          </p>

          <div className="flex items-center gap-4 text-xs text-[#56664F] pt-0.5 flex-wrap">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#829675]" />
              <span>Verified Localities</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-[#829675]" />
              <span>English • Hindi • Marathi • Telugu</span>
            </span>
          </div>
        </div>

        {/* Right CTA */}
        <div className="w-full md:w-auto shrink-0">
          <Link to="/dashboard/therapists" className="block w-full sm:w-auto">
            <Button
              variant="primary"
              size="md"
              fullWidth
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="px-6 py-3 shadow-soft-sm text-sm"
            >
              Explore Pune Therapists
            </Button>
          </Link>
        </div>

      </div>
    </Card>
  );
};
