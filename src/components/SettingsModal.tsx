import React, { useState } from 'react';
import { UserProfile } from '../types/gamification';
import { soundManager } from '../utils/audio';
import { initSupabase } from '../services/supabase';
import {
  X,
  Volume2,
  VolumeX,
  Palette,
  Type,
  Sliders,
  Database,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile
}) => {
  const [supabaseUrl, setSupabaseUrl] = useState(
    localStorage.getItem('keyrush_supabase_url') || ''
  );
  const [supabaseKey, setSupabaseKey] = useState(
    localStorage.getItem('keyrush_supabase_key') || ''
  );
  const [supabaseStatus, setSupabaseStatus] = useState<'idle' | 'success' | 'error'>('idle');

  if (!isOpen) return null;

  const testAudio = (type: 'cherry-blue' | 'cherry-brown' | 'thocky' | 'cyber') => {
    soundManager.setMuted(false);
    soundManager.playKey(type, false);
  };

  const handleSaveSupabase = () => {
    if (supabaseUrl && supabaseKey) {
      localStorage.setItem('keyrush_supabase_url', supabaseUrl);
      localStorage.setItem('keyrush_supabase_key', supabaseKey);
      const client = initSupabase(supabaseUrl, supabaseKey);
      if (client) {
        setSupabaseStatus('success');
      } else {
        setSupabaseStatus('error');
      }
    } else {
      localStorage.removeItem('keyrush_supabase_url');
      localStorage.removeItem('keyrush_supabase_key');
      setSupabaseStatus('idle');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-combo-bounce">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#12141c] border border-[#262b3d] shadow-2xl p-6 md:p-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#262b3d]">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-purple-400" />
            <h3 className="text-xl font-bold font-display text-white">System Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Themes */}
        <div className="flex flex-col gap-3">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Palette className="w-4 h-4 text-purple-400" /> Color Theme
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {[
              { id: 'dark', label: 'Charcoal Dark', color: '#090a0f' },
              { id: 'cyberpunk', label: 'Cyberpunk Neon', color: '#060814' },
              { id: 'midnight', label: 'Midnight Blue', color: '#030712' },
              { id: 'dracula', label: 'Dracula Violet', color: '#181926' },
              { id: 'minimal', label: 'Minimal Monokai', color: '#121314' }
            ].map(theme => (
              <button
                key={theme.id}
                onClick={() => {
                  onUpdateProfile({ theme: theme.id as any });
                  document.documentElement.setAttribute('data-theme', theme.id);
                }}
                className={`p-3 rounded-2xl border text-left text-xs font-semibold flex items-center gap-2 transition-all ${
                  profile.theme === theme.id
                    ? 'border-purple-500 bg-purple-600/15 text-purple-300 shadow-glow-purple'
                    : 'border-[#262b3d] bg-[#181b26] text-slate-400 hover:text-slate-200'
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-slate-700"
                  style={{ backgroundColor: theme.color }}
                />
                <span className="truncate">{theme.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Section 2: Mechanical Switch Sound Generator */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-purple-400" /> Mechanical Key Sound
            </label>
            <button
              onClick={() => onUpdateProfile({ soundEnabled: !profile.soundEnabled })}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                profile.soundEnabled
                  ? 'bg-purple-600 text-white shadow-glow-purple'
                  : 'bg-slate-800 text-slate-500'
              }`}
            >
              {profile.soundEnabled ? 'Enabled' : 'Muted'}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'thocky', label: 'Holy Panda (Thock)' },
              { id: 'cherry-blue', label: 'Cherry MX Blue' },
              { id: 'cherry-brown', label: 'Cherry MX Brown' },
              { id: 'cyber', label: 'Cyber Beep' }
            ].map(sw => (
              <button
                key={sw.id}
                onClick={() => {
                  onUpdateProfile({ soundType: sw.id as any });
                  testAudio(sw.id as any);
                }}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center text-center transition-all ${
                  profile.soundType === sw.id
                    ? 'border-purple-500 bg-purple-600/15 text-purple-300 shadow-glow-purple'
                    : 'border-[#262b3d] bg-[#181b26] text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{sw.label}</span>
                <span className="text-[10px] text-purple-400 mt-1 font-mono">Test Click</span>
              </button>
            ))}
          </div>

          {/* Volume slider */}
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-slate-400">Volume</span>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={profile.soundVolume}
              onChange={e => {
                const vol = parseFloat(e.target.value);
                onUpdateProfile({ soundVolume: vol });
                soundManager.setVolume(vol);
              }}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <span className="text-xs font-mono text-slate-400">
              {Math.round(profile.soundVolume * 100)}%
            </span>
          </div>
        </div>

        {/* Section 3: Caret and Typography */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Caret Style */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Caret Style
            </label>
            <div className="flex items-center gap-1.5 bg-[#181b26] p-1.5 rounded-2xl border border-[#262b3d]">
              {(['line', 'block', 'underline'] as const).map(style => (
                <button
                  key={style}
                  onClick={() => onUpdateProfile({ caretStyle: style })}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                    profile.caretStyle === style
                      ? 'bg-purple-600 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Font Size
            </label>
            <div className="flex items-center gap-1.5 bg-[#181b26] p-1.5 rounded-2xl border border-[#262b3d]">
              {(['sm', 'md', 'lg', 'xl'] as const).map(size => (
                <button
                  key={size}
                  onClick={() => onUpdateProfile({ fontSize: size })}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-semibold uppercase transition-all ${
                    profile.fontSize === size
                      ? 'bg-purple-600 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Cloud & Supabase Integration (Optional) */}
        <div className="p-4 rounded-2xl bg-[#090a0f] border border-[#262b3d] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" /> Supabase Cloud Database (Optional)
            </label>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">
              Offline Storage Active
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            KeyRush stores all your sessions, records, and XP safely in local storage by default. You can optionally connect your own Supabase project URL & Anon Key to sync to PostgreSQL.
          </p>

          <input
            type="text"
            value={supabaseUrl}
            onChange={e => setSupabaseUrl(e.target.value)}
            placeholder="https://xyzcompany.supabase.co"
            className="w-full px-3 py-2 rounded-xl bg-[#181b26] border border-[#262b3d] text-xs font-mono text-slate-200 outline-none focus:border-cyan-500"
          />
          <input
            type="password"
            value={supabaseKey}
            onChange={e => setSupabaseKey(e.target.value)}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            className="w-full px-3 py-2 rounded-xl bg-[#181b26] border border-[#262b3d] text-xs font-mono text-slate-200 outline-none focus:border-cyan-500"
          />

          <div className="flex items-center justify-between mt-1">
            {supabaseStatus === 'success' && (
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle className="w-3.5 h-3.5" /> Supabase Connected!
              </span>
            )}
            {supabaseStatus === 'error' && (
              <span className="text-xs text-rose-400 flex items-center gap-1 font-semibold">
                <AlertCircle className="w-3.5 h-3.5" /> Invalid Credentials
              </span>
            )}
            {supabaseStatus === 'idle' && <div />}

            <button
              onClick={handleSaveSupabase}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
            >
              Save Credentials
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-glow-purple"
        >
          Save & Return to Arena
        </button>
      </div>
    </div>
  );
};
