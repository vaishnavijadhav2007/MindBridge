import React, { useState, useEffect } from 'react';
import { Wind, Pause, Play, RotateCcw, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface GuidedBreathingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type BreathPhase = 'Inhale' | 'Hold' | 'Exhale' | 'Rest';

export const GuidedBreathingModal: React.FC<GuidedBreathingModalProps> = ({ isOpen, onClose }) => {
  const [isActive, setIsActive] = useState<boolean>(true);
  const [phase, setPhase] = useState<BreathPhase>('Inhale');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(4);
  const [completedCycles, setCompletedCycles] = useState<number>(0);

  useEffect(() => {
    if (!isOpen) {
      setIsActive(false);
      setPhase('Inhale');
      setSecondsRemaining(4);
      setCompletedCycles(0);
      return;
    }
    setIsActive(true);
  }, [isOpen]);

  useEffect(() => {
    let timer: any = null;

    if (isActive && isOpen) {
      timer = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev > 1) {
            return prev - 1;
          }

          // Transition to next phase
          if (phase === 'Inhale') {
            setPhase('Hold');
            return 4;
          } else if (phase === 'Hold') {
            setPhase('Exhale');
            return 4;
          } else if (phase === 'Exhale') {
            setPhase('Rest');
            return 2;
          } else {
            // Completed 1 full cycle
            setCompletedCycles((c) => c + 1);
            setPhase('Inhale');
            return 4;
          }
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isActive, isOpen, phase]);

  if (!isOpen) return null;

  const phaseDetails = {
    Inhale: { label: 'Breathe In Slowly', instruction: 'Fill your lungs with cool, gentle air through your nose.', scale: 'scale-125 bg-[#829675]/30' },
    Hold: { label: 'Hold Gently', instruction: 'Notice the stillness inside you. Keep shoulders soft.', scale: 'scale-125 bg-[#829675]/40' },
    Exhale: { label: 'Release and Let Go', instruction: 'Gently release the breath out through your mouth.', scale: 'scale-90 bg-[#829675]/15' },
    Rest: { label: 'Rest and Pause', instruction: 'Take a natural pause before the next cycle.', scale: 'scale-90 bg-[#829675]/10' }
  };

  const currentDetail = phaseDetails[phase];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Guided Box Breathing"
      subtitle="4-4-4 rhythm designed to ground your nervous system"
      maxWidth="md"
    >
      <div className="space-y-6 pt-2 flex flex-col items-center text-center">
        
        {/* Animated Breathing Circle */}
        <div className="relative w-56 h-56 flex items-center justify-center my-2">
          {/* Outer Ambient Glow Ring */}
          <div
            className={`absolute inset-0 rounded-full border-2 border-[#829675]/40 transition-transform duration-1000 ease-in-out ${currentDetail.scale}`}
          />

          {/* Core Pulsing Center */}
          <div
            className={`w-40 h-40 rounded-full bg-[#E9EFE7] border-2 border-[#829675] shadow-soft-md flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${
              phase === 'Inhale' || phase === 'Hold' ? 'scale-110 shadow-soft-lg' : 'scale-95'
            }`}
          >
            <Wind className="w-6 h-6 text-[#829675] mb-1 animate-pulse" />
            <span className="text-2xl font-bold font-mono text-[#403B35]">
              {secondsRemaining}s
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#56664F] mt-0.5">
              {phase}
            </span>
          </div>
        </div>

        {/* Phase Instruction */}
        <div className="space-y-1 max-w-sm">
          <h4 className="text-base font-semibold text-[#403B35]">
            {currentDetail.label}
          </h4>
          <p className="text-xs text-[#77736B] leading-relaxed">
            {currentDetail.instruction}
          </p>
        </div>

        {/* Cycles Counter */}
        <div className="flex items-center gap-2 text-xs font-medium text-[#56664F] bg-[#E9EFE7] px-3.5 py-1.5 rounded-full border border-[#D7E2D3]">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#829675]" />
          <span>Cycles completed: <strong>{completedCycles}</strong></span>
        </div>

        {/* Controls: Play/Pause, Reset, Stop & Close */}
        <div className="flex items-center justify-center gap-3 pt-4 border-t border-[#E4DACA] w-full">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsActive(!isActive)}
            leftIcon={isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          >
            {isActive ? 'Pause' : 'Resume'}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setPhase('Inhale');
              setSecondsRemaining(4);
              setCompletedCycles(0);
              setIsActive(true);
            }}
            leftIcon={<RotateCcw className="w-4 h-4" />}
          >
            Restart
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onClose}
          >
            Stop & Close
          </Button>
        </div>

      </div>
    </Modal>
  );
};
