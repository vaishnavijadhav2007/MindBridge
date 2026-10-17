import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DbChatConversation, DbChatMessage } from '../types/database';

export interface ChatMessageRecord {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

/**
 * Fetch all user conversations (only for consenting user)
 */
export async function fetchUserConversations(userId: string): Promise<{ data: DbChatConversation[]; error: string | null }> {
  if (!isSupabaseConfigured || !userId) {
    return { data: [], error: null };
  }

  try {
    const { data, error } = await supabase
      .from('chat_conversations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) return { data: [], error: error.message };
    return { data: (data as DbChatConversation[]) || [], error: null };
  } catch (err: any) {
    return { data: [], error: err.message || 'Failed to load conversations.' };
  }
}

/**
 * Create a new conversation record in Supabase
 */
export async function createConversationRecord(
  userId: string,
  title: string,
  consentToStore: boolean
): Promise<{ data: DbChatConversation | null; error: string | null }> {
  if (!isSupabaseConfigured || !userId || !consentToStore) {
    return { data: null, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('chat_conversations')
      .insert({
        user_id: userId,
        title: title.slice(0, 60),
        consent_to_store: consentToStore,
      })
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data: data as DbChatConversation, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || 'Failed to create conversation.' };
  }
}

/**
 * Store an individual chat message in Supabase
 */
export async function saveChatMessageRecord(
  conversationId: string,
  userId: string,
  role: 'user' | 'assistant',
  content: string
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured || !userId || !conversationId) {
    return { error: null };
  }

  try {
    const { error } = await supabase
      .from('chat_messages')
      .insert({
        conversation_id: conversationId,
        user_id: userId,
        role: role,
        content: content,
      });

    if (error) return { error: error.message };
    return { error: null };
  } catch (err: any) {
    return { error: err.message || 'Failed to save message.' };
  }
}

/**
 * Fetch messages for a specific conversation
 */
export async function fetchConversationMessages(
  conversationId: string
): Promise<{ data: ChatMessageRecord[]; error: string | null }> {
  if (!isSupabaseConfigured || !conversationId) {
    return { data: [], error: null };
  }

  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) return { data: [], error: error.message };

    const mapped: ChatMessageRecord[] = (data as DbChatMessage[]).map((msg) => ({
      id: msg.id,
      sender: msg.role === 'user' ? 'user' : 'ai',
      text: msg.content,
      time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));

    return { data: mapped, error: null };
  } catch (err: any) {
    return { data: [], error: err.message || 'Failed to load conversation messages.' };
  }
}

/**
 * Delete a specific conversation and all associated messages (via cascade)
 */
export async function deleteUserConversation(
  userId: string,
  conversationId: string
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured || !userId) {
    return { error: null };
  }

  try {
    const { error } = await supabase
      .from('chat_conversations')
      .delete()
      .eq('id', conversationId)
      .eq('user_id', userId);

    if (error) return { error: error.message };
    return { error: null };
  } catch (err: any) {
    return { error: err.message || 'Failed to delete conversation.' };
  }
}

/**
 * Delete all conversations for the user
 */
export async function deleteAllUserConversations(userId: string): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured || !userId) {
    return { error: null };
  }

  try {
    const { error } = await supabase
      .from('chat_conversations')
      .delete()
      .eq('user_id', userId);

    if (error) return { error: error.message };
    return { error: null };
  } catch (err: any) {
    return { error: err.message || 'Failed to clear chat history.' };
  }
}
