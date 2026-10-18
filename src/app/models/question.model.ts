export interface Category {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  icon: string;
}

export interface SubQuestion {
  id: string;
  text: string;
  orderIndex: number;
}

export interface Question {
  id: string;
  text: string;
  hints: string[];
  exampleAnswers: string[];
  track: string | null;
  stack: string | null;
  difficulty: string | null;
  category: Category;
  subQuestions: SubQuestion[];
}

export interface ExampleAnswer {
  text: string;
  source: 'stored';
}

export interface GrammarIssue {
  message: string;
  offset: number;
  length: number;
  replacements: string[];
}

export interface Recording {
  id: string;
  duration: number;
  createdAt: string;
  subQuestionId: string | null;
  playbackUrl: string;
  transcript: string | null;
  correctedText: string | null;
  grammarIssues: GrammarIssue[] | null;
}

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  totalXP: number;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}
