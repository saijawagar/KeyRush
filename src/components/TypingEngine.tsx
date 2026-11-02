import React, { useRef, useEffect } from 'react';
import { useTypingEngine } from '../hooks/useTypingEngine';
import { TestDuration, CaretStyle, TypingMetrics } from '../types/typing';
import { Volume2, VolumeX, RotateCcw, Zap, Sparkles } from 'lucide-react';

interface TypingEngineProps {
  passage: string;
  duration: TestDuration;
  onDurationChange?: (duration: TestDuration) => void;
  onComplete: (metrics: TypingMetrics) => void;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  soundType?: 'cherry-blue' | 'cherry-brown' | 'thocky' | 'cyber';
  caretStyle?: CaretStyle;
  fontSize?: 'sm' | 'md' | 'lg' | 'xl';
  title?: string;
  modeLabel?: string;
}

export const TypingEngine: React.FC<TypingEngineProps> = ({
  passage,
  duration,
  onDurationChange,
  onComplete,
  soundEnabled = true,
  onToggleSound,
  soundType = 'thocky',
  caretStyle = 'line',
  fontSize = 'lg',
  title,
  modeLabel = 'Classic'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsContainerRef = useRef<HTMLDivElement>(null);

  const {
    words,
    currentWordIndex,
    currentInput,
    typedHistory,
    isActive,
    isFinished,
    timeLeft,
    elapsedSeconds,
    combo,
    metrics,
    isFocused,
    setIsFocused,
    handleKeyDown,
    restart
  } = useTypingEngine({
    passage,
    duration,
    soundEnabled,
    soundType,
    onComplete
  });

  // Focus container on mount and click
  useEffect(() => {
    containerRef.current?.focus();
  }, [passage]);

  const handleContainerKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    handleKeyDown(e.nativeEvent);
  };

  // Font size classes
  const fontSizes = {
    sm: 'text-lg leading-relaxed',
    md: 'text-xl leading-relaxed',
    lg: 'text-2xl leading-loose',
    xl: 'text-3xl leading-loose'
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 select-none">
      {/* Top Header / Mode & Duration Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-3 py-2 bg-[#12141c]/60 backdrop-blur-md rounded-2xl border border-[#262b3d]/60">
        {/* Left: Mode Badge & Live Title */}
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
            {modeLabel}
          </span>
          {title && (
            <span className="text-sm font-medium text-slate-400 truncate max-w-[260px]">
              {title}
            </span>
          )}
        </div>

        {/* Center: Duration Selectors */}
        {onDurationChange && (
          <div className="flex items-center gap-1 bg-[#181b26] p-1 rounded-xl border border-[#262b3d]">
            {([15, 30, 60, 120] as TestDuration[]).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => {
                  onDurationChange(d);
                  containerRef.current?.focus();
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  duration === d
                    ? 'bg-purple-600 text-white shadow-glow-purple'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {d}s
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                onDurationChange(0);
                containerRef.current?.focus();
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                duration === 0
                  ? 'bg-purple-600 text-white shadow-glow-purple'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              ∞
            </button>
          </div>
        )}

        {/* Right: Sound, Restart & Stats Glance */}
        <div className="flex items-center gap-2">
          {onToggleSound && (
            <button
              type="button"
              onClick={onToggleSound}
              title={soundEnabled ? 'Mute keyboard sound' : 'Enable keyboard sound'}
              className="p-2 rounded-xl text-slate-400 hover:text-purple-400 hover:bg-slate-800/60 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              restart();
              containerRef.current?.focus();
            }}
            title="Restart test (Tab)"
            className="p-2 rounded-xl text-slate-400 hover:text-purple-400 hover:bg-slate-800/60 transition-colors flex items-center gap-1 text-xs"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline font-mono text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">Tab</span>
          </button>
        </div>
      </div>

      {/* Live Stats Bar */}
      <div className="flex items-center justify-between px-4 py-2 text-sm font-mono">
        <div className="flex items-center gap-6">
          {/* Timer Display */}
          <div className="flex items-baseline gap-2">
            <span className="text-xs uppercase text-slate-500 font-sans font-semibold">Time</span>
            <span className="text-2xl font-bold text-cyan-400">
              {duration > 0 ? timeLeft : elapsedSeconds}
              <span className="text-xs text-slate-500 ml-0.5">s</span>
            </span>
          </div>

          {/* Live WPM */}
          <div className="flex items-baseline gap-2">
            <span className="text-xs uppercase text-slate-500 font-sans font-semibold">WPM</span>
            <span className="text-2xl font-bold text-purple-400">
              {metrics.wpm}
            </span>
          </div>

          {/* Live Accuracy */}
          <div className="flex items-baseline gap-2">
            <span className="text-xs uppercase text-slate-500 font-sans font-semibold">Acc</span>
            <span className="text-2xl font-bold text-emerald-400">
              {metrics.accuracy}%
            </span>
          </div>
        </div>

        {/* Combo Multiplier Pill */}
        {combo > 3 && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-purple-500/20 border border-amber-500/30 text-amber-300 animate-combo-bounce shadow-glow-purple">
            <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold font-mono">{combo}x Combo</span>
          </div>
        )}
      </div>

      {/* Core Typing Arena Box */}
      <div
        ref={containerRef}
        tabIndex={0}
        onKeyDown={handleContainerKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`relative min-h-[220px] p-8 md:p-10 rounded-3xl bg-[#12141c]/90 border transition-all duration-300 outline-none cursor-text ${
          isFocused
            ? 'border-purple-500/40 shadow-glow-purple ring-1 ring-purple-500/20'
            : 'border-[#262b3d] hover:border-slate-700'
        }`}
      >
        {/* Click to Focus Overlay */}
        {!isFocused && !isFinished && (
          <div className="absolute inset-0 bg-[#090a0f]/80 backdrop-blur-sm rounded-3xl flex items-center justify-center z-20 cursor-pointer">
            <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-[#181b26] border border-purple-500/40 text-purple-300 text-sm font-medium shadow-xl">
              <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
              Click or press any key to focus typing arena
            </div>
          </div>
        )}

        {/* Word Display Stream */}
        <div
          ref={wordsContainerRef}
          className={`font-mono ${fontSizes[fontSize]} flex flex-wrap gap-x-3 gap-y-2.5 transition-all`}
        >
          {words.map((word, wIdx) => {
            const isPast = wIdx < currentWordIndex;
            const isCurrent = wIdx === currentWordIndex;
            const typedVal = isPast
              ? typedHistory[wIdx] || ''
              : isCurrent
              ? currentInput
              : '';

            return (
              <div
                key={wIdx}
                className={`relative inline-flex items-center tracking-normal ${
                  isCurrent ? 'opacity-100 font-medium' : isPast ? 'opacity-85' : 'opacity-40'
                }`}
              >
                {/* Render word characters */}
                {word.split('').map((char, cIdx) => {
                  let charClass = 'char-pending';
                  const hasTyped = cIdx < typedVal.length;

                  if (hasTyped) {
                    if (typedVal[cIdx] === char) {
                      charClass = 'char-correct text-slate-100';
                    } else {
                      charClass = 'char-incorrect text-rose-400 bg-rose-500/20 rounded-sm';
                    }
                  }

                  const showCaret = isCurrent && cIdx === currentInput.length;

                  return (
                    <span key={cIdx} className="relative inline-block">
                      {/* Caret before current character */}
                      {showCaret && isFocused && (
                        <span
                          className={`absolute -left-[1.5px] top-1/2 -translate-y-1/2 ${
                            caretStyle === 'block'
                              ? 'w-3 h-6 bg-purple-500/40 border-b-2 border-purple-400'
                              : caretStyle === 'underline'
                              ? 'w-3 h-0.5 bg-purple-400 -bottom-1 shadow-glow-purple'
                              : 'w-[2.5px] h-6 bg-purple-400 rounded-full shadow-glow-purple animate-caret-blink'
                          }`}
                        />
                      )}
                      <span className={charClass}>{char}</span>
                    </span>
                  );
                })}

                {/* Extra typed characters beyond word length */}
                {typedVal.length > word.length && (
                  <span className="inline-flex">
                    {typedVal.slice(word.length).split('').map((extraChar, eIdx) => (
                      <span
                        key={eIdx}
                        className="text-rose-500 bg-rose-950/60 font-bold px-[1px] rounded"
                      >
                        {extraChar}
                      </span>
                    ))}
                  </span>
                )}

                {/* Caret at end of current word */}
                {isCurrent && currentInput.length >= word.length && isFocused && (
                  <span
                    className={`inline-block ml-0.5 ${
                      caretStyle === 'block'
                        ? 'w-3 h-6 bg-purple-500/40 border-b-2 border-purple-400'
                        : caretStyle === 'underline'
                        ? 'w-3 h-0.5 bg-purple-400 -bottom-1'
                        : 'w-[2.5px] h-6 bg-purple-400 rounded-full shadow-glow-purple animate-caret-blink'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer shortcut helper */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-4">
        <div className="flex items-center gap-4">
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-[#181b26] border border-slate-700 text-slate-300 font-mono">
              Tab
            </kbd>{' '}
            restart test
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-[#181b26] border border-slate-700 text-slate-300 font-mono">
              Space
            </kbd>{' '}
            next word
          </span>
        </div>
        <div>
          <span>{words.length} words total</span>
        </div>
      </div>
    </div>
  );
};
