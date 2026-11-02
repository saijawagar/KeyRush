import { LevelInfo, UserProfile, Achievement } from '../types/gamification';
import { TypingSessionResult } from '../types/typing';
import { storage } from './storage';

export const LEVEL_TIERS: { level: number; title: string; minXp: number }[] = [
  { level: 1, title: 'Freshman', minXp: 0 },
  { level: 5, title: 'Keyboard Rookie', minXp: 1200 },
  { level: 10, title: 'Typing Scholar', minXp: 3800 },
  { level: 20, title: 'Speed Specialist', minXp: 10500 },
  { level: 35, title: 'Keyboard Ninja', minXp: 26000 },
  { level: 50, title: 'Typing Legend', minXp: 52000 }
];

export function getLevelInfo(totalXp: number): LevelInfo {
  let currentTier = LEVEL_TIERS[0];
  let nextTier = LEVEL_TIERS[1];

  for (let i = 0; i < LEVEL_TIERS.length; i++) {
    if (totalXp >= LEVEL_TIERS[i].minXp) {
      currentTier = LEVEL_TIERS[i];
      nextTier = LEVEL_TIERS[i + 1] || {
        level: 60,
        title: 'Grandmaster Typist',
        minXp: 80000
      };
    } else {
      break;
    }
  }

  // Calculate granular level between tiers
  const xpInTier = totalXp - currentTier.minXp;
  const tierRange = Math.max(1, nextTier.minXp - currentTier.minXp);
  const tierLevelDiff = Math.max(1, nextTier.level - currentTier.level);
  const fractionalLevel = (xpInTier / tierRange) * tierLevelDiff;
  const calculatedLevel = Math.min(50, Math.floor(currentTier.level + fractionalLevel));

  const progressPercent = Math.min(100, Math.max(0, Math.round((xpInTier / tierRange) * 100)));

  return {
    level: Math.max(1, calculatedLevel),
    title: currentTier.title,
    minXp: currentTier.minXp,
    maxXp: nextTier.minXp,
    progressPercent
  };
}

export function calculateXpEarned(session: {
  wpm: number;
  accuracy: number;
  elapsedSeconds: number;
  totalKeystrokes: number;
  mode: string;
}): number {
  // Prevent farming on tests with too few characters or seconds
  if (session.totalKeystrokes < 20 || session.elapsedSeconds < 8) {
    return 10;
  }

  const baseWpmXp = session.wpm * 1.5;
  const accuracyMultiplier = session.accuracy >= 98 ? 1.4 : session.accuracy >= 94 ? 1.2 : session.accuracy >= 90 ? 1.0 : 0.7;
  const durationBonus = Math.min(60, session.elapsedSeconds * 0.8);
  const modeBonus = session.mode === 'code' ? 35 : session.mode === 'academic' ? 25 : session.mode === 'race' ? 40 : 15;

  const total = Math.round((baseWpmXp * accuracyMultiplier) + durationBonus + modeBonus);
  return Math.max(20, Math.min(600, total));
}

export function updateStreak(currentStreak: number, lastActiveDate: string): { newStreak: number; streakUpdated: boolean } {
  const today = new Date().toISOString().split('T')[0];
  if (lastActiveDate === today) {
    return { newStreak: currentStreak, streakUpdated: false };
  }

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  if (lastActiveDate === yesterday) {
    return { newStreak: currentStreak + 1, streakUpdated: true };
  }

  // Streak broken or brand new
  return { newStreak: 1, streakUpdated: true };
}

export function processSessionGamification(
  session: TypingSessionResult,
  profile: UserProfile
): {
  updatedProfile: UserProfile;
  newAchievements: Achievement[];
  leveledUp: boolean;
  newLevelInfo: LevelInfo;
} {
  const xpEarned = calculateXpEarned({
    wpm: session.wpm,
    accuracy: session.accuracy,
    elapsedSeconds: session.elapsedSeconds,
    totalKeystrokes: session.totalKeystrokes,
    mode: session.mode
  });

  const prevLevelInfo = getLevelInfo(profile.xp);
  const newXp = profile.xp + xpEarned;
  const newLevelInfo = getLevelInfo(newXp);
  const leveledUp = newLevelInfo.level > prevLevelInfo.level;

  const { newStreak } = updateStreak(profile.streak, profile.lastActiveDate);

  // Update cumulative metrics
  const newTotalTests = profile.totalTests + 1;
  const newBestWpm = Math.max(profile.bestWpm, session.wpm);
  const newAvgWpm = Math.round(((profile.averageWpm * profile.totalTests) + session.wpm) / newTotalTests);
  const newAvgAcc = Number((((profile.averageAccuracy * profile.totalTests) + session.accuracy) / newTotalTests).toFixed(1));
  const newTimeTyped = profile.totalTimeTypedSeconds + Math.round(session.elapsedSeconds);

  // Update weak keys map
  const updatedWeakKeys = { ...profile.weakKeys };
  if (session.mistakeMap) {
    Object.entries(session.mistakeMap).forEach(([char, count]) => {
      updatedWeakKeys[char] = (updatedWeakKeys[char] || 0) + count;
    });
  }

  // Check achievements
  const existingAchievements = storage.getAchievements();
  const newAchievements: Achievement[] = [];
  const updatedAchievementsList = [...(profile.achievements || [])];

  existingAchievements.forEach(ach => {
    if (updatedAchievementsList.includes(ach.id)) return;

    let unlocked = false;
    if (ach.id === 'first-test' && newTotalTests >= 1) unlocked = true;
    if (ach.id === 'wpm-30' && session.wpm >= 30) unlocked = true;
    if (ach.id === 'wpm-60' && session.wpm >= 60) unlocked = true;
    if (ach.id === 'wpm-100' && session.wpm >= 100) unlocked = true;
    if (ach.id === 'wpm-120' && session.wpm >= 120) unlocked = true;
    if (ach.id === 'perfect-accuracy' && session.accuracy === 100 && session.totalKeystrokes >= 50) unlocked = true;
    if (ach.id === 'streak-3' && newStreak >= 3) unlocked = true;
    if (ach.id === 'streak-7' && newStreak >= 7) unlocked = true;
    if (ach.id === 'tests-25' && newTotalTests >= 25) unlocked = true;
    if (ach.id === 'level-10' && newLevelInfo.level >= 10) unlocked = true;
    if (ach.id === 'level-20' && newLevelInfo.level >= 20) unlocked = true;
    if (ach.id === 'academic-scholar' && session.mode === 'academic') unlocked = true;
    if (ach.id === 'code-master' && session.mode === 'code') unlocked = true;
    if (ach.id === 'assignment-typed' && session.mode === 'custom') unlocked = true;

    if (unlocked) {
      ach.unlockedAt = Date.now();
      ach.progress = 100;
      updatedAchievementsList.push(ach.id);
      newAchievements.push(ach);
    }
  });

  storage.saveAchievements(existingAchievements);

  const updatedProfile: UserProfile = {
    ...profile,
    level: newLevelInfo.level,
    xp: newXp,
    streak: newStreak,
    lastActiveDate: new Date().toISOString().split('T')[0],
    bestWpm: newBestWpm,
    averageWpm: newAvgWpm,
    averageAccuracy: newAvgAcc,
    totalTests: newTotalTests,
    totalTimeTypedSeconds: newTimeTyped,
    weakKeys: updatedWeakKeys,
    achievements: updatedAchievementsList
  };

  storage.saveProfile(updatedProfile);

  return {
    updatedProfile,
    newAchievements,
    leveledUp,
    newLevelInfo
  };
}
