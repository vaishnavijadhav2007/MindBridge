import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  linkToHome?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showTagline = false,
  linkToHome = true,
}) => {
  const sizeMap = {
    sm: { icon: 'w-6 h-6', text: 'text-lg', badge: 'text-[10px]' },
    md: { icon: 'w-8 h-8', text: 'text-xl', badge: 'text-xs' },
    lg: { icon: 'w-10 h-10', text: 'text-2xl', badge: 'text-xs' },
  };

  const currentSize = sizeMap[size];

  const content = (
    <div className={`inline-flex items-center gap-2.5 group ${className}`}>
      {/* MindBridge Leaf / Wellness Emblem */}
      <div className={`relative flex items-center justify-center ${currentSize.icon} rounded-full bg-[#E9EFE7] text-[#829675] border border-[#D7E2D3] transition-transform duration-300 group-hover:scale-105 shadow-soft-sm`}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4/5 h-4/5 text-[#829675]"
        >
          {/* Natural curved leaf & gentle inner vein */}
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
      </div>

      <div className="flex flex-col">
        <span className={`font-semibold tracking-tight text-[#403B35] ${currentSize.text} transition-colors group-hover:text-[#2E2A25]`}>
          Mind<span className="text-[#829675] font-bold">Bridge</span>
        </span>
        {showTagline && (
          <span className="text-xs text-[#77736B] font-normal tracking-normal -mt-0.5">
            Your Mental Wellness Companion
          </span>
        )}
      </div>
    </div>
  );

  if (linkToHome) {
    return (
      <Link to="/" className="outline-none focus-visible:ring-2 focus-visible:ring-[#829675] rounded-lg p-0.5" aria-label="MindBridge Home">
        {content}
      </Link>
    );
  }

  return content;
};
