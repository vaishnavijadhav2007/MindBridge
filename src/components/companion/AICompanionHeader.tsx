import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Feather, ShieldAlert, HeartHandshake } from 'lucide-react';
import { Button } from '../common/Button';

export const AICompanionHeader: React.FC = () => {
  return (
    <div className="space-y-4 pb-4 border-b border-[#E4DACA]/70">
      
      {/* Top Bar with Title, Subtitle, and Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        <div className="flex items-start gap-3.5">
          {/* Gentle leaf / wellness companion avatar badge */}
          <div className="w-12 h-12 rounded-2xl bg-[#E9EFE7] border border-[#D7E2D3] text-[#829675] flex items-center justify-center shrink-0 shadow-soft-sm">
            <Feather className="w-6 h-6 text-[#829675]" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#E9EFE7] text-[#56664F] border border-[#D7E2D3]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#829675] animate-pulse" />
                Mental Wellness Companion
              </span>
              <span className="text-[11px] text-[#77736B]">Private & Empathetic Prototype</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-semibold text-[#403B35] tracking-tight">
              A Safe Space to Talk
            </h1>
            <p className="text-xs sm:text-sm text-[#77736B] mt-0.5">
              Share what's on your mind. Let's explore it together.
            </p>
          </div>
        </div>

        {/* Return to Dashboard Button */}
        <Link to="/dashboard" className="self-start sm:self-auto">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<ArrowLeft className="w-4 h-4 text-[#829675]" />}
            className="shadow-soft-sm text-xs"
          >
            Return to Dashboard
          </Button>
        </Link>
      </div>

      {/* Brief Friendly Disclaimer as strictly requested */}
      <div className="bg-[#FAF6EE] border border-[#E4DACA] rounded-2xl p-3 sm:p-3.5 flex items-start gap-3 text-xs text-[#77736B] leading-relaxed">
        <HeartHandshake className="w-4 h-4 text-[#829675] shrink-0 mt-0.5" />
        <p>
          <strong className="text-[#403B35]">Companion Notice:</strong> I'm an AI wellness companion, not a therapist or a medical professional. I can offer general information and coping strategies, but I cannot diagnose mental health conditions.
        </p>
      </div>

    </div>
  );
};
