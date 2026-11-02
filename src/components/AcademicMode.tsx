import React, { useState } from 'react';
import { ACADEMIC_SUBJECTS } from '../data/academicPassages';
import { AcademicSubject } from '../types/modes';
import { Cpu, Binary, Cog, FlaskConical, TrendingUp, BookOpen, GraduationCap, ChevronRight, CheckCircle2 } from 'lucide-react';

interface AcademicModeProps {
  onSelectPassage: (passage: { title: string; content: string; subject: string; difficulty: string }) => void;
}

export const AcademicMode: React.FC<AcademicModeProps> = ({ onSelectPassage }) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('cs');
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');

  const activeSubject = ACADEMIC_SUBJECTS.find(s => s.id === selectedSubjectId) || ACADEMIC_SUBJECTS[0];

  const filteredPassages = activeSubject.passages.filter(
    p => difficultyFilter === 'All' || p.difficulty === difficultyFilter
  );

  const getSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu': return <Cpu className="w-5 h-5" />;
      case 'Binary': return <Binary className="w-5 h-5" />;
      case 'Cog': return <Cog className="w-5 h-5" />;
      case 'FlaskConical': return <FlaskConical className="w-5 h-5" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5" />;
      default: return <GraduationCap className="w-5 h-5" />;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
      {/* Subject Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-purple-950/30 to-[#12141c] border border-purple-500/20">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
            <GraduationCap className="w-4 h-4" /> Academic Arena
          </div>
          <h2 className="text-2xl md:text-3xl font-black font-display text-white">
            College Curriculum Practice
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Master typing technical terminology, mathematical theorems, scientific literature, and exam-grade discourse without typos.
          </p>
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-1 bg-[#181b26] p-1.5 rounded-2xl border border-[#262b3d]">
          {(['All', 'Easy', 'Medium', 'Hard'] as const).map(d => (
            <button
              key={d}
              onClick={() => setDifficultyFilter(d)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                difficultyFilter === d
                  ? 'bg-purple-600 text-white shadow-glow-purple'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Subject Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {ACADEMIC_SUBJECTS.map(subject => {
          const isSelected = subject.id === selectedSubjectId;
          return (
            <button
              key={subject.id}
              onClick={() => setSelectedSubjectId(subject.id)}
              className={`p-4 rounded-2xl flex flex-col items-center text-center gap-2.5 transition-all border ${
                isSelected
                  ? 'bg-purple-600/15 border-purple-500/60 text-purple-300 shadow-glow-purple ring-1 ring-purple-500/30'
                  : 'bg-[#181b26] border-[#262b3d] text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-purple-500/20 text-purple-300' : 'bg-slate-800 text-slate-400'}`}>
                {getSubjectIcon(subject.icon)}
              </div>
              <span className="text-xs font-bold tracking-tight">{subject.name}</span>
            </button>
          );
        })}
      </div>

      {/* Passages List */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            Available Passages in {activeSubject.name}
            <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-400">
              {filteredPassages.length}
            </span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredPassages.map(passage => (
            <div
              key={passage.id}
              onClick={() => onSelectPassage({
                title: passage.title,
                content: passage.content,
                subject: activeSubject.name,
                difficulty: passage.difficulty
              })}
              className="group p-6 rounded-2xl bg-[#12141c] hover:bg-[#181b26] border border-[#262b3d] hover:border-purple-500/50 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    passage.difficulty === 'Easy'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                      : passage.difficulty === 'Medium'
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                      : 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                  }`}>
                    {passage.difficulty}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    {passage.content.split(' ').length} words
                  </span>
                </div>

                <h4 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                  {passage.title}
                </h4>

                <p className="text-xs text-slate-400 line-clamp-3 mt-2 font-mono leading-relaxed opacity-80">
                  {passage.content}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-[#262b3d]/60 flex items-center justify-between text-xs">
                <span className="text-slate-500 truncate max-w-[170px]" title={passage.source}>
                  {passage.source}
                </span>
                <span className="text-purple-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Practice <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
