import React, { useState, useEffect, useCallback } from 'react';
import { Wind, Pause, Play, RefreshCcw, Check, X } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface BreathingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

type Phase = 'inhale' | 'hold' | 'exhale' | 'rest';

const PHASES: { phase: Phase; label: string; duration: number; instruction: string }[] = [
  { phase: 'inhale', label: 'Breathe In',  duration: 4, instruction: 'Slowly breathe in through your nose...' },
  { phase: 'hold',   label: 'Hold',         duration: 4, instruction: 'Gently hold...' },
  { phase: 'exhale', label: 'Breathe Out', duration: 4, instruction: 'Slowly breathe out through your mouth...' },
  { phase: 'rest',   label: 'Rest',         duration: 2, instruction: 'Rest before the next breath...' },
];

const TOTAL_ROUNDS = 5;

export const BreathingActivityModal: React.FC<BreathingModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [countdown, setCountdown] = useState(PHASES[0].duration);
  const [round, setRound] = useState(1);
  const [finished, setFinished] = useState(false);

  const reset = useCallback(() => {
    setIsRunning(false);
    setPhaseIndex(0);
    setCountdown(PHASES[0].duration);
    setRound(1);
    setFinished(false);
  }, []);

  useEffect(() => {
    if (!isOpen) { reset(); }
  }, [isOpen, reset]);

  useEffect(() => {
    if (!isRunning || finished) return;
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
    // Move to next phase
    const nextPhaseIndex = (phaseIndex + 1) % PHASES.length;
    if (nextPhaseIndex === 0) {
      // Completed a full round
      if (round >= TOTAL_ROUNDS) {
        setIsRunning(false);
        setFinished(true);
        return;
      }
      setRound(r => r + 1);
    }
    setPhaseIndex(nextPhaseIndex);
    setCountdown(PHASES[nextPhaseIndex].duration);
  }, [isRunning, countdown, phaseIndex, round, finished]);

  const currentPhase = PHASES[phaseIndex];

  const circleScale = currentPhase.phase === 'inhale'
    ? 'scale-125'
    : currentPhase.phase === 'exhale'
    ? 'scale-75'
    : 'scale-100';

  const circleTransition = `transition-transform duration-[${currentPhase.duration * 1000}ms] ease-in-out`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Mindful Breathing" subtitle="4-4-4 Breathing • 5 rounds" maxWidth="sm">
      <div className="flex flex-col items-center gap-6 py-2">

        {!finished ? (
          <>
            {/* Animated Circle */}
            <div className="relative flex items-center justify-center w-40 h-40">
              <div
                className={`absolute inset-0 rounded-full bg-[#E9EFE7]/60 border border-[#D7E2D3] ${circleScale} ${circleTransition}`}
              />
              <div className={`relative w-24 h-24 rounded-full bg-[#829675]/20 border-2 border-[#829675] flex flex-col items-center justify-center ${circleScale} ${circleTransition}`}>
                <Wind className="w-5 h-5 text-[#829675] mb-1" />
                <span className="text-2xl font-bold text-[#403B35] leading-none">{countdown}</span>
              </div>
            </div>

            {/* Phase + Instruction */}
            <div className="text-center space-y-1">
              <div className="text-lg font-semibold text-[#403B35]">{currentPhase.label}</div>
              <p className="text-sm text-[#77736B]">{currentPhase.instruction}</p>
              <div className="text-xs text-[#A39D93] mt-1">Round {round} of {TOTAL_ROUNDS}</div>
            </div>

            {/* Phase Progress Dots */}
            <div className="flex items-center gap-2">
              {PHASES.map((p, i) => (
                <div
                  key={p.phase}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === phaseIndex ? 'w-6 bg-[#829675]' : 'w-3 bg-[#D7E2D3]'
                  }`}
                />
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 w-full">
              <Button variant="secondary" size="sm" onClick={reset} leftIcon={<RefreshCcw className="w-3.5 h-3.5" />}>
                Reset
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="flex-1"
                onClick={() => setIsRunning(r => !r)}
                leftIcon={isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              >
                {isRunning ? 'Pause' : (countdown === PHASES[0].duration && phaseIndex === 0 && round === 1 ? 'Begin' : 'Resume')}
              </Button>
            </div>

            <p className="text-[11px] text-[#A39D93] text-center">You can stop or pause at any time.</p>
          </>
        ) : (
          /* Completion State */
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-16 h-16 rounded-full bg-[#E9EFE7] border border-[#D7E2D3] flex items-center justify-center">
              <Check className="w-8 h-8 text-[#829675]" />
            </div>
            <div className="text-center space-y-1">
              <div className="text-lg font-semibold text-[#403B35]">All 5 rounds complete</div>
              <p className="text-sm text-[#77736B]">
                Well done. Even two minutes of mindful breathing can shift your entire state.
              </p>
            </div>
            <div className="flex gap-3 w-full">
              <Button variant="secondary" size="sm" onClick={reset}>Do again</Button>
              <Button variant="primary" size="sm" className="flex-1" onClick={onComplete} leftIcon={<Check className="w-3.5 h-3.5" />}>
                Finish
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
