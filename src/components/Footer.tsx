import React from 'react';
import { Zap, Heart, Database, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onNavigateTab: (tab: string) => void;
  isSupabaseConnected?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab, isSupabaseConnected = false }) => {
  return (
    <footer className="w-full mt-auto border-t border-[#262b3d]/60 bg-[#090a0f] py-8 px-4 text-xs text-slate-500">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Brand info */}
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-purple-400" />
          <span className="font-semibold text-slate-400">KeyRush</span>
          <span>•</span>
          <span>Competitive typing tutor built for college students</span>
        </div>

        {/* Center: Keyboard shortcuts */}
        <div className="hidden sm:flex items-center gap-4 font-mono text-[11px]">
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-[#181b26] border border-slate-700 text-slate-400">
              Tab
            </kbd>{' '}
            restart
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-[#181b26] border border-slate-700 text-slate-400">
              Space
            </kbd>{' '}
            next word
          </span>
        </div>

        {/* Right: Storage status */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#12141c] border border-[#262b3d] text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
            <span className="text-slate-400 font-mono">Offline-First Engine</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
