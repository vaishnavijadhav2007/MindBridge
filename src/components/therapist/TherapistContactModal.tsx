import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building,
  Video,
  Send,
  Heart,
  X,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { PuneTherapist } from '../../types/therapist';
import { useWellness } from '../../context/WellnessContext';
import { TherapistAvatar } from './TherapistAvatar';

interface TherapistContactModalProps {
  therapist: PuneTherapist | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TherapistContactModal: React.FC<TherapistContactModalProps> = ({
  therapist,
  isOpen,
  onClose,
}) => {
  const { userProfile, showToast } = useWellness();

  const [name, setName] = useState(userProfile.name);
  const [contact, setContact] = useState(userProfile.email);
  const [preferredFormat, setPreferredFormat] = useState<'In-person' | 'Online'>(
    therapist?.consultationFormat === 'Online' ? 'Online' : 'In-person'
  );
  const [preferredDay, setPreferredDay] = useState<'This Week' | 'Next Week' | 'Weekend'>('This Week');
  const [note, setNote] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!therapist) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    showToast(`Appointment enquiry submitted for ${therapist.name}.`);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setNote('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleReset} title="" maxWidth="md">
      <div className="space-y-6 text-[#403B35]">

        {/* Header with Circular Avatar */}
        <div className="border-b border-[#E4DACA] pb-4 flex items-center gap-3.5">
          <TherapistAvatar
            name={therapist.name}
            profileImage={therapist.profileImage}
            size="md"
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-semibold tracking-wider text-[#829675]">
                Appointment & Consultation Request
              </span>
            </div>
            <h3 className="text-xl font-semibold text-[#403B35]">
              Contact {therapist.name}
            </h3>
            <p className="text-xs text-[#77736B] mt-0.5">
              {therapist.clinicName ? `${therapist.clinicName} • ` : ''}
              {therapist.locality}, Pune District
            </p>
          </div>
        </div>

        {isSubmitted ? (
          /* Confirmation Screen */
          <div className="py-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#E9EFE7] text-[#56664F] mx-auto flex items-center justify-center border border-[#D7E2D3]">
              <CheckCircle2 className="w-7 h-7 text-[#829675]" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-semibold text-[#403B35]">
                Consultation Request Received
              </h4>
              <p className="text-xs sm:text-sm text-[#77736B] max-w-sm mx-auto leading-relaxed">
                Thank you, <strong>{name}</strong>. In the real MindBridge directory, the clinic coordinator at{' '}
                <strong>{therapist.clinicName || therapist.name}</strong> will review your preferred format ({preferredFormat}) and contact you within 24 hours.
              </p>
            </div>

            <div className="p-3.5 bg-[#FAF6EE] rounded-2xl border border-[#E4DACA] text-xs text-[#77736B] max-w-sm mx-auto">
              <p className="font-medium text-[#403B35]">Demo Confirmation Notice</p>
              <p className="text-[11px] mt-0.5">
                No personal data was transmitted to external servers. This was a simulated appointment interaction.
              </p>
            </div>

            <div className="pt-2">
              <Button variant="primary" size="md" onClick={handleReset}>
                Done
              </Button>
            </div>
          </div>
        ) : (
          /* Contact / Booking Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Verified Clinic Info Card */}
            <div className="p-3.5 rounded-xl bg-[#FAF6EE] border border-[#E4DACA] space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#403B35] font-semibold">
                <span className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-[#829675]" />
                  <span>Clinic Address</span>
                </span>
                <span className="text-[11px] text-[#56664F] bg-[#E9EFE7] px-2 py-0.5 rounded-md font-medium border border-[#D7E2D3]">
                  Pune District Verified
                </span>
              </div>
              <p className="text-[#5B554D] leading-relaxed">
                {therapist.address}
              </p>
              <div className="flex items-center gap-3 pt-1 text-[11px] text-[#77736B] border-t border-[#E4DACA]">
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-[#829675]" />
                  <span>{therapist.phone}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-[#829675]" />
                  <span>{therapist.email}</span>
                </span>
              </div>
            </div>

            {/* Consultation Fee Note */}
            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-[#77736B]">Standard consultation fee:</span>
              <span className="font-semibold text-[#403B35]">
                ₹{therapist.consultationFee.amount} / {therapist.consultationFee.sessionDuration}
              </span>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Your Phone or Email"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
              />
            </div>

            {/* Consultation Format Choice */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#403B35] block">
                Preferred Consultation Format
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  disabled={therapist.consultationFormat === 'Online'}
                  onClick={() => setPreferredFormat('In-person')}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                    preferredFormat === 'In-person'
                      ? 'bg-[#E9EFE7] border-[#829675] text-[#56664F] font-semibold'
                      : 'bg-[#FFFCF6] border-[#E4DACA] text-[#77736B] hover:bg-[#FAF6EE]'
                  } ${therapist.consultationFormat === 'Online' ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  <Building className="w-3.5 h-3.5" />
                  <span>In-person at Clinic</span>
                </button>

                <button
                  type="button"
                  disabled={therapist.consultationFormat === 'In-person'}
                  onClick={() => setPreferredFormat('Online')}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                    preferredFormat === 'Online'
                      ? 'bg-[#E9EFE7] border-[#829675] text-[#56664F] font-semibold'
                      : 'bg-[#FFFCF6] border-[#E4DACA] text-[#77736B] hover:bg-[#FAF6EE]'
                  } ${therapist.consultationFormat === 'In-person' ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Online Video Call</span>
                </button>
              </div>
            </div>

            {/* Preferred Time Window */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#403B35] block">
                Preferred Timeline
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {(['This Week', 'Next Week', 'Weekend'] as const).map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setPreferredDay(day)}
                    className={`py-2 px-1 rounded-xl border text-center transition-all ${
                      preferredDay === day
                        ? 'bg-[#E9EFE7] border-[#829675] text-[#56664F] font-semibold'
                        : 'bg-[#FFFCF6] border-[#E4DACA] text-[#77736B] hover:bg-[#FAF6EE]'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Note */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#403B35] block">
                Brief Note or Reason for Consultation (Optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Share any preferred time slots, concerns, or questions for the clinic (e.g. anxiety support, evening slot)..."
                rows={2}
                className="w-full text-xs p-3 rounded-xl border border-[#E4DACA] bg-[#FFFCF6] text-[#403B35] focus:outline-none focus:ring-2 focus:ring-[#829675]/30 focus:border-[#829675] transition-all resize-none"
              />
            </div>

            <p className="text-[11px] text-[#A39D93] leading-relaxed">
              MindBridge respects your privacy. Details submitted in demo mode are not stored on external databases.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 border-t border-[#E4DACA] flex items-center justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={handleReset}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                type="submit"
                rightIcon={<Send className="w-3.5 h-3.5" />}
              >
                Send Request
              </Button>
            </div>

          </form>
        )}

      </div>
    </Modal>
  );
};
