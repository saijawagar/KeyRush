import React, { useState } from 'react';
import { CODE_LANGUAGES } from '../data/codeSnippets';
import { Terminal, FileCode2, Code, Layers, Coffee, Database, ChevronRight, Hash, Braces } from 'lucide-react';

interface CodeModeProps {
  onSelectCodeSnippet: (snippet: { title: string; code: string; language: string; difficulty: string }) => void;
}

export const CodeMode: React.FC<CodeModeProps> = ({ onSelectCodeSnippet }) => {
  const [selectedLangId, setSelectedLangId] = useState<string>('python');
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');

  const activeLang = CODE_LANGUAGES.find(l => l.id === selectedLangId) || CODE_LANGUAGES[0];

  const filteredSnippets = activeLang.snippets.filter(
    s => difficultyFilter === 'All' || s.difficulty === difficultyFilter
  );

  const getLangIcon = (iconName: string) => {
    switch (iconName) {
      case 'Terminal': return <Terminal className="w-5 h-5 text-emerald-400" />;
      case 'FileCode2': return <FileCode2 className="w-5 h-5 text-amber-400" />;
      case 'Code': return <Code className="w-5 h-5 text-cyan-400" />;
      case 'Layers': return <Layers className="w-5 h-5 text-purple-400" />;
      case 'Coffee': return <Coffee className="w-5 h-5 text-rose-400" />;
      case 'Database': return <Database className="w-5 h-5 text-sky-400" />;
      default: return <Braces className="w-5 h-5" />;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-cyan-950/30 to-[#12141c] border border-cyan-500/20">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Braces className="w-4 h-4" /> Developer Arena
          </div>
          <h2 className="text-2xl md:text-3xl font-black font-display text-white">
            Code & Syntax Mode
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Build muscle memory for brackets <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded">{}</code>, indentation, semicolons <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded">;</code>, arrows <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded">=&gt;</code>, and real production syntax.
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
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Language Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {CODE_LANGUAGES.map(lang => {
          const isSelected = lang.id === selectedLangId;
          return (
            <button
              key={lang.id}
              onClick={() => setSelectedLangId(lang.id)}
              className={`p-4 rounded-2xl flex flex-col items-center text-center gap-2.5 transition-all border ${
                isSelected
                  ? 'bg-cyan-500/15 border-cyan-500/60 text-cyan-300 shadow-glow-cyan ring-1 ring-cyan-500/30'
                  : 'bg-[#181b26] border-[#262b3d] text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-cyan-500/20' : 'bg-slate-800'}`}>
                {getLangIcon(lang.icon)}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold tracking-tight">{lang.name}</span>
                <span className="text-[10px] font-mono text-slate-500">{lang.extension}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Code Snippets List */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            Available {activeLang.name} Challenges
            <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-400">
              {filteredSnippets.length}
            </span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredSnippets.map(snippet => (
            <div
              key={snippet.id}
              onClick={() => onSelectCodeSnippet({
                title: snippet.title,
                code: snippet.code,
                language: activeLang.name,
                difficulty: snippet.difficulty
              })}
              className="group p-6 rounded-2xl bg-[#12141c] hover:bg-[#181b26] border border-[#262b3d] hover:border-cyan-500/50 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    snippet.difficulty === 'Easy'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                      : snippet.difficulty === 'Medium'
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                      : 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                  }`}>
                    {snippet.difficulty}
                  </span>
                  <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                    <Hash className="w-3 h-3" /> {snippet.code.split('\n').length} lines
                  </span>
                </div>

                <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {snippet.title}
                </h4>

                <p className="text-xs text-slate-400 mt-1 mb-3">
                  {snippet.description}
                </p>

                {/* Code Preview Block */}
                <div className="p-3 rounded-xl bg-[#090a0f] border border-slate-800/80 font-mono text-[11px] text-slate-300 overflow-x-hidden leading-relaxed max-h-24 opacity-80 group-hover:opacity-100 transition-opacity">
                  <pre className="whitespace-pre">
                    {snippet.code.split('\n').slice(0, 4).join('\n')}
                  </pre>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[#262b3d]/60 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono">
                  {snippet.code.length} chars
                </span>
                <span className="text-cyan-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Code Practice <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
