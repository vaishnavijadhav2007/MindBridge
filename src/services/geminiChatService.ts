import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { generateCompanionReply } from './aiMockService';
import { ChatMessage } from '../components/companion/ChatMessageBubble';

export interface CompanionReplyResult {
  success: boolean;
  reply: string;
  suggestedAction?: 'breathing' | 'grounding' | 'journal';
  isCrisis?: boolean;
  isFallback?: boolean;
  error?: string;
  model?: string;
}

/**
 * Sends a message to the Gemini-powered AI Companion via the Supabase Edge Function 'gemini-chat'.
 *
 * Requirements fulfilled:
 * - Never exposes GEMINI_API_KEY to frontend.
 * - Authenticates the request using the active Supabase session JWT.
 * - Does not send mood tracking history or sensitive health data to Gemini.
 * - Provides graceful fallback and actionable error messages with retry support.
 */
export async function sendCompanionMessage(
  message: string,
  history: ChatMessage[],
  isAuthenticated: boolean
): Promise<CompanionReplyResult> {
  const trimmed = message.trim();
  if (!trimmed) {
    return {
      success: false,
      reply: 'Please type a message to begin.',
      error: 'Message is empty.',
    };
  }

  // 1. If Supabase is configured and user is authenticated, invoke the secure server-side Edge Function
  if (isSupabaseConfigured && isAuthenticated) {
    try {
      // Format recent messages for context (strip IDs and keep text & sender)
      const contextHistory = history
        .slice(-6)
        .map((m) => ({ sender: m.sender, text: m.text }));

      // supabase.functions.invoke automatically attaches the session JWT in the Authorization header
      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: {
          message: trimmed,
          history: contextHistory,
        },
      });

      // Successful Gemini response
      if (!error && data && typeof data.reply === 'string' && data.reply.trim().length > 0) {
        return {
          success: true,
          reply: data.reply,
          suggestedAction: data.suggestedAction,
          isCrisis: Boolean(data.isCrisis),
          model: data.model || 'Gemini 2.0 Flash',
          isFallback: false,
        };
      }

      // If an error or unexpected response structure occurred, extract detailed diagnostic message
      let extractedError = '';

      if (error) {
        // FunctionsHttpError contains the response in context
        try {
          if ((error as any).context && typeof (error as any).context.json === 'function') {
            const errJson = await (error as any).context.json();
            extractedError = errJson?.error || errJson?.message || '';
          }
        } catch {
          // ignore context parsing error
        }
        if (!extractedError) {
          extractedError = error.message || 'Edge Function call failed.';
        }
      } else if (data) {
        // Status was 200, but data.reply is missing
        if (typeof data.message === 'string' && data.message.includes('Hello')) {
          extractedError =
            'The "gemini-chat" Edge Function in your Supabase project is currently running the default "Hello World" template instead of the Gemini code. Please deploy the code from supabase/functions/gemini-chat/index.ts in your Supabase Dashboard.';
        } else if (data.error) {
          extractedError = data.error;
        } else {
          extractedError = data.message || 'Edge Function returned an invalid response structure without a reply.';
        }
      }

      // Identify specific setup issues
      const isNotDeployed =
        extractedError.includes('Failed to send a request') ||
        extractedError.includes('404') ||
        extractedError.includes('NOT_FOUND') ||
        extractedError.includes('FunctionsFetchError') ||
        extractedError.includes('Requested function was not found');

      const isSecretMissing = extractedError.includes('GEMINI_API_KEY');

      let userFacingError = extractedError;
      if (isNotDeployed) {
        userFacingError =
          'The "gemini-chat" Edge Function has not been deployed to your Supabase project yet. Please create and deploy it in your Supabase Dashboard.';
      } else if (isSecretMissing) {
        userFacingError =
          'GEMINI_API_KEY is not configured in Supabase Edge Function Secrets. In your Supabase Dashboard, go to Project Settings -> Edge Functions -> Secrets and add GEMINI_API_KEY.';
      }

      // Gracefully fall back to local empathetic engine so the user isn't stuck with a broken UI
      const fallbackResult = generateCompanionReply(trimmed);
      return {
        success: false,
        reply: fallbackResult.reply,
        suggestedAction: fallbackResult.suggestedAction,
        isCrisis: fallbackResult.isCrisis,
        isFallback: true,
        error: userFacingError,
      };
    } catch (err: any) {
      const fallbackResult = generateCompanionReply(trimmed);
      return {
        success: false,
        reply: fallbackResult.reply,
        suggestedAction: fallbackResult.suggestedAction,
        isCrisis: fallbackResult.isCrisis,
        isFallback: true,
        error: err.message || 'Unable to connect to Gemini Edge Function.',
      };
    }
  }

  // 2. Unauthenticated mode: Use local empathetic guidance engine
  const localReply = generateCompanionReply(trimmed);
  return {
    success: true,
    reply: localReply.reply,
    suggestedAction: localReply.suggestedAction,
    isCrisis: localReply.isCrisis,
    isFallback: true,
  };
}
