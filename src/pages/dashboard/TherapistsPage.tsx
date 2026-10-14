import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  UserCheck,
  BookmarkCheck,
  Search,
  Sparkles,
  MapPin,
  Heart,
  ShieldCheck,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { useWellness } from '../../context/WellnessContext';
import { PuneTherapist, TherapistFilterState } from '../../types/therapist';
import {
  SAMPLE_PUNE_THERAPISTS,
  isVerifiedInPuneDistrict,
} from '../../services/therapistData';
import { TherapistCard } from '../../components/therapist/TherapistCard';
import { TherapistDetailModal } from '../../components/therapist/TherapistDetailModal';
import { TherapistContactModal } from '../../components/therapist/TherapistContactModal';
import { TherapistFilters } from '../../components/therapist/TherapistFilters';
import { CrisisSupportBanner } from '../../components/therapist/CrisisSupportBanner';
import { LocationNoticeBanner } from '../../components/therapist/LocationNoticeBanner';
import { DemoNoticeBanner } from '../../components/therapist/DemoNoticeBanner';

const DEFAULT_FILTERS: TherapistFilterState = {
  searchQuery: '',
  locality: 'All',
  languages: [],
  professionalTypes: [],
  areasOfPractice: [],
  format: 'All',
  sortBy: 'name-asc',
};

export const TherapistsPage: React.FC = () => {
  const { savedTherapistIds } = useWellness();

  // Active view tab: Directory or Saved
  const [activeTab, setActiveTab] = useState<'directory' | 'saved'>('directory');

  // Filter state
  const [filters, setFilters] = useState<TherapistFilterState>(DEFAULT_FILTERS);

  // Modals state
  const [detailTherapist, setDetailTherapist] = useState<PuneTherapist | null>(null);
  const [contactTherapist, setContactTherapist] = useState<PuneTherapist | null>(null);

  // Strict District Enforcement: Only therapists verified in Pune District are considered
  const verifiedPuneTherapists = useMemo(() => {
    return SAMPLE_PUNE_THERAPISTS.filter(isVerifiedInPuneDistrict);
  }, []);

  // Filtered & Sorted therapists
  const filteredTherapists = useMemo(() => {
    return verifiedPuneTherapists.filter((th) => {
      // 1. Text Search (Name, Clinic, Locality)
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        const matchesName = th.name.toLowerCase().includes(query);
        const matchesClinic = th.clinicName?.toLowerCase().includes(query) ?? false;
        const matchesLocality = th.locality.toLowerCase().includes(query);
        const matchesAddress = th.address.toLowerCase().includes(query);
        if (!matchesName && !matchesClinic && !matchesLocality && !matchesAddress) {
          return false;
        }
      }

      // 2. Locality Filter (Strictly within Pune District)
      if (filters.locality !== 'All' && th.locality !== filters.locality) {
        return false;
      }

      // 3. Language Filter (ONLY English, Hindi, Marathi, Telugu)
      // If user selected languages, provider must speak at least ONE of the selected languages
      if (filters.languages.length > 0) {
        const speaksSelectedLanguage = filters.languages.some((lang) =>
          th.languages.includes(lang)
        );
        if (!speaksSelectedLanguage) return false;
      }

      // 4. Professional Type Filter
      if (filters.professionalTypes.length > 0) {
        if (!filters.professionalTypes.includes(th.professionalType)) {
          return false;
        }
      }

      // 5. Areas of Practice Filter
      if (filters.areasOfPractice.length > 0) {
        const matchesArea = filters.areasOfPractice.some((area) =>
          th.areasOfPractice.includes(area)
        );
        if (!matchesArea) return false;
      }

      // 6. Consultation Format (In-person, Online, Both)
      if (filters.format !== 'All') {
        if (filters.format === 'In-person') {
          if (th.consultationFormat !== 'In-person' && th.consultationFormat !== 'Both') {
            return false;
          }
        } else if (filters.format === 'Online') {
          if (th.consultationFormat !== 'Online' && th.consultationFormat !== 'Both') {
            return false;
          }
        } else if (filters.format === 'Both') {
          if (th.consultationFormat !== 'Both') {
            return false;
          }
        }
      }

      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'fee-asc':
          return a.consultationFee.amount - b.consultationFee.amount;
        case 'fee-desc':
          return b.consultationFee.amount - a.consultationFee.amount;
        case 'experience-desc':
          return b.experienceYears - a.experienceYears;
        default:
          return 0;
      }
    });
  }, [verifiedPuneTherapists, filters]);

  // Saved therapists list
  const savedTherapists = useMemo(() => {
    return verifiedPuneTherapists.filter((th) => savedTherapistIds.has(th.id));
  }, [verifiedPuneTherapists, savedTherapistIds]);

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      
      {/* ─── Top Header Section ───────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-2 border-b border-[#E4DACA]/60">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-xs uppercase tracking-widest font-semibold text-[#829675]">
              Professional Directory
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-[#E9EFE7] text-[#56664F] font-semibold border border-[#D7E2D3]">
              <MapPin className="w-3 h-3 text-[#829675]" />
              <span>Pune District Only</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-semibold text-[#403B35] tracking-tight">
            You Don't Have to Figure It Out Alone
          </h1>

          <p className="text-sm sm:text-base text-[#77736B] mt-1.5 leading-relaxed max-w-2xl">
            Explore professional mental health support that fits your needs, location, and language.
          </p>

          <p className="text-xs text-[#8C867A] mt-2 leading-relaxed max-w-2xl bg-[#FFFCF6] p-3 rounded-xl border border-[#E4DACA]">
            <Heart className="w-3.5 h-3.5 text-[#829675] inline mr-1.5" />
            Taking time to explore professional support is a courageous, positive step toward your emotional health. Feel free to browse options, review verified credentials, and move at whatever pace feels comfortable to you.
          </p>
        </div>

        {/* Return to Dashboard */}
        <Link to="/dashboard" className="self-start">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<ArrowLeft className="w-4 h-4 text-[#829675]" />}
            className="shadow-soft-sm shrink-0"
          >
            Return to Dashboard
          </Button>
        </Link>
      </div>

      {/* ─── Urgent Crisis Support Banner ─────────────────────────── */}
      <section aria-label="Urgent Crisis Support">
        <CrisisSupportBanner />
      </section>

      {/* ─── Location & Demo Notices ──────────────────────────────── */}
      <section aria-label="Directory Verification Notices" className="space-y-3">
        <LocationNoticeBanner />
        <DemoNoticeBanner />
      </section>

      {/* ─── Main Content Tabs: Directory vs Saved ───────────────── */}
      <div className="flex items-center justify-between border-b border-[#E4DACA] pb-1 gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('directory')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
              activeTab === 'directory'
                ? 'bg-[#829675] text-[#FFFCF6] shadow-soft-sm'
                : 'text-[#77736B] hover:text-[#403B35] hover:bg-[#FAF6EE]'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Pune Directory</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] ${
                activeTab === 'directory'
                  ? 'bg-white/20 text-white'
                  : 'bg-[#FAF6EE] text-[#77736B] border border-[#E4DACA]'
              }`}
            >
              {filteredTherapists.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('saved')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
              activeTab === 'saved'
                ? 'bg-[#829675] text-[#FFFCF6] shadow-soft-sm'
                : 'text-[#77736B] hover:text-[#403B35] hover:bg-[#FAF6EE]'
            }`}
          >
            <BookmarkCheck className="w-4 h-4" />
            <span>Saved Professionals</span>
            {savedTherapistIds.size > 0 && (
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                  activeTab === 'saved'
                    ? 'bg-white/20 text-white'
                    : 'bg-[#E9EFE7] text-[#56664F] border border-[#D7E2D3]'
                }`}
              >
                {savedTherapistIds.size}
              </span>
            )}
          </button>
        </div>

        {activeTab === 'directory' && (
          <span className="text-xs text-[#77736B] hidden sm:block">
            Showing verified practitioners in Pune District
          </span>
        )}
      </div>

      {/* ─── TAB 1: DIRECTORY VIEW ───────────────────────────────── */}
      {activeTab === 'directory' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <TherapistFilters
            filters={filters}
            onChange={setFilters}
            onReset={handleResetFilters}
            resultsCount={filteredTherapists.length}
          />

          {/* Therapist Results Grid */}
          {filteredTherapists.length === 0 ? (
            /* Friendly Empty State as specified */
            <div className="bg-[#FFFCF6] border border-[#E4DACA] rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-soft-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF3E7] text-[#C59B7E] mx-auto flex items-center justify-center border border-[#E8DBCA]">
                <Search className="w-6 h-6" />
              </div>
              <div className="space-y-1.5 max-w-md mx-auto">
                <h3 className="text-base sm:text-lg font-semibold text-[#403B35]">
                  No Professionals Match Your Search
                </h3>
                <p className="text-xs sm:text-sm text-[#77736B] leading-relaxed">
                  No professionals match your current filters. Try another language, specialization, or locality within Pune district.
                </p>
              </div>

              <div className="pt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleResetFilters}
                  leftIcon={<RotateCcw className="w-3.5 h-3.5 text-[#829675]" />}
                >
                  Clear All Filters
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTherapists.map((therapist) => (
                <TherapistCard
                  key={therapist.id}
                  therapist={therapist}
                  onViewDetails={setDetailTherapist}
                  onContactBook={setContactTherapist}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 2: SAVED PROFESSIONALS VIEW ─────────────────────── */}
      {activeTab === 'saved' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-[#FFFCF6] border border-[#E4DACA] flex items-center justify-between flex-wrap gap-2 text-xs">
            <div>
              <h3 className="font-semibold text-sm text-[#403B35]">
                Your Saved Professionals ({savedTherapists.length})
              </h3>
              <p className="text-[#77736B] text-[11px] mt-0.5">
                Bookmarked listings for Pune district. Stored locally in your browser session for personal review.
              </p>
            </div>
            <div className="text-[11px] text-[#8C6D4F] bg-[#FAF3E7] px-2.5 py-1 rounded-lg border border-[#E8DBCA]">
              Private & Confidential
            </div>
          </div>

          {savedTherapists.length === 0 ? (
            <div className="bg-[#FFFCF6] border border-[#E4DACA] rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-soft-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#E9EFE7] text-[#56664F] mx-auto flex items-center justify-center border border-[#D7E2D3]">
                <BookmarkCheck className="w-6 h-6 text-[#829675]" />
              </div>
              <div className="space-y-1.5 max-w-sm mx-auto">
                <h3 className="text-base font-semibold text-[#403B35]">
                  No Saved Professionals Yet
                </h3>
                <p className="text-xs text-[#77736B] leading-relaxed">
                  As you browse practitioners in Pune district, click the bookmark icon on any card to save them here for easy access.
                </p>
              </div>
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setActiveTab('directory')}
                >
                  Browse Pune Directory
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {savedTherapists.map((therapist) => (
                <TherapistCard
                  key={therapist.id}
                  therapist={therapist}
                  onViewDetails={setDetailTherapist}
                  onContactBook={setContactTherapist}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── Modals ──────────────────────────────────────────────── */}
      <TherapistDetailModal
        therapist={detailTherapist}
        isOpen={!!detailTherapist}
        onClose={() => setDetailTherapist(null)}
        onContactBook={(th) => {
          setDetailTherapist(null);
          setContactTherapist(th);
        }}
      />

      <TherapistContactModal
        therapist={contactTherapist}
        isOpen={!!contactTherapist}
        onClose={() => setContactTherapist(null)}
      />

    </div>
  );
};
