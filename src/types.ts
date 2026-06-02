/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type EducationalLevel = 'basica' | 'media' | 'superior';

export type LearningStyle = 'visual' | 'practico' | 'teorico';

export interface UserProfile {
  name: string;
  email: string;
  academicLevel: EducationalLevel;
  learningStyle: LearningStyle;
  isRegistered: boolean;
}

export interface Message {
  id: string;
  role: 'student' | 'tutor';
  content: string;
  timestamp: string;
  isThinking?: boolean;
}

export interface Subject {
  id: string;
  name: string;
  iconName: string;
  color: string;
  progress: number; // 0 to 100
  topics: string[];
}

export interface ChatSession {
  id: string;
  title: string;
  subjectId: string;
  topicName: string;
  messages: Message[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  userSelectedIndex?: number;
}

export interface QuizSession {
  subjectId: string;
  topicName: string;
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  isFinished: boolean;
  score: number; // Correct answers count
  grade: number; // scale 1.0 to 7.0
}

export interface QuizHistoryEntry {
  id: string;
  date: string;
  subjectName: string;
  topicName: string;
  score: number;
  totalQuestions: number;
  grade: number;
}

export interface AcademicHistory {
  averageGrade: number; // escala 1.0 a 7.0
  completedLessons: number;
  studyTimeMin: number;
  quizzesTaken: number;
  history: QuizHistoryEntry[];
}
