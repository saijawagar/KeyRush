export type TestDuration = 15 | 30 | 60 | 120 | 0; // 0 for unlimited / word-based

export type CaretStyle = 'line' | 'block' | 'underline';

export type SwitchSound = 'cherry-blue' | 'cherry-brown' | 'thocky' | 'cyber' | 'off';

export interface KeystrokeLog {
  char: string;
  expected: string;
  timestamp: number;
  isCorrect: boolean;
}

export interface TypingMetrics {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  extraChars: number;
  missedChars: number;
  totalKeystrokes: number;
  elapsedSeconds: number;
  consistency: number;
  timeline: { second: number; wpm: number; rawWpm: number; errors: number }[];
  mistakeMap: Record<string, number>; // e.g. { 'e': 3, 'r': 5 }
}

export interface TypingSessionResult extends TypingMetrics {
  id: string;
  timestamp: number;
  mode: 'classic' | 'academic' | 'code' | 'race' | 'survival' | 'daily' | 'custom' | 'adaptive';
  category?: string;
  duration: number;
  passageTitle?: string;
  xpEarned: number;
}
