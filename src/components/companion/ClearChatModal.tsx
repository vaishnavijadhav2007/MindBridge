import React from 'react';
import { Trash2 } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface ClearChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ClearChatModal: React.FC<ClearChatModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Clear Current Conversation?"
      subtitle="This will reset your messages and start with a fresh welcome message."
      maxWidth="sm"
    >
      <div className="space-y-4 pt-1">
        <p className="text-xs text-[#77736B] leading-relaxed">
          Are you sure you want to clear your current messages? In this frontend prototype, this action cannot be undone.
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="bg-red-600 hover:bg-red-700 text-white border-transparent"
            leftIcon={<Trash2 className="w-4 h-4" />}
          >
            Yes, Clear Chat
          </Button>
        </div>
      </div>
    </Modal>
  );
};
