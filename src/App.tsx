import React, { useState, useEffect } from 'react';
import { storage } from './services/storage';
import { getLevelInfo, processSessionGamification } from './services/gamification';
import { generateWordList } from './data/classicWords';
import { UserProfile, LevelInfo, Achievement } from './types/gamification';
import { TestDuration, TypingMetrics, TypingSessionResult } from './types/typing';
import { supabaseService } from './services/supabase';
import { soundManager } from './utils/audio';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { TypingEngine } from './components/TypingEngine';
import { ResultsModal } from './components/ResultsModal';
import { AcademicMode } from './components/AcademicMode';
import { CodeMode } from './components/CodeMode';
import { CollegeRace } from './components/CollegeRace';
import { SurvivalMode } from './components/SurvivalMode';
import { AssignmentUploader } from './components/AssignmentUploader';
import { AdaptivePractice } from './components/AdaptivePractice';
import { Leaderboard } from './components/Leaderboard';
import { Dashboard } from './components/Dashboard';
import { SettingsModal } from './components/SettingsModal';
import { ProfileModal } from './components/ProfileModal';
import { AchievementToast } from './components/AchievementToast';

export function App() {
  const [profile, setProfile] = useState<UserProfile>(() => storage.getProfile());
  const [sessions, setSessions] = useState<TypingSessionResult[]>(() => storage.getSessions());
  const [achievements, setAchievements] = useState<Achievement[]>(() => storage.getAchievements());

  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeToast, setActiveToast] = useState<Achievement | null>(null);

  // Active Practice State
  const [practicePassage, setPracticePassage] = useState<string>(() => generateWordList(45, true));
  const [practiceDuration, setPracticeDuration] = useState<TestDuration>(30);
  const [practiceTitle, setPracticeTitle] = useState<string>('Standard Word Stream');
  const [practiceMode, setPracticeMode] = useState<'classic' | 'academic' | 'code' | 'race' | 'survival' | 'daily' | 'custom' | 'adaptive'>('classic');
  const [practiceCategory, setPracticeCategory] = useState<string | undefined>(undefined);

  // Test Results Modal State
  const [completedMetrics, setCompletedMetrics] = useState<TypingMetrics | null>(null);
  const [lastXpEarned, setLastXpEarned] = useState<number>(0);
  const [isNewPersonalBest, setIsNewPersonalBest] = useState<boolean>(false);

  // Apply theme class on body
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', profile.theme);
    soundManager.setVolume(profile.soundVolume);
    soundManager.setMuted(!profile.soundEnabled);
  }, [profile.theme, profile.soundVolume, profile.soundEnabled]);

  const levelInfo: LevelInfo = getLevelInfo(profile.xp);

  // Handle test completion
  const handleTestComplete = (metrics: TypingMetrics) => {
    const isNewBest = metrics.wpm > profile.bestWpm;
    setIsNewPersonalBest(isNewBest);

    const sessionResult: TypingSessionResult = {
      ...metrics,
      id: `session-${Date.now()}`,
      timestamp: Date.now(),
      mode: practiceMode,
      category: practiceCategory,
      duration: practiceDuration,
      passageTitle: practiceTitle,
      xpEarned: 0 // calculated in gamification
    };

    const { updatedProfile, newAchievements } = processSessionGamification(sessionResult, profile);
    sessionResult.xpEarned = updatedProfile.xp - profile.xp;
    setLastXpEarned(sessionResult.xpEarned);

    // Save session
    storage.saveSession(sessionResult);
    setSessions(storage.getSessions());
    setProfile(updatedProfile);
    setAchievements(storage.getAchievements());

    // Async sync to Supabase if connected
    supabaseService.syncSession(sessionResult, updatedProfile);

    // Achievement alerts
    if (newAchievements.length > 0) {
      setActiveToast(newAchievements[0]);
    }

    setCompletedMetrics(metrics);
  };

  // Next Passage Generator
  const handleNextPassage = () => {
    setCompletedMetrics(null);
    if (practiceMode === 'classic') {
      setPracticePassage(generateWordList(45, true));
      setPracticeTitle('Standard Word Stream');
    }
  };

  // Start Academic passage
  const handleStartAcademicPassage = (item: { title: string; content: string; subject: string; difficulty: string }) => {
    setPracticePassage(item.content);
    setPracticeTitle(`${item.subject}: ${item.title}`);
    setPracticeMode('academic');
    setPracticeCategory(item.subject);
    setPracticeDuration(60);
    setCompletedMetrics(null);
    setCurrentTab('practice');
  };

  // Start Code snippet
  const handleStartCodeSnippet = (snippet: { title: string; code: string; language: string; difficulty: string }) => {
    setPracticePassage(snippet.code);
    setPracticeTitle(`${snippet.language}: ${snippet.title}`);
    setPracticeMode('code');
    setPracticeCategory(snippet.language);
    setPracticeDuration(60);
    setCompletedMetrics(null);
    setCurrentTab('practice');
  };

  // Start Custom Assignment text
  const handleStartAssignment = (passage: { title: string; content: string }) => {
    setPracticePassage(passage.content);
    setPracticeTitle(passage.title);
    setPracticeMode('custom');
    setPracticeCategory('Homework');
    setPracticeDuration(60);
    setCompletedMetrics(null);
    setCurrentTab('practice');
  };

  // Start Adaptive drill
  const handleStartAdaptiveDrill = (drill: { title: string; content: string }) => {
    setPracticePassage(drill.content);
    setPracticeTitle(drill.title);
    setPracticeMode('adaptive');
    setPracticeCategory('Weak Keys');
    setPracticeDuration(30);
    setCompletedMetrics(null);
    setCurrentTab('practice');
  };

  // Start Daily Challenge
  const handleStartDailyChallenge = () => {
    const today = new Date().toISOString().split('T')[0];
    const dailyPrompt = `Today's Universal College Challenge for ${today}: Cognitive ergonomics in modern distributed systems prioritize high-concurrency event loops, asynchronous backpressure handling, and low-latency throughput. Speed with precision defines championship engineering.`;
    setPracticePassage(dailyPrompt);
    setPracticeTitle(`Daily Sprint (${today})`);
    setPracticeMode('daily');
    setPracticeCategory('Daily Sprint');
    setPracticeDuration(30);
    setCompletedMetrics(null);
    setCurrentTab('practice');
  };

  // Race Finish Handler
  const handleRaceFinish = (wpm: number, accuracy: number, rank: number) => {
    const metrics: TypingMetrics = {
      wpm,
      rawWpm: Math.round(wpm * 1.08),
      accuracy,
      correctChars: Math.round(wpm * 5),
      incorrectChars: Math.round(wpm * 0.15),
      extraChars: 0,
      missedChars: 0,
      totalKeystrokes: Math.round(wpm * 5 * 1.05),
      elapsedSeconds: 30,
      consistency: 88,
      timeline: [],
      mistakeMap: {}
    };
    handleTestComplete(metrics);
  };

  // Survival Game Over Handler
  const handleSurvivalGameOver = (score: number, maxCombo: number, durationSeconds: number) => {
    const approxWpm = Math.max(30, Math.round((score / 15) / Math.max(0.5, durationSeconds / 60)));
    const metrics: TypingMetrics = {
      wpm: approxWpm,
      rawWpm: approxWpm,
      accuracy: 94,
      correctChars: score,
      incorrectChars: 6,
      extraChars: 0,
      missedChars: 0,
      totalKeystrokes: score + 6,
      elapsedSeconds: durationSeconds,
      consistency: 85,
      timeline: [],
      mistakeMap: {}
    };
    handleTestComplete(metrics);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--text-primary)]">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCompletedMetrics(null);
          setCurrentTab(tab);
        }}
        profile={profile}
        levelInfo={levelInfo}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Main Page Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 flex flex-col items-center">
        {/* TAB 1: Landing Page */}
        {currentTab === 'landing' && (
          <LandingPage
            onStartTyping={() => {
              setPracticeMode('classic');
              setPracticePassage(generateWordList(45, true));
              setPracticeTitle('Standard Word Stream');
              setCurrentTab('practice');
            }}
            onExploreModes={() => setCurrentTab('academic')}
            onNavigateTab={setCurrentTab}
          />
        )}

        {/* TAB 2: Core Practice Arena */}
        {currentTab === 'practice' && (
          <div className="w-full flex flex-col items-center gap-6">
            {!completedMetrics ? (
              <TypingEngine
                passage={practicePassage}
                duration={practiceDuration}
                onDurationChange={(d) => setPracticeDuration(d)}
                onComplete={handleTestComplete}
                soundEnabled={profile.soundEnabled}
                onToggleSound={() => {
                  const updated = !profile.soundEnabled;
                  setProfile(p => ({ ...p, soundEnabled: updated }));
                  storage.saveProfile({ ...profile, soundEnabled: updated });
                }}
                soundType={profile.soundType}
                caretStyle={profile.caretStyle}
                fontSize={profile.fontSize}
                title={practiceTitle}
                modeLabel={practiceMode}
              />
            ) : (
              <ResultsModal
                metrics={completedMetrics}
                xpEarned={lastXpEarned}
                levelInfo={levelInfo}
                isNewBest={isNewPersonalBest}
                onRestart={() => setCompletedMetrics(null)}
                onNextTest={handleNextPassage}
                onPracticeWeakKeys={(keys) => {
                  handleStartAdaptiveDrill({
                    title: `Target Drill: [${keys.join(', ')}]`,
                    content: generateWordList(40, true)
                  });
                }}
              />
            )}
          </div>
        )}

        {/* TAB 3: Academic Mode */}
        {currentTab === 'academic' && (
          <AcademicMode onSelectPassage={handleStartAcademicPassage} />
        )}

        {/* TAB 4: Code Mode */}
        {currentTab === 'code' && (
          <CodeMode onSelectCodeSnippet={handleStartCodeSnippet} />
        )}

        {/* TAB 5: College Race */}
        {currentTab === 'race' && (
          <CollegeRace
            userUsername={profile.username}
            userCollege={profile.college}
            onFinishRace={handleRaceFinish}
          />
        )}

        {/* TAB 6: Survival Mode */}
        {currentTab === 'survival' && (
          <SurvivalMode onGameOver={handleSurvivalGameOver} />
        )}

        {/* TAB 7: Assignment-to-Typing */}
        {currentTab === 'document' && (
          <AssignmentUploader onStartCustomPassage={handleStartAssignment} />
        )}

        {/* TAB 8: AI Adaptive Practice */}
        {currentTab === 'adaptive' && (
          <AdaptivePractice
            weakKeysMap={profile.weakKeys}
            onStartAdaptivePassage={handleStartAdaptiveDrill}
          />
        )}

        {/* TAB 9: Leaderboard */}
        {currentTab === 'leaderboard' && (
          <Leaderboard userProfile={profile} />
        )}

        {/* TAB 10: Student Dashboard */}
        {currentTab === 'dashboard' && (
          <Dashboard
            profile={profile}
            levelInfo={levelInfo}
            sessions={sessions}
            onStartDailyChallenge={handleStartDailyChallenge}
            onNavigateTab={setCurrentTab}
          />
        )}
      </main>

      {/* Global Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        profile={profile}
        onUpdateProfile={(updated) => {
          const newProfile = { ...profile, ...updated };
          setProfile(newProfile);
          storage.saveProfile(newProfile);
        }}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        achievements={achievements}
        onUpdateProfile={(updated) => {
          const newProfile = { ...profile, ...updated };
          setProfile(newProfile);
          storage.saveProfile(newProfile);
        }}
      />

      {/* Achievement Unlock Celebration Toast */}
      <AchievementToast
        achievement={activeToast}
        onDismiss={() => setActiveToast(null)}
      />

      {/* Footer */}
      <Footer onNavigateTab={setCurrentTab} isSupabaseConnected={supabaseService.isConnected()} />
    </div>
  );
}

export default App;
