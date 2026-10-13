import React from 'react';
import { Sparkles, MessageCircleQuestion } from 'lucide-react';

interface SuggestedQuestionsProps {
  onSelectPrompt: (prompt: string) => void;
  disabled?: boolean;
}

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({
  onSelectPrompt,
  disabled = false,
}) => {
  const suggestions = [
    { text: "I'm feeling stressed about my studies.", category: "Academic" },
    { text: "How can I manage anxiety?", category: "Coping" },
    { text: "I've been having trouble sleeping.", category: "Sleep" },
    { text: "I feel overwhelmed and don't know where to start.", category: "Overwhelm" },
    { text: "How can I build a healthier daily routine?", category: "Wellness" }
  ];

  return (
    <div className="space-y-2 pt-2">
      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#77736B]">
        <Sparkles className="w-3.5 h-3.5 text-[#829675]" />
        <span>Suggested Explorations</span>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {suggestions.map((item, idx) => (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => onSelectPrompt(item.text)}
            className="text-left p-3 rounded-2xl bg-[#FFFCF6] border border-[#E4DACA] hover:border-[#829675] hover:bg-[#FAF6EE] transition-all duration-200 shadow-soft-sm group disabled:opacity-50 disabled:cursor-not-allowed flex items-start gap-2.5"
          >
            <div className="w-6 h-6 rounded-full bg-[#E9EFE7] text-[#829675] flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
              <MessageCircleQuestion className="w-3.5 h-3.5 text-[#829675]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[#403B35] leading-snug group-hover:text-[#2E2A25]">
                "{item.text}"
              </p>
              <span className="text-[10px] text-[#A39D93] uppercase font-semibold mt-1 inline-block">
                {item.category}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
