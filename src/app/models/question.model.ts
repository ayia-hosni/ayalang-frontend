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
  category: Category;
  subQuestions: SubQuestion[];
}

export interface Recording {
  id: string;
  duration: number;
  createdAt: string;
  subQuestionId: string | null;
  playbackUrl: string;
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
