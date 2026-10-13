import React from 'react';
import { Wind, Compass, PenTool, Sparkles, ArrowRight } from 'lucide-react';
import { Card } from '../common/Card';

interface QuickActionsSectionProps {
  onOpenBreathing: () => void;
  onOpenGrounding: () => void;
  onOpenJournal: () => void;
}

export const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({
  onOpenBreathing,
  onOpenGrounding,
  onOpenJournal,
}) => {
  const actions = [
    {
      title: 'Guided Breathing',
      subtitle: '4-4-4 Visual pacing timer',
      icon: Wind,
      badge: '2 min',
      color: 'bg-[#E9EFE7] text-[#829675] border-[#D7E2D3]',
      onClick: onOpenBreathing,
    },
    {
      title: 'Grounding Exercise',
      subtitle: '5-4-3-2-1 Sensory awareness',
      icon: Compass,
      badge: 'Step-by-step',
      color: 'bg-[#FAF3E7] text-[#C59B7E] border-[#E8DBCA]',
      onClick: onOpenGrounding,
    },
    {
      title: 'Journal Prompt',
      subtitle: 'Release circling thoughts',
      icon: PenTool,
      badge: 'Self-reflection',
      color: 'bg-[#E9EFE7] text-[#56664F] border-[#D7E2D3]',
      onClick: onOpenJournal,
    },
  ];

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#77736B]">
          Try This • Mindful Actions
        </span>
        <span className="text-[11px] text-[#A39D93]">Interactive Tools</span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {actions.map((act, idx) => {
          const Icon = act.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={act.onClick}
              className="text-left p-3.5 rounded-2xl bg-[#FFFCF6] border border-[#E4DACA] hover:border-[#829675] hover:bg-[#FAF6EE] transition-all duration-200 shadow-soft-sm group flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${act.color} group-hover:scale-105 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#403B35] group-hover:text-[#2E2A25]">
                    {act.title}
                  </h4>
                  <p className="text-[11px] text-[#77736B] mt-0.5 line-clamp-1">
                    {act.subtitle}
                  </p>
                </div>
              </div>

              <span className="text-[10px] text-[#829675] font-semibold shrink-0 group-hover:translate-x-0.5 transition-transform mt-1">
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
