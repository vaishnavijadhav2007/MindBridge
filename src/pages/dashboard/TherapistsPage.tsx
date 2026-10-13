import React, { useState } from 'react';
import { UserCheck, Star, MapPin, Calendar, Check, Search, ShieldCheck } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Therapist } from '../../types';
import { useWellness } from '../../context/WellnessContext';

const sampleTherapists: Therapist[] = [
  {
    id: 'th-1',
    name: 'Dr. Elena Vance, PsyD',
    credentials: 'Licensed Clinical Psychologist',
    specialties: ['Anxiety & Panic', 'Mindfulness-Based CBT', 'Workplace Burnout'],
    experience: '12+ years experience',
    rating: 4.9,
    reviewsCount: 48,
    availableSlot: 'Tomorrow at 2:00 PM',
    bio: 'Specializing in compassionate cognitive-behavioral tools and grounding techniques for high-stress professionals and chronic anxiety.',
    location: 'Virtual / Video Consultation'
  },
  {
    id: 'th-2',
    name: 'Marcus Holloway, LMFT',
    credentials: 'Licensed Marriage & Family Therapist',
    specialties: ['Life Transitions', 'Relationship Dynamics', 'Emotional Awareness'],
    experience: '8+ years experience',
    rating: 4.8,
    reviewsCount: 34,
    availableSlot: 'Thursday at 11:00 AM',
    bio: 'Focuses on building healthy boundaries, self-worth, and authentic emotional expression in a warm, welcoming space.',
    location: 'Virtual & In-Person (Austin, TX)'
  },
  {
    id: 'th-3',
    name: 'Aisha Patel, LCSW',
    credentials: 'Licensed Clinical Social Worker',
    specialties: ['Depression Support', 'Holistic Wellness', 'Mindful Somatics'],
    experience: '10+ years experience',
    rating: 5.0,
    reviewsCount: 62,
    availableSlot: 'Friday at 4:30 PM',
    bio: 'Integrates somatic nervous system regulation with psychodynamic therapy to help individuals overcome feelings of stagnation.',
    location: 'Virtual Consultation'
  }
];

export const TherapistsPage: React.FC = () => {
  const { showToast } = useWellness();
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const filters = ['All', 'Anxiety & Panic', 'Mindfulness-Based CBT', 'Life Transitions', 'Depression Support'];

  const filteredTherapists = sampleTherapists.filter(t => {
    if (activeFilter === 'All') return true;
    return t.specialties.includes(activeFilter);
  });

  const handleBook = () => {
    setBookingConfirmed(true);
    setTimeout(() => {
      setBookingConfirmed(false);
      const name = selectedTherapist?.name;
      setSelectedTherapist(null);
      showToast(`Demo consultation booked with ${name}!`);
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#829675] mb-1">
            <UserCheck className="w-4 h-4" />
            <span>Professional Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#403B35] tracking-tight">
            Find a Licensed Therapist
          </h1>
          <p className="text-sm text-[#77736B] mt-1">
            Connect with verified mental health specialists who match your goals and communication style.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#56664F] bg-[#E9EFE7] border border-[#D7E2D3] px-3.5 py-1.5 rounded-full">
          <ShieldCheck className="w-4 h-4 text-[#829675]" />
          <span>All Providers Vetted & Certified</span>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap border ${
              activeFilter === f
                ? 'bg-[#829675] text-[#FFFCF6] border-[#829675] shadow-soft-sm'
                : 'bg-[#FFFCF6] text-[#77736B] border-[#E4DACA] hover:border-[#829675]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Therapist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredTherapists.map((therapist) => (
          <Card key={therapist.id} padding="md" hoverEffect className="flex flex-col justify-between border-[#E4DACA] bg-[#FFFCF6]">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#E9EFE7] text-[#829675] font-semibold text-sm flex items-center justify-center shrink-0 border border-[#D7E2D3]">
                  {therapist.name.split(' ')[1]?.[0] || 'T'}
                </div>
                <div className="flex items-center gap-1 bg-[#FAF6EE] px-2 py-1 rounded-xl text-xs font-semibold text-[#403B35]">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{therapist.rating}</span>
                  <span className="text-[#A39D93] text-[10px]">({therapist.reviewsCount})</span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-base text-[#403B35]">{therapist.name}</h3>
                <p className="text-xs text-[#77736B]">{therapist.credentials}</p>
                <div className="flex items-center gap-1 text-[11px] text-[#A39D93] mt-1">
                  <MapPin className="w-3 h-3 text-[#829675]" />
                  <span>{therapist.location}</span>
                </div>
              </div>

              <p className="text-xs text-[#77736B] leading-relaxed line-clamp-3">
                {therapist.bio}
              </p>

              {/* Specialties */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {therapist.specialties.map((s, idx) => (
                  <span key={idx} className="text-[10px] bg-[#F3EBDD] text-[#56664F] px-2 py-0.5 rounded-md border border-[#E4DACA]">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Next availability & Action button */}
            <div className="pt-4 mt-4 border-t border-[#F0E8DC] space-y-2.5">
              <div className="text-[11px] text-[#77736B] flex items-center justify-between">
                <span>Next Opening:</span>
                <strong className="text-[#829675]">{therapist.availableSlot}</strong>
              </div>
              <Button
                variant="primary"
                fullWidth
                size="sm"
                onClick={() => setSelectedTherapist(therapist)}
              >
                Book Consultation
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Booking Demo Modal */}
      <Modal
        isOpen={!!selectedTherapist}
        onClose={() => setSelectedTherapist(null)}
        title="Consultation Request"
        subtitle={selectedTherapist ? `Scheduling introductory session with ${selectedTherapist.name}` : ''}
      >
        {bookingConfirmed ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#E9EFE7] text-[#829675] flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-base text-[#403B35]">Consultation Request Placed!</h4>
            <p className="text-xs text-[#77736B]">
              In this frontend demo, your request for <strong>{selectedTherapist?.availableSlot}</strong> has been logged.
            </p>
          </div>
        ) : (
          <div className="space-y-4 text-sm text-[#403B35]">
            <div className="bg-[#FAF6EE] p-3.5 rounded-xl border border-[#E4DACA] space-y-1 text-xs">
              <div><strong>Format:</strong> 15-minute introductory video call</div>
              <div><strong>Available Slot:</strong> {selectedTherapist?.availableSlot}</div>
              <div><strong>Cost:</strong> Complimentary initial fit check</div>
            </div>

            <p className="text-xs text-[#77736B]">
              This consultation allows you and the specialist to discuss your wellness goals and determine if their care style matches your needs.
            </p>

            <div className="flex justify-end gap-3 pt-3">
              <Button variant="ghost" onClick={() => setSelectedTherapist(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleBook}>
                Confirm Demo Booking
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
