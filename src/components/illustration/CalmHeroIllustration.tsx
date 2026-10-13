import React from 'react';
import { Sparkles, Heart, Sun } from 'lucide-react';

export const CalmHeroIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Background Soft Glow & Ambient Organic Shapes */}
      <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[#E8DFCE] blur-2xl opacity-70 -z-10" />
      <div className="absolute -top-6 -right-6 w-44 h-44 rounded-full bg-[#E9EFE7] blur-xl opacity-80 -z-10" />

      {/* Main Illustration Canvas */}
      <div className="relative w-full max-w-[460px] aspect-[4/3.6] bg-[#FFFCF6] border border-[#E4DACA] rounded-3xl p-6 sm:p-8 shadow-soft-md overflow-hidden flex items-center justify-center">
        
        {/* Subtle decorative background curves */}
        <svg
          viewBox="0 0 400 320"
          className="absolute inset-0 w-full h-full opacity-60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Gentle sun arc */}
          <circle cx="200" cy="180" r="110" fill="#F4EEDB" />
          <circle cx="200" cy="180" r="85" fill="#EAE1CF" />
          
          {/* Hills / Horizon arcs */}
          <path
            d="M-20 280 Q 90 220 200 240 T 420 270 L 420 340 L -20 340 Z"
            fill="#E9EFE7"
          />
          <path
            d="M-10 300 Q 120 250 250 265 T 430 280 L 430 340 L -10 340 Z"
            fill="#D7E2D3"
          />

          {/* Plant stems and foliage on left */}
          <path
            d="M70 290 Q 75 190 115 150"
            stroke="#829675"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M72 230 C 50 215 50 185 75 185 C 95 185 85 215 72 230 Z"
            fill="#829675"
          />
          <path
            d="M85 190 C 110 170 125 180 115 200 C 105 215 85 205 85 190 Z"
            fill="#9CB28E"
          />
          <path
            d="M115 150 C 130 135 145 140 140 160 C 130 175 115 160 115 150 Z"
            fill="#829675"
          />

          {/* Plant pot */}
          <path
            d="M55 270 L 85 270 L 80 305 L 60 305 Z"
            fill="#C59B7E"
          />
        </svg>

        {/* Central Person in Meditative / Relaxing Pose */}
        <div className="relative z-10 flex flex-col items-center">
          <svg
            viewBox="0 0 200 200"
            className="w-44 h-44 sm:w-52 sm:h-52 drop-shadow-sm"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Person Head */}
            <circle cx="100" cy="55" r="16" fill="#D3A588" />
            {/* Hair */}
            <path
              d="M86 52 C 86 38 114 38 114 52 C 114 56 110 59 100 59 C 90 59 86 56 86 52 Z"
              fill="#403B35"
            />
            {/* Serene face closed eyes */}
            <path d="M94 57 Q 96 60 98 57" stroke="#403B35" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M102 57 Q 104 60 106 57" stroke="#403B35" strokeWidth="1.2" strokeLinecap="round" />

            {/* Neck */}
            <rect x="97" y="69" width="6" height="8" rx="2" fill="#D3A588" />

            {/* Sage Green Linen Shirt / Body */}
            <path
              d="M80 82 C 78 78 88 75 100 75 C 112 75 122 78 120 82 L 126 120 C 126 124 122 128 118 128 L 82 128 C 78 128 74 124 74 120 Z"
              fill="#829675"
            />
            {/* Collar neckline */}
            <path d="M94 76 L 100 85 L 106 76" stroke="#FFFCF6" strokeWidth="1.5" strokeLinecap="round" />

            {/* Arms gently folded in lap / mindful mudra */}
            <path
              d="M78 88 Q 62 105 76 122 Q 92 126 100 124 Q 108 126 124 122 Q 138 105 122 88"
              stroke="#829675"
              strokeWidth="11"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Hands resting peacefully */}
            <ellipse cx="100" cy="123" rx="9" ry="6" fill="#D3A588" />

            {/* Crossed legs / seated cushion */}
            <path
              d="M52 142 C 52 130 70 126 100 126 C 130 126 148 130 148 142 C 148 150 134 154 100 154 C 66 154 52 150 52 142 Z"
              fill="#6B7E5F"
            />
            {/* Meditation Cushion (Zafu) */}
            <ellipse cx="100" cy="154" rx="55" ry="12" fill="#E4DACA" stroke="#D3C7B5" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Floating Interactive Micro-cards for Calming Feel */}
        {/* Top-Right Badge: Mindful Breath */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-[#FFFCF6]/95 backdrop-blur-sm border border-[#E4DACA] rounded-2xl px-3.5 py-2 shadow-soft flex items-center gap-2 transform hover:scale-105 transition-transform duration-200">
          <div className="w-6 h-6 rounded-full bg-[#E9EFE7] flex items-center justify-center text-[#829675]">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-[#403B35] leading-tight">Deep Breath</div>
            <div className="text-[9px] text-[#77736B]">Inhale • Exhale</div>
          </div>
        </div>

        {/* Bottom-Left Badge: Today: Peaceful */}
        <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 bg-[#FFFCF6]/95 backdrop-blur-sm border border-[#E4DACA] rounded-2xl px-3.5 py-2 shadow-soft flex items-center gap-2 transform hover:scale-105 transition-transform duration-200">
          <div className="w-6 h-6 rounded-full bg-[#FAF3E7] flex items-center justify-center text-[#C59B7E]">
            <Heart className="w-3.5 h-3.5 fill-[#C59B7E]/20" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-[#403B35] leading-tight">Safe Space</div>
            <div className="text-[9px] text-[#77736B]">Pause & Recharge</div>
          </div>
        </div>

        {/* Small Sun Ray Icon */}
        <div className="absolute top-5 left-6 text-[#A3B597]/70">
          <Sun className="w-5 h-5 animate-spin" style={{ animationDuration: '24s' }} />
        </div>
      </div>
    </div>
  );
};
