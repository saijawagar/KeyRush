import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { TypingSessionResult } from '../types/typing';
import { UserProfile } from '../types/gamification';

const DEFAULT_URL = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_SUPABASE_URL || '';
const DEFAULT_KEY = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_SUPABASE_ANON_KEY || '';

let client: SupabaseClient | null = null;

export function initSupabase(url?: string, key?: string): SupabaseClient | null {
  const finalUrl = url || localStorage.getItem('keyrush_supabase_url') || DEFAULT_URL;
  const finalKey = key || localStorage.getItem('keyrush_supabase_key') || DEFAULT_KEY;

  if (finalUrl && finalKey) {
    try {
      client = createClient(finalUrl, finalKey);
      return client;
    } catch {
      return null;
    }
  }
  return null;
}

export function getSupabase(): SupabaseClient | null {
  if (!client) {
    client = initSupabase();
  }
  return client;
}

export const supabaseService = {
  isConnected(): boolean {
    return !!getSupabase();
  },

  async syncSession(session: TypingSessionResult, profile: UserProfile): Promise<boolean> {
    const sb = getSupabase();
    if (!sb) return false;
    try {
      const { error } = await sb.from('typing_sessions').insert([{
        user_id: profile.id,
        username: profile.username,
        college: profile.college,
        wpm: session.wpm,
        raw_wpm: session.rawWpm,
        accuracy: session.accuracy,
        duration: session.duration,
        mode: session.mode,
        category: session.category || null,
        created_at: new Date(session.timestamp).toISOString()
      }]);
      return !error;
    } catch {
      return false;
    }
  },

  async fetchLeaderboard(): Promise<any[] | null> {
    const sb = getSupabase();
    if (!sb) return null;
    try {
      const { data, error } = await sb
        .from('typing_sessions')
        .select('*')
        .order('wpm', { ascending: false })
        .limit(50);
      if (error) return null;
      return data;
    } catch {
      return null;
    }
  }
};
