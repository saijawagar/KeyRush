import React, { useEffect } from 'react';
import { Achievement } from '../types/gamification';
import { Award, Sparkles, X } from 'lucide-react';

interface AchievementToastProps {
  achievement: Achievement | null;
  onDismiss: () => void;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({ achievement, onDismiss }) => {
  useEffect(() => {
    if (achievement) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onDismiss]);

  if (!achievement) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 p-4 rounded-2xl bg-[#12141c] border-2 border-purple-500 shadow-glow-purple animate-combo-bounce text-left max-w-sm">
      <div className="text-3xl p-2.5 rounded-xl bg-purple-500/20 text-purple-300 flex-shrink-0">
        {achievement.icon}
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> Achievement Unlocked!
        </div>
        <h4 className="text-sm font-bold text-white mt-0.5">{achievement.title}</h4>
        <p className="text-xs text-slate-400 line-clamp-1">{achievement.description}</p>
      </div>

      <button
        onClick={onDismiss}
        className="text-slate-500 hover:text-white p-1 ml-auto self-start"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
