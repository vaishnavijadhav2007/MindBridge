import React, { useState, useEffect, useCallback } from 'react';
import { Timer, Play, Pause, RefreshCcw, Check } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface FocusTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const DEFAULT_SECONDS = 15 * 60; // 15 minutes

function formatTime(s: number): string {
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

export const FocusTimerModal: React.FC<FocusTimerModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [totalSeconds] = useState(DEFAULT_SECONDS);
  const [remaining, setRemaining] = useState(DEFAULT_SECONDS);
  const [isRunning, setIsRunning] = useState(false);
  const [finished, setFinished] = useState(false);

  const reset = useCallback(() => {
    setIsRunning(false);
    setRemaining(DEFAULT_SECONDS);
    setFinished(false);
  }, []);

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  useEffect(() => {
    if (!isRunning || finished) return;
    if (remaining <= 0) {
      setIsRunning(false);
      setFinished(true);
      return;
    }
    const t = setTimeout(() => setRemaining(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [isRunning, remaining, finished]);

  const progress = ((totalSeconds - remaining) / totalSeconds) * 100;
  const circumference = 2 * Math.PI * 54; // radius 54

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Study Focus Session" subtitle="15-minute focus timer" maxWidth="sm">
      {!finished ? (
        <div className="flex flex-col items-center gap-6 py-2">
          {/* Circular Progress */}
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="#E4DACA" strokeWidth="6" />
              <circle
                cx="60" cy="60" r="54" fill="none"
                stroke="#829675" strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (circumference * progress) / 100}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="flex flex-col items-center">
              <Timer className="w-5 h-5 text-[#829675] mb-1" />
              <span className="text-3xl font-bold text-[#403B35] tabular-nums">{formatTime(remaining)}</span>
            </div>
          </div>

          <div className="text-center space-y-1">
            <p className="text-sm font-medium text-[#403B35]">
              {isRunning ? 'Focus time — you\'ve got this.' : remaining === DEFAULT_SECONDS ? 'Ready when you are.' : 'Paused. Resume when you\'re ready.'}
            </p>
            <p className="text-xs text-[#77736B]">
              Choose one task. Set aside distractions. Just begin.
            </p>
          </div>

          <div className="flex gap-3 w-full">
            <Button variant="secondary" size="sm" onClick={reset} leftIcon={<RefreshCcw className="w-3.5 h-3.5" />}>
              Reset
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="flex-1"
              onClick={() => setIsRunning(r => !r)}
              leftIcon={isRunning
                ? <Pause className="w-3.5 h-3.5" />
                : <Play className="w-3.5 h-3.5 fill-current" />}
            >
              {isRunning ? 'Pause' : remaining === DEFAULT_SECONDS ? 'Start Focus' : 'Resume'}
            </Button>
          </div>

          {/* Allow early finish */}
          {!isRunning && remaining < DEFAULT_SECONDS && (
            <button
              type="button"
              onClick={() => setFinished(true)}
              className="text-xs text-[#77736B] hover:text-[#403B35] underline"
            >
              Mark session as complete early
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 py-2">
          <div className="w-16 h-16 rounded-full bg-[#E9EFE7] border border-[#D7E2D3] flex items-center justify-center">
            <Check className="w-8 h-8 text-[#829675]" />
          </div>
          <div className="text-center space-y-2">
            <div className="text-lg font-semibold text-[#403B35]">Focus session complete!</div>
            <p className="text-sm text-[#77736B]">
              Excellent focus. One step at a time really does add up. Take a short break before the next session.
            </p>
          </div>
          <div className="flex gap-3 w-full">
            <Button variant="secondary" size="sm" onClick={reset}>Start another</Button>
            <Button variant="primary" size="sm" className="flex-1" onClick={onComplete} leftIcon={<Check className="w-3.5 h-3.5" />}>
              Finish
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
