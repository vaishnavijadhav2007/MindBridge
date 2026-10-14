import React from 'react';
import { BookmarkCheck, BookmarkX } from 'lucide-react';
import { useWellness } from '../../context/WellnessContext';
import { ALL_ACTIVITIES } from '../../services/wellnessActivities';
import { ActivityCard } from './ActivityCard';

export const SavedActivitiesSection: React.FC = () => {
  const { savedActivityIds, toggleSaved } = useWellness();

  const saved = ALL_ACTIVITIES.filter(a => savedActivityIds.has(a.id));

  if (saved.length === 0) {
    return (
      <div className="bg-[#FAF6EE] border border-[#E4DACA] border-dashed rounded-2xl p-6 flex flex-col items-center gap-3 text-center">
        <div className="w-10 h-10 rounded-2xl bg-[#E9EFE7] flex items-center justify-center">
          <BookmarkCheck className="w-5 h-5 text-[#829675]" />
        </div>
        <div>
          <p className="text-sm font-medium text-[#403B35]">No saved activities yet</p>
          <p className="text-xs text-[#77736B] mt-0.5">
            Tap the bookmark icon on any activity card to save it here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {saved.map(act => (
        <ActivityCard key={act.id} activity={act} showAddToPlan />
      ))}
    </div>
  );
};
