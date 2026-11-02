import { UserProfile, Achievement } from '../types/gamification';
import { TypingSessionResult } from '../types/typing';

const PROFILE_KEY = 'keyrush_user_profile';
const SESSIONS_KEY = 'keyrush_typing_sessions';
const ACHIEVEMENTS_KEY = 'keyrush_achievements_state';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-test',
    title: 'First Flight',
    description: 'Complete your first typing session on KeyRush.',
    icon: '🚀',
    category: 'speed',
    rarity: 'common',
    target: 1,
    progress: 0
  },
  {
    id: 'wpm-30',
    title: 'Rookie Speed',
    description: 'Achieve 30+ WPM in any typing test.',
    icon: '⚡',
    category: 'speed',
    rarity: 'common',
    target: 30,
    progress: 0
  },
  {
    id: 'wpm-60',
    title: 'Speed Specialist',
    description: 'Achieve 60+ WPM in any test.',
    icon: '🔥',
    category: 'speed',
    rarity: 'rare',
    target: 60,
    progress: 0
  },
  {
    id: 'wpm-100',
    title: 'Century Club',
    description: 'Break the 100 WPM barrier in any test.',
    icon: '⚡',
    category: 'speed',
    rarity: 'epic',
    target: 100,
    progress: 0
  },
  {
    id: 'wpm-120',
    title: 'Supersonic Typist',
    description: 'Surpass 120+ WPM with elite velocity.',
    icon: '🛸',
    category: 'speed',
    rarity: 'legendary',
    target: 120,
    progress: 0
  },
  {
    id: 'perfect-accuracy',
    title: 'Sniper Precision',
    description: 'Complete a test with 100% accuracy (minimum 30s or 25 words).',
    icon: '🎯',
    category: 'accuracy',
    rarity: 'rare',
    target: 100,
    progress: 0
  },
  {
    id: 'code-master',
    title: 'Code Prodigy',
    description: 'Complete 5 programming code typing challenges.',
    icon: '💻',
    category: 'mode',
    rarity: 'rare',
    target: 5,
    progress: 0
  },
  {
    id: 'academic-scholar',
    title: 'Academic Dean',
    description: 'Complete 5 college subject academic tests.',
    icon: '🎓',
    category: 'mode',
    rarity: 'rare',
    target: 5,
    progress: 0
  },
  {
    id: 'race-winner',
    title: 'Campus Champion',
    description: 'Finish 1st place in a College Race against campus bots.',
    icon: '🏆',
    category: 'mode',
    rarity: 'rare',
    target: 1,
    progress: 0
  },
  {
    id: 'survival-survivor',
    title: 'Survival Titan',
    description: 'Reach a 25+ combo in Survival Mode.',
    icon: '🛡️',
    category: 'mode',
    rarity: 'epic',
    target: 25,
    progress: 0
  },
  {
    id: 'streak-3',
    title: 'Consistent Hustle',
    description: 'Maintain a 3-day typing practice streak.',
    icon: '📅',
    category: 'streak',
    rarity: 'common',
    target: 3,
    progress: 0
  },
  {
    id: 'streak-7',
    title: 'Unstoppable Habit',
    description: 'Maintain a 7-day typing streak.',
    icon: '🌟',
    category: 'streak',
    rarity: 'epic',
    target: 7,
    progress: 0
  },
  {
    id: 'tests-25',
    title: 'Dedicated Student',
    description: 'Complete 25 total typing sessions.',
    icon: '📚',
    category: 'mastery',
    rarity: 'rare',
    target: 25,
    progress: 0
  },
  {
    id: 'assignment-typed',
    title: 'Homework Crusher',
    description: 'Upload and practice your own college assignment or notes.',
    icon: '📝',
    category: 'mode',
    rarity: 'common',
    target: 1,
    progress: 0
  },
  {
    id: 'level-10',
    title: 'Typing Scholar',
    description: 'Reach Level 10 in the KeyRush ranking ladder.',
    icon: '👑',
    category: 'mastery',
    rarity: 'rare',
    target: 10,
    progress: 0
  },
  {
    id: 'level-20',
    title: 'Keyboard Ninja',
    description: 'Reach Level 20 in the KeyRush ranking ladder.',
    icon: '⚔️',
    category: 'mastery',
    rarity: 'legendary',
    target: 20,
    progress: 0
  }
];

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'usr-student-local',
  username: 'Alex Rivera',
  avatar: '🎓',
  college: 'MIT',
  major: 'Computer Science',
  bio: 'Engineering undergrad leveling up typing velocity for coding interviews and academic papers.',
  level: 3,
  xp: 780,
  streak: 2,
  lastActiveDate: new Date().toISOString().split('T')[0],
  bestWpm: 76,
  averageWpm: 64,
  averageAccuracy: 97.2,
  totalTests: 12,
  totalTimeTypedSeconds: 420,
  soundEnabled: true,
  soundType: 'thocky',
  soundVolume: 0.6,
  caretStyle: 'line',
  theme: 'dark',
  smoothCaret: true,
  fontSize: 'lg',
  weakKeys: { 'r': 4, 't': 3, 'p': 2, ';': 5, '{': 3 },
  achievements: ['first-test', 'wpm-30', 'wpm-60']
};

export const storage = {
  getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(PROFILE_KEY);
      if (data) {
        return { ...DEFAULT_USER_PROFILE, ...JSON.parse(data) };
      }
    } catch {
      // fallback
    }
    return DEFAULT_USER_PROFILE;
  },

  saveProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch {
      // ignore
    }
  },

  getSessions(): TypingSessionResult[] {
    try {
      const data = localStorage.getItem(SESSIONS_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // fallback
    }
    // Return sample seeded sessions so graphs show realistic progression right from the start
    return [
      {
        id: 'init-1',
        timestamp: Date.now() - 86400000 * 3,
        mode: 'classic',
        duration: 30,
        wpm: 58,
        rawWpm: 64,
        accuracy: 94.5,
        correctChars: 145,
        incorrectChars: 8,
        extraChars: 0,
        missedChars: 0,
        totalKeystrokes: 153,
        elapsedSeconds: 30,
        consistency: 78,
        timeline: [
          { second: 10, wpm: 54, rawWpm: 60, errors: 2 },
          { second: 20, wpm: 58, rawWpm: 63, errors: 4 },
          { second: 30, wpm: 58, rawWpm: 64, errors: 8 }
        ],
        mistakeMap: { 't': 3, 'r': 2 },
        xpEarned: 135
      },
      {
        id: 'init-2',
        timestamp: Date.now() - 86400000 * 2,
        mode: 'academic',
        category: 'Computer Science',
        duration: 60,
        wpm: 66,
        rawWpm: 71,
        accuracy: 96.8,
        correctChars: 330,
        incorrectChars: 11,
        extraChars: 0,
        missedChars: 0,
        totalKeystrokes: 341,
        elapsedSeconds: 60,
        consistency: 82,
        timeline: [
          { second: 15, wpm: 62, rawWpm: 67, errors: 2 },
          { second: 30, wpm: 65, rawWpm: 70, errors: 5 },
          { second: 45, wpm: 68, rawWpm: 72, errors: 8 },
          { second: 60, wpm: 66, rawWpm: 71, errors: 11 }
        ],
        mistakeMap: { 'c': 2, 'm': 3 },
        xpEarned: 240
      },
      {
        id: 'init-3',
        timestamp: Date.now() - 86400000 * 1,
        mode: 'code',
        category: 'Python',
        duration: 30,
        wpm: 76,
        rawWpm: 80,
        accuracy: 98.2,
        correctChars: 190,
        incorrectChars: 3,
        extraChars: 0,
        missedChars: 0,
        totalKeystrokes: 193,
        elapsedSeconds: 30,
        consistency: 86,
        timeline: [
          { second: 10, wpm: 72, rawWpm: 76, errors: 1 },
          { second: 20, wpm: 75, rawWpm: 79, errors: 2 },
          { second: 30, wpm: 76, rawWpm: 80, errors: 3 }
        ],
        mistakeMap: { ':': 1, '_': 2 },
        xpEarned: 195
      }
    ];
  },

  saveSession(session: TypingSessionResult): void {
    try {
      const sessions = this.getSessions();
      sessions.unshift(session);
      // Keep up to 200 sessions
      if (sessions.length > 200) sessions.pop();
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
    } catch {
      // ignore
    }
  },

  getAchievements(): Achievement[] {
    try {
      const data = localStorage.getItem(ACHIEVEMENTS_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // fallback
    }
    return INITIAL_ACHIEVEMENTS;
  },

  saveAchievements(achievements: Achievement[]): void {
    try {
      localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
    } catch {
      // ignore
    }
  }
};
