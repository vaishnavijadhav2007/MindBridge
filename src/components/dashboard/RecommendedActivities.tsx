import React from 'react';
import { Clock, Play, Wind, PenTool, Move, Sparkles } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Activity } from '../../types';
import { useWellness } from '../../context/WellnessContext';

export const RecommendedActivities: React.FC = () => {
  const { recommendedActivities, openActivityModal } = useWellness();

  const getActivityIcon = (category: string) => {
    switch (category) {
      case 'Breathing':
        return <Wind className="w-5 h-5 text-[#829675]" />;
      case 'Journaling':
        return <PenTool className="w-5 h-5 text-[#C59B7E]" />;
      case 'Physical':
        return <Move className="w-5 h-5 text-[#56664F]" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#829675]" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-[#403B35] tracking-tight">
            Recommended for You
          </h3>
          <p className="text-xs sm:text-sm text-[#77736B]">
            Short, restorative practices suited for your day.
          </p>
        </div>
      </div>

      {/* 3 Activity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {recommendedActivities.map((activity) => (
          <Card
            key={activity.id}
            hoverEffect
            padding="md"
            className="flex flex-col justify-between border-[#E4DACA] bg-[#FFFCF6]"
          >
            <div className="space-y-3">
              {/* Category & Duration Row */}
              <div className="flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E9EFE7] text-[#56664F] font-medium border border-[#D7E2D3]">
                  {getActivityIcon(activity.category)}
                  <span>{activity.category}</span>
                </span>

                <span className="inline-flex items-center gap-1 text-[#77736B] font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#829675]" />
                  <span>{activity.duration}</span>
                </span>
              </div>

              {/* Title & Short Description */}
              <div className="space-y-1.5 pt-1">
                <h4 className="text-base font-semibold text-[#403B35] tracking-tight line-clamp-1">
                  {activity.title}
                </h4>
                <p className="text-xs text-[#77736B] leading-relaxed line-clamp-2">
                  {activity.description}
                </p>
              </div>
            </div>

            {/* Start Activity Button */}
            <div className="pt-5 mt-4 border-t border-[#F0E8DC]">
              <Button
                variant="primary"
                fullWidth
                size="sm"
                onClick={() => openActivityModal(activity)}
                leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
              >
                Start Activity
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
