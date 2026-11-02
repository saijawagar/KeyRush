import React, { useState } from 'react';
import { UserProfile, LevelInfo } from '../types/gamification';
import {
  Flame,
  Zap,
  Settings,
  User,
  GraduationCap,
  Trophy,
  BarChart2,
  Keyboard,
  Menu,
  X,
  Code,
  Shield,
  BookOpen
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  profile: UserProfile;
  levelInfo: LevelInfo;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  profile,
  levelInfo,
  onOpenSettings,
  onOpenProfile
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Home' },
    { id: 'practice', label: 'Practice' },
    { id: 'academic', label: 'Academic' },
    { id: 'code', label: 'Code' },
    { id: 'race', label: 'Race' },
    { id: 'survival', label: 'Survival' },
    { id: 'document', label: 'Assignment' },
    { id: 'leaderboard', label: 'Leaderboard' },
    { id: 'dashboard', label: 'Dashboard' }
  ];

  return (
    <nav className="w-full sticky top-0 z-50 bg-[#090a0f]/85 backdrop-blur-md border-b border-[#262b3d]/80 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => onSelectTab('landing')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center text-white shadow-glow-purple group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5 fill-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-black text-xl tracking-tight text-white flex items-center gap-1">
              Key<span className="text-purple-400">Rush</span>
            </span>
            <span className="text-[9px] font-mono text-slate-500 -mt-1 tracking-wider uppercase">
              Student Arena
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1 bg-[#12141c]/60 p-1 rounded-2xl border border-[#262b3d]/60 text-xs font-semibold">
          {navItems.map(item => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-glow-purple font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right Section: Level, Streak & User controls */}
        <div className="flex items-center gap-3">
          {/* Streak pill */}
          <div
            title={`Active ${profile.streak}-day streak!`}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-bold"
          >
            <Flame className="w-3.5 h-3.5 fill-amber-400" />
            <span>{profile.streak}d</span>
          </div>

          {/* Level pill */}
          <div
            title={`Level ${levelInfo.level}: ${levelInfo.title}`}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold"
          >
            <span className="text-[10px] uppercase tracking-wider text-slate-400">Lvl</span>
            <span className="font-mono font-bold text-purple-400">{levelInfo.level}</span>
          </div>

          {/* Settings button */}
          <button
            onClick={onOpenSettings}
            title="Settings (Sound, Themes, Caret)"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Profile Avatar button */}
          <button
            onClick={onOpenProfile}
            title="Profile & Customization"
            className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-[#181b26] hover:bg-slate-800 border border-[#262b3d] transition-colors"
          >
            <span className="text-base">{profile.avatar || '🎓'}</span>
            <span className="text-xs font-semibold text-slate-300 hidden md:inline truncate max-w-[80px]">
              {profile.username}
            </span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="lg:hidden p-2 text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t border-[#262b3d] flex flex-col gap-1 px-2 pb-2">
          {navItems.map(item => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold text-left transition-all ${
                  isActive
                    ? 'bg-purple-600 text-white font-bold'
                    : 'text-slate-400 hover:bg-slate-800/60 text-slate-200'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
};
