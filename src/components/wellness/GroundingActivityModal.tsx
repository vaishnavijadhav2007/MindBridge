import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, Eye, Ear, Wind, Hand, Smile } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface GroundingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const STEPS = [
  {
    number: 5,
    sense: 'See',
    icon: Eye,
    color: 'bg-[#E9EFE7] text-[#829675] border-[#D7E2D3]',
    prompt: 'Look around and name 5 things you can see.',
    hint: 'A book, a lamp, a window — anything in your field of vision.',
  },
  {
    number: 4,
    sense: 'Touch',
    icon: Hand,
    color: 'bg-[#FAF3E7] text-[#C59B7E] border-[#E8DBCA]',
    prompt: 'Notice 4 things you can physically feel.',
    hint: 'The texture of your clothes, the floor beneath your feet, the air on your skin.',
  },
  {
    number: 3,
    sense: 'Hear',
    icon: Ear,
    color: 'bg-[#EEF0F5] text-[#6B7FA3] border-[#D4D9E8]',
    prompt: 'Listen for 3 sounds around you.',
    hint: 'Traffic in the distance, your breath, a fan humming — anything at all.',
  },
  {
    number: 2,
    sense: 'Smell',
    icon: Wind,
    color: 'bg-[#F5EEF8] text-[#9B59B6] border-[#DEC9EA]',
    prompt: 'Notice 2 things you can smell (or recall a comforting scent).',
    hint: 'Coffee, fresh air, a candle, or simply nothing — that\'s fine too.',
  },
  {
    number: 1,
    sense: 'Taste',
    icon: Smile,
    color: 'bg-[#FEF0F0] text-[#C0392B] border-[#EDBBBB]',
    prompt: 'Notice 1 thing you can taste right now.',
    hint: 'A lingering flavour, or simply the neutral taste of your mouth.',
  },
];

export const GroundingActivityModal: React.FC<GroundingModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleClose = () => {
    setStepIndex(0);
    setFinished(false);
    onClose();
  };

  const handleNext = () => {
    if (stepIndex < STEPS.length - 1) {
      setStepIndex(i => i + 1);
    } else {
      setFinished(true);
    }
  };

  const handlePrev = () => {
    if (stepIndex > 0) setStepIndex(i => i - 1);
  };

  const step = STEPS[stepIndex];
  const SenseIcon = step.icon;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Grounding Exercise" subtitle="5-4-3-2-1 Sensory Awareness" maxWidth="sm">
      {!finished ? (
        <div className="space-y-5">
          {/* Step progress */}
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= stepIndex ? 'bg-[#829675]' : 'bg-[#E4DACA]'}`}
              />
            ))}
          </div>

          {/* Sense Badge */}
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${step.color}`}>
              <SenseIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-[#77736B] font-medium uppercase tracking-wider">Step {stepIndex + 1} of 5</div>
              <div className="text-xl font-bold text-[#403B35]">{step.number} things to {step.sense}</div>
            </div>
          </div>

          {/* Prompt */}
          <div className="bg-[#FAF6EE] border border-[#E4DACA] rounded-2xl p-4 space-y-2">
            <p className="text-sm font-medium text-[#403B35] leading-relaxed">{step.prompt}</p>
            <p className="text-xs text-[#77736B] leading-relaxed italic">{step.hint}</p>
          </div>

          <p className="text-xs text-[#A39D93] text-center">Take your time. There's no rush.</p>

          {/* Navigation */}
          <div className="flex gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={handlePrev}
              disabled={stepIndex === 0}
              leftIcon={<ChevronLeft className="w-4 h-4" />}
            >
              Previous
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="flex-1"
              onClick={handleNext}
              rightIcon={stepIndex < STEPS.length - 1 ? <ChevronRight className="w-4 h-4" /> : <Check className="w-4 h-4" />}
            >
              {stepIndex < STEPS.length - 1 ? 'Next Sense' : 'Finish'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 py-2">
          <div className="w-16 h-16 rounded-full bg-[#E9EFE7] border border-[#D7E2D3] flex items-center justify-center">
            <Check className="w-8 h-8 text-[#829675]" />
          </div>
          <div className="text-center space-y-2">
            <div className="text-lg font-semibold text-[#403B35]">You are here. You are grounded.</div>
            <p className="text-sm text-[#77736B]">
              That took courage. Notice how your body feels right now — a little more present, perhaps a little calmer.
            </p>
          </div>
          <div className="flex gap-3 w-full">
            <Button variant="secondary" size="sm" onClick={() => { setStepIndex(0); setFinished(false); }}>
              Do again
            </Button>
            <Button variant="primary" size="sm" className="flex-1" onClick={onComplete} leftIcon={<Check className="w-3.5 h-3.5" />}>
              Finish
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
