import { useState, useEffect, useRef, useCallback } from 'react';
import { TestDuration, TypingMetrics, TypingSessionResult } from '../types/typing';
import { soundManager } from '../utils/audio';

export interface UseTypingEngineProps {
  passage: string;
  duration: TestDuration; // 15, 30, 60, 120 or 0 for unlimited
  soundEnabled?: boolean;
  soundType?: 'cherry-blue' | 'cherry-brown' | 'thocky' | 'cyber';
  onComplete?: (result: TypingMetrics) => void;
}

export interface WordState {
  original: string;
  typed: string;
  isCurrent: boolean;
  isPast: boolean;
}

export function useTypingEngine({
  passage,
  duration,
  soundEnabled = true,
  soundType = 'thocky',
  onComplete
}: UseTypingEngineProps) {
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState('');
  const [typedHistory, setTypedHistory] = useState<string[]>([]); // record of what was typed per word

  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(duration);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Real-time tracking
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [correctKeystrokes, setCorrectKeystrokes] = useState(0);
  const [mistakeMap, setMistakeMap] = useState<Record<string, number>>({});
  const [timeline, setTimeline] = useState<{ second: number; wpm: number; rawWpm: number; errors: number }[]>([]);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);

  const startTimeRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<any>(null);
  const isFocusedRef = useRef(true);
  const [isFocused, setIsFocused] = useState(true);

  // Initialize words from passage
  useEffect(() => {
    if (!passage) return;
    const splitWords = passage.trim().split(/\s+/).filter(Boolean);
    setWords(splitWords);
    setCurrentWordIndex(0);
    setCurrentInput('');
    setTypedHistory([]);
    setIsActive(false);
    setIsFinished(false);
    setTimeLeft(duration);
    setElapsedSeconds(0);
    setTotalKeystrokes(0);
    setCorrectKeystrokes(0);
    setMistakeMap({});
    setTimeline([]);
    setCombo(0);
    setMaxCombo(0);
    startTimeRef.current = null;
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
  }, [passage, duration]);

  // Sound configuration
  useEffect(() => {
    soundManager.setMuted(!soundEnabled);
  }, [soundEnabled]);

  // Calculate live metrics
  const getMetrics = useCallback((): TypingMetrics => {
    const elapsed = Math.max(1, elapsedSeconds);
    const elapsedMinutes = elapsed / 60;

    let correctChars = 0;
    let incorrectChars = 0;
    let extraChars = 0;
    let missedChars = 0;

    // Evaluate past words
    typedHistory.forEach((typed, idx) => {
      const original = words[idx] || '';
      for (let i = 0; i < Math.max(original.length, typed.length); i++) {
        if (i < original.length && i < typed.length) {
          if (original[i] === typed[i]) {
            correctChars++;
          } else {
            incorrectChars++;
          }
        } else if (i >= original.length) {
          extraChars++;
        } else if (i >= typed.length) {
          missedChars++;
        }
      }
      // Space between words counted as correct if word wasn't empty
      if (typed.length > 0) correctChars++;
    });

    // Evaluate current word
    const currOrig = words[currentWordIndex] || '';
    for (let i = 0; i < currentInput.length; i++) {
      if (i < currOrig.length) {
        if (currOrig[i] === currentInput[i]) {
          correctChars++;
        } else {
          incorrectChars++;
        }
      } else {
        extraChars++;
      }
    }

    const totalTyped = correctChars + incorrectChars + extraChars;
    const wpm = Math.max(0, Math.round((correctChars / 5) / elapsedMinutes));
    const rawWpm = Math.max(0, Math.round((totalTyped / 5) / elapsedMinutes));
    const totalHits = Math.max(totalKeystrokes, totalTyped);
    const accuracy = totalHits > 0 
      ? Number(Math.min(100, Math.max(0, (correctKeystrokes / totalHits) * 100)).toFixed(1))
      : 100;

    // Consistency calculation based on timeline variance
    let consistency = 85;
    if (timeline.length > 3) {
      const wpms = timeline.map(t => t.wpm);
      const avg = wpms.reduce((a, b) => a + b, 0) / wpms.length;
      const variance = wpms.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / wpms.length;
      const stdDev = Math.sqrt(variance);
      consistency = Math.max(40, Math.min(100, Math.round(100 - (stdDev / (avg || 1)) * 50)));
    }

    return {
      wpm,
      rawWpm,
      accuracy,
      correctChars,
      incorrectChars,
      extraChars,
      missedChars,
      totalKeystrokes: totalHits,
      elapsedSeconds: elapsed,
      consistency,
      timeline,
      mistakeMap
    };
  }, [
    elapsedSeconds,
    typedHistory,
    words,
    currentWordIndex,
    currentInput,
    totalKeystrokes,
    correctKeystrokes,
    timeline,
    mistakeMap
  ]);

  // Finish test callback
  const finishTest = useCallback(() => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setIsActive(false);
    setIsFinished(true);
    soundManager.playSuccess();
    const finalMetrics = getMetrics();
    if (onComplete) {
      onComplete(finalMetrics);
    }
  }, [getMetrics, onComplete]);

  // Timer loop
  useEffect(() => {
    if (isActive && !isFinished) {
      timerIntervalRef.current = setInterval(() => {
        setElapsedSeconds(prev => {
          const nextElapsed = prev + 1;

          // Record timeline slice
          const m = getMetrics();
          setTimeline(tl => [
            ...tl,
            {
              second: nextElapsed,
              wpm: m.wpm,
              rawWpm: m.rawWpm,
              errors: m.incorrectChars
            }
          ]);

          if (duration > 0) {
            setTimeLeft(tl => {
              if (tl <= 1) {
                finishTest();
                return 0;
              }
              return tl - 1;
            });
          }

          return nextElapsed;
        });
      }, 1000);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isActive, isFinished, duration, finishTest, getMetrics]);

  // Handle keystroke input
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isFinished) {
        if (e.key === 'Tab' || (e.ctrlKey && e.key === 'r')) {
          e.preventDefault();
          restart();
        }
        return;
      }

      // Quick restart with Tab
      if (e.key === 'Tab') {
        e.preventDefault();
        restart();
        return;
      }

      // Ignore modifier keys alone
      if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Escape'].includes(e.key)) {
        return;
      }

      // Start timer on first printable keystroke
      if (!isActive && !isFinished) {
        setIsActive(true);
        startTimeRef.current = Date.now();
      }

      const targetWord = words[currentWordIndex] || '';

      // Backspace handler
      if (e.key === 'Backspace') {
        e.preventDefault();
        if (currentInput.length > 0) {
          setCurrentInput(prev => prev.slice(0, -1));
          soundManager.playKey(soundType, false);
        } else if (currentWordIndex > 0) {
          // If at start of word, check if previous word had errors; allow backspacing into it!
          const prevIndex = currentWordIndex - 1;
          const prevTyped = typedHistory[prevIndex] || '';
          const prevTarget = words[prevIndex] || '';
          if (prevTyped !== prevTarget) {
            setCurrentWordIndex(prevIndex);
            setCurrentInput(prevTyped);
            setTypedHistory(prev => prev.slice(0, prevIndex));
            soundManager.playKey(soundType, false);
          }
        }
        return;
      }

      // Spacebar handler (advance to next word)
      if (e.key === ' ') {
        e.preventDefault();
        if (currentInput.length === 0) return; // ignore repeated spaces

        soundManager.playKey(soundType, true);
        setTotalKeystrokes(k => k + 1);

        // Record typed history
        const newHistory = [...typedHistory, currentInput];
        setTypedHistory(newHistory);

        // Check if word was correct
        if (currentInput === targetWord) {
          setCorrectKeystrokes(k => k + 1);
          setCombo(c => {
            const nextCombo = c + 1;
            setMaxCombo(m => Math.max(m, nextCombo));
            if (nextCombo % 10 === 0) soundManager.playCombo(nextCombo);
            return nextCombo;
          });
        } else {
          setCombo(0);
          soundManager.playError();
        }

        // Check if last word reached
        if (currentWordIndex + 1 >= words.length) {
          setCurrentWordIndex(currentWordIndex + 1);
          setCurrentInput('');
          finishTest();
        } else {
          setCurrentWordIndex(prev => prev + 1);
          setCurrentInput('');
        }
        return;
      }

      // Standard character input (single printable char)
      if (e.key.length === 1) {
        // Prevent default browser shortcuts when typing
        if (!e.ctrlKey && !e.metaKey) {
          e.preventDefault();
        }

        const char = e.key;
        const expectedChar = targetWord[currentInput.length];
        const isMatch = char === expectedChar;

        setTotalKeystrokes(k => k + 1);

        if (isMatch) {
          setCorrectKeystrokes(k => k + 1);
          setCombo(c => {
            const nextCombo = c + 1;
            setMaxCombo(m => Math.max(m, nextCombo));
            return nextCombo;
          });
          soundManager.playKey(soundType, false);
        } else {
          setCombo(0);
          soundManager.playError();
          // Track weak keys
          setMistakeMap(m => ({
            ...m,
            [expectedChar || char]: (m[expectedChar || char] || 0) + 1
          }));
        }

        const nextInput = currentInput + char;
        setCurrentInput(nextInput);

        // If this is the last word and user typed full length correctly
        if (currentWordIndex === words.length - 1 && nextInput === targetWord) {
          setTypedHistory(prev => [...prev, nextInput]);
          finishTest();
        }
      }
    },
    [
      isFinished,
      isActive,
      words,
      currentWordIndex,
      currentInput,
      typedHistory,
      soundType,
      finishTest
    ]
  );

  // Restart function
  const restart = useCallback(() => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setCurrentWordIndex(0);
    setCurrentInput('');
    setTypedHistory([]);
    setIsActive(false);
    setIsFinished(false);
    setTimeLeft(duration);
    setElapsedSeconds(0);
    setTotalKeystrokes(0);
    setCorrectKeystrokes(0);
    setMistakeMap({});
    setTimeline([]);
    setCombo(0);
    startTimeRef.current = null;
  }, [duration]);

  return {
    words,
    currentWordIndex,
    currentInput,
    typedHistory,
    isActive,
    isFinished,
    timeLeft,
    elapsedSeconds,
    combo,
    maxCombo,
    metrics: getMetrics(),
    isFocused,
    setIsFocused,
    handleKeyDown,
    restart,
    finishTest
  };
}
