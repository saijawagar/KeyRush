import React, { useState } from 'react';
import { extractTextFromFile, chunkTextIntoPassages, ExtractedPassage } from '../utils/textExtractor';
import { UploadCloud, FileText, CheckCircle, AlertCircle, ArrowRight, BookOpen, Layers } from 'lucide-react';

interface AssignmentUploaderProps {
  onStartCustomPassage: (passage: { title: string; content: string }) => void;
}

export const AssignmentUploader: React.FC<AssignmentUploaderProps> = ({ onStartCustomPassage }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [pastedText, setPastedText] = useState('');
  const [wordsPerChunk, setWordsPerChunk] = useState<number>(60);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [extractedPassages, setExtractedPassages] = useState<ExtractedPassage[]>([]);
  const [selectedPassageIndex, setSelectedPassageIndex] = useState<number>(0);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const rawText = await extractTextFromFile(file);
      const chunks = chunkTextIntoPassages(rawText, wordsPerChunk, file.name.replace(/\.[^/.]+$/, ''));

      if (chunks.length === 0) {
        throw new Error('No readable text content found in this file. Try pasting the assignment text directly.');
      }

      setExtractedPassages(chunks);
      setSelectedPassageIndex(0);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to extract text from document. Please use the text paste tab.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePasteProcess = () => {
    if (!pastedText.trim()) {
      setErrorMessage('Please paste your study notes, essay, or assignment text first.');
      return;
    }

    setErrorMessage(null);
    const chunks = chunkTextIntoPassages(pastedText, wordsPerChunk, 'Course Notes');
    if (chunks.length === 0) {
      setErrorMessage('Unable to process pasted text. Ensure it contains words.');
      return;
    }

    setExtractedPassages(chunks);
    setSelectedPassageIndex(0);
  };

  const handleStartTyping = () => {
    const selected = extractedPassages[selectedPassageIndex];
    if (selected) {
      onStartCustomPassage({
        title: selected.title,
        content: selected.content
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/40 to-[#12141c] border border-purple-500/20">
        <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
          <BookOpen className="w-4 h-4" /> Academic Workflow
        </div>
        <h2 className="text-2xl md:text-3xl font-black font-display text-white">
          Assignment-to-Typing Engine
        </h2>
        <p className="text-slate-400 text-sm mt-1 max-w-2xl">
          Transform your real college homework, lecture slides, research papers, and study guides into interactive typing tests. Retain academic concepts while building typing speed!
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#262b3d] pb-2">
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'upload'
              ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <UploadCloud className="w-4 h-4" /> Upload Document (PDF / TXT)
        </button>
        <button
          onClick={() => setActiveTab('paste')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'paste'
              ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" /> Paste Lecture Notes
        </button>
      </div>

      {/* Controls / Options */}
      <div className="flex items-center gap-4 bg-[#12141c] p-4 rounded-2xl border border-[#262b3d] text-xs">
        <span className="text-slate-400 font-semibold flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-purple-400" /> Target Passage Length:
        </span>
        <div className="flex items-center gap-1">
          {([30, 60, 120, 200] as const).map(count => (
            <button
              key={count}
              onClick={() => {
                setWordsPerChunk(count);
                if (extractedPassages.length > 0 && pastedText) {
                  const chunks = chunkTextIntoPassages(pastedText, count, 'Course Notes');
                  setExtractedPassages(chunks);
                }
              }}
              className={`px-3 py-1 rounded-lg font-mono font-bold transition-all ${
                wordsPerChunk === count
                  ? 'bg-purple-600 text-white shadow-glow-purple'
                  : 'bg-[#181b26] text-slate-400 hover:text-slate-200'
              }`}
            >
              {count} words
            </button>
          ))}
        </div>
      </div>

      {/* Upload or Paste Area */}
      {activeTab === 'upload' ? (
        <label className="flex flex-col items-center justify-center p-12 rounded-3xl border-2 border-dashed border-[#262b3d] hover:border-purple-500/60 bg-[#12141c]/60 hover:bg-[#12141c] transition-all cursor-pointer group">
          <UploadCloud className="w-12 h-12 text-purple-400 group-hover:scale-110 transition-transform mb-3" />
          <span className="text-base font-bold text-white mb-1">
            Drag & drop your file or browse
          </span>
          <span className="text-xs text-slate-500 font-mono">
            Supports PDF, TXT, MD, Code files
          </span>
          <input
            type="file"
            accept=".pdf,.txt,.md,.json,.js,.py,.java,.cpp"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      ) : (
        <div className="flex flex-col gap-3">
          <textarea
            value={pastedText}
            onChange={e => setPastedText(e.target.value)}
            placeholder="Paste your syllabus, thesis abstract, study questions, or lecture transcript here..."
            className="w-full h-44 p-4 rounded-2xl bg-[#12141c] border border-[#262b3d] text-slate-200 font-mono text-sm leading-relaxed focus:border-purple-500/50 outline-none resize-none"
          />
          <button
            onClick={handlePasteProcess}
            className="self-end px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-glow-purple flex items-center gap-2"
          >
            Extract Passages <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Error Notice */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Processed Passages Preview Carousel / List */}
      {extractedPassages.length > 0 && (
        <div className="flex flex-col gap-4 p-6 rounded-3xl bg-[#12141c] border border-[#262b3d]">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Generated {extractedPassages.length} Practice Passages
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Select one to practice
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
            {extractedPassages.map((chunk, idx) => {
              const isSelected = idx === selectedPassageIndex;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedPassageIndex(idx)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-purple-600/15 border-purple-500 text-purple-300 shadow-glow-purple'
                      : 'bg-[#181b26] border-[#262b3d] text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono mb-2">
                      <span className="font-bold text-white">{chunk.title}</span>
                      <span className="text-slate-500">{chunk.wordCount} words</span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono line-clamp-2">
                      {chunk.preview}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Start Test CTA */}
          <div className="flex justify-end pt-4 border-t border-[#262b3d]">
            <button
              onClick={handleStartTyping}
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-glow-purple flex items-center gap-2"
            >
              Start Typing Assignment <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
