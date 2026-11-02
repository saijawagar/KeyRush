import React, { useState, useEffect, useRef } from 'react';
import { RaceOpponent } from '../types/modes';
import { generateWordList } from '../data/classicWords';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Trophy, Flag, Zap, RotateCcw, Award, ChevronRight, Gauge } from 'lucide-react';

interface CollegeRaceProps {
  userUsername: string;
  userCollege: string;
  onFinishRace: (wpm: number, accuracy: number, rank: number) => void;
}

const AI_BOTS: { name: string; avatar: string; college: string; baseWpm: number }[] = [
  { name: 'MIT Cypher', avatar: '⚡', college: 'MIT', baseWpm: 72 },
  { name: 'Stanford Lynx', avatar: '🌲', college: 'Stanford University', baseWpm: 66 },
  { name: 'Berkeley Bear', avatar: '🐻', college: 'UC Berkeley', baseWpm: 61 },
  { name: 'Oxford Scholar', avatar: '🎓', college: 'Oxford University', baseWpm: 58 }
];

export const CollegeRace: React.FC<CollegeRaceProps> = ({
  userUsername,
  userCollege,
  onFinishRace
}) => {
  const [racePassage, setRacePassage] = useState<string>('');
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [currentInput, setCurrentInput] = useState('');
  const [typedHistory, setTypedHistory] = useState<string[]>([]);

  const [raceState, setRaceState] = useState<'countdown' | 'racing' | 'finished'>('countdown');
  const [countdown, setCountdown] = useState<number>(3);
  const [startTime, setStartTime] = useState<number>(0);
  const [userWpm, setUserWpm] = useState<number>(0);
  const [userAccuracy, setUserAccuracy] = useState<number>(100);
  const [keystrokes, setKeystrokes] = useState({ total: 0, correct: 0 });

  // Opponents state
  const [opponents, setOpponents] = useState<RaceOpponent[]>([]);
  const [finalRank, setFinalRank] = useState<number>(1);

  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<any>(null);

  // Initialize race
  const initRace = () => {
    const text = generateWordList(35, true);
    setRacePassage(text);
    const splitWords = text.split(' ');
    setWords(splitWords);
    setCurrentWordIdx(0);
    setCurrentInput('');
    setTypedHistory([]);
    setUserWpm(0);
    setUserAccuracy(100);
    setKeystrokes({ total: 0, correct: 0 });
    setRaceState('countdown');
    setCountdown(3);

    // Seed opponents with slight variation
    const initialOpponents: RaceOpponent[] = AI_BOTS.map((bot, idx) => ({
      id: `bot-${idx}`,
      name: bot.name,
      avatar: bot.avatar,
      college: bot.college,
      targetWpm: Math.round(bot.baseWpm + (Math.random() * 14 - 7)),
      currentWpm: 0,
      progressPercent: 0,
      accuracy: Math.round(96 + Math.random() * 3),
      isFinished: false
    }));
    setOpponents(initialOpponents);
  };

  useEffect(() => {
    initRace();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (raceState === 'countdown') {
      if (countdown > 0) {
        const timer = setTimeout(() => {
          setCountdown(prev => prev - 1);
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        setRaceState('racing');
        setStartTime(Date.now());
        containerRef.current?.focus();
      }
    }
  }, [raceState, countdown]);

  // AI Opponents movement loop
  useEffect(() => {
    if (raceState !== 'racing') return;

    const interval = setInterval(() => {
      const elapsedMinutes = Math.max(0.01, (Date.now() - startTime) / 60000);

      setOpponents(prevOpponents => {
        return prevOpponents.map(bot => {
          if (bot.isFinished) return bot;

          // Jitter speed realistically
          const speedVariance = Math.sin(Date.now() / 2000 + bot.targetWpm) * 6;
          const currentSpeed = Math.max(20, Math.round(bot.targetWpm + speedVariance));

          // Words typed based on WPM
          const wordsTyped = currentSpeed * elapsedMinutes;
          const percent = Math.min(100, Math.round((wordsTyped / words.length) * 100));

          const finished = percent >= 100;
          return {
            ...bot,
            currentWpm: currentSpeed,
            progressPercent: percent,
            isFinished: finished,
            finishTime: finished && !bot.finishTime ? Date.now() : bot.finishTime
          };
        });
      });
    }, 200);

    return () => clearInterval(interval);
  }, [raceState, startTime, words.length]);

  // Calculate user progress percentage
  const userProgressPercent = words.length > 0
    ? Math.min(100, Math.round(((currentWordIdx + (currentInput.length / (words[currentWordIdx]?.length || 1))) / words.length) * 100))
    : 0;

  // Live ranking
  const allRacers = [
    {
      name: userUsername,
      avatar: '🏎️',
      college: userCollege,
      isUser: true,
      progress: userProgressPercent,
      wpm: userWpm
    },
    ...opponents.map(o => ({
      name: o.name,
      avatar: o.avatar,
      college: o.college,
      isUser: false,
      progress: o.progressPercent,
      wpm: o.currentWpm
    }))
  ].sort((a, b) => b.progress - a.progress);

  const currentRank = allRacers.findIndex(r => r.isUser) + 1;

  // Input keystroke handling
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (raceState !== 'racing') return;

    if (e.key === 'Tab') {
      e.preventDefault();
      initRace();
      return;
    }

    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Escape'].includes(e.key)) return;

    const targetWord = words[currentWordIdx] || '';

    // Backspace
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (currentInput.length > 0) {
        setCurrentInput(prev => prev.slice(0, -1));
        soundManager.playKey('cherry-blue', false);
      }
      return;
    }

    // Spacebar (next word)
    if (e.key === ' ') {
      e.preventDefault();
      if (currentInput.length === 0) return;

      soundManager.playKey('cherry-blue', true);
      const isWordMatch = currentInput === targetWord;
      setKeystrokes(k => ({
        total: k.total + 1,
        correct: k.correct + (isWordMatch ? 1 : 0)
      }));

      const newHistory = [...typedHistory, currentInput];
      setTypedHistory(newHistory);

      // Check race finish
      if (currentWordIdx + 1 >= words.length) {
        finishRace();
      } else {
        setCurrentWordIdx(prev => prev + 1);
        setCurrentInput('');
      }
      return;
    }

    // Single character
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      const char = e.key;
      const expectedChar = targetWord[currentInput.length];
      const isMatch = char === expectedChar;

      setKeystrokes(k => ({
        total: k.total + 1,
        correct: k.correct + (isMatch ? 1 : 0)
      }));

      if (isMatch) {
        soundManager.playKey('cherry-blue', false);
      } else {
        soundManager.playError();
      }

      const nextInput = currentInput + char;
      setCurrentInput(nextInput);

      // Update user WPM
      const elapsedMinutes = Math.max(0.01, (Date.now() - startTime) / 60000);
      const approxCorrectChars = (currentWordIdx * 5) + nextInput.length;
      const liveWpm = Math.round((approxCorrectChars / 5) / elapsedMinutes);
      setUserWpm(liveWpm);

      if (keystrokes.total > 0) {
        setUserAccuracy(Number(((keystrokes.correct / keystrokes.total) * 100).toFixed(1)));
      }

      // Check if last word finished
      if (currentWordIdx === words.length - 1 && nextInput === targetWord) {
        finishRace();
      }
    }
  };

  const finishRace = () => {
    setRaceState('finished');
    soundManager.playSuccess();
    setFinalRank(currentRank);

    if (currentRank === 1) {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    }

    onFinishRace(userWpm, userAccuracy, currentRank);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
      {/* Race Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-[#12141c] border border-[#262b3d]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Flag className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display text-white">Intercollegiate Grand Prix</h2>
            <p className="text-xs text-slate-400">Race live against student typists from rival universities</p>
          </div>
        </div>

        <div className="flex items-center gap-5 font-mono">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xs uppercase text-slate-500 font-sans">Rank</span>
            <span className="text-2xl font-bold text-amber-400">#{currentRank}</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xs uppercase text-slate-500 font-sans">Your Speed</span>
            <span className="text-2xl font-bold text-purple-400">{userWpm}</span>
            <span className="text-xs text-slate-500">WPM</span>
          </div>
        </div>
      </div>

      {/* Racetrack Stadium Visualization */}
      <div className="p-6 rounded-3xl bg-[#12141c]/90 border border-[#262b3d] flex flex-col gap-4">
        {/* User Lane */}
        <div className="p-3 rounded-2xl bg-purple-950/20 border border-purple-500/30 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-purple-300 flex items-center gap-1.5">
              <span>🏎️</span> {userUsername} ({userCollege})
            </span>
            <span className="font-mono text-purple-400 font-bold">{userWpm} WPM • {userProgressPercent}%</span>
          </div>

          <div className="relative w-full h-5 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-cyan-400 rounded-full transition-all duration-150"
              style={{ width: `${userProgressPercent}%` }}
            />
          </div>
        </div>

        {/* AI Opponents Lanes */}
        {opponents.map((bot) => (
          <div key={bot.id} className="p-2.5 rounded-2xl bg-[#181b26] border border-[#262b3d]/60 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-300 flex items-center gap-1.5">
                <span>{bot.avatar}</span> {bot.name} ({bot.college})
              </span>
              <span className="font-mono text-slate-400">{bot.currentWpm} WPM • {bot.progressPercent}%</span>
            </div>

            <div className="relative w-full h-3 rounded-full bg-slate-900 border border-slate-800/60 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-slate-600 to-slate-400 rounded-full transition-all duration-200"
                style={{ width: `${bot.progressPercent}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Countdown Overlay or Active Typing Arena */}
      {raceState === 'countdown' ? (
        <div className="h-64 rounded-3xl bg-[#12141c] border border-purple-500/30 flex flex-col items-center justify-center gap-3">
          <span className="text-xs uppercase tracking-widest text-purple-400 font-bold">Race Starting In</span>
          <span className="text-7xl font-black font-display text-white animate-combo-bounce">
            {countdown > 0 ? countdown : 'GO!'}
          </span>
          <span className="text-xs text-slate-500">Get your fingers on the home row!</span>
        </div>
      ) : raceState === 'racing' ? (
        <div
          ref={containerRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className="p-8 rounded-3xl bg-[#12141c] border border-purple-500/50 shadow-glow-purple font-mono text-2xl leading-loose outline-none cursor-text select-none min-h-[180px]"
        >
          <div className="flex flex-wrap gap-x-3 gap-y-2">
            {words.map((word, wIdx) => {
              const isPast = wIdx < currentWordIdx;
              const isCurrent = wIdx === currentWordIdx;
              const typed = isPast ? typedHistory[wIdx] : isCurrent ? currentInput : '';

              return (
                <span
                  key={wIdx}
                  className={`${
                    isCurrent ? 'opacity-100' : isPast ? 'opacity-70' : 'opacity-40'
                  }`}
                >
                  {word.split('').map((char, cIdx) => {
                    let color = 'text-slate-500';
                    if (cIdx < typed.length) {
                      color = typed[cIdx] === char ? 'text-slate-100' : 'text-rose-400 bg-rose-500/20';
                    }
                    return (
                      <span key={cIdx} className={color}>
                        {char}
                      </span>
                    );
                  })}
                </span>
              );
            })}
          </div>
        </div>
      ) : (
        /* Race Finished Banner */
        <div className="p-8 rounded-3xl bg-[#12141c] border border-[#262b3d] flex flex-col items-center text-center gap-4 animate-combo-bounce">
          <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Trophy className="w-10 h-10" />
          </div>
          <h3 className="text-3xl font-black font-display text-white">
            {finalRank === 1 ? '🥇 1st Place Champion!' : `Finished #${finalRank} in the Race!`}
          </h3>
          <p className="text-slate-400 text-sm max-w-md">
            You completed the sprint with an average velocity of{' '}
            <strong className="text-purple-400">{userWpm} WPM</strong> and {userAccuracy}% accuracy.
          </p>

          <button
            onClick={initRace}
            className="mt-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-glow-purple flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Race Again
          </button>
        </div>
      )}
    </div>
  );
};
