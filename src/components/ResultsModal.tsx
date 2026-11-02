import React, { useEffect } from 'react';
import { TypingMetrics } from '../types/typing';
import { LevelInfo } from '../types/gamification';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import confetti from 'canvas-confetti';
import { RotateCcw, ArrowRight, Share2, Award, Zap, Target, Clock, ShieldCheck, Flame } from 'lucide-react';

interface ResultsModalProps {
  metrics: TypingMetrics;
  xpEarned: number;
  levelInfo: LevelInfo;
  isNewBest?: boolean;
  onRestart: () => void;
  onNextTest: () => void;
  onPracticeWeakKeys?: (weakKeys: string[]) => void;
}

export const ResultsModal: React.FC<ResultsModalProps> = ({
  metrics,
  xpEarned,
  levelInfo,
  isNewBest = false,
  onRestart,
  onNextTest,
  onPracticeWeakKeys
}) => {
  useEffect(() => {
    // Fire confetti for great typing
    if (metrics.wpm >= 60 || isNewBest || metrics.accuracy === 100) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [metrics.wpm, isNewBest, metrics.accuracy]);

  const weakKeys = Object.entries(metrics.mistakeMap || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([char]) => char);

  // Format chart data
  const chartData = metrics.timeline.length > 0
    ? metrics.timeline
    : [
        { second: 0, wpm: 0, rawWpm: 0, errors: 0 },
        { second: metrics.elapsedSeconds, wpm: metrics.wpm, rawWpm: metrics.rawWpm, errors: metrics.incorrectChars }
      ];

  const handleShare = () => {
    const text = `🚀 I just hit ${metrics.wpm} WPM with ${metrics.accuracy}% accuracy on KeyRush! Can you beat my speed?`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      alert('Results copied to clipboard!');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 p-8 rounded-3xl bg-[#12141c]/95 border border-[#262b3d] shadow-2xl backdrop-blur-xl animate-combo-bounce">
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-6 border-b border-[#262b3d]">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-display text-white flex items-center gap-2">
              Test Completed
              {isNewBest && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-amber-400 text-amber-400" /> New Personal Best!
                </span>
              )}
            </h2>
            <p className="text-sm text-slate-400">
              Great work! Your keystroke metrics and XP have been recorded.
            </p>
          </div>
        </div>

        {/* Level & XP Capsule */}
        <div className="hidden sm:flex flex-col items-end">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-300">
            <span>Level {levelInfo.level}</span>
            <span className="text-slate-500">•</span>
            <span>{levelInfo.title}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-28 h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-mono text-purple-400 font-bold">+{xpEarned} XP</span>
          </div>
        </div>
      </div>

      {/* Main Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
        {/* WPM Card */}
        <div className="p-5 rounded-2xl bg-[#181b26] border border-[#262b3d]/80 flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Net Speed</span>
          <div className="flex items-baseline gap-1 my-2">
            <span className="text-5xl font-black font-mono text-purple-400 tracking-tight">
              {metrics.wpm}
            </span>
            <span className="text-sm font-medium text-slate-500">WPM</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">Raw: {metrics.rawWpm} WPM</span>
        </div>

        {/* Accuracy Card */}
        <div className="p-5 rounded-2xl bg-[#181b26] border border-[#262b3d]/80 flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Accuracy</span>
          <div className="flex items-baseline gap-1 my-2">
            <span className="text-5xl font-black font-mono text-emerald-400 tracking-tight">
              {metrics.accuracy}
            </span>
            <span className="text-sm font-medium text-slate-500">%</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {metrics.correctChars}/{metrics.totalKeystrokes} Keys
          </span>
        </div>

        {/* Consistency Card */}
        <div className="p-5 rounded-2xl bg-[#181b26] border border-[#262b3d]/80 flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Consistency</span>
          <div className="flex items-baseline gap-1 my-2">
            <span className="text-5xl font-black font-mono text-cyan-400 tracking-tight">
              {metrics.consistency}
            </span>
            <span className="text-sm font-medium text-slate-500">%</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">Smoothness Index</span>
        </div>

        {/* Time Card */}
        <div className="p-5 rounded-2xl bg-[#181b26] border border-[#262b3d]/80 flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Duration</span>
          <div className="flex items-baseline gap-1 my-2">
            <span className="text-5xl font-black font-mono text-amber-400 tracking-tight">
              {metrics.elapsedSeconds}
            </span>
            <span className="text-sm font-medium text-slate-500">s</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">{metrics.incorrectChars} Mistakes</span>
        </div>
      </div>

      {/* Speed & Error Progression Chart */}
      <div className="my-6 p-6 rounded-2xl bg-[#181b26]/70 border border-[#262b3d]">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-purple-400" /> Velocity Timeline (WPM & Errors)
          </span>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-purple-400">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400 inline-block" /> WPM
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-500 inline-block" /> Raw WPM
            </span>
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" /> Errors
            </span>
          </div>
        </div>

        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262b3d" />
              <XAxis dataKey="second" stroke="#4f566b" fontSize={11} tickFormatter={(val) => `${val}s`} />
              <YAxis stroke="#4f566b" fontSize={11} domain={[0, 'dataMax + 15']} />
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
                dot={false}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="rawWpm"
                name="Raw WPM"
                stroke="#64748b"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />
              <Line
                type="step"
                dataKey="errors"
                name="Errors"
                stroke="#f43f5e"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weak Keys & Breakdown */}
      {weakKeys.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-rose-300">Weak Keys Detected:</span>
            <div className="flex items-center gap-1.5">
              {weakKeys.map((key, i) => (
                <kbd
                  key={i}
                  className="px-2 py-0.5 rounded bg-[#181b26] border border-rose-500/30 text-rose-300 font-mono text-xs font-bold"
                >
                  {key === ' ' ? 'Space' : key}
                </kbd>
              ))}
            </div>
          </div>
          {onPracticeWeakKeys && (
            <button
              onClick={() => onPracticeWeakKeys(weakKeys)}
              className="text-xs font-bold text-purple-400 hover:text-purple-300 underline underline-offset-4 flex items-center gap-1"
            >
              Practice Weak Keys Now <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-6 border-t border-[#262b3d]">
        <button
          onClick={handleShare}
          className="px-4 py-2.5 rounded-xl bg-[#181b26] hover:bg-slate-800 text-slate-300 text-sm font-semibold transition-colors flex items-center gap-2 border border-[#262b3d]"
        >
          <Share2 className="w-4 h-4 text-slate-400" /> Share Result
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={onRestart}
            className="px-5 py-2.5 rounded-xl bg-[#181b26] hover:bg-slate-800 text-slate-200 text-sm font-semibold transition-colors flex items-center gap-2 border border-[#262b3d]"
          >
            <RotateCcw className="w-4 h-4 text-purple-400" /> Repeat Test
          </button>
          <button
            onClick={onNextTest}
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold shadow-glow-purple transition-all flex items-center gap-2"
          >
            Next Passage <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
