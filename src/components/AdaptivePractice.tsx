import React, { useState } from 'react';
import { COMMON_WORDS, COLLEGE_WORDS } from '../data/classicWords';
import { BrainCircuit, Sparkles, Play, Flame, BarChart2, CheckCircle2 } from 'lucide-react';

interface AdaptivePracticeProps {
  weakKeysMap: Record<string, number>;
  onStartAdaptivePassage: (passage: { title: string; content: string }) => void;
}

const KEYBOARD_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']
];

export const AdaptivePractice: React.FC<AdaptivePracticeProps> = ({
  weakKeysMap,
  onStartAdaptivePassage
}) => {
  const [selectedFocusKeys, setSelectedFocusKeys] = useState<string[]>([]);

  // Find top weak keys from user history
  const sortedWeakKeys = Object.entries(weakKeysMap || {})
    .filter(([char]) => char.length === 1 && char !== ' ')
    .sort((a, b) => b[1] - a[1]);

  const topWeakChars = sortedWeakKeys.slice(0, 6).map(([char]) => char);

  const getHeatmapColor = (char: string) => {
    const errorCount = weakKeysMap[char] || 0;
    if (errorCount === 0) return 'bg-[#181b26] text-slate-400 border-[#262b3d]';
    if (errorCount < 3) return 'bg-amber-950/40 text-amber-300 border-amber-600/40';
    if (errorCount < 6) return 'bg-orange-950/60 text-orange-300 border-orange-500/50';
    return 'bg-rose-950/80 text-rose-300 border-rose-500 shadow-glow-ruby';
  };

  // Rule-based drill generator tailored to weak keys
  const generateTargetedPassage = (focusKeys: string[]): { title: string; content: string } => {
    const keysToUse = focusKeys.length > 0 ? focusKeys : (topWeakChars.length > 0 ? topWeakChars : ['r', 't', 'p']);
    const allWords = [...COMMON_WORDS, ...COLLEGE_WORDS];

    // Filter words containing any of the target weak keys
    const targetedWords = allWords.filter(w => {
      const lower = w.toLowerCase();
      return keysToUse.some(k => lower.includes(k.toLowerCase()));
    });

    // Pick 40 focused words
    const selectedWords: string[] = [];
    for (let i = 0; i < 40; i++) {
      const randIdx = Math.floor(Math.random() * targetedWords.length);
      selectedWords.push(targetedWords[randIdx] || 'focus');
    }

    return {
      title: `Adaptive Muscle Drill: Focus [${keysToUse.join(', ')}]`,
      content: selectedWords.join(' ')
    };
  };

  const handleLaunchDrill = (keys?: string[]) => {
    const drill = generateTargetedPassage(keys || (selectedFocusKeys.length > 0 ? selectedFocusKeys : topWeakChars));
    onStartAdaptivePassage(drill);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/40 via-cyan-950/20 to-[#12141c] border border-purple-500/30">
        <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
          <BrainCircuit className="w-4 h-4" /> AI Diagnostics
        </div>
        <h2 className="text-2xl md:text-3xl font-black font-display text-white">
          Adaptive Mistake Analysis & Drills
        </h2>
        <p className="text-slate-400 text-sm mt-1 max-w-2xl">
          Our adaptive engine continuously tracks your keystroke errors, identifies difficult character bigrams and finger transitions, and generates tailored drills to eliminate bottlenecks.
        </p>
      </div>

      {/* Weak Keys Heatmap / Keyboard Visual */}
      <div className="p-6 rounded-3xl bg-[#12141c] border border-[#262b3d] flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-400" /> Keystroke Error Heatmap
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            Click keys to build a customized focus drill
          </span>
        </div>

        {/* Keyboard Layout Matrix */}
        <div className="flex flex-col items-center gap-1.5 p-6 rounded-2xl bg-[#090a0f] border border-slate-800 select-none">
          {KEYBOARD_ROWS.map((row, rIdx) => (
            <div key={rIdx} className="flex gap-1.5">
              {row.map(char => {
                const count = weakKeysMap[char] || 0;
                const isSelected = selectedFocusKeys.includes(char);
                return (
                  <button
                    key={char}
                    onClick={() => {
                      setSelectedFocusKeys(prev =>
                        prev.includes(char) ? prev.filter(c => c !== char) : [...prev, char]
                      );
                    }}
                    className={`w-9 h-10 md:w-11 md:h-12 rounded-xl font-mono text-sm font-bold flex flex-col items-center justify-center transition-all border ${
                      isSelected
                        ? 'bg-purple-600 text-white border-purple-400 shadow-glow-purple scale-105'
                        : getHeatmapColor(char)
                    }`}
                  >
                    <span>{char.toUpperCase()}</span>
                    {count > 0 && (
                      <span className="text-[9px] font-sans opacity-75">
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-[#181b26] border border-[#262b3d] inline-block" /> Low / Zero Errors
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2.5 h-2.5 rounded bg-amber-500/40 inline-block" /> Minor Mistakes (1-2)
            </span>
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-2.5 h-2.5 rounded bg-rose-600/70 inline-block" /> High Error Rate (3+)
            </span>
          </div>

          {selectedFocusKeys.length > 0 && (
            <button
              onClick={() => setSelectedFocusKeys([])}
              className="text-xs text-slate-400 hover:text-white underline"
            >
              Clear Selection
            </button>
          )}
        </div>
      </div>

      {/* Preset Recommended Drills */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Drill 1: Top Weak Letters */}
        <div className="p-5 rounded-2xl bg-[#12141c] border border-[#262b3d] flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
              High Priority
            </span>
            <h4 className="text-base font-bold text-white mt-2">Personal Mistake Buster</h4>
            <p className="text-xs text-slate-400 mt-1">
              Targets your most frequently mistyped keys: {topWeakChars.length > 0 ? topWeakChars.join(', ') : 'r, t, p, ;'}.
            </p>
          </div>
          <button
            onClick={() => handleLaunchDrill(topWeakChars)}
            className="mt-4 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-glow-purple flex items-center justify-center gap-2"
          >
            <Play className="w-3.5 h-3.5 fill-white" /> Launch Mistake Drill
          </button>
        </div>

        {/* Drill 2: Coding Symbols & Brackets */}
        <div className="p-5 rounded-2xl bg-[#12141c] border border-[#262b3d] flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              Coding Dexterity
            </span>
            <h4 className="text-base font-bold text-white mt-2">Syntax & Symbol Agility</h4>
            <p className="text-xs text-slate-400 mt-1">
              Focuses on braces, brackets, semicolons, and operators often stumbled on by CS students.
            </p>
          </div>
          <button
            onClick={() => handleLaunchDrill(['{', '}', ';', '(', ')', '='])}
            className="mt-4 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-glow-cyan flex items-center justify-center gap-2"
          >
            <Play className="w-3.5 h-3.5 fill-slate-950" /> Launch Symbol Drill
          </button>
        </div>

        {/* Drill 3: Custom Selected Drill */}
        <div className="p-5 rounded-2xl bg-[#12141c] border border-[#262b3d] flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              Customized
            </span>
            <h4 className="text-base font-bold text-white mt-2">Custom Selected Set</h4>
            <p className="text-xs text-slate-400 mt-1">
              {selectedFocusKeys.length > 0
                ? `Drill tailored to selected keys: ${selectedFocusKeys.join(', ')}`
                : 'Click any keys in the heatmap above to generate a custom target workout.'}
            </p>
          </div>
          <button
            onClick={() => handleLaunchDrill(selectedFocusKeys)}
            disabled={selectedFocusKeys.length === 0}
            className={`mt-4 px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              selectedFocusKeys.length > 0
                ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-glow-purple'
                : 'bg-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Launch Selected Drill
          </button>
        </div>
      </div>
    </div>
  );
};
