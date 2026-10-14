import React, { useState } from 'react';
import { ThumbsUp, Minus, ThumbsDown, Check } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { ActivityFeedback } from '../../types/wellness';

interface FeedbackModalProps {
  isOpen: boolean;
  activityTitle: string;
  completionPrompt: string;
  onFeedback: (feedback: ActivityFeedback) => void;
  onClose: () => void;
}

const OPTIONS: { value: ActivityFeedback; label: string; icon: React.ReactNode; bg: string }[] = [
  {
    value: 'helpful',
    label: 'Helpful',
    icon: <ThumbsUp className="w-5 h-5" />,
    bg: 'bg-[#E9EFE7] text-[#56664F] border-[#D7E2D3] hover:bg-[#DDE6DA]',
  },
  {
    value: 'okay',
    label: 'Okay',
    icon: <Minus className="w-5 h-5" />,
    bg: 'bg-[#FAF3E7] text-[#C59B7E] border-[#E8DBCA] hover:bg-[#F5EADA]',
  },
  {
    value: 'not-for-me',
    label: 'Not for me',
    icon: <ThumbsDown className="w-5 h-5" />,
    bg: 'bg-[#FEF0F0] text-[#C0392B] border-[#EDBBBB] hover:bg-[#FAE0E0]',
  },
];

export const ActivityFeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  activityTitle,
  completionPrompt,
  onFeedback,
  onClose,
}) => {
  const [selected, setSelected] = useState<ActivityFeedback | null>(null);

  const handleSubmit = () => {
    if (selected) {
      onFeedback(selected);
      setSelected(null);
    } else {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => { setSelected(null); onClose(); }}
      title="How was that for you?"
      subtitle={activityTitle}
      maxWidth="sm"
    >
      <div className="space-y-5">
        <div className="bg-[#FAF6EE] border border-[#E4DACA] rounded-2xl p-4">
          <p className="text-sm text-[#403B35] leading-relaxed">
            {completionPrompt}
          </p>
        </div>

        <p className="text-sm text-[#77736B]">
          Your feedback helps personalise future suggestions within this session.
        </p>

        <div className="grid grid-cols-3 gap-3">
          {OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSelected(opt.value)}
              className={`flex flex-col items-center gap-2 p-3.5 rounded-2xl border-2 transition-all duration-200 ${opt.bg} ${
                selected === opt.value
                  ? 'ring-2 ring-[#829675] ring-offset-2 scale-105'
                  : 'border-opacity-60'
              }`}
            >
              {opt.icon}
              <span className="text-xs font-semibold">{opt.label}</span>
            </button>
          ))}
        </div>

        <p className="text-[11px] text-[#A39D93] text-center">
          Recommendations are based on self-reported preferences — not clinical analysis.
        </p>

        <Button
          variant="primary"
          size="sm"
          fullWidth
          onClick={handleSubmit}
          leftIcon={<Check className="w-3.5 h-3.5" />}
        >
          {selected ? 'Submit Feedback' : 'Skip & Close'}
        </Button>
      </div>
    </Modal>
  );
};
