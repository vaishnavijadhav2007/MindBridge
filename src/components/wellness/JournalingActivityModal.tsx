import React, { useState } from 'react';
import { PenTool, Check, RefreshCcw } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface JournalingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  /** If provided, overrides the default prompt set */
  singlePrompt?: string;
}

const PROMPTS = [
  'What is one thing that felt heavy today, and what is one small thing I appreciate?',
  'What emotion am I carrying right now? Where do I feel it in my body?',
  'What is one worry circling in my mind? What is the smallest step I could take to address it?',
  'What does a calmer version of me know that I sometimes forget?',
  'What am I grateful for that I often overlook?',
];

export const JournalingActivityModal: React.FC<JournalingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  singlePrompt,
}) => {
  const [text, setText] = useState('');
  const [promptIndex, setPromptIndex] = useState(() => Math.floor(Math.random() * PROMPTS.length));
  const [finished, setFinished] = useState(false);

  const prompt = singlePrompt ?? PROMPTS[promptIndex];

  const handleClose = () => {
    setText('');
    setFinished(false);
    onClose();
  };

  const handleFinish = () => {
    setFinished(true);
  };

  const newPrompt = () => {
    setPromptIndex(i => (i + 1) % PROMPTS.length);
    setText('');
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Guided Journaling" subtitle="A quiet space for reflection" maxWidth="md">
      {!finished ? (
        <div className="space-y-4">
          {/* Prompt box */}
          <div className="bg-[#FAF6EE] border border-[#E4DACA] rounded-2xl p-4 flex items-start gap-3">
            <PenTool className="w-4 h-4 text-[#829675] mt-0.5 shrink-0" />
            <p className="text-sm font-medium text-[#403B35] leading-relaxed italic">"{prompt}"</p>
          </div>

          {!singlePrompt && (
            <button
              type="button"
              onClick={newPrompt}
              className="flex items-center gap-1.5 text-xs text-[#829675] hover:text-[#56664F] font-medium transition-colors"
            >
              <RefreshCcw className="w-3 h-3" />
              Try a different prompt
            </button>
          )}

          {/* Text area */}
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Write freely — no one else will read this. There's no right or wrong answer."
            rows={7}
            className="w-full bg-[#F3EBDD]/50 border border-[#E4DACA] focus:border-[#829675] rounded-xl px-4 py-3 text-sm text-[#403B35] placeholder:text-[#9B968D] outline-none resize-none transition-colors leading-relaxed"
          />

          <p className="text-[11px] text-[#A39D93]">
            Your words are not stored. This text is only held in your browser while the page is open.
          </p>

          <div className="flex gap-3">
            <Button variant="secondary" size="sm" onClick={handleClose}>Cancel</Button>
            <Button
              variant="primary"
              size="sm"
              className="flex-1"
              onClick={handleFinish}
              leftIcon={<Check className="w-3.5 h-3.5" />}
            >
              {text.trim() ? 'Finish Writing' : 'Skip & Finish'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 py-2">
          <div className="w-16 h-16 rounded-full bg-[#E9EFE7] border border-[#D7E2D3] flex items-center justify-center">
            <Check className="w-8 h-8 text-[#829675]" />
          </div>
          <div className="text-center space-y-2">
            <div className="text-lg font-semibold text-[#403B35]">Thank you for writing.</div>
            <p className="text-sm text-[#77736B]">
              Giving your thoughts a voice is a meaningful act of self-care. You can close this whenever you're ready.
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
