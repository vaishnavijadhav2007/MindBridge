import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { WellnessActivity } from '../../types/wellness';

interface SimpleActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  activity: WellnessActivity;
}

export const SimpleActivityModal: React.FC<SimpleActivityModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  activity,
}) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [finished, setFinished] = useState(false);

  const steps = activity.steps ?? [];

  const handleClose = () => {
    setStepIndex(0);
    setFinished(false);
    onClose();
  };

  const handleNext = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex(i => i + 1);
    } else {
      setFinished(true);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={activity.title}
      subtitle={`${activity.estimatedDuration} • ${activity.category}`}
      maxWidth="md"
    >
      {!finished ? (
        <div className="space-y-5">
          {/* Progress */}
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= stepIndex ? 'bg-[#829675]' : 'bg-[#E4DACA]'}`}
              />
            ))}
          </div>

          {/* Step */}
          <div className="bg-[#FAF6EE] border border-[#E4DACA] rounded-2xl p-5 min-h-[100px] flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-[#829675] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              {stepIndex + 1}
            </div>
            <p className="text-sm text-[#403B35] leading-relaxed">{steps[stepIndex]}</p>
          </div>

          <p className="text-xs text-[#77736B] text-center">Step {stepIndex + 1} of {steps.length}</p>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setStepIndex(i => i - 1)}
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
              rightIcon={stepIndex < steps.length - 1
                ? <ChevronRight className="w-4 h-4" />
                : <Check className="w-4 h-4" />}
            >
              {stepIndex < steps.length - 1 ? 'Next Step' : 'Finish'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 py-2">
          <div className="w-16 h-16 rounded-full bg-[#E9EFE7] border border-[#D7E2D3] flex items-center justify-center">
            <Check className="w-8 h-8 text-[#829675]" />
          </div>
          <div className="text-center space-y-2">
            <div className="text-lg font-semibold text-[#403B35]">Activity complete!</div>
            <p className="text-sm text-[#77736B]">
              {activity.completionPrompt ?? 'Well done for taking time for yourself today.'}
            </p>
          </div>
          <Button variant="primary" size="sm" className="w-full" onClick={onComplete} leftIcon={<Check className="w-3.5 h-3.5" />}>
            Complete Activity
          </Button>
        </div>
      )}
    </Modal>
  );
};
