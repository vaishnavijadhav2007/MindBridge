import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useWellness } from '../../context/WellnessContext';

export const Toast: React.FC = () => {
  const { toastMessage } = useWellness();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-3 duration-300">
      <div className="flex items-center gap-2.5 bg-[#FFFCF6] border border-[#829675]/50 shadow-soft-lg px-4 py-3 rounded-2xl text-[#403B35]">
        <CheckCircle2 className="w-5 h-5 text-[#829675] shrink-0" />
        <span className="text-sm font-medium">{toastMessage}</span>
      </div>
    </div>
  );
};
