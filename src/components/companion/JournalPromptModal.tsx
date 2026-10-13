import React, { useState } from 'react';
import { PenTool, Check, Copy, BookOpen } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useWellness } from '../../context/WellnessContext';

interface JournalPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JournalPromptModal: React.FC<JournalPromptModalProps> = ({ isOpen, onClose }) => {
  const [reflection, setReflection] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const { showToast } = useWellness();

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!reflection.trim()) return;
    navigator.clipboard.writeText(reflection);
    setIsCopied(true);
    showToast('Reflection copied to clipboard.');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSave = () => {
    if (reflection.trim()) {
      showToast('Reflection saved to your local session.');
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Mindful Journal Prompt"
      subtitle="Writing creates space between yourself and your racing thoughts"
      maxWidth="md"
    >
      <div className="space-y-5 pt-1">
        
        {/* The Prompt Card */}
        <div className="bg-[#FAF6EE] border border-[#E4DACA] rounded-2xl p-4 sm:p-5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#829675]">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Today's Reflection Question</span>
          </div>
          <h4 className="text-base sm:text-lg font-semibold text-[#403B35]">
            "What is one thing that has been on your mind today?"
          </h4>
          <p className="text-xs text-[#77736B] leading-relaxed">
            Write without worrying about structure, spelling, or neatness. Just let your thoughts flow naturally onto the page.
          </p>
        </div>

        {/* Text Area */}
        <div className="space-y-1.5">
          <textarea
            rows={5}
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Type freely here... What does this feel like? Why does it matter to you right now?"
            className="w-full rounded-2xl bg-[#FFFCF6] border border-[#E4DACA] p-4 text-sm text-[#403B35] placeholder:text-[#9B968D] focus:border-[#829675] focus:ring-2 focus:ring-[#829675]/20 outline-none transition-all resize-y"
          />
          <div className="flex items-center justify-between text-[11px] text-[#77736B] px-1">
            <span>{reflection.trim().split(/\s+/).filter(Boolean).length} words</span>
            <span>Your text is completely private to this session</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E4DACA]">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            disabled={!reflection.trim()}
            leftIcon={isCopied ? <Check className="w-4 h-4 text-[#829675]" /> : <Copy className="w-4 h-4" />}
          >
            {isCopied ? 'Copied!' : 'Copy Text'}
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave}>
              Save & Close
            </Button>
          </div>
        </div>

      </div>
    </Modal>
  );
};
