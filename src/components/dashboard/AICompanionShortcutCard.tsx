import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MessageSquare, ArrowRight, Feather, Wind, Heart } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

export const AICompanionShortcutCard: React.FC = () => {
  const quickTopics = [
    { label: 'Study Stress', prompt: 'I am feeling stressed about my studies.' },
    { label: 'Manage Anxiety', prompt: 'How can I manage anxiety?' },
    { label: 'Sleep Trouble', prompt: 'I have been having trouble sleeping.' },
    { label: 'Build Routine', prompt: 'How can I build a healthier daily routine?' },
  ];

  return (
    <Card
      padding="lg"
      className="border-[#E4DACA] bg-[#FAF6EE] shadow-soft-sm relative overflow-hidden"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        {/* Left: Info */}
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E9EFE7] text-[#56664F] border border-[#D7E2D3]">
            <Sparkles className="w-3.5 h-3.5 text-[#829675]" />
            <span>AI Wellness Companion</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-semibold text-[#403B35] tracking-tight">
            Have something on your mind? Let's talk.
          </h3>

          <p className="text-xs sm:text-sm text-[#77736B] leading-relaxed">
            Your non-judgmental companion is ready to explore stress, sleep, studies, or emotions with gentle, practical coping tools.
          </p>

          {/* Quick exploration chips */}
          <div className="flex flex-wrap gap-2 pt-1">
            {quickTopics.map((topic, idx) => (
              <Link
                key={idx}
                to="/dashboard/companion"
                className="text-xs bg-[#FFFCF6] border border-[#E4DACA] text-[#403B35] hover:border-[#829675] hover:text-[#829675] px-3 py-1 rounded-full transition-colors shadow-soft-sm"
              >
                {topic.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Button & Emblem */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <Link to="/dashboard/companion" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="md"
              fullWidth
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="px-6 py-3 shadow-soft-sm text-sm"
            >
              Open AI Companion
            </Button>
          </Link>
        </div>

      </div>
    </Card>
  );
};
