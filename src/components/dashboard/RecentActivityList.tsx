import React from 'react';
import { Smile, CheckCircle, Clock, Calendar, Sparkles } from 'lucide-react';
import { Card } from '../common/Card';
import { useWellness } from '../../context/WellnessContext';

export const RecentActivityList: React.FC = () => {
  const { recentActivities } = useWellness();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-[#403B35] tracking-tight">
            Your Recent Activity
          </h3>
          <p className="text-xs sm:text-sm text-[#77736B]">
            A gentle record of your moments of self-care and emotional reflection.
          </p>
        </div>
      </div>

      <Card padding="none" className="border-[#E4DACA] bg-[#FFFCF6] overflow-hidden">
        <div className="divide-y divide-[#F0E8DC]">
          {recentActivities.map((log) => {
            const isMood = log.type === 'mood';
            return (
              <div
                key={log.id}
                className="p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4 hover:bg-[#FAF6EE] transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  {/* Icon Indicator */}
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
                    isMood
                      ? 'bg-[#E9EFE7] text-[#829675] border border-[#D7E2D3]'
                      : 'bg-[#FAF3E7] text-[#C59B7E] border border-[#E8DBCA]'
                  }`}>
                    {isMood ? <Smile className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                  </div>

                  {/* Title & Detail */}
                  <div className="space-y-0.5">
                    <div className="text-sm font-semibold text-[#403B35]">
                      {log.title}
                    </div>
                    {log.detail && (
                      <p className="text-xs text-[#77736B] line-clamp-1">
                        {log.detail}
                      </p>
                    )}
                  </div>
                </div>

                {/* Timestamp & Badge */}
                <div className="text-right shrink-0">
                  <span className="inline-block text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#F3EBDD] text-[#77736B] border border-[#E4DACA]">
                    {log.badge}
                  </span>
                  <div className="text-[11px] text-[#A39D93] mt-1 flex items-center justify-end gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{log.timestamp}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
