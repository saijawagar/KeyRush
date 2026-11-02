import React, { useState, useRef } from 'react';
import { soundManager } from '../utils/audio';
import {
  ArrowRight,
  Zap,
  GraduationCap,
  Code,
  Flag,
  Shield,
  BookOpen,
  Sparkles,
  Trophy,
  CheckCircle2,
  Users,
  Flame,
  Star
} from 'lucide-react';

interface LandingPageProps {
  onStartTyping: () => void;
  onExploreModes: () => void;
  onNavigateTab: (tab: string) => void;
}

const HERO_WORDS = ['velocity', 'algorithm', 'syntax', 'precision', 'keyboard', 'focus'];

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartTyping,
  onExploreModes,
  onNavigateTab
}) => {
  // Interactive mini typing preview in hero
  const [wordIdx, setWordIdx] = useState(0);
  const [typedInput, setTypedInput] = useState('');
  const [previewWpm, setPreviewWpm] = useState(65);
  const heroInputRef = useRef<HTMLInputElement>(null);

  const currentTargetWord = HERO_WORDS[wordIdx] || 'velocity';

  const handleHeroInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    soundManager.playKey('thocky', false);

    if (val.endsWith(' ') || val === currentTargetWord) {
      if (val.trim() === currentTargetWord) {
        setWordIdx(prev => (prev + 1) % HERO_WORDS.length);
        setTypedInput('');
        setPreviewWpm(w => Math.min(130, w + 4));
        soundManager.playKey('thocky', true);
      }
    } else {
      setTypedInput(val);
    }
  };

  return (
    <div className="w-full flex flex-col gap-24 pb-20 select-none">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 flex flex-col items-center text-center px-4">
        {/* Glow backdrop lights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-purple-600/15 blur-[120px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-1/3 -translate-x-1/2 w-[350px] h-[250px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

        {/* College Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-6 shadow-glow-purple">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          Engineered for College Students & Developers
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-display tracking-tight text-white max-w-4xl leading-[1.1]">
          Your keyboard. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-300 to-purple-400">
            Your speed. Your arena.
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mt-6 leading-relaxed">
          Improve your typing speed, dominate coding challenges, and compete with college students around the world.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          <button
            onClick={onStartTyping}
            className="px-8 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-glow-purple transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
          >
            Start Typing <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onExploreModes}
            className="px-8 py-3.5 rounded-2xl bg-[#181b26] hover:bg-slate-800 text-slate-200 font-bold text-sm border border-[#262b3d] transition-all flex items-center gap-2"
          >
            Explore Challenges
          </button>
        </div>

        {/* Interactive Typing Preview in Hero */}
        <div
          onClick={() => heroInputRef.current?.focus()}
          className="mt-14 w-full max-w-2xl p-6 sm:p-8 rounded-3xl bg-[#12141c]/90 border border-[#262b3d] shadow-2xl backdrop-blur-xl flex flex-col items-center gap-4 cursor-text hover:border-purple-500/50 transition-colors"
        >
          <div className="flex items-center justify-between w-full text-xs font-mono text-slate-400 border-b border-[#262b3d] pb-3">
            <span className="flex items-center gap-2 text-purple-400 font-sans font-bold">
              <Zap className="w-4 h-4" /> Interactive Test-Drive
            </span>
            <span>Speed: <strong className="text-emerald-400">{previewWpm} WPM</strong></span>
          </div>

          <div className="font-mono text-2xl sm:text-3xl tracking-wide my-2 flex items-center gap-1">
            <span className="text-purple-400 font-bold underline underline-offset-8">
              {currentTargetWord.slice(0, typedInput.length)}
            </span>
            <span className="w-0.5 h-7 bg-purple-400 animate-caret-blink inline-block" />
            <span className="text-slate-600">
              {currentTargetWord.slice(typedInput.length)}
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Type the word above and hit <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">Space</kbd>
          </p>

          <input
            ref={heroInputRef}
            type="text"
            value={typedInput}
            onChange={handleHeroInputChange}
            className="opacity-0 absolute -z-10"
            autoFocus
          />
        </div>
      </section>

      {/* Live Platform Stats */}
      <section className="max-w-5xl mx-auto w-full px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-3xl bg-[#12141c] border border-[#262b3d]">
          <div className="flex flex-col items-center text-center p-3">
            <span className="text-3xl md:text-4xl font-black font-mono text-purple-400">14.2M</span>
            <span className="text-xs font-semibold text-slate-400 uppercase mt-1">Keystrokes Typed</span>
          </div>
          <div className="flex flex-col items-center text-center p-3">
            <span className="text-3xl md:text-4xl font-black font-mono text-cyan-400">420+</span>
            <span className="text-xs font-semibold text-slate-400 uppercase mt-1">Colleges Represented</span>
          </div>
          <div className="flex flex-col items-center text-center p-3">
            <span className="text-3xl md:text-4xl font-black font-mono text-emerald-400">+38%</span>
            <span className="text-xs font-semibold text-slate-400 uppercase mt-1">Avg Speed Boost</span>
          </div>
          <div className="flex flex-col items-center text-center p-3">
            <span className="text-3xl md:text-4xl font-black font-mono text-amber-400">98.4%</span>
            <span className="text-xs font-semibold text-slate-400 uppercase mt-1">Avg Target Accuracy</span>
          </div>
        </div>
      </section>

      {/* Game Modes Showcase */}
      <section className="max-w-5xl mx-auto w-full px-4 flex flex-col gap-10">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Built for the Academic Journey</span>
          <h2 className="text-3xl sm:text-4xl font-black font-display text-white mt-2">
            Engineered for Modern College Life
          </h2>
          <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
            From technical coding syntax to real assignment typing, practice what actually moves your career forward.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Academic Mode */}
          <div
            onClick={() => onNavigateTab('academic')}
            className="p-6 rounded-3xl bg-[#12141c] hover:bg-[#181b26] border border-[#262b3d] hover:border-purple-500/50 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 w-fit mb-4">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display text-white group-hover:text-purple-300 transition-colors">
                Academic Curriculum
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Practice real passages across Computer Science, Linear Algebra, Thermodynamics, and Economics.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#262b3d] flex items-center justify-between text-xs text-purple-400 font-bold">
              <span>Explore Subjects</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Code Mode */}
          <div
            onClick={() => onNavigateTab('code')}
            className="p-6 rounded-3xl bg-[#12141c] hover:bg-[#181b26] border border-[#262b3d] hover:border-cyan-500/50 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 w-fit mb-4">
                <Code className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display text-white group-hover:text-cyan-300 transition-colors">
                Real Code & Syntax
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Master semicolons, braces, brackets, and operators in Python, TypeScript, Java, C++, and SQL.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#262b3d] flex items-center justify-between text-xs text-cyan-400 font-bold">
              <span>Code Challenges</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: College Race */}
          <div
            onClick={() => onNavigateTab('race')}
            className="p-6 rounded-3xl bg-[#12141c] hover:bg-[#181b26] border border-[#262b3d] hover:border-amber-500/50 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 w-fit mb-4">
                <Flag className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display text-white group-hover:text-amber-300 transition-colors">
                College Race Track
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Race side-by-side against student bots from MIT, Stanford, Oxford, and Berkeley on an animated track.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#262b3d] flex items-center justify-between text-xs text-amber-400 font-bold">
              <span>Enter Race</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Survival Mode */}
          <div
            onClick={() => onNavigateTab('survival')}
            className="p-6 rounded-3xl bg-[#12141c] hover:bg-[#181b26] border border-[#262b3d] hover:border-rose-500/50 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 w-fit mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display text-white group-hover:text-rose-300 transition-colors">
                Endless Survival
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Rapid arcade typing. Every mistake drains your health integrity. Maintain combos to survive!
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#262b3d] flex items-center justify-between text-xs text-rose-400 font-bold">
              <span>Play Survival</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5: Assignment Uploader */}
          <div
            onClick={() => onNavigateTab('document')}
            className="p-6 rounded-3xl bg-[#12141c] hover:bg-[#181b26] border border-[#262b3d] hover:border-purple-500/50 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 w-fit mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display text-white group-hover:text-purple-300 transition-colors">
                Assignment-to-Typing
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Upload your actual lecture notes or homework PDF and convert it directly into typing practice passages.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#262b3d] flex items-center justify-between text-xs text-purple-400 font-bold">
              <span>Upload Notes</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 6: AI Adaptive Drills */}
          <div
            onClick={() => onNavigateTab('adaptive')}
            className="p-6 rounded-3xl bg-[#12141c] hover:bg-[#181b26] border border-[#262b3d] hover:border-emerald-500/50 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display text-white group-hover:text-emerald-300 transition-colors">
                Adaptive Mistake Drills
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Interactive heatmap detects your specific stumbling blocks and generates targeted finger workouts.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#262b3d] flex items-center justify-between text-xs text-emerald-400 font-bold">
              <span>View Weak Keys</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Student Testimonials */}
      <section className="max-w-5xl mx-auto w-full px-4 flex flex-col gap-8">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Loved by College Students</span>
          <h2 className="text-3xl font-black font-display text-white mt-1">
            Built for Students, Tested by Typists
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-[#12141c] border border-[#262b3d] flex flex-col justify-between">
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "KeyRush's Code Mode helped me increase my syntax typing from 45 to 88 WPM before my technical software engineering interviews."
            </p>
            <div className="mt-4 pt-3 border-t border-[#262b3d] flex items-center gap-3">
              <span className="text-xl">👩‍💻</span>
              <div>
                <h4 className="text-xs font-bold text-white">Elena R.</h4>
                <p className="text-[10px] text-slate-500">CS Senior • Stanford University</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#12141c] border border-[#262b3d] flex flex-col justify-between">
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "The assignment-to-typing feature is genius. I uploaded my biology review slides and typed them out to study for midterms."
            </p>
            <div className="mt-4 pt-3 border-t border-[#262b3d] flex items-center gap-3">
              <span className="text-xl">🧬</span>
              <div>
                <h4 className="text-xs font-bold text-white">Marcus T.</h4>
                <p className="text-[10px] text-slate-500">Pre-Med Junior • UC Berkeley</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#12141c] border border-[#262b3d] flex flex-col justify-between">
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "The mechanical keyboard sounds and College Race mode make practicing addictive. Our dorm competes on the leaderboard every night."
            </p>
            <div className="mt-4 pt-3 border-t border-[#262b3d] flex items-center gap-3">
              <span className="text-xl">⚡</span>
              <div>
                <h4 className="text-xs font-bold text-white">Devin K.</h4>
                <p className="text-[10px] text-slate-500">EECS Sophomore • MIT</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-5xl mx-auto w-full px-4">
        <div className="p-10 md:p-12 rounded-3xl bg-gradient-to-r from-purple-900/50 via-[#181b26] to-cyan-900/30 border border-purple-500/30 flex flex-col items-center text-center gap-4">
          <h2 className="text-3xl md:text-4xl font-black font-display text-white">
            Ready to claim the top rank on campus?
          </h2>
          <p className="text-slate-300 text-sm max-w-lg">
            Jump into a quick 30-second session now. No registration required to practice.
          </p>
          <button
            onClick={onStartTyping}
            className="mt-4 px-8 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-glow-purple transition-all flex items-center gap-2 hover:scale-105"
          >
            Start Typing Now <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
