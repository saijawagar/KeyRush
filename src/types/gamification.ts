export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'speed' | 'accuracy' | 'streak' | 'mode' | 'mastery';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: number; // timestamp
  progress?: number; // 0 - 100
  target: number;
}

export interface UserProfile {
  id: string;
  username: string;
  avatar: string;
  college: string;
  major: string;
  bio: string;
  level: number;
  xp: number;
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  bestWpm: number;
  averageWpm: number;
  averageAccuracy: number;
  totalTests: number;
  totalTimeTypedSeconds: number; // in seconds
  soundEnabled: boolean;
  soundType: 'cherry-blue' | 'cherry-brown' | 'thocky' | 'cyber';
  soundVolume: number; // 0 - 1
  caretStyle: 'line' | 'block' | 'underline';
  theme: 'dark' | 'cyberpunk' | 'midnight' | 'dracula' | 'minimal';
  smoothCaret: boolean;
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  weakKeys: Record<string, number>; // total mistakes per key
  achievements: string[]; // achievement IDs
}

export interface LevelInfo {
  level: number;
  title: string;
  minXp: number;
  maxXp: number;
  progressPercent: number;
}
