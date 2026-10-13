import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  RotateCcw, 
  Trash2, 
  Sparkles, 
  Feather, 
  HeartHandshake, 
  ShieldAlert,
  Info
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { AICompanionHeader } from '../../components/companion/AICompanionHeader';
import { ChatMessageBubble, ChatMessage } from '../../components/companion/ChatMessageBubble';
import { SuggestedQuestions } from '../../components/companion/SuggestedQuestions';
import { QuickActionsSection } from '../../components/companion/QuickActionsSection';
import { GuidedBreathingModal } from '../../components/companion/GuidedBreathingModal';
import { GroundingExerciseModal } from '../../components/companion/GroundingExerciseModal';
import { JournalPromptModal } from '../../components/companion/JournalPromptModal';
import { CrisisSupportPanel } from '../../components/companion/CrisisSupportPanel';
import { ClearChatModal } from '../../components/companion/ClearChatModal';
import { generateCompanionReply } from '../../services/aiMockService';
import { useWellness } from '../../context/WellnessContext';

const WELCOME_TEXT = "Hi! I'm your MindBridge companion. You can talk to me about stress, studies, sleep, emotions, or anything affecting your well-being. What would you like to explore today?";

export const AICompanionPage: React.FC = () => {
  const { showToast } = useWellness();

  // Initial welcome message
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'ai',
      text: WELCOME_TEXT,
      time: 'Just now'
    }
  ]);

  const [inputText, setInputText] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showCrisisPanel, setShowCrisisPanel] = useState<boolean>(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState<boolean>(false);

  // Modals for Quick Actions
  const [activeModal, setActiveModal] = useState<'breathing' | 'grounding' | 'journal' | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  // Handle message submission
  const handleSendMessage = (messageText?: string) => {
    const textToSend = (messageText || inputText).trim();
    if (!textToSend || isGenerating) return;

    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      time: timeFormatted,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsGenerating(true);

    // Simulate gentle, empathetic AI response delay (750ms - 1000ms)
    setTimeout(() => {
      const companionResult = generateCompanionReply(textToSend);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: companionResult.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction: companionResult.suggestedAction,
        isCrisis: companionResult.isCrisis,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsGenerating(false);

      if (companionResult.isCrisis) {
        setShowCrisisPanel(true);
      }
    }, 850);
  };

  // Start fresh chat
  const handleStartNewChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'ai',
        text: WELCOME_TEXT,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setShowCrisisPanel(false);
    showToast('Started a fresh conversation.');
    inputRef.current?.focus();
  };

  // Clear chat completely
  const handleConfirmClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'ai',
        text: WELCOME_TEXT,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setShowCrisisPanel(false);
    showToast('Conversation cleared.');
  };

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      
      {/* Page Header */}
      <AICompanionHeader />

      {/* Optional Crisis Support Alert Banner (if triggered) */}
      {showCrisisPanel && (
        <CrisisSupportPanel onDismiss={() => setShowCrisisPanel(false)} />
      )}

      {/* Main Conversation & Interactive Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Chat Conversation Container (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <Card
            padding="none"
            className="flex flex-col h-[600px] border-[#E4DACA] bg-[#FFFCF6] shadow-soft-sm overflow-hidden"
          >
            {/* Chat Top Subheader with Controls */}
            <div className="p-3.5 px-5 bg-[#FAF6EE] border-b border-[#E4DACA] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#829675] animate-pulse" />
                <span className="text-xs font-semibold text-[#403B35]">Active Session</span>
                <span className="text-[11px] text-[#A39D93]">• Local State</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleStartNewChat}
                  className="px-2.5 py-1 text-xs font-medium text-[#77736B] hover:text-[#403B35] hover:bg-[#F3EBDD] rounded-lg transition-colors flex items-center gap-1"
                  title="Start a fresh chat"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">New Chat</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsClearModalOpen(true)}
                  className="px-2.5 py-1 text-xs font-medium text-[#77736B] hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1"
                  title="Clear conversation"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              </div>
            </div>

            {/* Scrollable Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#FFFCF6]">
              {messages.map((msg) => (
                <ChatMessageBubble
                  key={msg.id}
                  message={msg}
                  onTriggerAction={(action) => setActiveModal(action)}
                />
              ))}

              {/* Typing indicator */}
              {isGenerating && (
                <div className="flex items-start gap-3 animate-in fade-in duration-200">
                  <div className="w-8 h-8 rounded-2xl bg-[#E9EFE7] text-[#829675] border border-[#D7E2D3] flex items-center justify-center shrink-0">
                    <Feather className="w-4 h-4 animate-bounce" />
                  </div>
                  <div className="bg-[#FAF6EE] border border-[#E4DACA] rounded-2xl rounded-tl-sm p-3.5 px-4 text-xs text-[#77736B] flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#829675] animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#829675] animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#829675] animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span>MindBridge is reflecting...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Text Input Bar */}
            <div className="p-3 sm:p-4 bg-[#FFFCF6] border-t border-[#E4DACA] space-y-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Share what's on your mind... (e.g., 'Feeling stressed about my studies')"
                  value={inputText}
                  disabled={isGenerating}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 bg-[#F3EBDD]/60 border border-[#E4DACA] focus:border-[#829675] rounded-xl px-4 py-2.5 text-sm outline-none text-[#403B35] placeholder:text-[#9B968D] transition-all disabled:opacity-50"
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={!inputText.trim() || isGenerating}
                  rightIcon={<Send className="w-4 h-4" />}
                  className="shrink-0 font-medium px-4 sm:px-5"
                >
                  Send
                </Button>
              </form>

              <div className="flex items-center justify-between text-[11px] text-[#A39D93] px-1">
                <span>Empathetic, non-judgmental guidance</span>
                <span>Press Enter to send</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Suggested Questions & Quick Actions (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Actions ("Try This") */}
          <QuickActionsSection
            onOpenBreathing={() => setActiveModal('breathing')}
            onOpenGrounding={() => setActiveModal('grounding')}
            onOpenJournal={() => setActiveModal('journal')}
          />

          {/* Suggested Questions */}
          <SuggestedQuestions
            onSelectPrompt={(prompt) => handleSendMessage(prompt)}
            disabled={isGenerating}
          />

          {/* Gentle Crisis Resources Trigger (Optional reassurance) */}
          <div className="p-3.5 rounded-2xl bg-[#FAF6EE] border border-[#E4DACA] text-xs text-[#77736B] space-y-2">
            <div className="flex items-center gap-2 font-semibold text-[#403B35]">
              <HeartHandshake className="w-4 h-4 text-[#829675]" />
              <span>Need Immediate Care?</span>
            </div>
            <p className="leading-relaxed">
              If you ever feel unsafe or need someone to talk to right now, free confidential help is accessible 24/7.
            </p>
            <button
              type="button"
              onClick={() => setShowCrisisPanel(true)}
              className="text-xs text-[#829675] font-semibold hover:underline inline-flex items-center gap-1"
            >
              <span>View Crisis Helplines & Resources</span>
            </button>
          </div>

        </div>

      </div>

      {/* Modals */}
      <GuidedBreathingModal
        isOpen={activeModal === 'breathing'}
        onClose={() => setActiveModal(null)}
      />

      <GroundingExerciseModal
        isOpen={activeModal === 'grounding'}
        onClose={() => setActiveModal(null)}
      />

      <JournalPromptModal
        isOpen={activeModal === 'journal'}
        onClose={() => setActiveModal(null)}
      />

      <ClearChatModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={handleConfirmClearChat}
      />

    </div>
  );
};
