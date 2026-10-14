import React, { useState } from 'react';
import {
  Search,
  Filter,
  RotateCcw,
  MapPin,
  Languages,
  UserCheck,
  Award,
  Video,
  Building,
  ChevronDown,
  ChevronUp,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import {
  TherapistFilterState,
  PuneLocality,
  AllowedLanguage,
  ProfessionalType,
  AreaOfPractice,
  ConsultationFormat,
} from '../../types/therapist';
import {
  PUNE_LOCALITIES,
  ALLOWED_LANGUAGES,
  PROFESSIONAL_TYPES,
  AREAS_OF_PRACTICE,
} from '../../services/therapistData';

interface TherapistFiltersProps {
  filters: TherapistFilterState;
  onChange: (filters: TherapistFilterState) => void;
  onReset: () => void;
  resultsCount: number;
}

export const TherapistFilters: React.FC<TherapistFiltersProps> = ({
  filters,
  onChange,
  onReset,
  resultsCount,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Search query handler
  const handleSearchChange = (val: string) => {
    onChange({ ...filters, searchQuery: val });
  };

  // Locality handler
  const handleLocalityChange = (val: PuneLocality | 'All') => {
    onChange({ ...filters, locality: val });
  };

  // Language toggle (Multi-select)
  const toggleLanguage = (lang: AllowedLanguage) => {
    const exists = filters.languages.includes(lang);
    const updated = exists
      ? filters.languages.filter((l) => l !== lang)
      : [...filters.languages, lang];
    onChange({ ...filters, languages: updated });
  };

  // Professional Type toggle (Multi-select)
  const toggleProfessionalType = (type: ProfessionalType) => {
    const exists = filters.professionalTypes.includes(type);
    const updated = exists
      ? filters.professionalTypes.filter((t) => t !== type)
      : [...filters.professionalTypes, type];
    onChange({ ...filters, professionalTypes: updated });
  };

  // Area of Practice toggle (Multi-select)
  const toggleArea = (area: AreaOfPractice) => {
    const exists = filters.areasOfPractice.includes(area);
    const updated = exists
      ? filters.areasOfPractice.filter((a) => a !== area)
      : [...filters.areasOfPractice, area];
    onChange({ ...filters, areasOfPractice: updated });
  };

  // Format handler
  const handleFormatChange = (fmt: 'All' | ConsultationFormat) => {
    onChange({ ...filters, format: fmt });
  };

  // Sort handler
  const handleSortChange = (sort: TherapistFilterState['sortBy']) => {
    onChange({ ...filters, sortBy: sort });
  };

  // Count active filters (excluding defaults)
  const activeFiltersCount =
    (filters.searchQuery ? 1 : 0) +
    (filters.locality !== 'All' ? 1 : 0) +
    filters.languages.length +
    filters.professionalTypes.length +
    filters.areasOfPractice.length +
    (filters.format !== 'All' ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* ─── Search Bar and Primary Controls ───────────────────────── */}
      <div className="bg-[#FFFCF6] border border-[#E4DACA] rounded-2xl p-4 shadow-soft-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Main Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#829675] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by professional name, clinic, or locality in Pune..."
              className="w-full text-xs sm:text-sm pl-10 pr-9 py-2.5 rounded-xl border border-[#E4DACA] bg-[#FAF6EE] text-[#403B35] placeholder-[#A39D93] focus:outline-none focus:ring-2 focus:ring-[#829675]/30 focus:border-[#829675] transition-all"
            />
            {filters.searchQuery && (
              <button
                type="button"
                onClick={() => handleSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A39D93] hover:text-[#403B35]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Pune Locality Select */}
          <div className="w-full md:w-56 shrink-0 relative">
            <MapPin className="w-4 h-4 text-[#829675] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={filters.locality}
              onChange={(e) => handleLocalityChange(e.target.value as PuneLocality | 'All')}
              aria-label="Filter by locality within Pune district"
              className="w-full text-xs sm:text-sm pl-9 pr-8 py-2.5 rounded-xl border border-[#E4DACA] bg-[#FAF6EE] text-[#403B35] focus:outline-none focus:ring-2 focus:ring-[#829675]/30 focus:border-[#829675] transition-all appearance-none cursor-pointer"
            >
              <option value="All">All Pune Localities</option>
              {PUNE_LOCALITIES.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#77736B] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sort By Select */}
          <div className="w-full md:w-48 shrink-0 relative">
            <select
              value={filters.sortBy}
              onChange={(e) => handleSortChange(e.target.value as TherapistFilterState['sortBy'])}
              aria-label="Sort providers"
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-[#E4DACA] bg-[#FAF6EE] text-[#403B35] focus:outline-none focus:ring-2 focus:ring-[#829675]/30 focus:border-[#829675] transition-all appearance-none cursor-pointer"
            >
              <option value="name-asc">Sort: Name (A to Z)</option>
              <option value="name-desc">Sort: Name (Z to A)</option>
              <option value="fee-asc">Sort: Fee (Lowest First)</option>
              <option value="fee-desc">Sort: Fee (Highest First)</option>
              <option value="experience-desc">Sort: Experience (Years)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#77736B] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Toggle Advanced Filters Button */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`px-3.5 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-colors shrink-0 ${
              showAdvanced || activeFiltersCount > 0
                ? 'bg-[#E9EFE7] border-[#829675] text-[#56664F]'
                : 'bg-[#FAF6EE] border-[#E4DACA] text-[#77736B] hover:bg-[#EAE1D2]'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#829675] text-[#FFFCF6] text-[10px] font-bold flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
            {showAdvanced ? <ChevronUp className="w-3.5 h-3.5 ml-1" /> : <ChevronDown className="w-3.5 h-3.5 ml-1" />}
          </button>

        </div>

        {/* Format Quick Selector Pills (Always Visible) */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#F0E8DC] flex-wrap text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[#77736B] font-medium mr-1 text-[11px] uppercase tracking-wider">
              Format:
            </span>
            {(['All', 'Both', 'In-person', 'Online'] as const).map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => handleFormatChange(fmt)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                  filters.format === fmt
                    ? 'bg-[#829675] text-[#FFFCF6] font-semibold'
                    : 'bg-[#FAF6EE] text-[#5B554D] border border-[#E4DACA] hover:bg-[#EAE1D2]'
                }`}
              >
                {fmt === 'All' ? 'All Formats' : fmt}
              </button>
            ))}
          </div>

          {/* Results count & Clear all */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#77736B] font-medium">
              Found <strong className="text-[#403B35]">{resultsCount}</strong> {resultsCount === 1 ? 'provider' : 'providers'} in Pune
            </span>

            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-1 text-xs text-[#829675] hover:text-[#56664F] font-semibold hover:underline"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear all</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* ─── Expanded Filter Panel ─────────────────────────────────── */}
      {showAdvanced && (
        <div className="bg-[#FFFCF6] border border-[#E4DACA] rounded-2xl p-5 shadow-soft-sm space-y-5 animate-in fade-in duration-200">
          
          {/* 1. Language Filter (ONLY 4 ALLOWED LANGUAGES) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#403B35] flex items-center gap-1.5">
                <Languages className="w-4 h-4 text-[#829675]" />
                <span>Language (Explicitly Confirmed Only)</span>
              </span>
              <span className="text-[11px] text-[#77736B]">Select one or multiple</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ALLOWED_LANGUAGES.map((lang) => {
                const checked = filters.languages.includes(lang);
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => toggleLanguage(lang)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all ${
                      checked
                        ? 'bg-[#E9EFE7] border-[#829675] text-[#56664F] font-semibold shadow-soft-sm'
                        : 'bg-[#FAF6EE] border-[#E4DACA] text-[#403B35] hover:bg-[#EAE1D2]'
                    }`}
                  >
                    <span>{lang}</span>
                    <span
                      className={`w-4 h-4 rounded-md border flex items-center justify-center text-[10px] ${
                        checked
                          ? 'bg-[#829675] border-[#829675] text-white font-bold'
                          : 'border-[#A39D93] bg-[#FFFCF6]'
                      }`}
                    >
                      {checked && '✓'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Professional Type Filter */}
          <div className="space-y-2 pt-3 border-t border-[#F0E8DC]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#403B35] flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-[#829675]" />
                <span>Professional Type</span>
              </span>
              <span className="text-[11px] text-[#77736B]">Clinical Psychologist, Psychiatrist, etc.</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {PROFESSIONAL_TYPES.map((type) => {
                const selected = filters.professionalTypes.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleProfessionalType(type)}
                    className={`px-3 py-1.5 rounded-xl border text-xs transition-all ${
                      selected
                        ? 'bg-[#829675] border-[#829675] text-[#FFFCF6] font-semibold shadow-soft-sm'
                        : 'bg-[#FAF6EE] border-[#E4DACA] text-[#403B35] hover:bg-[#EAE1D2]'
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Areas of Practice Filter */}
          <div className="space-y-2 pt-3 border-t border-[#F0E8DC]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#403B35] flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#829675]" />
                <span>Areas of Practice (Non-Diagnostic)</span>
              </span>
              <span className="text-[11px] text-[#77736B]">Explore concerns at your own pace</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {AREAS_OF_PRACTICE.map((area) => {
                const selected = filters.areasOfPractice.includes(area);
                return (
                  <button
                    key={area}
                    type="button"
                    onClick={() => toggleArea(area)}
                    className={`px-3 py-1.5 rounded-xl border text-xs transition-all ${
                      selected
                        ? 'bg-[#E9EFE7] border-[#829675] text-[#56664F] font-semibold'
                        : 'bg-[#FAF6EE] border-[#E4DACA] text-[#5B554D] hover:bg-[#EAE1D2]'
                    }`}
                  >
                    {area}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Clear & Close Row */}
          <div className="pt-3 border-t border-[#F0E8DC] flex items-center justify-between">
            <span className="text-xs text-[#77736B]">
              {activeFiltersCount} active filter{activeFiltersCount === 1 ? '' : 's'}
            </span>

            <div className="flex items-center gap-2">
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={onReset}
                  className="px-3 py-1.5 rounded-xl bg-[#FAF6EE] text-xs font-medium text-[#77736B] hover:text-[#403B35] hover:bg-[#EAE1D2]"
                >
                  Clear all
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowAdvanced(false)}
                className="px-4 py-1.5 rounded-xl bg-[#829675] text-xs font-semibold text-[#FFFCF6] hover:bg-[#728566] transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ─── Active Filter Pills (Removable) ───────────────────────── */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap text-xs pt-1">
          <span className="text-[11px] text-[#77736B] uppercase font-semibold tracking-wider mr-1">
            Active:
          </span>

          {filters.searchQuery && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFFCF6] border border-[#E4DACA] text-[#403B35]">
              <span>"{filters.searchQuery}"</span>
              <button
                type="button"
                onClick={() => handleSearchChange('')}
                className="hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.locality !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E9EFE7] border border-[#D7E2D3] text-[#56664F] font-medium">
              <span>{filters.locality}</span>
              <button
                type="button"
                onClick={() => handleLocalityChange('All')}
                className="hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.languages.map((l) => (
            <span
              key={l}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FAF3E7] border border-[#E8DBCA] text-[#8C6D4F] font-medium"
            >
              <span>{l}</span>
              <button
                type="button"
                onClick={() => toggleLanguage(l)}
                className="hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {filters.professionalTypes.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EBF3F8] border border-[#D4E3EE] text-[#476C87] font-medium"
            >
              <span>{t}</span>
              <button
                type="button"
                onClick={() => toggleProfessionalType(t)}
                className="hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {filters.areasOfPractice.map((a) => (
            <span
              key={a}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFFCF6] border border-[#E4DACA] text-[#77736B]"
            >
              <span>{a}</span>
              <button
                type="button"
                onClick={() => toggleArea(a)}
                className="hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {filters.format !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FAF6EE] border border-[#E4DACA] text-[#403B35]">
              <span>Format: {filters.format}</span>
              <button
                type="button"
                onClick={() => handleFormatChange('All')}
                className="hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}

    </div>
  );
};
