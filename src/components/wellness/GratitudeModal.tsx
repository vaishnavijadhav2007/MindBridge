import React, { useState } from 'react';
import { Heart, Check } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface GratitudeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const PROMPTS = [
  { id: 'p1', text: 'Something or someone you\'re glad exists in your life right now.' },
  { id: 'p2', text: 'A small, ordinary moment from today (or recently) that felt nice.' },
  { id: 'p3', text: 'A quality in yourself that you can appreciate today.' },
];

export const GratitudeModal: React.FC<GratitudeModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [values, setValues] = useState<Record<string, string>>({ p1: '', p2: '', p3: '' });
  const [finished, setFinished] = useState(false);

  const handleClose = () => {
    setValues({ p1: '', p2: '', p3: '' });
    setFinished(false);
    onClose();
  };

  const filledCount = Object.values(values).filter(v => v.trim()).length;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Gratitude Reflection" subtitle="Gently notice what you appreciate" maxWidth="md">
      {!finished ? (
        <div className="space-y-5">
          <p className="text-sm text-[#77736B] leading-relaxed">
            There's no pressure to answer all three. Notice whatever comes naturally — even the tiniest thing counts.
          </p>

          {PROMPTS.map(p => (
            <div key={p.id} className="space-y-1.5">
              <label className="text-sm font-medium text-[#403B35] leading-relaxed block">
                {p.text}
              </label>
              <input
                type="text"
                value={values[p.id]}
                onChange={e => setValues(prev => ({ ...prev, [p.id]: e.target.value }))}
                placeholder="Write anything — big or small…"
                className="w-full bg-[#F3EBDD]/50 border border-[#E4DACA] focus:border-[#829675] rounded-xl px-4 py-2.5 text-sm text-[#403B35] placeholder:text-[#9B968D] outline-none transition-colors"
              />
            </div>
          ))}

          <p className="text-[11px] text-[#A39D93]">
            Your responses are not stored and will clear when you close this window.
          </p>

          <div className="flex gap-3">
            <Button variant="secondary" size="sm" onClick={handleClose}>Cancel</Button>
            <Button
              variant="primary"
              size="sm"
              className="flex-1"
              onClick={() => setFinished(true)}
              leftIcon={<Check className="w-3.5 h-3.5" />}
            >
              {filledCount > 0 ? `Finish (${filledCount} noted)` : 'Skip & Finish'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 py-2">
          <div className="w-16 h-16 rounded-full bg-[#E9EFE7] border border-[#D7E2D3] flex items-center justify-center">
            <Heart className="w-8 h-8 text-[#829675] fill-[#829675]/20" />
          </div>
          <div className="text-center space-y-2">
            <div className="text-lg font-semibold text-[#403B35]">Beautifully done.</div>
            <p className="text-sm text-[#77736B]">
              Noticing the good — even in small ways — takes real practice. You did it.
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
