import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Activity, 
  Moon, 
  Tag, 
  Edit3, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  Smile, 
  Frown, 
  Meh, 
  Laugh 
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { EditMoodModal } from './EditMoodModal';
import { useWellness } from '../../context/WellnessContext';
import { MoodEntry, MoodType } from '../../types';

interface MoodHistoryListProps {
  range: '7days' | '30days';
}

export const MoodHistoryList: React.FC<MoodHistoryListProps> = ({ range }) => {
  const { moodEntries, updateMoodEntry, deleteMoodEntry, hasUserEntries } = useWellness();
  const [editingEntry, setEditingEntry] = useState<MoodEntry | null>(null);
  const [entryToDelete, setEntryToDelete] = useState<MoodEntry | null>(null);

  const rangeMs = range === '7days' ? 7 * 86400000 : 30 * 86400000;
  const cutoffTime = Date.now() - rangeMs;

  // Use only user entries if available, otherwise sample entries
  const displaySource = hasUserEntries
    ? moodEntries.filter(e => !e.isSample)
    : moodEntries;

  // Sort descending by timestamp (newest first for reading logs)
  const filteredEntries = [...displaySource]
    .filter(e => new Date(e.timestamp).getTime() >= cutoffTime || displaySource.length <= 4)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const getMoodBadge = (mood: MoodType) => {
    switch (mood) {
      case 'very-low':
        return {
          icon: Frown,
          label: 'Very Low',
          style: 'bg-[#FAF0E6] text-[#A67C5A] border-[#EADACD]'
        };
      case 'low':
        return {
          icon: Meh,
          label: 'Low',
          style: 'bg-[#F7EBE1] text-[#A67C5A] border-[#EADACD]'
        };
      case 'okay':
        return {
          icon: Smile,
          label: 'Okay',
          style: 'bg-[#F2ECE1] text-[#715E49] border-[#E5DBCA]'
        };
      case 'good':
        return {
          icon: Smile,
          label: 'Good',
          style: 'bg-[#E9EFE7] text-[#56664F] border-[#D7E2D3]'
        };
      case 'great':
        return {
          icon: Laugh,
          label: 'Great',
          style: 'bg-[#DFEAD9] text-[#475C3E] border-[#C8DCBE]'
        };
    }
  };

  const handleDeleteConfirm = () => {
    if (entryToDelete) {
      deleteMoodEntry(entryToDelete.id);
      setEntryToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-[#403B35] tracking-tight">
            Recorded Check-in History
          </h3>
          <p className="text-xs sm:text-sm text-[#77736B]">
            Review your reflections, factors, and emotional details.
          </p>
        </div>

        <span className="text-xs text-[#77736B]">
          Showing {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}
        </span>
      </div>

      {filteredEntries.length === 0 ? (
        <Card padding="lg" className="border-[#E4DACA] bg-[#FFFCF6] text-center py-12">
          <AlertCircle className="w-8 h-8 text-[#829675] mx-auto mb-3" />
          <h4 className="text-base font-semibold text-[#403B35]">No check-in entries found</h4>
          <p className="text-xs text-[#77736B] max-w-sm mx-auto mt-1">
            Complete the daily check-in form above to add your first reflection to your history.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredEntries.map((entry) => {
            const badge = getMoodBadge(entry.mood);
            const Icon = badge.icon;
            return (
              <Card
                key={entry.id}
                padding="md"
                className="border-[#E4DACA] bg-[#FFFCF6] hover:border-[#829675]/40 transition-all shadow-soft-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  
                  {/* Left: Date, Mood Badge, and Details */}
                  <div className="space-y-3 flex-1 min-w-0">
                    
                    {/* Top Row: Date, Time, Mood & Sample tag */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#403B35]">
                        <Calendar className="w-3.5 h-3.5 text-[#829675]" />
                        <span>{entry.date}</span>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-[#77736B]">
                        <Clock className="w-3 h-3 text-[#A39D93]" />
                        <span>{entry.time}</span>
                      </div>

                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.style}`}>
                        <Icon className="w-3.5 h-3.5" />
                        <span>{badge.label}</span>
                      </span>

                      {entry.isSample && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#FAF3E7] text-[#C59B7E] border border-[#E8DBCA]">
                          Demo Sample
                        </span>
                      )}
                    </div>

                    {/* Stress & Sleep Tags */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#403B35]">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF6EE] border border-[#E4DACA]">
                        <Activity className="w-3.5 h-3.5 text-[#829675]" />
                        <span>Stress: <strong>{entry.stressLevel} / 5</strong></span>
                      </div>

                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF6EE] border border-[#E4DACA]">
                        <Moon className="w-3.5 h-3.5 text-[#829675]" />
                        <span>Sleep: <strong>{entry.sleepQuality}</strong></span>
                      </div>
                    </div>

                    {/* Contributing Factors */}
                    {entry.factors && entry.factors.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        <Tag className="w-3 h-3 text-[#77736B] shrink-0" />
                        {entry.factors.map((factor, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] bg-[#F3EBDD] text-[#56664F] px-2 py-0.5 rounded-md border border-[#E4DACA]"
                          >
                            {factor}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Journal Note */}
                    {entry.journalNote && (
                      <p className="text-xs text-[#77736B] bg-[#FAF6EE] p-3 rounded-xl border border-[#E4DACA] italic leading-relaxed">
                        “{entry.journalNote}”
                      </p>
                    )}

                  </div>

                  {/* Right: Edit & Delete Action Buttons */}
                  <div className="flex items-center gap-2 self-end sm:self-start shrink-0 pt-1 sm:pt-0">
                    <button
                      type="button"
                      onClick={() => setEditingEntry(entry)}
                      className="p-2 rounded-xl text-[#77736B] hover:text-[#403B35] hover:bg-[#F3EBDD] transition-colors"
                      title="Edit check-in entry"
                      aria-label="Edit check-in entry"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setEntryToDelete(entry)}
                      className="p-2 rounded-xl text-[#77736B] hover:text-red-700 hover:bg-red-50 transition-colors"
                      title="Delete check-in entry"
                      aria-label="Delete check-in entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Edit Entry Modal */}
      <EditMoodModal
        entry={editingEntry}
        isOpen={!!editingEntry}
        onClose={() => setEditingEntry(null)}
        onSave={updateMoodEntry}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!entryToDelete}
        onClose={() => setEntryToDelete(null)}
        title="Delete Check-in Entry?"
        subtitle="This action will remove this check-in from your local history."
        maxWidth="sm"
      >
        <div className="space-y-4 pt-1">
          <p className="text-xs text-[#77736B] leading-relaxed">
            Are you sure you want to delete the check-in from <strong className="text-[#403B35]">{entryToDelete?.date} at {entryToDelete?.time}</strong>? This cannot be undone.
          </p>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEntryToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white border-transparent"
            >
              Delete Entry
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
