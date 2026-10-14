import React, { useState } from 'react';
import {
  Clock, Bookmark, BookmarkCheck, Play,
  Plus, Check, Info, Tag
} from 'lucide-react';
import { WellnessActivity } from '../../types/wellness';
import { useWellness } from '../../context/WellnessContext';

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Relaxation: { bg: 'bg-[#EEF0F5]', text: 'text-[#6B7FA3]', border: 'border-[#D4D9E8]' },
  Focus:       { bg: 'bg-[#FAF3E7]', text: 'text-[#C59B7E]', border: 'border-[#E8DBCA]' },
  Reflection:  { bg: 'bg-[#F5EEF8]', text: 'text-[#9B59B6]', border: 'border-[#DEC9EA]' },
  Sleep:       { bg: 'bg-[#EEF0F5]', text: 'text-[#4A6FA5]', border: 'border-[#C5D1E8]' },
  Breathing:   { bg: 'bg-[#E9EFE7]', text: 'text-[#56664F]', border: 'border-[#D7E2D3]' },
  Physical:    { bg: 'bg-[#FEF0F0]', text: 'text-[#C0392B]', border: 'border-[#EDBBBB]' },
};

interface ActivityCardProps {
  activity: WellnessActivity;
  /** Show add-to-plan button */
  showAddToPlan?: boolean;
  /** Show check-off button when in daily plan */
  showComplete?: boolean;
  isCompleted?: boolean;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  showAddToPlan = true,
  showComplete = false,
  isCompleted = false,
}) => {
  const { openWellnessActivity, toggleSaved, savedActivityIds, addToDailyPlan, dailyPlan } = useWellness();
  const [showWhy, setShowWhy] = useState(false);

  const isSaved = savedActivityIds.has(activity.id);
  const isInPlan = dailyPlan.some(p => p.activityId === activity.id);
  const color = CATEGORY_COLORS[activity.category] ?? CATEGORY_COLORS.Breathing;

  return (
    <div
      className={`bg-[#FFFCF6] border rounded-2xl sm:rounded-3xl shadow-soft-sm transition-all duration-200 flex flex-col ${
        isCompleted
          ? 'border-[#D7E2D3] opacity-70'
          : 'border-[#E4DACA] hover:border-[#829675]/40 hover:shadow-soft-md'
      }`}
    >
      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Top row: category + duration + bookmark */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${color.bg} ${color.text} ${color.border}`}>
              <Tag className="w-3 h-3" />
              {activity.category}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-[#77736B]">
              <Clock className="w-3.5 h-3.5 text-[#829675]" />
              {activity.estimatedDuration}
            </span>
          </div>
          <button
            type="button"
            onClick={() => toggleSaved(activity.id)}
            title={isSaved ? 'Remove from saved' : 'Save for later'}
            className={`p-1.5 rounded-xl transition-colors ${isSaved ? 'text-[#829675]' : 'text-[#C5BDB4] hover:text-[#829675]'} hover:bg-[#F3EBDD]`}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>

        {/* Title + description */}
        <div>
          <h4 className={`text-sm font-semibold mb-1 ${isCompleted ? 'line-through text-[#77736B]' : 'text-[#403B35]'}`}>
            {activity.title}
          </h4>
          <p className="text-xs text-[#77736B] leading-relaxed">{activity.shortDescription}</p>
        </div>

        {/* Why it helps toggle */}
        <button
          type="button"
          onClick={() => setShowWhy(w => !w)}
          className="flex items-center gap-1.5 text-[11px] text-[#829675] hover:text-[#56664F] font-medium transition-colors w-fit"
        >
          <Info className="w-3 h-3" />
          {showWhy ? 'Hide' : 'Why it may help'}
        </button>

        {showWhy && (
          <div className="text-[11px] text-[#77736B] bg-[#FAF6EE] border border-[#E4DACA] rounded-xl p-3 leading-relaxed">
            {activity.whyItHelps}
          </div>
        )}
      </div>

      {/* Action row */}
      {!isCompleted && (
        <div className="px-5 pb-5 flex gap-2">
          <button
            type="button"
            onClick={() => openWellnessActivity(activity)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold bg-[#829675] text-[#FFFCF6] hover:bg-[#718465] px-3 py-2 rounded-xl transition-colors shadow-soft-sm"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Start Activity
          </button>

          {showAddToPlan && !isInPlan && (
            <button
              type="button"
              onClick={() => addToDailyPlan(activity.id)}
              title="Add to today's plan"
              className="p-2 rounded-xl border border-[#E4DACA] text-[#77736B] hover:text-[#403B35] hover:border-[#829675]/50 hover:bg-[#F3EBDD] transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}

          {showAddToPlan && isInPlan && (
            <div
              title="Already in your plan"
              className="p-2 rounded-xl border border-[#D7E2D3] text-[#829675] bg-[#E9EFE7]"
            >
              <Check className="w-4 h-4" />
            </div>
          )}
        </div>
      )}

      {isCompleted && (
        <div className="px-5 pb-5">
          <div className="flex items-center gap-1.5 text-xs text-[#829675] font-medium">
            <Check className="w-3.5 h-3.5" />
            Completed today
          </div>
        </div>
      )}
    </div>
  );
};
