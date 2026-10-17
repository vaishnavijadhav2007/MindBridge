import React, { useState } from 'react';
import { 
  Sparkles, 
  RotateCcw, 
  CheckCircle, 
  AlertCircle, 
  Heart, 
  ShieldCheck,
  Bot
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { WellnessAnalysisReport } from '../../types/assessment';

interface AiNarrativeReportProps {
  report: WellnessAnalysisReport;
  onRegenerate: () => Promise<void>;
  isGenerating?: boolean;
}

export const AiNarrativeReport: React.FC<AiNarrativeReportProps> = ({
  report,
  onRegenerate,
  isGenerating = false,
}) => {
  const [internalLoading, setInternalLoading] = useState(false);

  const handleRefresh = async () => {
    setInternalLoading(true);
    try {
      await onRegenerate();
    } finally {
      setInternalLoading(false);
    }
  };

  const loading = isGenerating || internalLoading;

  const paragraphs = report.summaryText.split('\n\n').filter(p => p.trim().length > 0);

  const isGemini = report.modelSource.toLowerCase().includes('gemini');

  return (
    <Card 
      padding="lg" 
      className="border-[#E4DACA] bg-[#FFFCF6] shadow-soft relative overflow-hidden space-y-6"
    >
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E4DACA]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E9EFE7] text-[#56664F] border border-[#D7E2D3]">
            <Sparkles className="w-3.5 h-3.5 text-[#829675]" />
            <span>AI Personalized Synthesis</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold text-[#403B35] tracking-tight">
            Your Wellness Narrative
          </h2>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Model badge */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#F3EBDD] border border-[#E4DACA] text-[11px] font-medium text-[#77736B]">
            <Bot className="w-3 h-3 text-[#829675]" />
            <span>{isGemini ? 'Google Gemini AI' : 'Clinical Heuristic Engine'}</span>
          </span>

          {/* Regenerate Button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRefresh}
            isLoading={loading}
            leftIcon={<RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
            className="text-xs shadow-soft-sm"
          >
            Update Analysis
          </Button>
        </div>
      </div>

      {/* Narrative Body */}
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-10 h-10 rounded-full border-3 border-[#829675] border-t-transparent animate-spin" />
          <p className="text-sm font-medium text-[#56664F]">
            Gemini is synthesizing your recent check-ins and screening patterns...
          </p>
          <span className="text-xs text-[#77736B]">
            Reflecting with warmth and non-judgmental validation.
          </span>
        </div>
      ) : (
        <div className="space-y-4 text-sm sm:text-base text-[#403B35] leading-relaxed">
          {paragraphs.map((p, idx) => (
            <p key={idx} className="text-[#403B35]">
              {p}
            </p>
          ))}
        </div>
      )}

      {/* Structured Key Insights Tags */}
      {!loading && report.keyInsights && report.keyInsights.length > 0 && (
        <div className="pt-4 border-t border-[#E4DACA] space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#829675]">
            Key Observed Patterns
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {report.keyInsights.map((insight, idx) => {
              const isPositive = insight.level === 'positive';
              const isAttention = insight.level === 'attention';

              return (
                <div
                  key={idx}
                  className={`
                    p-3.5 rounded-2xl border text-xs sm:text-sm flex items-start gap-3
                    ${isPositive 
                      ? 'bg-[#E9EFE7]/60 border-[#D7E2D3] text-[#56664F]' 
                      : isAttention 
                        ? 'bg-[#FAF3ED]/80 border-[#E8B4A2] text-[#8C3A27]' 
                        : 'bg-[#F3EBDD]/50 border-[#E4DACA] text-[#403B35]'
                    }
                  `}
                >
                  {isPositive ? (
                    <CheckCircle className="w-4 h-4 text-[#829675] shrink-0 mt-0.5" />
                  ) : isAttention ? (
                    <AlertCircle className="w-4 h-4 text-[#B85D43] shrink-0 mt-0.5" />
                  ) : (
                    <Heart className="w-4 h-4 text-[#829675] shrink-0 mt-0.5" />
                  )}

                  <div className="space-y-0.5">
                    <span className="font-semibold block text-xs tracking-tight">
                      {insight.category}
                    </span>
                    <span className="text-xs leading-relaxed opacity-95">
                      {insight.text}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Medical Boundary Disclaimer */}
      <div className="pt-3 border-t border-[#E4DACA]/60 flex items-center gap-2 text-[11px] text-[#77736B]">
        <ShieldCheck className="w-3.5 h-3.5 text-[#829675] shrink-0" />
        <span>
          MindBridge AI reflections are educational and supportive. They do not constitute formal psychiatric or medical diagnostic advice.
        </span>
      </div>

    </Card>
  );
};
