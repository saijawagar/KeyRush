import React, { useState } from 'react';
import { MOCK_LEADERBOARD_DATA, COLLEGES_LIST, LeaderboardEntry } from '../data/mockLeaderboard';
import { UserProfile } from '../types/gamification';
import { Trophy, Search, Filter, ShieldCheck, Flame, Zap, Award } from 'lucide-react';

interface LeaderboardProps {
  userProfile: UserProfile;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ userProfile }) => {
  const [activeTab, setActiveTab] = useState<'Global' | 'Weekly' | 'Daily' | 'College'>('Global');
  const [selectedCollege, setSelectedCollege] = useState<string>('All Colleges');
  const [searchQuery, setSearchQuery] = useState('');

  // Inject current user into leaderboard
  const currentUserEntry: LeaderboardEntry = {
    rank: 0,
    userId: userProfile.id,
    username: `${userProfile.username} (You)`,
    avatar: userProfile.avatar || '🎓',
    college: userProfile.college,
    major: userProfile.major,
    wpm: userProfile.bestWpm,
    accuracy: userProfile.averageAccuracy,
    testsCompleted: userProfile.totalTests,
    xp: userProfile.xp,
    level: userProfile.level,
    streak: userProfile.streak,
    isCurrentUser: true
  };

  const combinedList = [...MOCK_LEADERBOARD_DATA, currentUserEntry]
    .sort((a, b) => b.wpm - a.wpm)
    .map((item, idx) => ({ ...item, rank: idx + 1 }));

  const filteredEntries = combinedList.filter(item => {
    // College filter
    if (selectedCollege !== 'All Colleges' && item.college !== selectedCollege) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.username.toLowerCase().includes(q) ||
        item.college.toLowerCase().includes(q) ||
        item.major.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-amber-950/30 via-purple-950/20 to-[#12141c] border border-amber-500/20">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4" /> Collegiate Arena Rankings
          </div>
          <h2 className="text-2xl md:text-3xl font-black font-display text-white">
            Global & Campus Leaderboards
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Compete with students worldwide. Rank up by pushing higher WPM, accuracy, and practice streaks.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1 bg-[#181b26] p-1.5 rounded-2xl border border-[#262b3d]">
          {(['Global', 'Weekly', 'Daily', 'College'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-purple-600 text-white shadow-glow-purple font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#12141c] border border-[#262b3d]">
        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#181b26] border border-[#262b3d] text-sm w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search student or university..."
            className="bg-transparent text-slate-200 text-xs outline-none w-full"
          />
        </div>

        {/* College Dropdown */}
        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={selectedCollege}
            onChange={e => setSelectedCollege(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#181b26] border border-[#262b3d] text-slate-300 text-xs outline-none cursor-pointer"
          >
            {COLLEGES_LIST.map(col => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Leaderboard Table Card */}
      <div className="p-6 rounded-3xl bg-[#12141c] border border-[#262b3d] overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-[#262b3d] text-slate-500 font-sans uppercase">
              <th className="pb-4 font-semibold w-16">Rank</th>
              <th className="pb-4 font-semibold">Student</th>
              <th className="pb-4 font-semibold">University</th>
              <th className="pb-4 font-semibold">WPM</th>
              <th className="pb-4 font-semibold">Accuracy</th>
              <th className="pb-4 font-semibold">Level & XP</th>
              <th className="pb-4 font-semibold">Streak</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#262b3d]/60">
            {filteredEntries.map(entry => {
              const isCurrentUser = entry.isCurrentUser;
              return (
                <tr
                  key={entry.userId}
                  className={`transition-colors ${
                    isCurrentUser
                      ? 'bg-purple-950/40 text-purple-200 border-l-2 border-purple-500 font-medium'
                      : 'hover:bg-[#181b26]/50 text-slate-300'
                  }`}
                >
                  {/* Rank */}
                  <td className="py-3.5 pl-2 font-bold font-sans">
                    {entry.rank === 1 ? (
                      <span className="text-amber-400 flex items-center gap-1">🥇 #1</span>
                    ) : entry.rank === 2 ? (
                      <span className="text-slate-300 flex items-center gap-1">🥈 #2</span>
                    ) : entry.rank === 3 ? (
                      <span className="text-amber-600 flex items-center gap-1">🥉 #3</span>
                    ) : (
                      <span className="text-slate-500">#{entry.rank}</span>
                    )}
                  </td>

                  {/* Student */}
                  <td className="py-3.5">
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{entry.avatar}</span>
                      <div className="flex flex-col">
                        <span className={`font-sans font-bold ${isCurrentUser ? 'text-purple-300' : 'text-white'}`}>
                          {entry.username}
                        </span>
                        <span className="text-[10px] text-slate-500 font-sans">{entry.major}</span>
                      </div>
                    </div>
                  </td>

                  {/* College */}
                  <td className="py-3.5 font-sans font-medium text-slate-300">
                    {entry.college}
                  </td>

                  {/* WPM */}
                  <td className="py-3.5 text-base font-bold text-purple-400">
                    {entry.wpm}
                  </td>

                  {/* Accuracy */}
                  <td className="py-3.5 text-emerald-400 font-bold">
                    {entry.accuracy}%
                  </td>

                  {/* Level & XP */}
                  <td className="py-3.5">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-300 font-sans text-[11px]">Level {entry.level}</span>
                      <span className="text-[10px] text-slate-500">{entry.xp.toLocaleString()} XP</span>
                    </div>
                  </td>

                  {/* Streak */}
                  <td className="py-3.5 text-amber-400 font-bold flex items-center gap-1 mt-1">
                    <Flame className="w-3.5 h-3.5 fill-amber-400" /> {entry.streak}d
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredEntries.length === 0 && (
          <div className="py-12 text-center text-slate-500 text-sm">
            No students found matching your filters.
          </div>
        )}
      </div>
    </div>
  );
};
