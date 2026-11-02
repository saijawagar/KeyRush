export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar: string;
  college: string;
  major: string;
  wpm: number;
  accuracy: number;
  testsCompleted: number;
  xp: number;
  level: number;
  streak: number;
  isCurrentUser?: boolean;
}

export const MOCK_LEADERBOARD_DATA: LeaderboardEntry[] = [
  {
    rank: 1,
    userId: 'user-top-1',
    username: 'QuantumKeystroke',
    avatar: '⚡',
    college: 'MIT',
    major: 'Computer Science',
    wpm: 154,
    accuracy: 99.4,
    testsCompleted: 1420,
    xp: 48900,
    level: 48,
    streak: 64
  },
  {
    rank: 2,
    userId: 'user-top-2',
    username: 'CyberTypist_99',
    avatar: '🚀',
    college: 'Stanford University',
    major: 'Symbolic Systems',
    wpm: 147,
    accuracy: 98.8,
    testsCompleted: 1105,
    xp: 41200,
    level: 44,
    streak: 42
  },
  {
    rank: 3,
    userId: 'user-top-3',
    username: 'KernelPanicker',
    avatar: '💻',
    college: 'UC Berkeley',
    major: 'EECS',
    wpm: 142,
    accuracy: 99.1,
    testsCompleted: 980,
    xp: 38400,
    level: 41,
    streak: 35
  },
  {
    rank: 4,
    userId: 'user-top-4',
    username: 'TheoremProver',
    avatar: '📐',
    college: 'Oxford University',
    major: 'Mathematics',
    wpm: 138,
    accuracy: 99.6,
    testsCompleted: 870,
    xp: 35100,
    level: 38,
    streak: 28
  },
  {
    rank: 5,
    userId: 'user-top-5',
    username: 'DevAstronaut',
    avatar: '🪐',
    college: 'Carnegie Mellon',
    major: 'Software Engineering',
    wpm: 135,
    accuracy: 98.4,
    testsCompleted: 760,
    xp: 31800,
    level: 35,
    streak: 21
  },
  {
    rank: 6,
    userId: 'user-top-6',
    username: 'SiliconValkyrie',
    avatar: '🛡️',
    college: 'IIT Bombay',
    major: 'Computer Science',
    wpm: 131,
    accuracy: 98.9,
    testsCompleted: 690,
    xp: 29500,
    level: 33,
    streak: 19
  },
  {
    rank: 7,
    userId: 'user-top-7',
    username: 'AlgoNinja_X',
    avatar: '🥷',
    college: 'Harvard University',
    major: 'Applied Math',
    wpm: 128,
    accuracy: 97.9,
    testsCompleted: 610,
    xp: 26400,
    level: 30,
    streak: 15
  },
  {
    rank: 8,
    userId: 'user-top-8',
    username: 'MatrixArchitect',
    avatar: '🕶️',
    college: 'Georgia Tech',
    major: 'Computer Engineering',
    wpm: 124,
    accuracy: 98.2,
    testsCompleted: 540,
    xp: 23900,
    level: 27,
    streak: 12
  },
  {
    rank: 9,
    userId: 'user-top-9',
    username: 'LambdaCurry',
    avatar: '☕',
    college: 'Cambridge University',
    major: 'Natural Sciences',
    wpm: 121,
    accuracy: 99.2,
    testsCompleted: 480,
    xp: 21700,
    level: 25,
    streak: 14
  },
  {
    rank: 10,
    userId: 'user-top-10',
    username: 'RustaceanAce',
    avatar: '🦀',
    college: 'ETH Zurich',
    major: 'Data Science',
    wpm: 118,
    accuracy: 98.5,
    testsCompleted: 430,
    xp: 19800,
    level: 23,
    streak: 9
  }
];

export const COLLEGES_LIST = [
  'All Colleges',
  'MIT',
  'Stanford University',
  'UC Berkeley',
  'Oxford University',
  'Carnegie Mellon',
  'IIT Bombay',
  'Harvard University',
  'Georgia Tech',
  'Cambridge University',
  'ETH Zurich',
  'Caltech',
  'University of Toronto',
  'National University of Singapore'
];
