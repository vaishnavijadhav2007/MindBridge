import React, { useState } from 'react';
import { CheckSquare, Plus, Check, Clock, Flame, Calendar, Award } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useWellness } from '../../context/WellnessContext';

interface HabitItem {
  id: string;
  title: string;
  timeOfDay: 'Morning' | 'Afternoon' | 'Evening';
  duration: string;
  completed: boolean;
}

export const WellnessPlanPage: React.FC = () => {
  const { showToast } = useWellness();

  const [habits, setHabits] = useState<HabitItem[]>([
    { id: 'h-1', title: 'Morning sunlight & 5-minute stretch', timeOfDay: 'Morning', duration: '5 min', completed: true },
    { id: 'h-2', title: 'Hydration check-in (glass of water)', timeOfDay: 'Morning', duration: '1 min', completed: true },
    { id: 'h-3', title: 'Afternoon screen break & box breathing', timeOfDay: 'Afternoon', duration: '3 min', completed: false },
    { id: 'h-4', title: 'Gratitude reflection / thought journal', timeOfDay: 'Evening', duration: '5 min', completed: false },
    { id: 'h-5', title: 'Screen off 30 minutes before sleep', timeOfDay: 'Evening', duration: '30 min', completed: false }
  ]);

  const toggleHabit = (id: string) => {
    setHabits(prev =>
      prev.map(h => {
        if (h.id === id) {
          const nextState = !h.completed;
          showToast(nextState ? `Completed: "${h.title}"` : `Marked "${h.title}" as pending`);
          return { ...h, completed: nextState };
        }
        return h;
      })
    );
  };

  const completedCount = habits.filter(h => h.completed).length;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#403B35] tracking-tight">
            My Wellness Plan
          </h1>
          <p className="text-sm text-[#77736B] mt-1">
            Build gentle routines and maintain consistency at a pace that honors your capacity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#E9EFE7] border border-[#D7E2D3] px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#56664F] flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#829675]" />
            <span>{completedCount} / {habits.length} Done Today</span>
          </div>
        </div>
      </div>

      {/* Routine Cards by Time of Day */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(['Morning', 'Afternoon', 'Evening'] as const).map((period) => {
          const periodHabits = habits.filter(h => h.timeOfDay === period);
          return (
            <Card key={period} padding="md" className="border-[#E4DACA] bg-[#FFFCF6] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#F0E8DC]">
                  <h3 className="font-semibold text-base text-[#403B35]">{period} Flow</h3>
                  <span className="text-xs text-[#77736B]">{periodHabits.length} habits</span>
                </div>

                <div className="space-y-3">
                  {periodHabits.map((habit) => (
                    <div
                      key={habit.id}
                      onClick={() => toggleHabit(habit.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                        habit.completed
                          ? 'bg-[#E9EFE7]/50 border-[#D7E2D3] text-[#77736B]'
                          : 'bg-[#FFFCF6] border-[#E4DACA] hover:border-[#829675]/50'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                        habit.completed ? 'bg-[#829675] border-[#829675] text-white' : 'border-[#D9CFBF]'
                      }`}>
                        {habit.completed && <Check className="w-3.5 h-3.5" />}
                      </div>

                      <div className="flex-1">
                        <div className={`text-xs font-medium ${habit.completed ? 'line-through text-[#77736B]' : 'text-[#403B35]'}`}>
                          {habit.title}
                        </div>
                        <div className="text-[10px] text-[#A39D93] mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{habit.duration}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#F0E8DC] text-[11px] text-[#829675] font-medium text-center">
                Click any task to toggle status
              </div>
            </Card>
          );
        })}
      </div>

      {/* Wellness Milestones Banner */}
      <Card padding="md" className="border-[#E4DACA] bg-[#FAF6EE] flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#E9EFE7] text-[#829675] flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-semibold text-[#403B35]">Weekly Habit Milestone Unlocked</div>
            <div className="text-xs text-[#77736B]">You logged 4 consecutive days of mindful breaks. Consistency breeds calm.</div>
          </div>
        </div>
      </Card>
    </div>
  );
};
