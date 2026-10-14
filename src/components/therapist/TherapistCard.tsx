import React from 'react';
import {
  MapPin,
  Languages,
  Video,
  Building,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { PuneTherapist } from '../../types/therapist';
import { useWellness } from '../../context/WellnessContext';

interface TherapistCardProps {
  therapist: PuneTherapist;
  onViewDetails: (therapist: PuneTherapist) => void;
  onContactBook: (therapist: PuneTherapist) => void;
}

export const TherapistCard: React.FC<TherapistCardProps> = ({
  therapist,
  onViewDetails,
  onContactBook,
}) => {
  const { isTherapistSaved, toggleSaveTherapist } = useWellness();
  const isSaved = isTherapistSaved(therapist.id);

  const getFormatBadge = () => {
    switch (therapist.consultationFormat) {
      case 'Both':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#E9EFE7] text-[#56664F] border border-[#D7E2D3]">
            <Building className="w-3 h-3 text-[#829675]" />
            <span>In-person & Online</span>
          </span>
        );
      case 'In-person':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#FAF3E7] text-[#8C6D4F] border border-[#E8DBCA]">
            <Building className="w-3 h-3 text-[#C59B7E]" />
            <span>In-person Only</span>
          </span>
        );
      case 'Online':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#EBF3F8] text-[#476C87] border border-[#D4E3EE]">
            <Video className="w-3 h-3 text-[#588DA8]" />
            <span>Online Only</span>
          </span>
        );
    }
  };

  const getTypeBadgeClass = () => {
    switch (therapist.professionalType) {
      case 'Clinical Psychologist':
        return 'bg-[#E9EFE7] text-[#56664F] border-[#D7E2D3]';
      case 'Psychiatrist':
        return 'bg-[#F3EBF7] text-[#6D28D9] border-[#DEC9EA]';
      case 'Counseling Psychologist':
        return 'bg-[#FAF3E7] text-[#8C6D4F] border-[#E8DBCA]';
      case 'Mental Health Counselor':
        return 'bg-[#EBF3F8] text-[#476C87] border-[#D4E3EE]';
      default:
        return 'bg-[#FAF6EE] text-[#5B554D] border-[#E4DACA]';
    }
  };

  return (
    <Card
      padding="lg"
      className="bg-[#FFFCF6] border-[#E4DACA] shadow-soft-sm hover:shadow-soft-md transition-all duration-200 flex flex-col justify-between relative group"
    >
      <div>
        {/* Top Meta Header: Type Badge, Consultation Format, Bookmark */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getTypeBadgeClass()}`}
            >
              {therapist.professionalType}
            </span>
            {getFormatBadge()}
          </div>

          <button
            type="button"
            onClick={() => toggleSaveTherapist(therapist.id)}
            title={isSaved ? 'Remove from saved' : 'Save professional'}
            className={`p-2 rounded-xl transition-colors shrink-0 ${
              isSaved
                ? 'bg-[#E9EFE7] text-[#56664F]'
                : 'text-[#A39D93] hover:text-[#403B35] hover:bg-[#FAF6EE]'
            }`}
          >
            {isSaved ? (
              <BookmarkCheck className="w-4 h-4 fill-current text-[#829675]" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Name and Credentials */}
        <div className="mt-3">
          <h3 className="text-lg font-semibold text-[#403B35] tracking-tight group-hover:text-[#2E2A25] transition-colors">
            {therapist.name}
          </h3>
          <p className="text-xs text-[#77736B] font-medium mt-0.5 line-clamp-1">
            {therapist.credentials}
          </p>
        </div>

        {/* Clinic & Locality in Pune District */}
        <div className="mt-3 space-y-1.5 text-xs text-[#5B554D]">
          {therapist.clinicName && (
            <div className="flex items-center gap-1.5 text-[#403B35] font-medium">
              <Building className="w-3.5 h-3.5 text-[#829675] shrink-0" />
              <span className="line-clamp-1">{therapist.clinicName}</span>
            </div>
          )}

          <div className="flex items-start gap-1.5 text-[#77736B]">
            <MapPin className="w-3.5 h-3.5 text-[#829675] shrink-0 mt-0.5" />
            <span className="line-clamp-2">
              <strong className="text-[#403B35]">{therapist.locality}</strong>, Pune District
            </span>
          </div>
        </div>

        {/* Confirmed Languages Chips */}
        <div className="mt-3.5 pt-3 border-t border-[#F0E8DC]">
          <div className="flex items-center gap-1.5 text-xs text-[#77736B] mb-1.5">
            <Languages className="w-3.5 h-3.5 text-[#829675]" />
            <span className="text-[11px] font-medium uppercase tracking-wider">Confirmed Languages:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {therapist.languages.map((lang) => (
              <span
                key={lang}
                className="px-2 py-0.5 rounded-lg bg-[#FAF6EE] text-[#403B35] text-xs font-medium border border-[#E4DACA]"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>

        {/* Areas of Practice Chips */}
        <div className="mt-3">
          <div className="flex flex-wrap gap-1">
            {therapist.areasOfPractice.map((area) => (
              <span
                key={area}
                className="px-2 py-0.5 rounded-md bg-[#FFFCF6] text-[#77736B] text-[11px] border border-[#E4DACA]/80"
              >
                {area}
              </span>
            ))}
          </div>
        </div>

        {/* Short Bio */}
        <p className="mt-3 text-xs text-[#77736B] leading-relaxed line-clamp-2">
          {therapist.bio}
        </p>
      </div>

      {/* Card Footer: Fee, Availability, Action Buttons */}
      <div className="mt-5 pt-4 border-t border-[#F0E8DC] space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-[#403B35] text-sm">
                ₹{therapist.consultationFee.amount}
              </span>
              <span className="text-[#77736B]">/ {therapist.consultationFee.sessionDuration}</span>
            </div>
            <span className="text-[10px] text-[#56664F] flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3 h-3 text-[#829675]" />
              <span>Verified fee</span>
            </span>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-[#77736B] font-medium block">
              {therapist.experienceYears}+ years exp.
            </span>
            <span className="text-[10px] text-[#829675] font-medium block line-clamp-1 max-w-[150px]">
              {therapist.availableSlot}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Button
            variant="secondary"
            size="sm"
            fullWidth
            onClick={() => onViewDetails(therapist)}
          >
            View Details
          </Button>

          <Button
            variant="primary"
            size="sm"
            fullWidth
            onClick={() => onContactBook(therapist)}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Contact / Book
          </Button>
        </div>
      </div>
    </Card>
  );
};
