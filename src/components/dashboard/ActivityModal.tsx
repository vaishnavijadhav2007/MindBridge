import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, Sparkles, Lightbulb, Play, Pause, RotateCcw } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useWellness } from '../../context/WellnessContext';

export const ActivityModal: React.FC = () => {
  const { activeModalActivity, closeActivityModal, completeActivity } = useWellness();
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  // Reset timer whenever activity changes
  useEffect(() => {
    setTimerSeconds(30);
    setIsTimerRunning(false);
  }, [activeModalActivity]);

  if (!activeModalActivity) return null;

  const handleFinish = () => {
    completeActivity(activeModalActivity.id);
  };

  return (
    <Modal
      isOpen={!!activeModalActivity}
      onClose={closeActivityModal}
      title={activeModalActivity.title}
      subtitle={`${activeModalActivity.category} • ${activeModalActivity.duration}`}
      maxWidth="lg"
    >
      <div className="space-y-6 pt-1">
        
        {/* Description */}
        <p className="text-sm text-[#77736B] leading-relaxed bg-[#F3EBDD] p-3.5 rounded-2xl border border-[#E4DACA]">
          {activeModalActivity.description}
        </p>

        {/* Guided Step-by-Step Instructions */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#403B35]">
            Guided Instructions
          </h4>
          <ol className="space-y-2.5">
            {activeModalActivity.steps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-[#403B35]">
                <span className="w-5 h-5 rounded-full bg-[#E9EFE7] text-[#56664F] font-semibold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-[#D7E2D3]">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Interactive Guided Timer Simulation */}
        <div className="bg-[#FAF6EE] border border-[#E4DACA] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-mono text-sm font-bold transition-all ${
              isTimerRunning ? 'border-[#829675] text-[#829675] bg-[#E9EFE7] scale-105 animate-pulse' : 'border-[#D9CFBF] text-[#77736B]'
            }`}>
              {timerSeconds}s
            </div>
            <div>
              <div className="text-xs font-semibold text-[#403B35]">Practice Focus Timer</div>
              <div className="text-[11px] text-[#77736B]">
                {timerSeconds === 0 ? 'Cycle complete! Feel the calm.' : 'Follow the breathing rhythm.'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              leftIcon={isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            >
              {isTimerRunning ? 'Pause' : timerSeconds === 0 ? 'Restart' : 'Start Timer'}
            </Button>
            <button
              onClick={() => {
                setTimerSeconds(30);
                setIsTimerRunning(false);
              }}
              className="p-2 text-[#77736B] hover:text-[#403B35] rounded-xl hover:bg-[#EAE1D2]"
              title="Reset Timer"
              aria-label="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tip Box */}
        {activeModalActivity.tips && (
          <div className="flex items-start gap-2.5 text-xs text-[#56664F] bg-[#E9EFE7] p-3 rounded-xl border border-[#D7E2D3]">
            <Lightbulb className="w-4 h-4 text-[#829675] shrink-0 mt-0.5" />
            <span><strong>Mindful Tip:</strong> {activeModalActivity.tips}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E4DACA]">
          <Button variant="ghost" onClick={closeActivityModal}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleFinish}
            leftIcon={<CheckCircle2 className="w-4 h-4" />}
          >
            Mark as Completed
          </Button>
        </div>

      </div>
    </Modal>
  );
};
