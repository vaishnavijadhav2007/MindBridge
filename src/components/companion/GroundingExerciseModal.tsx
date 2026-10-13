import React, { useState } from 'react';
import { Eye, Hand, Volume2, Sparkles, Check, ArrowRight, ArrowLeft, RotateCcw } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface GroundingExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GroundingExerciseModal: React.FC<GroundingExerciseModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const steps = [
    {
      count: 5,
      sense: 'SEE',
      title: '5 Things You Can See',
      description: 'Look around the room right now. Notice 5 distinct objects. Observe their color, texture, or how the light reflects off them.',
      examples: 'e.g., A water cup, the grain of a desk, light on the wall, a plant, a shadow.',
      icon: Eye,
      color: 'bg-[#E9EFE7] text-[#56664F] border-[#D7E2D3]'
    },
    {
      count: 4,
      sense: 'TOUCH',
      title: '4 Things You Can Physically Feel',
      description: 'Bring awareness to physical sensations. Touch 4 surfaces near you or notice sensations in your body.',
      examples: 'e.g., The texture of your clothing, feet grounded on the floor, your cool keyboard, a ring on your finger.',
      icon: Hand,
      color: 'bg-[#FAF3E7] text-[#C59B7E] border-[#E8DBCA]'
    },
    {
      count: 3,
      sense: 'HEAR',
      title: '3 Sounds You Can Hear',
      description: 'Close your eyes for a moment. Listen carefully for 3 subtle sounds in your environment, near or far.',
      examples: 'e.g., A humming fan, distant traffic, your own calm breath, rustling leaves outside.',
      icon: Volume2,
      color: 'bg-[#E9EFE7] text-[#56664F] border-[#D7E2D3]'
    },
    {
      count: 2,
      sense: 'SMELL',
      title: '2 Things You Can Smell',
      description: 'Inhale gently through your nose. What 2 scents can you detect in the space around you?',
      examples: 'e.g., Fresh air, coffee aroma, scented soap, the clean air of your room.',
      icon: Sparkles,
      color: 'bg-[#FAF3E7] text-[#C59B7E] border-[#E8DBCA]'
    },
    {
      count: 1,
      sense: 'TASTE / APPRECIATE',
      title: '1 Thing You Can Taste or Appreciate',
      description: 'Notice the lingering taste of water or mint, or bring to mind one tiny, genuine thing you appreciate today.',
      examples: 'e.g., The taste of tea, taking a pause for yourself, warm blankets, a pet or loved one.',
      icon: Check,
      color: 'bg-[#E9EFE7] text-[#56664F] border-[#D7E2D3]'
    }
  ];

  if (!isOpen) return null;

  const isCompleted = currentStep >= steps.length;
  const activeStep = steps[currentStep];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="5-4-3-2-1 Grounding Practice"
      subtitle="Gently anchoring your focus to the present sensory reality"
      maxWidth="md"
    >
      <div className="space-y-6 pt-1">
        
        {/* Step Progress Pill Indicator */}
        <div className="flex items-center justify-between gap-1.5 pb-2">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                idx < currentStep
                  ? 'bg-[#829675]'
                  : idx === currentStep
                  ? 'bg-[#829675]/60'
                  : 'bg-[#E4DACA]'
              }`}
            />
          ))}
        </div>

        {!isCompleted ? (
          <div className="space-y-5">
            {/* Step Card */}
            <div className="bg-[#FAF6EE] border border-[#E4DACA] rounded-2xl p-6 text-center space-y-4">
              <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center border ${activeStep.color} shadow-soft-sm`}>
                <span className="text-2xl font-bold font-mono">{activeStep.count}</span>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#829675]">
                  Sense of {activeStep.sense}
                </span>
                <h4 className="text-xl font-semibold text-[#403B35]">
                  {activeStep.title}
                </h4>
                <p className="text-sm text-[#77736B] leading-relaxed max-w-md mx-auto pt-1">
                  {activeStep.description}
                </p>
              </div>

              <div className="p-3 bg-[#FFFCF6] border border-[#E4DACA] rounded-xl text-xs text-[#77736B] italic">
                {activeStep.examples}
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-2">
              <Button
                variant="ghost"
                size="sm"
                disabled={currentStep === 0}
                onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Previous
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={() => setCurrentStep((s) => s + 1)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {currentStep === steps.length - 1 ? 'Complete Practice' : 'Next Step'}
              </Button>
            </div>
          </div>
        ) : (
          /* Completion State */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#E9EFE7] text-[#829675] border border-[#D7E2D3] flex items-center justify-center mx-auto shadow-soft-sm">
              <Check className="w-8 h-8 text-[#829675]" />
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-semibold text-[#403B35]">You are grounded in this moment.</h4>
              <p className="text-xs sm:text-sm text-[#77736B] max-w-sm mx-auto leading-relaxed">
                Take one deep, easy breath. Notice how your body feels right now compared to when you began.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentStep(0)}
                leftIcon={<RotateCcw className="w-4 h-4" />}
              >
                Do it again
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={onClose}
              >
                Finish & Close
              </Button>
            </div>
          </div>
        )}

      </div>
    </Modal>
  );
};
