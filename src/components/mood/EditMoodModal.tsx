import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { MoodEntry, MoodType, SleepQuality, MoodOption } from '../../types';
import { Frown, Meh, Smile, Laugh } from 'lucide-react';

interface EditMoodModalProps {
  entry: MoodEntry | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updated: Partial<MoodEntry>) => void;
}

export const EditMoodModal: React.FC<EditMoodModalProps> = ({
  entry,
  isOpen,
  onClose,
  onSave,
}) => {
  const [mood, setMood] = useState<MoodType>('good');
  const [factors, setFactors] = useState<string[]>([]);
  const [stressLevel, setStressLevel] = useState<number>(3);
  const [sleepQuality, setSleepQuality] = useState<SleepQuality>('Good');
  const [journalNote, setJournalNote] = useState<string>('');

  useEffect(() => {
    if (entry) {
      setMood(entry.mood);
      setFactors(entry.factors || []);
      setStressLevel(entry.stressLevel || 3);
      setSleepQuality(entry.sleepQuality || 'Good');
      setJournalNote(entry.journalNote || '');
    }
  }, [entry]);

  if (!entry) return null;

  const factorOptions = [
    'Studies or Work',
    'Family',
    'Relationships',
    'Health',
    'Sleep',
    'Loneliness',
    'Personal Concerns',
    'Something Good',
    'Other'
  ];

  const sleepOptions: SleepQuality[] = [
    'Very Poor',
    'Poor',
    'Fair',
    'Good',
    'Excellent'
  ];

  const toggleFactor = (f: string) => {
    setFactors(prev =>
      prev.includes(f) ? prev.filter(item => item !== f) : [...prev, f]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(entry.id, {
      mood,
      factors,
      stressLevel,
      sleepQuality,
      journalNote: journalNote.trim() || undefined
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Mood Check-in"
      subtitle={`Recorded on ${entry.date} at ${entry.time}`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6 pt-2">
        {/* Mood Selector */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-[#403B35]">
            Selected Mood
          </label>
          <div className="grid grid-cols-5 gap-2">
            {[
              { type: 'very-low' as MoodType, label: 'Very Low', icon: Frown },
              { type: 'low' as MoodType, label: 'Low', icon: Meh },
              { type: 'okay' as MoodType, label: 'Okay', icon: Smile },
              { type: 'good' as MoodType, label: 'Good', icon: Smile },
              { type: 'great' as MoodType, label: 'Great', icon: Laugh },
            ].map(item => {
              const Icon = item.icon;
              const isSelected = mood === item.type;
              return (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setMood(item.type)}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                    isSelected
                      ? 'bg-[#829675] text-[#FFFCF6] border-[#829675] shadow-soft-sm'
                      : 'bg-[#FFFCF6] text-[#403B35] border-[#E4DACA] hover:border-[#829675]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[11px] font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Factors */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-[#403B35]">
            Affecting Factors
          </label>
          <div className="flex flex-wrap gap-1.5">
            {factorOptions.map(f => (
              <button
                key={f}
                type="button"
                onClick={() => toggleFactor(f)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  factors.includes(f)
                    ? 'bg-[#829675] text-[#FFFCF6] border-[#829675]'
                    : 'bg-[#FFFCF6] text-[#77736B] border-[#E4DACA] hover:border-[#829675]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Stress & Sleep */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[#403B35]">
              Stress Level: {stressLevel} / 5
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {[1, 2, 3, 4, 5].map(lvl => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setStressLevel(lvl)}
                  className={`py-2 rounded-lg border text-xs font-medium ${
                    stressLevel === lvl
                      ? 'bg-[#829675] text-[#FFFCF6] border-[#829675]'
                      : 'bg-[#FFFCF6] border-[#E4DACA] hover:border-[#829675]'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[#403B35]">
              Sleep Quality: {sleepQuality}
            </label>
            <div className="grid grid-cols-5 gap-1">
              {sleepOptions.map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSleepQuality(opt)}
                  className={`py-2 px-1 rounded-lg border text-[11px] truncate ${
                    sleepQuality === opt
                      ? 'bg-[#829675] text-[#FFFCF6] border-[#829675]'
                      : 'bg-[#FFFCF6] border-[#E4DACA] hover:border-[#829675]'
                  }`}
                  title={opt}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Journal Reflection */}
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-[#403B35]">
            Reflection Note
          </label>
          <textarea
            rows={3}
            value={journalNote}
            onChange={(e) => setJournalNote(e.target.value)}
            className="w-full rounded-xl bg-[#FFFCF6] border border-[#E4DACA] p-3 text-sm text-[#403B35] focus:border-[#829675] outline-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E4DACA]">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};
