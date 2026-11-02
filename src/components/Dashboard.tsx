import React from 'react';
import { UserProfile, LevelInfo } from '../types/gamification';
import { TypingSessionResult } from '../types/typing';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import {
  Flame,
  Award,
  Zap,
  Clock,
  Target,
  BarChart3,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Cpu,
  CheckCircle2
} from 'lucide-react';

interface DashboardProps {
  profile: UserProfile;
  levelInfo: LevelInfo;
  sessions: TypingSessionResult[];
  onStartDailyChallenge: () => void;
  onNavigateTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  profile,
  levelInfo,
  sessions,
  onStartDailyChallenge,
  onNavigateTab
}) => {
  // Format progression chart data from real recorded sessions
  const progressionData = [...sessions].reverse().map((s, idx) => ({
    testNum: `#${idx + 1}`,
    wpm: s.wpm,
    rawWpm: s.rawWpm,
    accuracy: s.accuracy,
    mode: s.mode
  }));

  // Group tests by mode for mode breakdown
  const modeCounts: Record<string, number> = {};
  sessions.forEach(s => {
    modeCounts[s.mode] = (modeCounts[s.mode] || 0) + 1;
  });

  const modeChartData = Object.entries(modeCounts).map(([mode, count]) => ({
    mode: mode.charAt(0).toUpperCase() + mode.slice(1),
    tests: count
  }));

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const hrs = Math.floor(mins / 60);
    if (hrs > 0) return `${hrs}h ${mins % 60}m`;
    return `${mins}m ${seconds % 60}s`;
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
      {/* Student Profile Card Banner */}
      <div className="p-8 rounded-3xl bg-[#12141c] border border-[#262b3d] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-3xl shadow-glow-purple">
            {profile.avatar || '🎓'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold font-display text-white">{profile.username}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/15 text-purple-400 border border-purple-500/20">
                {profile.college}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Major: <strong className="text-slate-300">{profile.major}</strong> • Level {levelInfo.level} ({levelInfo.title})
            </p>
          </div>
        </div>

        {/* Level Progression Bar */}
        <div className="w-full md:w-64 flex flex-col gap-2 p-4 rounded-2xl bg-[#181b26] border border-[#262b3d]">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300">Level {levelInfo.level} Progress</span>
            <span className="font-mono text-purple-400 font-bold">{levelInfo.progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all duration-300"
              style={{ width: `${levelInfo.progressPercent}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-slate-500 text-right">
            {profile.xp} / {levelInfo.maxXp} XP
          </span>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Best WPM */}
        <div className="p-5 rounded-2xl bg-[#12141c] border border-[#262b3d]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Personal Best</span>
            <Zap className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl md:text-4xl font-black font-mono text-purple-400">
              {profile.bestWpm}
            </span>
            <span className="text-xs text-slate-500">WPM</span>
          </div>
          <span className="text-xs text-slate-400 mt-1 block">Avg: {profile.averageWpm} WPM</span>
        </div>

        {/* Accuracy */}
        <div className="p-5 rounded-2xl bg-[#12141c] border border-[#262b3d]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Accuracy</span>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl md:text-4xl font-black font-mono text-emerald-400">
              {profile.averageAccuracy}
            </span>
            <span className="text-xs text-slate-500">%</span>
          </div>
          <span className="text-xs text-slate-400 mt-1 block">Across {profile.totalTests} tests</span>
        </div>

        {/* Streak */}
        <div className="p-5 rounded-2xl bg-[#12141c] border border-[#262b3d]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Daily Streak</span>
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl md:text-4xl font-black font-mono text-amber-400">
              {profile.streak}
            </span>
            <span className="text-xs text-slate-500">Days</span>
          </div>
          <span className="text-xs text-slate-400 mt-1 block">Active Habit</span>
        </div>

        {/* Total Time Typed */}
        <div className="p-5 rounded-2xl bg-[#12141c] border border-[#262b3d]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Practice Time</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl md:text-3xl font-black font-mono text-cyan-400">
              {formatTime(profile.totalTimeTypedSeconds)}
            </span>
          </div>
          <span className="text-xs text-slate-400 mt-1 block">{profile.totalTests} Tests Done</span>
        </div>
      </div>

      {/* Daily Challenge Banner CTA */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/40 via-amber-950/20 to-[#12141c] border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" /> Today's Featured Challenge
          </div>
          <h3 className="text-xl font-bold font-display text-white">Daily Academic Sprint</h3>
          <p className="text-slate-400 text-xs mt-1">
            Maintain your {profile.streak}-day streak and earn +200 bonus XP on today's universal college prompt!
          </p>
        </div>
        <button
          onClick={onStartDailyChallenge}
          className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-glow-amber flex items-center gap-2 flex-shrink-0"
        >
          Take Daily Challenge <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Visual Charts: Progression Timeline */}
      <div className="p-6 rounded-3xl bg-[#12141c] border border-[#262b3d] flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <h3 className="text-base font-bold text-white">WPM & Accuracy Progression History</h3>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-purple-400">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400" /> WPM
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Accuracy %
            </span>
          </div>
        </div>

        <div className="h-56 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={progressionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262b3d" />
              <XAxis dataKey="testNum" stroke="#4f566b" fontSize={11} />
              <YAxis stroke="#4f566b" fontSize={11} domain={[0, 'auto']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#12141c',
                  borderColor: '#262b3d',
                  borderRadius: '12px',
                  color: '#f1f5f9',
                  fontFamily: 'JetBrains Mono',
                  fontSize: '12px'
                }}
              />
              <Line
                type="monotone"
                dataKey="wpm"
                name="WPM"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', r: 3 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="accuracy"
                name="Accuracy %"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Mode Distribution & Weak Keys Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Practice Breakdown Bar Chart */}
        <div className="p-6 rounded-3xl bg-[#12141c] border border-[#262b3d] flex flex-col gap-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" /> Mode Engagement Breakdown
          </h3>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modeChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262b3d" vertical={false} />
                <XAxis dataKey="mode" stroke="#4f566b" fontSize={11} />
                <YAxis stroke="#4f566b" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#12141c',
                    borderColor: '#262b3d',
                    borderRadius: '12px',
                    color: '#f1f5f9',
                    fontFamily: 'JetBrains Mono',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="tests" name="Tests Completed" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weak Keys Action Card */}
        <div className="p-6 rounded-3xl bg-[#12141c] border border-[#262b3d] flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-rose-400" /> Top Typing Weaknesses
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Characters with highest cumulative typo counts across tests:
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              {Object.entries(profile.weakKeys || {})
                .sort((a, b) => b[1] - a[1])
                .slice(0, 7)
                .map(([char, count]) => (
                  <div
                    key={char}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#181b26] border border-rose-500/30 text-rose-300 font-mono text-xs"
                  >
                    <span className="font-bold text-sm text-white">{char === ' ' ? 'Space' : char}</span>
                    <span className="text-[10px] text-rose-400">({count} typos)</span>
                  </div>
                ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('adaptive')}
            className="mt-6 px-4 py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 font-bold text-xs flex items-center justify-between"
          >
            <span>Launch AI Adaptive Practice</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Recent Sessions Table */}
      <div className="p-6 rounded-3xl bg-[#12141c] border border-[#262b3d] flex flex-col gap-4">
        <h3 className="text-base font-bold text-white">Recent Session Logs</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#262b3d] text-slate-500 font-sans uppercase">
                <th className="pb-3 font-semibold">Mode</th>
                <th className="pb-3 font-semibold">WPM</th>
                <th className="pb-3 font-semibold">Raw WPM</th>
                <th className="pb-3 font-semibold">Accuracy</th>
                <th className="pb-3 font-semibold">Consistency</th>
                <th className="pb-3 font-semibold">Duration</th>
                <th className="pb-3 font-semibold">XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262b3d]/60 text-slate-300">
              {sessions.slice(0, 5).map((s) => (
                <tr key={s.id} className="hover:bg-[#181b26]/50">
                  <td className="py-3 font-sans font-medium text-white capitalize">
                    {s.mode} {s.category ? `(${s.category})` : ''}
                  </td>
                  <td className="py-3 font-bold text-purple-400">{s.wpm}</td>
                  <td className="py-3 text-slate-400">{s.rawWpm}</td>
                  <td className="py-3 text-emerald-400 font-bold">{s.accuracy}%</td>
                  <td className="py-3 text-cyan-400">{s.consistency}%</td>
                  <td className="py-3 text-slate-400">{s.elapsedSeconds}s</td>
                  <td className="py-3 text-amber-400 font-bold">+{s.xpEarned}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
