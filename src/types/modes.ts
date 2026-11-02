export type GameModeType = 
  | 'classic'
  | 'academic'
  | 'code'
  | 'race'
  | 'survival'
  | 'daily'
  | 'document'
  | 'adaptive';

export interface AcademicSubject {
  id: string;
  name: string;
  icon: string;
  description: string;
  passages: {
    id: string;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    content: string;
    source: string;
  }[];
}

export interface CodeLanguage {
  id: string;
  name: string;
  extension: string;
  icon: string;
  snippets: {
    id: string;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    code: string;
    description: string;
  }[];
}

export interface RaceOpponent {
  id: string;
  name: string;
  avatar: string;
  college: string;
  targetWpm: number;
  currentWpm: number;
  progressPercent: number; // 0 - 100
  accuracy: number;
  isFinished: boolean;
  finishTime?: number;
  rank?: number;
}
