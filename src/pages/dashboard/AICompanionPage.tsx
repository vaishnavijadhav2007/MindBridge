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
import { sendCompanionMessage } from '../../services/geminiChatService';
import { useWellness } from '../../context/WellnessContext';
import { useAuth } from '../../context/AuthContext';
import { 
  createConversationRecord, 
  saveChatMessageRecord, 
  fetchUserConversations, 
  fetchConversationMessages, 
  deleteUserConversation 
} from '../../services/chatHistoryService';
import { ShieldCheck, Lock } from 'lucide-react';

const WELCOME_TEXT = "Hi! I'm your MindBridge companion. You can talk to me about stress, studies, sleep, emotions, or anything affecting your well-being. What would you like to explore today?";

export const AICompanionPage: React.FC = () => {
  const { showToast } = useWellness();
  const { user, profile, updateProfile, isConfigured } = useAuth();

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
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isChatConsentEnabled, setIsChatConsentEnabled] = useState<boolean>(profile?.store_chat_consent ?? false);

  // Synchronize consent state when profile loads
  useEffect(() => {
    if (profile?.store_chat_consent !== undefined) {
      setIsChatConsentEnabled(profile.store_chat_consent);
    }
  }, [profile?.store_chat_consent]);

  // Load existing conversation if consent is enabled and user is logged in
  useEffect(() => {
    let isMounted = true;
    async function loadRecentChat() {
      if (!user?.id || !profile?.store_chat_consent || !isConfigured) return;
      try {
        const { data: convs } = await fetchUserConversations(user.id);
        if (convs && convs.length > 0 && isMounted) {
          const latest = convs[0];
          setActiveConversationId(latest.id);
          const { data: history } = await fetchConversationMessages(latest.id);
          if (history && history.length > 0 && isMounted) {
            setMessages(history);
          }
        }
      } catch {
        // Fall back gracefully to fresh conversation state
      }
    }
    loadRecentChat();
    return () => {
      isMounted = false;
    };
  }, [user?.id, profile?.store_chat_consent, isConfigured]);

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

  // Toggle user chat consent
  const handleToggleConsent = async () => {
    const nextVal = !isChatConsentEnabled;
    setIsChatConsentEnabled(nextVal);
    if (user) {
      await updateProfile({ store_chat_consent: nextVal });
    }
    showToast(
      nextVal
        ? 'Private chat saving enabled under your account.'
        : 'Ephemeral mode enabled (messages will not be saved).'
    );
  };

  // Handle message submission
  const handleSendMessage = async (messageText?: string) => {
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

    // If chat consent is enabled, save conversation and message to Supabase
    let currentConvId = activeConversationId;
    if (user?.id && isChatConsentEnabled && isConfigured) {
      try {
        if (!currentConvId) {
          const { data: createdConv } = await createConversationRecord(
            user.id,
            textToSend.slice(0, 45) || 'Wellness Reflection',
            true
          );
          if (createdConv) {
            currentConvId = createdConv.id;
            setActiveConversationId(createdConv.id);
          }
        }
        if (currentConvId) {
          await saveChatMessageRecord(currentConvId, user.id, 'user', textToSend);
        }
      } catch {
        // Continue smoothly even if background sync fails
      }
    }

    try {
      // Call secure Gemini Edge Function via Supabase client
      const companionResult = await sendCompanionMessage(textToSend, messages, Boolean(user));

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: companionResult.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction: companionResult.suggestedAction,
        isCrisis: companionResult.isCrisis,
        isError: companionResult.isFallback && !!companionResult.error,
        errorMessage: companionResult.error,
        retryText: companionResult.isFallback && !!companionResult.error ? textToSend : undefined,
        modelBadge: companionResult.isFallback
          ? (companionResult.error ? 'Fallback Mode' : 'Local Mode')
          : (companionResult.model || 'Gemini 2.5 Flash'),
      };

      setMessages((prev) => [...prev, aiMsg]);

      if (companionResult.isCrisis) {
        setShowCrisisPanel(true);
      }

      // Persist AI response if conversation is active
      if (user?.id && isChatConsentEnabled && isConfigured && currentConvId) {
        try {
          await saveChatMessageRecord(currentConvId, user.id, 'assistant', companionResult.reply);
        } catch {
          // Keep resilient
        }
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: "I'm having a little trouble connecting right now. Please take a gentle breath, and we can try again in a moment.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
        errorMessage: err.message || 'Network error.',
        retryText: textToSend,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle retrying a failed message without duplicating the user's message
  const handleRetryMessage = async (failedText: string, failedMessageId?: string) => {
    if (!failedText || isGenerating) return;

    // Filter out the failed message from UI so the user does not see stacked error cards
    const cleanedMessages = failedMessageId
      ? messages.filter((m) => m.id !== failedMessageId)
      : messages;

    setMessages(cleanedMessages);
    setIsGenerating(true);

    try {
      const companionResult = await sendCompanionMessage(failedText, cleanedMessages, Boolean(user));

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: companionResult.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction: companionResult.suggestedAction,
        isCrisis: companionResult.isCrisis,
        isError: companionResult.isFallback && !!companionResult.error,
        errorMessage: companionResult.error,
        retryText: companionResult.isFallback && !!companionResult.error ? failedText : undefined,
        modelBadge: companionResult.isFallback
          ? (companionResult.error ? 'Fallback Mode' : 'Local Mode')
          : (companionResult.model || 'Gemini 2.5 Flash'),
      };

      setMessages((prev) => [...prev, aiMsg]);

      if (companionResult.isCrisis) {
        setShowCrisisPanel(true);
      }

      if (user?.id && isChatConsentEnabled && isConfigured && activeConversationId) {
        try {
          await saveChatMessageRecord(activeConversationId, user.id, 'assistant', companionResult.reply);
        } catch {
          // Keep resilient
        }
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: "I'm having a little trouble connecting right now. Please take a gentle breath, and we can try again in a moment.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
        errorMessage: err.message || 'Network error.',
        retryText: failedText,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Start fresh chat
  const handleStartNewChat = () => {
    setActiveConversationId(null);
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
  const handleConfirmClearChat = async () => {
    if (user?.id && activeConversationId && isConfigured) {
      try {
        await deleteUserConversation(user.id, activeConversationId);
      } catch {
        // Graceful fallback
      }
    }
    setActiveConversationId(null);
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
            {/* Chat Top Subheader with Controls & Privacy Mode */}
            <div className="p-3.5 px-4 sm:px-5 bg-[#FAF6EE] border-b border-[#E4DACA] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#829675] animate-pulse" />
                <span className="text-xs font-semibold text-[#403B35]">Active Session</span>
                
                {/* Privacy Consent Mode Pill */}
                <button
                  type="button"
                  onClick={handleToggleConsent}
                  className={`ml-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border flex items-center gap-1 transition-all ${
                    isChatConsentEnabled
                      ? 'bg-[#E9EFE7] border-[#829675] text-[#42523D] hover:bg-[#dfe9dc]'
                      : 'bg-[#F3EBDD]/80 border-[#E4DACA] text-[#77736B] hover:text-[#403B35]'
                  }`}
                  title={
                    isChatConsentEnabled
                      ? 'Private storage is active. Click to switch to ephemeral mode.'
                      : 'Ephemeral mode. Click to enable encrypted cloud history with your consent.'
                  }
                >
                  {isChatConsentEnabled ? (
                    <ShieldCheck className="w-3 h-3 text-[#829675]" />
                  ) : (
                    <Lock className="w-3 h-3 text-[#77736B]" />
                  )}
                  <span>{isChatConsentEnabled ? 'Saved Privately' : 'Ephemeral Mode'}</span>
                </button>
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
                  onRetry={(retryText, messageId) => handleRetryMessage(retryText, messageId)}
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
