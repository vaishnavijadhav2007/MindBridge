import React from 'react';
import { 
  ClipboardCheck, 
  Clock, 
  ArrowRight, 
  Calendar, 
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { AssessmentType, AssessmentRecord } from '../../types/assessment';
import { QUESTIONNAIRES } from '../../services/assessmentService';

interface AssessmentCardProps {
  type: AssessmentType;
  latestRecord?: AssessmentRecord;
  onTakeAssessment: (type: AssessmentType) => void;
  onViewHistory?: (type: AssessmentType) => void;
}

export const AssessmentCard: React.FC<AssessmentCardProps> = ({
  type,
  latestRecord,
  onTakeAssessment,
  onViewHistory,
}) => {
  const definition = QUESTIONNAIRES[type];
  if (!definition) return null;

  const hasTaken = Boolean(latestRecord);
  const formattedDate = latestRecord ? new Date(latestRecord.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }) : null;

  return (
    <Card 
      padding="lg" 
      className="border-[#E4DACA] bg-[#FFFCF6] shadow-soft-sm hover:shadow-soft transition-all duration-200 flex flex-col justify-between"
    >
      <div className="space-y-4">
        
        {/* Top Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#E9EFE7] text-[#56664F] border border-[#D7E2D3]">
              <ClipboardCheck className="w-3 h-3 text-[#829675]" />
              <span>{definition.badge}</span>
            </span>
            <h3 className="text-base sm:text-lg font-bold text-[#403B35] tracking-tight">
              {definition.title}
            </h3>
          </div>

          <div className="flex items-center gap-1 text-xs text-[#77736B] shrink-0">
            <Clock className="w-3.5 h-3.5 text-[#829675]" />
            <span>{definition.estimatedMinutes} min</span>
          </div>
        </div>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-[#77736B] leading-relaxed">
          {definition.shortDescription}
        </p>

        {/* Latest Result Banner if taken */}
        {latestRecord ? (
          <div className="p-3.5 rounded-2xl bg-[#F3EBDD]/50 border border-[#E4DACA] space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#77736B]">Latest Score:</span>
              <span className="font-bold text-[#403B35]">
                {type === 'WHO-5' ? `${latestRecord.score * 4}%` : `${latestRecord.score} / ${latestRecord.maxScore}`}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#E9EFE7] text-[#56664F] border border-[#829675]/30">
                {latestRecord.severityLabel}
              </span>
              <span className="text-[11px] text-[#77736B] flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#829675]" />
                {formattedDate}
              </span>
            </div>

            {latestRecord.notes && (
              <p className="text-[11px] text-[#77736B] italic pt-1 border-t border-[#E4DACA]/60 line-clamp-1">
                "{latestRecord.notes}"
              </p>
            )}
          </div>
        ) : (
          <div className="p-3 rounded-2xl bg-[#F3EBDD]/30 border border-dashed border-[#E4DACA] text-xs text-[#77736B] flex items-center gap-2">
            <Info className="w-4 h-4 text-[#829675] shrink-0" />
            <span>Not taken yet. Take 2 minutes to check in.</span>
          </div>
        )}

      </div>

      {/* Card Action */}
      <div className="pt-5 mt-4 border-t border-[#E4DACA] flex items-center justify-between gap-3">
        {onViewHistory && (
          <button
            onClick={() => onViewHistory(type)}
            className="text-xs font-medium text-[#77736B] hover:text-[#56664F] underline"
          >
            Past Results
          </button>
        )}

        <Button
          variant={hasTaken ? 'secondary' : 'primary'}
          size="sm"
          onClick={() => onTakeAssessment(type)}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          className="text-xs ml-auto shadow-soft-sm"
        >
          {hasTaken ? 'Retake' : 'Begin Assessment'}
        </Button>
      </div>

    </Card>
  );
};
