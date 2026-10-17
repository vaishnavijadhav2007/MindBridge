import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ClipboardCheck, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

export const WellnessAnalysisShortcutCard: React.FC = () => {
  const assessmentPills = [
    { label: 'GAD-7 Anxiety', time: '2m' },
    { label: 'PHQ-9 Mood', time: '3m' },
    { label: 'PSS-4 Stress', time: '2m' },
    { label: 'WHO-5 Well-Being', time: '2m' },
  ];

  return (
    <Card
      padding="lg"
      className="border-[#E4DACA] bg-[#F7F2E7] shadow-soft-sm relative overflow-hidden"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        {/* Left: Info */}
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E9EFE7] text-[#56664F] border border-[#D7E2D3]">
            <Activity className="w-3.5 h-3.5 text-[#829675]" />
            <span>Personalized Wellness Analysis</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-semibold text-[#403B35] tracking-tight">
            Discover Your Patterns with Validated Self-Assessments
          </h3>

          <p className="text-xs sm:text-sm text-[#77736B] leading-relaxed">
            Gain clarity on your anxiety, stress, and mood trends. Receive an empathetic narrative report synthesized by Gemini AI with matched coping strategies.
          </p>

          {/* Quick screening chips */}
          <div className="flex flex-wrap gap-2 pt-1">
            {assessmentPills.map((pill, idx) => (
              <Link
                key={idx}
                to="/dashboard/analysis"
                className="text-xs bg-[#FFFCF6] border border-[#E4DACA] text-[#403B35] hover:border-[#829675] hover:text-[#829675] px-3 py-1 rounded-full transition-colors shadow-soft-sm flex items-center gap-1.5"
              >
                <ClipboardCheck className="w-3 h-3 text-[#829675]" />
                <span>{pill.label}</span>
                <span className="text-[10px] text-[#77736B] opacity-75">({pill.time})</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Button */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
          <Link to="/dashboard/analysis" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="md"
              fullWidth
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="px-6 py-3 shadow-soft-sm text-sm"
            >
              View Wellness Analysis
            </Button>
          </Link>
        </div>

      </div>
    </Card>
  );
};
