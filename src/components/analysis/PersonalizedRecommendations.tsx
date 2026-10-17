import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Play, 
  MapPin, 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  UserCheck,
  Heart
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { WellnessActivity } from '../../types/wellness';
import { PuneTherapist } from '../../types/therapist';
import { ALL_ACTIVITIES } from '../../services/wellnessActivities';
import { SAMPLE_PUNE_THERAPISTS } from '../../services/therapistData';
import { useWellness } from '../../context/WellnessContext';

interface PersonalizedRecommendationsProps {
  recommendedActivityIds: string[];
  recommendedSpecialties: string[];
}

export const PersonalizedRecommendations: React.FC<PersonalizedRecommendationsProps> = ({
  recommendedActivityIds,
  recommendedSpecialties,
}) => {
  const { openWellnessActivity } = useWellness();

  // Match activities from catalog
  const matchedActivities: WellnessActivity[] = ALL_ACTIVITIES.filter(act =>
    recommendedActivityIds.includes(act.id)
  );

  // Fallback to first 3 if none matched
  const displayActivities = matchedActivities.length > 0 
    ? matchedActivities 
    : ALL_ACTIVITIES.slice(0, 3);

  // Match Pune therapists matching specialties
  const matchedTherapists: PuneTherapist[] = SAMPLE_PUNE_THERAPISTS.filter(th =>
    th.areasOfPractice.some(s => recommendedSpecialties.includes(s))
  ).slice(0, 2);

  const displayTherapists = matchedTherapists.length > 0 
    ? matchedTherapists 
    : SAMPLE_PUNE_THERAPISTS.slice(0, 2);

  return (
    <div className="space-y-8">
      
      {/* 1. Tailored Coping Activities */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#829675] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Recommended Coping Exercises</span>
            </div>
            <h3 className="text-xl font-bold text-[#403B35] tracking-tight">
              Matched to Your Current State
            </h3>
          </div>
          <span className="text-xs text-[#77736B]">
            Interactive exercises you can do right now
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {displayActivities.map((act) => (
            <Card
              key={act.id}
              padding="md"
              className="border-[#E4DACA] bg-[#FFFCF6] shadow-soft-sm hover:shadow-soft transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-0.5 rounded-full font-semibold bg-[#E9EFE7] text-[#56664F] border border-[#D7E2D3]">
                    {act.category}
                  </span>
                  <span className="text-[#77736B] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#829675]" />
                    {act.estimatedDuration}
                  </span>
                </div>

                <h4 className="text-base font-bold text-[#403B35] tracking-tight">
                  {act.title}
                </h4>

                <p className="text-xs text-[#77736B] leading-relaxed line-clamp-2">
                  {act.shortDescription}
                </p>

                <p className="text-[11px] text-[#56664F] bg-[#F3EBDD]/40 p-2.5 rounded-xl border border-[#E4DACA]/70 line-clamp-2">
                  <strong>Why it helps:</strong> {act.whyItHelps}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#E4DACA]">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => openWellnessActivity(act)}
                  leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
                  className="w-full text-xs shadow-soft-sm"
                >
                  Start Exercise
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 2. Matched Pune District Therapists */}
      <section className="space-y-4 pt-4 border-t border-[#E4DACA]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#829675] mb-1">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Professional Care in Pune</span>
            </div>
            <h3 className="text-xl font-bold text-[#403B35] tracking-tight">
              Verified Practitioners Specializing in Your Needs
            </h3>
          </div>

          <Link
            to="/dashboard/therapists"
            className="text-xs font-semibold text-[#56664F] hover:text-[#403B35] underline flex items-center gap-1"
          >
            <span>Explore All 12 Pune Localities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayTherapists.map((th) => (
            <Card
              key={th.id}
              padding="lg"
              className="border-[#E4DACA] bg-[#FFFCF6] shadow-soft-sm hover:shadow-soft transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-base font-bold text-[#403B35]">
                      {th.name}
                    </h4>
                    <span className="text-xs font-semibold text-[#829675]">
                      {th.professionalType}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#E9EFE7] text-[#56664F] border border-[#D7E2D3]">
                    <MapPin className="w-3 h-3 text-[#829675]" />
                    {th.locality}
                  </span>
                </div>

                <p className="text-xs text-[#77736B] leading-relaxed line-clamp-2">
                  {th.credentials}
                </p>

                {/* Specialties matching */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {th.areasOfPractice.map((s, i) => {
                    const isMatched = recommendedSpecialties.includes(s);
                    return (
                      <span
                        key={i}
                        className={`text-[11px] px-2 py-0.5 rounded-full border ${
                          isMatched
                            ? 'bg-[#E9EFE7] text-[#56664F] border-[#829675]/40 font-semibold'
                            : 'bg-[#F3EBDD]/50 text-[#77736B] border-[#E4DACA]'
                        }`}
                      >
                        {s}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#E4DACA] flex items-center justify-between">
                <span className="text-xs text-[#77736B]">
                  Next slot: <strong>{th.availableSlot}</strong>
                </span>

                <Link to="/dashboard/therapists">
                  <Button
                    variant="outline"
                    size="sm"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    className="text-xs"
                  >
                    View in Directory
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

    </div>
  );
};
