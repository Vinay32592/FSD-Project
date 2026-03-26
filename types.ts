
export interface Step {
  title: string;
  description: string;
  duration: string;
  milestone: string;
  completed?: boolean;
  notes?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  hint: string;
  explanation: string;
}

export interface Roadmap {
  id: string;
  goal: string;
  steps: Step[];
  createdAt: string;
  timestamp: number;
  status: 'Draft' | 'In Progress' | 'Completed';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  signature?: string;
}
