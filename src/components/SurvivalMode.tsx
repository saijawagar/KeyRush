import React, { useState, useEffect, useRef } from 'react';
import { COMMON_WORDS, COLLEGE_WORDS } from '../data/classicWords';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Heart, Flame, ShieldAlert, Zap, RotateCcw, Skull, Award } from 'lucide-react';

interface SurvivalModeProps {
  onGameOver: (score: number, maxCombo: number, durationSeconds: number) => void;
}

export const SurvivalMode: React.FC<SurvivalModeProps> = ({ onGameOver }) => {
  const [health, setHealth] = useState(100);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [wordsCleared, setWordsCleared] = useState(0);
  const [difficultyTier, setDifficultyTier] = useState(1);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  // Active target words queue
  const [activeWords, setActiveWords] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const gameLoopRef = useRef<any>(null);

  const getWordPool = () => {
    return difficultyTier >= 3 ? [...COMMON_WORDS, ...COLLEGE_WORDS] : COMMON_WORDS;
  };

  const spawnWord = () => {
    const pool = getWordPool();
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const startSurvival = () => {
    setHealth(100);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setWordsCleared(0);
    setDifficultyTier(1);
    setElapsedTime(0);
    setIsGameOver(false);
    setCurrentInput('');

    // Initial words queue
    setActiveWords([spawnWord(), spawnWord(), spawnWord()]);
    containerRef.current?.focus();
  };

  useEffect(() => {
    startSurvival();
  }, []);

  // Time and health decay loop
  useEffect(() => {
    if (isGameOver) return;

    gameLoopRef.current = setInterval(() => {
      setElapsedTime(t => {
        const nextTime = t + 1;

        // Scale difficulty every 15 seconds
        if (nextTime % 15 === 0) {
          setDifficultyTier(prev => Math.min(5, prev + 1));
        }

        // Slight passive health drain as time passes
        setHealth(h => {
          const drain = 1 + (difficultyTier * 0.3);
          const nextHealth = Math.max(0, h - drain);
          if (nextHealth <= 0) {
            handleGameOver();
          }
          return nextHealth;
        });

        return nextTime;
      });
    }, 1000);

    return () => clearInterval(gameLoopRef.current);
  }, [isGameOver, difficultyTier]);

  const handleGameOver = () => {
    setIsGameOver(true);
    soundManager.playError();
    onGameOver(score, maxCombo, elapsedTime);
  };

  // Keyboard input handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isGameOver) {
      if (e.key === 'Tab' || e.key === 'Enter') {
        e.preventDefault();
        startSurvival();
      }
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      startSurvival();
      return;
    }

    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Escape'].includes(e.key)) return;

    const currentTarget = activeWords[0] || '';

    // Backspace
    if (e.key === 'Backspace') {
      e.preventDefault();
      setCurrentInput(prev => prev.slice(0, -1));
      soundManager.playKey('cyber', false);
      return;
    }

    // Space or Enter to submit word
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (!currentInput) return;

      if (currentInput === currentTarget) {
        // Correct Word!
        soundManager.playKey('cyber', true);
        const multiplier = 1 + Math.floor(combo / 5) * 0.5;
        const wordPoints = Math.round(currentTarget.length * 10 * multiplier);

        setScore(s => s + wordPoints);
        setWordsCleared(w => w + 1);
        setHealth(h => Math.min(100, h + 8)); // restore health
        setCombo(c => {
          const nextCombo = c + 1;
          setMaxCombo(m => Math.max(m, nextCombo));
          if (nextCombo % 10 === 0) soundManager.playCombo(nextCombo);
          return nextCombo;
        });

        // Shift active words and spawn next
        setActiveWords(prev => [...prev.slice(1), spawnWord()]);
        setCurrentInput('');
      } else {
        // Mistake on word completion
        soundManager.playError();
        setCombo(0);
        setHealth(h => {
          const nextH = Math.max(0, h - 14);
          if (nextH <= 0) handleGameOver();
          return nextH;
        });
        setCurrentInput('');
      }
      return;
    }

    // Printable key
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      const nextInput = currentInput + e.key;
      const expectedPrefix = currentTarget.slice(0, nextInput.length);

      if (currentTarget.startsWith(nextInput)) {
        soundManager.playKey('cyber', false);
        setCurrentInput(nextInput);

        // Auto submit if typed entire word length correctly
        if (nextInput === currentTarget) {
          const multiplier = 1 + Math.floor(combo / 5) * 0.5;
          const wordPoints = Math.round(currentTarget.length * 10 * multiplier);

          setScore(s => s + wordPoints);
          setWordsCleared(w => w + 1);
          setHealth(h => Math.min(100, h + 8));
          setCombo(c => {
            const nextCombo = c + 1;
            setMaxCombo(m => Math.max(m, nextCombo));
            return nextCombo;
          });

          setActiveWords(prev => [...prev.slice(1), spawnWord()]);
          setCurrentInput('');
        }
      } else {
        // Wrong letter
        soundManager.playError();
        setCombo(0);
        setHealth(h => {
          const nextH = Math.max(0, h - 5);
          if (nextH <= 0) handleGameOver();
          return nextH;
        });
      }
    }
  };

  const getHealthColor = () => {
    if (health > 60) return 'from-emerald-500 to-cyan-400';
    if (health > 30) return 'from-amber-500 to-orange-500';
    return 'from-rose-600 to-rose-400 animate-pulse';
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 select-none">
      {/* Top HUD */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-3xl bg-[#12141c] border border-[#262b3d]">
        {/* Score */}
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase text-slate-500">Survival Score</span>
          <span className="text-3xl font-black font-mono text-purple-400">{score}</span>
        </div>

        {/* Combo */}
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase text-slate-500">Active Combo</span>
          <span className="text-3xl font-black font-mono text-amber-400 flex items-center gap-1">
            <Zap className="w-5 h-5 fill-amber-400" /> {combo}x
          </span>
        </div>

        {/* Time Alive */}
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase text-slate-500">Time Alive</span>
          <span className="text-3xl font-black font-mono text-cyan-400">{elapsedTime}s</span>
        </div>

        {/* Threat Level */}
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase text-slate-500">Threat Tier</span>
          <span className="text-2xl font-black font-mono text-rose-400">Tier {difficultyTier}</span>
        </div>
      </div>

      {/* Health Bar */}
      <div className="p-4 rounded-2xl bg-[#12141c] border border-[#262b3d] flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-300 flex items-center gap-1.5">
            <Heart className={`w-4 h-4 ${health <= 30 ? 'fill-rose-500 text-rose-500 animate-ping' : 'fill-rose-500 text-rose-500'}`} />
            Survival Integrity
          </span>
          <span className="font-mono font-bold text-slate-300">{Math.round(health)}%</span>
        </div>
        <div className="w-full h-4 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${getHealthColor()} transition-all duration-200`}
            style={{ width: `${health}%` }}
          />
        </div>
      </div>

      {/* Main Arcade Stream Area */}
      {!isGameOver ? (
        <div
          ref={containerRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className="p-10 rounded-3xl bg-[#090a0f] border-2 border-purple-500/40 shadow-glow-purple flex flex-col items-center justify-center min-h-[260px] outline-none cursor-text"
        >
          {/* Target Word Prominently Displayed */}
          <div className="flex flex-col items-center gap-3">
            <span className="text-xs uppercase tracking-widest text-slate-500 font-mono">Current Target Word</span>
            <div className="font-mono text-4xl md:text-5xl font-black tracking-wider text-slate-200">
              {activeWords[0]?.split('').map((char, idx) => {
                const isMatched = idx < currentInput.length;
                return (
                  <span
                    key={idx}
                    className={isMatched ? 'text-purple-400 underline underline-offset-8' : 'text-slate-500'}
                  >
                    {char}
                  </span>
                );
              })}
            </div>

            {/* Next incoming queue */}
            <div className="flex items-center gap-4 mt-6">
              <span className="text-xs text-slate-600 uppercase font-bold">Next:</span>
              {activeWords.slice(1).map((w, i) => (
                <span key={i} className="text-sm font-mono text-slate-500 bg-[#181b26] px-3 py-1 rounded-xl border border-slate-800">
                  {w}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Game Over Screen */
        <div className="p-10 rounded-3xl bg-[#12141c] border border-rose-500/30 shadow-glow-ruby flex flex-col items-center text-center gap-4 animate-combo-bounce">
          <div className="p-4 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-500">
            <Skull className="w-10 h-10" />
          </div>
          <h3 className="text-3xl font-black font-display text-white">System Overload!</h3>
          <p className="text-slate-400 text-sm max-w-md">
            Integrity dropped to zero after enduring{' '}
            <strong className="text-cyan-400">{elapsedTime} seconds</strong> of intense typing.
          </p>

          <div className="flex items-center gap-6 my-2 text-sm font-mono">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              Final Score: <strong className="text-purple-400">{score}</strong>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              Max Combo: <strong className="text-amber-400">{maxCombo}x</strong>
            </div>
          </div>

          <button
            onClick={startSurvival}
            className="mt-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-glow-purple flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
        </div>
      )}
    </div>
  );
};
