import React, { useState } from 'react';
import { User } from 'lucide-react';

interface TherapistAvatarProps {
  name: string;
  profileImage?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

/**
 * Extracts clean 2-letter initials from a therapist's full name,
 * skipping professional prefixes like "Dr." or suffixes like "Ph.D.", "M.D.", "M.A."
 */
function getTherapistInitials(fullName: string): string {
  const cleaned = fullName
    .replace(/^Dr\.\s+/i, '')
    .replace(/,\s*(Ph\.D\.|M\.D\.|M\.A\.|M\.S\.W\.|M\.Sc\.|M\.Phil\.).*$/i, '')
    .trim();

  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'TH';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const TherapistAvatar: React.FC<TherapistAvatarProps> = ({
  name,
  profileImage,
  size = 'md',
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'w-10 h-10 text-xs',
    md: 'w-14 h-14 text-sm',
    lg: 'w-20 h-20 text-lg sm:w-24 sm:h-24 sm:text-xl',
    xl: 'w-28 h-28 text-2xl',
  }[size];

  const initials = getTherapistInitials(name);

  // If no image is provided or loading failed, display the neutral initials avatar
  if (!profileImage || imageError) {
    return (
      <div
        role="img"
        aria-label={`Initials avatar for ${name}`}
        className={`rounded-full shrink-0 flex items-center justify-center font-bold tracking-wider select-none bg-[#E9EFE7] text-[#56664F] border-2 border-[#D7E2D3] shadow-soft-sm ${sizeClasses} ${className}`}
      >
        <span>{initials}</span>
      </div>
    );
  }

  return (
    <div
      className={`rounded-full shrink-0 overflow-hidden border-2 border-[#E4DACA] bg-[#FAF6EE] shadow-soft-sm relative ${sizeClasses} ${className}`}
    >
      <img
        src={profileImage}
        alt={`Profile photo of ${name}`}
        loading="lazy"
        decoding="async"
        onError={() => setImageError(true)}
        className="w-full h-full object-cover object-center"
      />
    </div>
  );
};
