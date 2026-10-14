import React from 'react';
import {
  MapPin,
  Building,
  Languages,
  Video,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  Globe,
  Award,
  Sparkles,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  X,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { PuneTherapist } from '../../types/therapist';
import { useWellness } from '../../context/WellnessContext';
import { TherapistAvatar } from './TherapistAvatar';

interface TherapistDetailModalProps {
  therapist: PuneTherapist | null;
  isOpen: boolean;
  onClose: () => void;
  onContactBook: (therapist: PuneTherapist) => void;
}

export const TherapistDetailModal: React.FC<TherapistDetailModalProps> = ({
  therapist,
  isOpen,
  onClose,
  onContactBook,
}) => {
  const { isTherapistSaved, toggleSaveTherapist } = useWellness();

  if (!therapist) return null;
  const isSaved = isTherapistSaved(therapist.id);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      maxWidth="lg"
    >
      <div className="space-y-6 text-[#403B35]">
        
        {/* Top Header Card within Modal with Larger Circular Profile Picture */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-[#E4DACA]">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            {/* Larger Circular Profile Picture */}
            <TherapistAvatar
              name={therapist.name}
              profileImage={therapist.profileImage}
              size="lg"
            />

            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E9EFE7] text-[#56664F] border border-[#D7E2D3]">
                  {therapist.professionalType}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FFFCF6] text-[#829675] border border-[#D7E2D3]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Pune District Verified</span>
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-semibold text-[#403B35] tracking-tight">
                {therapist.name}
              </h2>
              <p className="text-xs sm:text-sm text-[#77736B] font-medium mt-0.5">
                {therapist.credentials}
              </p>
              {therapist.registrationNumber && (
                <p className="text-xs text-[#829675] font-mono mt-1">
                  Registration / Council ID: {therapist.registrationNumber}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 self-start shrink-0">
            <button
              type="button"
              onClick={() => toggleSaveTherapist(therapist.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors ${
                isSaved
                  ? 'bg-[#E9EFE7] text-[#56664F] border-[#D7E2D3]'
                  : 'bg-[#FFFCF6] text-[#77736B] border-[#E4DACA] hover:bg-[#FAF6EE]'
              }`}
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="w-3.5 h-3.5 text-[#829675] fill-current" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5 text-[#77736B]" />
                  <span>Save</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Practice Overview Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {/* Format */}
          <div className="p-3.5 rounded-xl bg-[#FAF6EE] border border-[#E4DACA] space-y-1">
            <span className="text-[#77736B] font-medium uppercase tracking-wider text-[10px] block">
              Consultation Formats
            </span>
            <div className="font-semibold text-[#403B35] flex items-center gap-1.5">
              {therapist.consultationFormat === 'Both' ? (
                <>
                  <Building className="w-3.5 h-3.5 text-[#829675]" />
                  <span>In-person & Online</span>
                </>
              ) : therapist.consultationFormat === 'In-person' ? (
                <>
                  <Building className="w-3.5 h-3.5 text-[#C59B7E]" />
                  <span>In-person Only</span>
                </>
              ) : (
                <>
                  <Video className="w-3.5 h-3.5 text-[#588DA8]" />
                  <span>Online Only</span>
                </>
              )}
            </div>
          </div>

          {/* Fee */}
          <div className="p-3.5 rounded-xl bg-[#FAF6EE] border border-[#E4DACA] space-y-1">
            <span className="text-[#77736B] font-medium uppercase tracking-wider text-[10px] block">
              Consultation Fee
            </span>
            <div className="font-semibold text-[#403B35] text-sm">
              ₹{therapist.consultationFee.amount}{' '}
              <span className="text-xs font-normal text-[#77736B]">
                / {therapist.consultationFee.sessionDuration}
              </span>
            </div>
            <span className="text-[10px] text-[#56664F] flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-[#829675]" />
              <span>Confirmed fee</span>
            </span>
          </div>

          {/* Experience */}
          <div className="p-3.5 rounded-xl bg-[#FAF6EE] border border-[#E4DACA] space-y-1">
            <span className="text-[#77736B] font-medium uppercase tracking-wider text-[10px] block">
              Clinical Experience
            </span>
            <div className="font-semibold text-[#403B35] text-sm">
              {therapist.experienceYears}+ Years
            </div>
            <span className="text-[10px] text-[#829675]">
              {therapist.availableSlot}
            </span>
          </div>
        </div>

        {/* Verified Clinic Address in Pune District */}
        <div className="p-4 rounded-xl bg-[#FFFCF6] border border-[#E4DACA] space-y-2 text-xs">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#403B35]">
            <MapPin className="w-4 h-4 text-[#829675]" />
            <span>Verified Clinic Location (Pune District Only)</span>
          </div>
          {therapist.clinicName && (
            <p className="font-medium text-[#403B35] text-sm">{therapist.clinicName}</p>
          )}
          <p className="text-[#5B554D] leading-relaxed">
            {therapist.address}
          </p>
          <div className="inline-flex items-center gap-1 text-[11px] text-[#56664F] font-medium bg-[#E9EFE7] px-2.5 py-0.5 rounded-md border border-[#D7E2D3]">
            <span>Locality: {therapist.locality}</span>
            <span>•</span>
            <span>Pune District, Maharashtra</span>
          </div>
        </div>

        {/* Confirmed Languages */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#77736B]">
            <Languages className="w-3.5 h-3.5 text-[#829675]" />
            <span>Confirmed Spoken Languages</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {therapist.languages.map((lang) => (
              <span
                key={lang}
                className="px-3 py-1 rounded-xl bg-[#FAF6EE] border border-[#E4DACA] text-xs font-medium text-[#403B35]"
              >
                {lang}
              </span>
            ))}
          </div>
          <p className="text-[11px] text-[#A39D93]">
            Languages are verified from official professional credentials.
          </p>
        </div>

        {/* Areas of Practice */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#77736B]">
            <Award className="w-3.5 h-3.5 text-[#829675]" />
            <span>Areas of Practice & Support</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {therapist.areasOfPractice.map((area) => (
              <span
                key={area}
                className="px-2.5 py-1 rounded-lg bg-[#E9EFE7]/60 text-[#56664F] text-xs font-medium border border-[#D7E2D3]"
              >
                {area}
              </span>
            ))}
          </div>
          <p className="text-[11px] text-[#A39D93]">
            Areas of practice represent clinical focus areas and do not imply medical diagnoses.
          </p>
        </div>

        {/* Bio & Approach */}
        <div className="space-y-3 pt-2 border-t border-[#F0E8DC]">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#77736B] mb-1">
              About the Professional
            </h4>
            <p className="text-xs sm:text-sm text-[#5B554D] leading-relaxed">
              {therapist.bio}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#77736B] mb-1">
              Therapeutic Approach & Modalities
            </h4>
            <p className="text-xs sm:text-sm text-[#5B554D] leading-relaxed">
              {therapist.approach}
            </p>
          </div>
        </div>

        {/* Contact details summary preview */}
        <div className="p-3.5 rounded-xl bg-[#FAF6EE] border border-[#E4DACA] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-1">
            <div className="font-semibold text-[#403B35]">Verified Contact Information</div>
            <div className="flex items-center gap-4 text-[#77736B] flex-wrap">
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#829675]" />
                <span>{therapist.phone}</span>
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-[#829675]" />
                <span>{therapist.email}</span>
              </span>
            </div>
          </div>

          <div className="text-[11px] text-[#8C6D4F] bg-[#FAF3E7] px-2.5 py-1 rounded-lg border border-[#E8DBCA] shrink-0">
            Simulated Demo Contact
          </div>
        </div>

        {/* Modal Actions */}
        <div className="pt-4 border-t border-[#E4DACA] flex items-center justify-end gap-3">
          <Button variant="secondary" size="md" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              onClose();
              onContactBook(therapist);
            }}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Contact / Book Appointment
          </Button>
        </div>

      </div>
    </Modal>
  );
};
