import React, { useState } from 'react';
import { Send, Sparkles, User, Bot, RefreshCw, Feather } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

const initialMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'ai',
    text: "Hello! I am your MindBridge AI Companion. I'm here to offer a calm, non-judgmental ear and gentle coping suggestions whenever you need to reflect. How can I support your mind today?",
    time: '10:00 AM'
  }
];

export const AICompanionPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const prompts = [
    "I'm feeling a bit anxious and need to ground myself.",
    "Can you suggest a quick 2-minute breathing exercise?",
    "How can I stop overthinking before bed?"
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = "Thank you for sharing that with me. It is completely natural to experience waves of emotion. Let's take a slow, deep breath together. Remember that you do not have to figure out everything all at once.";
      if (text.toLowerCase().includes('breath') || text.toLowerCase().includes('breathing')) {
        reply = "Let's pause right here. Close your eyes gently. Inhale through your nose for 4 counts... hold for 4 counts... and release smoothly for 4 counts. Notice how your shoulders drop as you let that breath go.";
      } else if (text.toLowerCase().includes('anxious') || text.toLowerCase().includes('overwhelm')) {
        reply = "Anxiety often tries to pull your attention into a future that hasn't happened. Bring your focus back to the present: name three neutral objects in the room around you. You are safe in this moment.";
      } else if (text.toLowerCase().includes('bed') || text.toLowerCase().includes('sleep')) {
        reply = "Racing thoughts at night usually mean your mind didn't get enough quiet space during the day to process. Try writing your worries on a physical notepad before bed to let your mind know they won't be forgotten.";
      }

      const aiMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'ai',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div className="space-y-6 pb-12 flex flex-col h-[calc(100vh-140px)] max-h-[820px]">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#829675] mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Compassionate Guidance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#403B35] tracking-tight">
          AI Wellness Companion
        </h1>
        <p className="text-xs sm:text-sm text-[#77736B]">
          A private, non-clinical space to process thoughts and discover gentle coping tools.
        </p>
      </div>

      {/* Main Chat Container */}
      <Card padding="none" className="flex-1 flex flex-col border-[#E4DACA] bg-[#FFFCF6] overflow-hidden min-h-0">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  isUser ? 'bg-[#403B35] text-[#FFFCF6]' : 'bg-[#E9EFE7] text-[#829675] border border-[#D7E2D3]'
                }`}>
                  {isUser ? <User className="w-4 h-4" /> : <Feather className="w-4 h-4" />}
                </div>

                <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                  isUser
                    ? 'bg-[#829675] text-[#FFFCF6] rounded-tr-sm'
                    : 'bg-[#F3EBDD] text-[#403B35] border border-[#E4DACA] rounded-tl-sm'
                }`}>
                  <p>{m.text}</p>
                  <span className={`block text-[10px] mt-1.5 ${isUser ? 'text-[#FFFCF6]/75 text-right' : 'text-[#77736B]'}`}>
                    {m.time}
                  </span>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#E9EFE7] text-[#829675] flex items-center justify-center">
                <Feather className="w-4 h-4" />
              </div>
              <div className="bg-[#F3EBDD] p-3 rounded-2xl border border-[#E4DACA] text-xs text-[#77736B] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#829675] animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#829675] animate-bounce delay-100" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#829675] animate-bounce delay-200" />
                <span className="ml-1">MindBridge is composing a gentle reply...</span>
              </div>
            </div>
          )}
        </div>

        {/* Prompt Suggestions */}
        <div className="px-4 py-2 border-t border-[#F0E8DC] bg-[#FAF6EE] flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-semibold text-[#77736B] shrink-0">Try asking:</span>
          {prompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="text-xs bg-[#FFFCF6] border border-[#E4DACA] text-[#403B35] hover:border-[#829675] hover:text-[#829675] px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors"
            >
              "{p}"
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-[#E4DACA] bg-[#FFFCF6] flex items-center gap-3">
          <input
            type="text"
            placeholder="Type your reflection or question here..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-[#F3EBDD]/60 border border-[#E4DACA] focus:border-[#829675] rounded-xl px-4 py-2.5 text-sm outline-none text-[#403B35] placeholder:text-[#9B968D]"
          />
          <Button
            variant="primary"
            size="md"
            onClick={() => handleSend()}
            disabled={!inputValue.trim()}
            rightIcon={<Send className="w-4 h-4" />}
          >
            Send
          </Button>
        </div>

      </Card>
    </div>
  );
};
