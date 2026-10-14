import React, { useState } from 'react';
import { CalendarDays, Check, X, RefreshCcw, Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWellness } from '../../context/WellnessContext';
import { ALL_ACTIVITIES } from '../../services/wellnessActivities';

export const DailyPlanSection: React.FC = () => {
  const {
    dailyPlan,
    allWellnessActivities,
    openWellnessActivity,
    removeFromDailyPlan,
    markPlanItemComplete,
    replacePlanItem,
    wellnessRecommendations,
  } = useWellness();

  const [replacingId, setReplacingId] = useState<string | null>(null);

  const completedCount = dailyPlan.filter(p => p.completed).length;
  const progress = dailyPlan.length > 0 ? (completedCount / dailyPlan.length) * 100 : 0;

  // Activities not yet in the plan — for replacement picker
  const notInPlan = wellnessRecommendations.filter(a => !dailyPlan.some(p => p.activityId === a.id));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <CalendarDays className="w-4 h-4 text-[#829675]" />
            <h3 className="text-lg font-semibold text-[#403B35]">Your Plan for Today</h3>
          </div>
          <p className="text-xs text-[#77736B]">Up to 3 activities. Move at your own pace.</p>
        </div>
        {dailyPlan.length > 0 && (
          <span className="text-xs font-semibold text-[#56664F] bg-[#E9EFE7] border border-[#D7E2D3] px-2.5 py-1 rounded-full">
            {completedCount}/{dailyPlan.length} done
          </span>
        )}
      </div>

      {/* Progress bar */}
      {dailyPlan.length > 0 && (
        <div className="h-1.5 w-full bg-[#E4DACA] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#829675] rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Plan items */}
      {dailyPlan.length === 0 ? (
        <div className="bg-[#FAF6EE] border border-[#E4DACA] border-dashed rounded-2xl p-6 flex flex-col items-center gap-3 text-center">
          <div className="w-10 h-10 rounded-2xl bg-[#E9EFE7] flex items-center justify-center">
            <Plus className="w-5 h-5 text-[#829675]" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#403B35]">No activities planned yet</p>
            <p className="text-xs text-[#77736B] mt-0.5">Add up to 3 activities from the recommendations below.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {dailyPlan.map(item => {
            const act = ALL_ACTIVITIES.find(a => a.id === item.activityId);
            if (!act) return null;
            return (
              <div key={item.activityId}>
                <div
                  className={`bg-[#FFFCF6] border rounded-2xl p-3.5 flex items-center gap-3 transition-all ${
                    item.completed ? 'border-[#D7E2D3] opacity-70' : 'border-[#E4DACA]'
                  }`}
                >
                  {/* Completion toggle */}
                  <button
                    type="button"
                    onClick={() => !item.completed && markPlanItemComplete(item.activityId)}
                    disabled={item.completed}
                    className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                      item.completed
                        ? 'bg-[#829675] border-[#829675] text-white cursor-default'
                        : 'border-[#D9CFBF] hover:border-[#829675] cursor-pointer'
                    }`}
                    title={item.completed ? 'Completed' : 'Mark as complete'}
                  >
                    {item.completed && <Check className="w-3.5 h-3.5" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${item.completed ? 'line-through text-[#77736B]' : 'text-[#403B35]'}`}>
                      {act.title}
                    </p>
                    <p className="text-[11px] text-[#A39D93]">{act.estimatedDuration} • {act.category}</p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {!item.completed && (
                      <>
                        <button
                          type="button"
                          onClick={() => openWellnessActivity(act)}
                          title="Start activity"
                          className="p-1.5 rounded-lg text-[#829675] hover:bg-[#E9EFE7] transition-colors"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setReplacingId(replacingId === item.activityId ? null : item.activityId)}
                          title="Replace activity"
                          className="p-1.5 rounded-lg text-[#77736B] hover:bg-[#F3EBDD] transition-colors"
                        >
                          <RefreshCcw className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFromDailyPlan(item.activityId)}
                          title="Remove from plan"
                          className="p-1.5 rounded-lg text-[#77736B] hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Replace picker */}
                {replacingId === item.activityId && notInPlan.length > 0 && (
                  <div className="mt-1.5 bg-[#FAF6EE] border border-[#E4DACA] rounded-xl p-3 space-y-1.5">
                    <p className="text-[11px] text-[#77736B] font-medium uppercase tracking-wide">Replace with:</p>
                    {notInPlan.slice(0, 4).map(a => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => { replacePlanItem(item.activityId, a.id); setReplacingId(null); }}
                        className="w-full text-left text-xs text-[#403B35] hover:text-[#829675] py-1.5 px-2 rounded-lg hover:bg-[#FFFCF6] transition-colors"
                      >
                        {a.title} <span className="text-[#A39D93]">· {a.estimatedDuration}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Friendly note — never shame about incomplete items */}
      {dailyPlan.length > 0 && completedCount < dailyPlan.length && (
        <p className="text-[11px] text-[#A39D93] text-center">
          Every step counts, no matter how small. There's always tomorrow.
        </p>
      )}
      {dailyPlan.length > 0 && completedCount === dailyPlan.length && (
        <p className="text-xs text-[#829675] text-center font-medium">
          ✦ All done for today — that's something to feel good about.
        </p>
      )}
    </div>
  );
};
