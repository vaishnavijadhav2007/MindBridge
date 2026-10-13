import React, { useState } from 'react';
import { Calendar, TrendingUp, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { Card } from '../common/Card';
import { useWellness } from '../../context/WellnessContext';
import { MoodEntry, MoodType } from '../../types';

interface MoodChartProps {
  range: '7days' | '30days';
  onRangeChange: (range: '7days' | '30days') => void;
}

export const MoodChart: React.FC<MoodChartProps> = ({ range, onRangeChange }) => {
  const { moodEntries, hasUserEntries, loadSampleEntries, clearAllEntries } = useWellness();
  const [activeTooltip, setActiveTooltip] = useState<MoodEntry | null>(null);

  // Filter entries based on the selected range (7 days = 7 * 86400000, 30 days = 30 * 86400000)
  const rangeMs = range === '7days' ? 7 * 86400000 : 30 * 86400000;
  const cutoffTime = Date.now() - rangeMs;

  // Use only user entries if available, otherwise sample entries
  const displaySource = hasUserEntries
    ? moodEntries.filter(e => !e.isSample)
    : moodEntries;

  // Filter and sort chronologically (oldest to newest for plotting)
  const chartEntries = [...displaySource]
    .filter(e => new Date(e.timestamp).getTime() >= cutoffTime || displaySource.length <= 4)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const moodScoreMap: Record<MoodType, number> = {
    'very-low': 1,
    'low': 2,
    'okay': 3,
    'good': 4,
    'great': 5,
  };

  const moodLabelMap: Record<MoodType, string> = {
    'very-low': 'Very Low',
    'low': 'Low',
    'okay': 'Okay',
    'good': 'Good',
    'great': 'Great',
  };

  // Dimensions for SVG canvas
  const svgWidth = 600;
  const svgHeight = 220;
  const paddingX = 45;
  const paddingY = 30;
  const plotWidth = svgWidth - paddingX * 2;
  const plotHeight = svgHeight - paddingY * 2;

  // Calculate points for the chart
  const points = chartEntries.map((entry, index) => {
    const x = chartEntries.length === 1
      ? svgWidth / 2
      : paddingX + (index / (chartEntries.length - 1)) * plotWidth;
    const score = moodScoreMap[entry.mood] || 3;
    // score 1 is at bottom (y = paddingY + plotHeight), score 5 is at top (y = paddingY)
    const y = paddingY + plotHeight - ((score - 1) / 4) * plotHeight;
    return { x, y, entry, score };
  });

  // Generate SVG path string
  const pathD = points.length > 1
    ? points.reduce((acc, curr, idx) => {
        return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
      }, '')
    : '';

  // Area path for subtle gradient fill
  const areaD = points.length > 1
    ? `${pathD} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`
    : '';

  return (
    <Card padding="lg" className="border-[#E4DACA] bg-[#FFFCF6] shadow-soft-sm space-y-6">
      
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-[#403B35]">
              {range === '7days' ? 'Weekly Mood Journey' : 'Monthly Emotional Trajectory'}
            </h3>
            {!hasUserEntries && (
              <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#FAF3E7] text-[#C59B7E] border border-[#E8DBCA]">
                Demonstration Sample Data
              </span>
            )}
            {hasUserEntries && (
              <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#E9EFE7] text-[#56664F] border border-[#D7E2D3]">
                Your Recorded History
              </span>
            )}
          </div>
          <p className="text-xs text-[#77736B] mt-0.5">
            {hasUserEntries
              ? 'Tracking your self-reported mood levels over time.'
              : 'Sample entries shown for demonstration until you record your own.'}
          </p>
        </div>

        {/* 7-day vs 30-day filter buttons */}
        <div className="flex items-center gap-2 bg-[#F3EBDD] p-1 rounded-xl border border-[#E4DACA] self-start sm:self-auto text-xs">
          <button
            type="button"
            onClick={() => onRangeChange('7days')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              range === '7days' ? 'bg-[#FFFCF6] text-[#403B35] shadow-soft-sm' : 'text-[#77736B] hover:text-[#403B35]'
            }`}
          >
            Last 7 Days
          </button>
          <button
            type="button"
            onClick={() => onRangeChange('30days')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              range === '30days' ? 'bg-[#FFFCF6] text-[#403B35] shadow-soft-sm' : 'text-[#77736B] hover:text-[#403B35]'
            }`}
          >
            Last 30 Days
          </button>
        </div>
      </div>

      {/* Main Chart Area */}
      {points.length === 0 ? (
        <div className="h-56 flex flex-col items-center justify-center text-center p-6 bg-[#FAF6EE] rounded-2xl border border-dashed border-[#E4DACA]">
          <AlertCircle className="w-8 h-8 text-[#829675] mb-2" />
          <h4 className="text-sm font-semibold text-[#403B35]">No check-in entries in this period</h4>
          <p className="text-xs text-[#77736B] max-w-sm mt-1">
            Complete the daily mood check-in above to start building your personal wellness chart.
          </p>
          <button
            onClick={loadSampleEntries}
            className="mt-4 text-xs text-[#829675] font-semibold flex items-center gap-1.5 hover:underline"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Load demonstration data</span>
          </button>
        </div>
      ) : (
        <div className="relative w-full overflow-x-auto">
          <div className="min-w-[500px]">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto overflow-visible select-none"
            >
              <defs>
                <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#829675" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#829675" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Reference Lines (Scores 1 to 5) */}
              {[
                { score: 5, label: 'Great' },
                { score: 4, label: 'Good' },
                { score: 3, label: 'Okay' },
                { score: 2, label: 'Low' },
                { score: 1, label: 'Very Low' }
              ].map(({ score, label }) => {
                const y = paddingY + plotHeight - ((score - 1) / 4) * plotHeight;
                return (
                  <g key={score}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={svgWidth - paddingX}
                      y2={y}
                      stroke="#EFE8DC"
                      strokeWidth="1"
                      strokeDasharray={score % 2 === 1 ? 'none' : '3 3'}
                    />
                    <text
                      x={paddingX - 10}
                      y={y + 3.5}
                      textAnchor="end"
                      className="fill-[#A39D93] text-[10px] font-medium"
                    >
                      {label}
                    </text>
                  </g>
                );
              })}

              {/* Shaded Area fill */}
              {areaD && (
                <path d={areaD} fill="url(#moodGradient)" />
              )}

              {/* Connected Line Path */}
              {pathD && (
                <path
                  d={pathD}
                  fill="none"
                  stroke="#829675"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Data Points */}
              {points.map((pt, idx) => (
                <g key={idx} className="cursor-pointer">
                  {/* Subtle outer halo */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={6}
                    fill="#FFFCF6"
                    stroke="#829675"
                    strokeWidth="2"
                    onMouseEnter={() => setActiveTooltip(pt.entry)}
                    onMouseLeave={() => setActiveTooltip(null)}
                  />
                  {/* Inner dot */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={3}
                    fill="#829675"
                    pointerEvents="none"
                  />
                  {/* X-axis date label */}
                  <text
                    x={pt.x}
                    y={svgHeight - 8}
                    textAnchor="middle"
                    className="fill-[#77736B] text-[10px] font-medium"
                  >
                    {pt.entry.date.replace(/, \d{4}/, '')}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Interactive Point Detail Bar */}
          <div className="mt-4 p-3 bg-[#FAF6EE] rounded-xl border border-[#E4DACA] flex flex-wrap items-center justify-between text-xs text-[#403B35]">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#829675]" />
              <span>
                {activeTooltip ? (
                  <>
                    <strong>{activeTooltip.date} ({activeTooltip.time}):</strong> Mood was <strong className="capitalize">{moodLabelMap[activeTooltip.mood]}</strong> • Stress {activeTooltip.stressLevel}/5 • Sleep {activeTooltip.sleepQuality}
                  </>
                ) : (
                  <span>Hover or tap any node above to inspect entry details.</span>
                )}
              </span>
            </div>

            {!hasUserEntries && (
              <button
                onClick={clearAllEntries}
                className="text-[11px] text-[#C59B7E] hover:underline ml-auto"
              >
                Clear demo entries to start blank
              </button>
            )}
          </div>
        </div>
      )}

    </Card>
  );
};
