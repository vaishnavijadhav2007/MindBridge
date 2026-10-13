import React from 'react';
import { Feather, User, Wind, Compass, PenTool } from 'lucide-react';

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
  suggestedAction?: 'breathing' | 'grounding' | 'journal';
  isCrisis?: boolean;
}

interface ChatMessageBubbleProps {
  message: ChatMessage;
  onTriggerAction?: (action: 'breathing' | 'grounding' | 'journal') => void;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({
  message,
  onTriggerAction,
}) => {
  const isUser = message.sender === 'user';

  // Format markdown-like bold text and linebreaks cleanly
  const renderFormattedText = (text: string) => {
    return text.split('\n\n').map((paragraph, pIdx) => (
      <p key={pIdx} className={pIdx > 0 ? 'mt-2.5' : ''}>
        {paragraph.split('\n').map((line, lIdx) => (
          <React.Fragment key={lIdx}>
            {lIdx > 0 && <br />}
            {renderLineWithBold(line)}
          </React.Fragment>
        ))}
      </p>
    ));
  };

  const renderLineWithBold = (line: string) => {
    const parts = line.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx} className="font-semibold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div
      className={`flex items-start gap-3 animate-in fade-in duration-200 ${
        isUser ? 'flex-row-reverse' : ''
      }`}
    >
      {/* Avatar Icon */}
      <div
        className={`w-8 h-8 rounded-2xl flex items-center justify-center shrink-0 shadow-soft-sm ${
          isUser
            ? 'bg-[#403B35] text-[#FFFCF6]'
            : 'bg-[#E9EFE7] text-[#829675] border border-[#D7E2D3]'
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Feather className="w-4 h-4" />}
      </div>

      {/* Bubble Container */}
      <div
        className={`max-w-[85%] sm:max-w-[78%] rounded-2xl sm:rounded-3xl p-4 sm:p-5 text-sm leading-relaxed transition-all shadow-soft-sm ${
          isUser
            ? 'bg-[#829675] text-[#FFFCF6] rounded-tr-sm'
            : 'bg-[#FFFCF6] text-[#403B35] border border-[#E4DACA] rounded-tl-sm'
        }`}
      >
        {/* Message Content */}
        <div className="space-y-1">
          {renderFormattedText(message.text)}
        </div>

        {/* Inline Action Helper Pill (if AI recommends an activity) */}
        {!isUser && message.suggestedAction && onTriggerAction && (
          <div className="pt-3 mt-3 border-t border-[#F0E8DC]">
            {message.suggestedAction === 'breathing' && (
              <button
                type="button"
                onClick={() => onTriggerAction('breathing')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#E9EFE7] text-[#56664F] hover:bg-[#DCE6DA] transition-colors border border-[#D7E2D3]"
              >
                <Wind className="w-3.5 h-3.5 text-[#829675]" />
                <span>Open Guided Breathing Exercise</span>
              </button>
            )}
            {message.suggestedAction === 'grounding' && (
              <button
                type="button"
                onClick={() => onTriggerAction('grounding')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#FAF3E7] text-[#C59B7E] hover:bg-[#F2E5DC] transition-colors border border-[#E8DBCA]"
              >
                <Compass className="w-3.5 h-3.5 text-[#C59B7E]" />
                <span>Try 5-4-3-2-1 Grounding Practice</span>
              </button>
            )}
            {message.suggestedAction === 'journal' && (
              <button
                type="button"
                onClick={() => onTriggerAction('journal')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#E9EFE7] text-[#56664F] hover:bg-[#DCE6DA] transition-colors border border-[#D7E2D3]"
              >
                <PenTool className="w-3.5 h-3.5 text-[#829675]" />
                <span>Open Reflective Journal Prompt</span>
              </button>
            )}
          </div>
        )}

        {/* Timestamp */}
        <div
          className={`text-[10px] mt-2 flex items-center gap-1 ${
            isUser ? 'text-[#FFFCF6]/80 justify-end' : 'text-[#A39D93]'
          }`}
        >
          <span>{message.time}</span>
          {!isUser && <span>• MindBridge Companion</span>}
        </div>
      </div>
    </div>
  );
};
