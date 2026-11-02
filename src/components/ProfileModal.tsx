import React, { useState } from 'react';
import { UserProfile, Achievement } from '../types/gamification';
import { storage } from '../services/storage';
import { COLLEGES_LIST } from '../data/mockLeaderboard';
import {
  X,
  User,
  Award,
  Sparkles,
  Lock,
  CheckCircle2,
  Trash2,
  Save,
  GraduationCap
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  achievements: Achievement[];
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
}

const AVATAR_OPTIONS = ['🎓', '⚡', '🚀', '💻', '🧠', '🏎️', '🛡️', '🦉', '👑', '🦀', '🦾', '☕'];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  achievements,
  onUpdateProfile
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'achievements'>('details');
  const [username, setUsername] = useState(profile.username);
  const [college, setCollege] = useState(profile.college);
  const [major, setMajor] = useState(profile.major);
  const [bio, setBio] = useState(profile.bio);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [saveToast, setSaveToast] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateProfile({
      username,
      college,
      major,
      bio,
      avatar
    });
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const unlockedCount = achievements.filter(a => profile.achievements?.includes(a.id)).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-combo-bounce">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#12141c] border border-[#262b3d] shadow-2xl p-6 md:p-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#262b3d]">
          <div className="flex items-center gap-2.5">
            <User className="w-5 h-5 text-purple-400" />
            <h3 className="text-xl font-bold font-display text-white">Student Profile & Honors</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 border-b border-[#262b3d] pb-2">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'details'
                ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-4 h-4" /> Student Credentials
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'achievements'
                ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-4 h-4" /> Achievements ({unlockedCount}/{achievements.length})
          </button>
        </div>

        {activeTab === 'details' ? (
          <div className="flex flex-col gap-5">
            {/* Avatar Picker */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Avatar Persona
              </label>
              <div className="flex flex-wrap gap-2">
                {AVATAR_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    onClick={() => setAvatar(opt)}
                    className={`w-11 h-11 rounded-2xl text-xl flex items-center justify-center transition-all ${
                      avatar === opt
                        ? 'bg-purple-600 shadow-glow-purple scale-110 border border-purple-400'
                        : 'bg-[#181b26] border border-[#262b3d] hover:bg-slate-800'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Username */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Display Name / Handle
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#181b26] border border-[#262b3d] text-sm text-white outline-none focus:border-purple-500"
              />
            </div>

            {/* University & Major Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  University / College
                </label>
                <select
                  value={college}
                  onChange={e => setCollege(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#181b26] border border-[#262b3d] text-sm text-white outline-none cursor-pointer focus:border-purple-500"
                >
                  {COLLEGES_LIST.filter(c => c !== 'All Colleges').map(col => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Academic Major
                </label>
                <input
                  type="text"
                  value={major}
                  onChange={e => setMajor(e.target.value)}
                  placeholder="e.g. Computer Science"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181b26] border border-[#262b3d] text-sm text-white outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Student Bio
              </label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                rows={2}
                placeholder="What are your typing and collegiate goals?"
                className="w-full px-4 py-2 rounded-xl bg-[#181b26] border border-[#262b3d] text-sm text-white outline-none resize-none focus:border-purple-500"
              />
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-between pt-2">
              {saveToast && (
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Profile saved successfully!
                </span>
              )}
              <div className="ml-auto">
                <button
                  onClick={handleSave}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-glow-purple flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save Profile
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Achievements Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[55vh] overflow-y-auto pr-1">
            {achievements.map(ach => {
              const isUnlocked = profile.achievements?.includes(ach.id);
              return (
                <div
                  key={ach.id}
                  className={`p-4 rounded-2xl border flex items-start gap-3 transition-all ${
                    isUnlocked
                      ? 'bg-[#181b26] border-purple-500/40 shadow-glow-purple'
                      : 'bg-[#12141c] border-[#262b3d] opacity-50'
                  }`}
                >
                  <div className={`text-2xl p-2 rounded-xl ${isUnlocked ? 'bg-purple-500/10' : 'bg-slate-800'}`}>
                    {isUnlocked ? ach.icon : <Lock className="w-5 h-5 text-slate-500" />}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{ach.title}</h4>
                      <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                        ach.rarity === 'legendary'
                          ? 'bg-amber-500/20 text-amber-300'
                          : ach.rarity === 'epic'
                          ? 'bg-purple-500/20 text-purple-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {ach.rarity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{ach.description}</p>
                    {isUnlocked ? (
                      <span className="text-[10px] text-emerald-400 font-bold mt-2 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Unlocked
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-mono mt-2">
                        Requirement: {ach.target}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
