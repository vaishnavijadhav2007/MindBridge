import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Sparkles, Target, CheckCircle2, Smile,
  Filter, RotateCcw, BookmarkCheck, CalendarDays,
  Info, AlertCircle,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { useWellness } from '../../context/WellnessContext';
import { ActivityCard } from '../../components/wellness/ActivityCard';
import { DailyPlanSection } from '../../components/wellness/DailyPlanSection';
import { SavedActivitiesSection } from '../../components/wellness/SavedActivitiesSection';
import { ALL_ACTIVITIES } from '../../services/wellnessActivities';
import { WellnessCategory, DurationFilter } from '../../types/wellness';

const CATEGORIES: (WellnessCategory | 'All')[] = [
  'All', 'Breathing', 'Relaxation', 'Focus', 'Reflection', 'Sleep', 'Physical',
];

const DURATIONS: { label: string; value: DurationFilter }[] = [
  { label: 'Any length', value: 'all' },
  { label: '≤ 2 min',    value: '2min' },
  { label: '≤ 5 min',    value: '5min' },
  { label: '10–15 min',  value: '10-15min' },
];

export const WellnessPlanPage: React.FC = () => {
  const {
    latestEntry,
    wellnessRecommendations,
    dailyPlan,
    savedActivityIds,
    feedbackRecord,
    resetPersonalization,
    userProfile,
  } = useWellness();

  const [activeTab, setActiveTab] = useState<'plan' | 'recommended' | 'all' | 'saved'>('plan');
  const [categoryFilter, setCategoryFilter] = useState<WellnessCategory | 'All'>('All');
  const [durationFilter, setDurationFilter] = useState<DurationFilter>('all');
  const [showFilters, setShowFilters] = useState(false);

  const completedToday = dailyPlan.filter(p => p.completed).length;
  const currentFocus = latestEntry?.factors[0] ?? 'General Wellness';

  // Filter ALL activities
  const filteredAll = useMemo(() => {
    return ALL_ACTIVITIES.filter(a => {
      if (categoryFilter !== 'All' && a.category !== categoryFilter) return false;
      if (durationFilter === '2min' && a.durationMinutes > 2) return false;
      if (durationFilter === '5min' && a.durationMinutes > 5) return false;
      if (durationFilter === '10-15min' && (a.durationMinutes < 10 || a.durationMinutes > 15)) return false;
      return true;
    });
  }, [categoryFilter, durationFilter]);

  const hasFeedback = Object.keys(feedbackRecord).length > 0;

  const TABS = [
    { id: 'plan' as const,        label: "Today's Plan", icon: CalendarDays,   count: dailyPlan.length },
    { id: 'recommended' as const, label: 'For You',      icon: Sparkles,       count: null },
    { id: 'all' as const,         label: 'All Activities', icon: Filter,        count: null },
    { id: 'saved' as const,       label: 'Saved',        icon: BookmarkCheck,  count: savedActivityIds.size || null },
  ];

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">

      {/* ─── Page Header ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#E4DACA]/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-widest font-semibold text-[#829675]">
              Personal Wellness Plan
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#403B35] tracking-tight">
            Small Steps, Better Days
          </h1>
          <p className="text-sm text-[#77736B] mt-1 max-w-lg">
            A little progress each day is worth celebrating.
          </p>
          <p className="text-xs text-[#77736B] mt-2 max-w-lg leading-relaxed">
            Explore simple activities that may support your emotional well-being.
            Choose what feels right for you and move at your own pace.
          </p>
        </div>

        <Link to="/dashboard" className="shrink-0 self-start sm:self-auto">
          <Button variant="secondary" size="sm" leftIcon={<ArrowLeft className="w-4 h-4 text-[#829675]" />} className="shadow-soft-sm">
            Dashboard
          </Button>
        </Link>
      </div>

      {/* ─── Summary Bar ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Card padding="sm" className="border-[#E4DACA]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#E9EFE7] flex items-center justify-center shrink-0">
              <CalendarDays className="w-4 h-4 text-[#829675]" />
            </div>
            <div>
              <div className="text-[11px] text-[#77736B] uppercase tracking-wide font-medium">Today's Plan</div>
              <div className="text-sm font-bold text-[#403B35]">
                {dailyPlan.length === 0 ? 'Empty' : `${completedToday} / ${dailyPlan.length} done`}
              </div>
            </div>
          </div>
        </Card>

        <Card padding="sm" className="border-[#E4DACA]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#E9EFE7] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4 text-[#829675]" />
            </div>
            <div>
              <div className="text-[11px] text-[#77736B] uppercase tracking-wide font-medium">Completed</div>
              <div className="text-sm font-bold text-[#403B35]">{userProfile.completedActivitiesToday} today</div>
            </div>
          </div>
        </Card>

        <Card padding="sm" className="border-[#E4DACA] col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#E9EFE7] flex items-center justify-center shrink-0">
              <Target className="w-4 h-4 text-[#829675]" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] text-[#77736B] uppercase tracking-wide font-medium">Current Focus</div>
              <div className="text-sm font-semibold text-[#403B35] truncate">{currentFocus}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* ─── Disclaimer ──────────────────────────────────────────── */}
      <div className="flex items-start gap-3 bg-[#FAF6EE] border border-[#E4DACA] rounded-2xl p-3.5 text-xs text-[#77736B] leading-relaxed">
        <Info className="w-4 h-4 text-[#829675] shrink-0 mt-0.5" />
        <p>
          <strong className="text-[#403B35]">About these recommendations:</strong>{' '}
          Suggestions are based on your self-reported mood and simple wellness rules — not clinical analysis.
          They do not diagnose, treat, or replace professional mental health care.{' '}
          {!latestEntry && (
            <span>
              <Link to="/dashboard/mood" className="text-[#829675] font-semibold hover:underline">
                Complete a mood check-in
              </Link>{' '}to see personalised suggestions.
            </span>
          )}
        </p>
      </div>

      {/* ─── Mood context notice ─────────────────────────────────── */}
      {latestEntry && (
        <div className="flex items-center gap-2 text-xs text-[#77736B] bg-[#FFFCF6] border border-[#E4DACA] rounded-xl px-3.5 py-2.5">
          <Smile className="w-4 h-4 text-[#829675]" />
          <span>
            Personalised for your recent check-in:&nbsp;
            <strong className="text-[#403B35] capitalize">{latestEntry.mood.replace('-', ' ')}</strong>
            {latestEntry.factors.length > 0 && (
              <> · {latestEntry.factors.join(', ')}</>
            )}
          </span>
          {hasFeedback && (
            <button
              type="button"
              onClick={resetPersonalization}
              className="ml-auto flex items-center gap-1 text-[#829675] hover:text-[#403B35] font-medium transition-colors"
              title="Reset feedback-based preferences"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}
        </div>
      )}

      {/* ─── Tabs ────────────────────────────────────────────────── */}
      <div className="flex gap-1 bg-[#F3EBDD]/60 border border-[#E4DACA] rounded-2xl p-1 flex-wrap sm:flex-nowrap">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-[#FFFCF6] text-[#403B35] shadow-soft-sm border border-[#E4DACA]'
                  : 'text-[#77736B] hover:text-[#403B35]'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{tab.label}</span>
              {tab.count != null && tab.count > 0 && (
                <span className="bg-[#829675] text-white rounded-full text-[10px] w-4 h-4 flex items-center justify-center font-bold leading-none">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ─── Tab Content ─────────────────────────────────────────── */}

      {/* TODAY'S PLAN */}
      {activeTab === 'plan' && (
        <DailyPlanSection />
      )}

      {/* RECOMMENDED FOR YOU */}
      {activeTab === 'recommended' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-[#403B35]">Recommended for You</h3>
            <p className="text-xs text-[#77736B] mt-0.5">
              {latestEntry
                ? 'Based on your latest mood check-in and simple wellness rules.'
                : 'General wellness activities — complete a mood check-in for personalised suggestions.'}
            </p>
          </div>
          {wellnessRecommendations.length === 0 ? (
            <div className="bg-[#FAF6EE] border border-[#E4DACA] rounded-2xl p-8 text-center">
              <p className="text-sm text-[#77736B]">No recommendations available right now.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {wellnessRecommendations.map(act => (
                <ActivityCard key={act.id} activity={act} showAddToPlan />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ALL ACTIVITIES */}
      {activeTab === 'all' && (
        <div className="space-y-5">
          {/* Filter bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <button
              type="button"
              onClick={() => setShowFilters(f => !f)}
              className="flex items-center gap-2 text-xs font-semibold text-[#77736B] hover:text-[#403B35] bg-[#FFFCF6] border border-[#E4DACA] px-3 py-2 rounded-xl transition-colors"
            >
              <Filter className="w-3.5 h-3.5" />
              Filters
              {(categoryFilter !== 'All' || durationFilter !== 'all') && (
                <span className="w-2 h-2 rounded-full bg-[#829675]" />
              )}
            </button>
            <span className="text-xs text-[#A39D93]">{filteredAll.length} activities</span>
            {(categoryFilter !== 'All' || durationFilter !== 'all') && (
              <button
                type="button"
                onClick={() => { setCategoryFilter('All'); setDurationFilter('all'); }}
                className="text-xs text-[#829675] font-medium hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>

          {showFilters && (
            <div className="bg-[#FAF6EE] border border-[#E4DACA] rounded-2xl p-4 space-y-4">
              <div>
                <p className="text-[11px] font-semibold text-[#77736B] uppercase tracking-wide mb-2">Category</p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                        categoryFilter === cat
                          ? 'bg-[#829675] text-white border-[#829675]'
                          : 'bg-[#FFFCF6] text-[#77736B] border-[#E4DACA] hover:border-[#829675]/50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-[#77736B] uppercase tracking-wide mb-2">Duration</p>
                <div className="flex flex-wrap gap-2">
                  {DURATIONS.map(d => (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => setDurationFilter(d.value)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                        durationFilter === d.value
                          ? 'bg-[#829675] text-white border-[#829675]'
                          : 'bg-[#FFFCF6] text-[#77736B] border-[#E4DACA] hover:border-[#829675]/50'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {filteredAll.length === 0 ? (
            <div className="bg-[#FAF6EE] border border-[#E4DACA] rounded-2xl p-8 text-center">
              <p className="text-sm text-[#77736B]">No activities match the current filters.</p>
              <button type="button" onClick={() => { setCategoryFilter('All'); setDurationFilter('all'); }} className="mt-2 text-xs text-[#829675] font-medium hover:underline">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAll.map(act => (
                <ActivityCard key={act.id} activity={act} showAddToPlan />
              ))}
            </div>
          )}
        </div>
      )}

      {/* SAVED */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-[#403B35]">Saved for Later</h3>
            <p className="text-xs text-[#77736B] mt-0.5">
              Activities you've bookmarked. Preferences are saved in your browser.
            </p>
          </div>
          <SavedActivitiesSection />
        </div>
      )}

    </div>
  );
};
