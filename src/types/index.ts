export interface Document {
  id: string;
  name: string;
  content: string;
  type: 'pdf' | 'epub' | 'docx';
  tags: string[];
  uploadDate: Date;
  size: number;
}

export interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: 'GS1' | 'GS2' | 'GS3' | 'GS4';
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface EssayTopic {
  id: string;
  topic: string;
  category: 'GS1' | 'GS2' | 'GS3' | 'GS4';
  wordLimit: number;
  timeLimit: number;
}

export interface TestSession {
  id: string;
  type: 'mcq' | 'essay';
  questions: string[];
  answers: Record<string, string | number | Record<string, unknown>>;
  startTime: Date;
  endTime?: Date;
  score?: number;
}

export interface CurrentAffairsItem {
  id: string;
  title: string;
  content: string;
  date: Date;
  tags: string[];
  questions: string[];
}

export interface Progress {
  category: 'GS1' | 'GS2' | 'GS3' | 'GS4';
  completed: number;
  total: number;
}