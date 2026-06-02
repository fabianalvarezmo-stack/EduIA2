/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserProfile, AcademicHistory, QuizHistoryEntry } from './types';
import RegisterForm from './components/RegisterForm';
import Dashboard from './components/Dashboard';
import ChatTutor from './components/ChatTutor';
import QuizSection from './components/QuizSection';
import {
  School,
  GraduationCap,
  Sparkles,
  Award,
  BookOpen,
  MessageSquare,
  Compass,
  User,
  LogOut,
  ChevronRight,
  TrendingUp,
  Sliders,
  Settings
} from 'lucide-react';

export default function App() {
  // Pull up initial profile details from Local Storage so state persists on reload
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('EDUAI_USER_PROFILE');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing profile', e);
      }
    }
    return {
      name: '',
      email: '',
      academicLevel: 'media',
      learningStyle: 'visual',
      isRegistered: false
    };
  });

  // Navigation tab coordinates
  const [currentView, setCurrentView] = useState<'register' | 'dashboard' | 'chat' | 'quiz'>(() => {
    const saved = localStorage.getItem('EDUAI_USER_PROFILE');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.isRegistered) {
          return 'dashboard';
        }
      } catch (e) {
        console.error('Error parsing profile for initial view', e);
      }
    }
    return 'register';
  });

  // Pre-populated academic stats history for Chilean scale demonstration
  const [history, setHistory] = useState<AcademicHistory>(() => {
    const saved = localStorage.getItem('EDUAI_ACADEMIC_HISTORY');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing history', e);
      }
    }
    return {
      averageGrade: 6.2, // escala 1.0 a 7.0
      completedLessons: 4,
      studyTimeMin: 120,
      quizzesTaken: 3,
      history: [
        {
          id: '1',
          date: '21-05-2026',
          subjectName: 'Ciencias',
          topicName: 'Cinemática y Dinámica',
          score: 3,
          totalQuestions: 3,
          grade: 7.0
        },
        {
          id: '2',
          date: '25-05-2026',
          subjectName: 'Historia de Chile',
          topicName: 'Independencia de Chile',
          score: 2,
          totalQuestions: 3,
          grade: 5.5
        },
        {
          id: '3',
          date: '30-05-2026',
          subjectName: 'Matemáticas',
          topicName: 'Límites y Continuidad',
          score: 2,
          totalQuestions: 3,
          grade: 6.0
        }
      ]
    };
  });

  // Handles parameters for contextual chat or evaluations
  const [quizParams, setQuizParams] = useState<{ subjectId: string; topicName: string } | null>(null);
  const [chatParams, setChatParams] = useState<{ subjectId: string; topicName: string } | null>(null);

  // Sync profile state changes to localStorage
  useEffect(() => {
    if (profile.isRegistered) {
      localStorage.setItem('EDUAI_USER_PROFILE', JSON.stringify(profile));
    }
  }, [profile]);

  // Sync academic metrics state changes to localStorage
  useEffect(() => {
    localStorage.setItem('EDUAI_ACADEMIC_HISTORY', JSON.stringify(history));
  }, [history]);

  // Handler: Save newly registered profile
  const handleRegister = (newProfile: UserProfile) => {
    setProfile(newProfile);
    setCurrentView('dashboard');
  };

  // Handler: Selecting a topic from the dashboard to tutor conversation
  const handleSelectTopicToChat = (subjectId: string, topicName: string) => {
    setChatParams({ subjectId, topicName });
    setCurrentView('chat');
  };

  // Handler: Selecting evaluation trigger
  const handleStartExam = (subjectId: string, topicName: string) => {
    setQuizParams({ subjectId, topicName });
    setCurrentView('quiz');
  };

  // Handler: Record quiz finishes
  const handleFinishQuiz = (score: number, total: number, grade: number) => {
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}-${String(
      today.getMonth() + 1
    ).padStart(2, '0')}-${today.getFullYear()}`;

    const newEntry: QuizHistoryEntry = {
      id: Math.random().toString(),
      date: formattedDate,
      subjectName:
        quizParams?.subjectId === 'matematica'
          ? 'Matemáticas'
          : quizParams?.subjectId === 'programacion'
          ? 'Programación'
          : quizParams?.subjectId === 'historia'
          ? 'Historia de Chile'
          : 'Ciencias',
      topicName: quizParams?.topicName || 'Evaluación General',
      score,
      totalQuestions: total,
      grade
    };

    const newHistoryList = [...history.history, newEntry];
    const totalGrades = newHistoryList.reduce((acc, curr) => acc + curr.grade, 0);
    const avgGrade = totalGrades / newHistoryList.length;

    setHistory((prev) => ({
      ...prev,
      quizzesTaken: prev.quizzesTaken + 1,
      averageGrade: Math.round(avgGrade * 10) / 10,
      history: newHistoryList
    }));
  };

  // Helper metrics incrementation
  const handleAddMinutes = (mins: number) => {
    setHistory((prev) => ({
      ...prev,
      studyTimeMin: prev.studyTimeMin + mins
    }));
  };

  const handleAddCompletedLesson = () => {
    setHistory((prev) => ({
      ...prev,
      completedLessons: prev.completedLessons + 1
    }));
  };

  const handleLogout = () => {
    if (window.confirm('¿Quieres limpiar la base locales del simulador y reiniciar tu perfil?')) {
      localStorage.clear();
      sessionStorage.clear();
      setProfile({
        name: '',
        email: '',
        academicLevel: 'media',
        learningStyle: 'visual',
        isRegistered: false
      });
      setHistory({
        averageGrade: 6.2,
        completedLessons: 4,
        studyTimeMin: 120,
        quizzesTaken: 3,
        history: [
          {
            id: '1',
            date: '21-05-2026',
            subjectName: 'Ciencias',
            topicName: 'Cinemática y Dinámica',
            score: 3,
            totalQuestions: 3,
            grade: 7.0
          },
          {
            id: '2',
            date: '25-05-2026',
            subjectName: 'Historia de Chile',
            topicName: 'Independencia de Chile',
            score: 2,
            totalQuestions: 3,
            grade: 5.5
          },
          {
            id: '3',
            date: '30-05-2026',
            subjectName: 'Matemáticas',
            topicName: 'Límites y Continuidad',
            score: 2,
            totalQuestions: 3,
            grade: 6.0
          }
        ]
      });
      setCurrentView('register');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans select-none">
      
      {/* Top Banner App Bar (Consistent headers and touch targets) */}
      <header className="bg-white border-b border-slate-200 fixed top-0 w-full h-16 shrink-0 flex justify-between items-center px-4 md:px-10 z-20 shadow-xs">
        <div className="flex items-center gap-3">
          {/* Brand logo container */}
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
            <School className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none flex items-center gap-1.5">
              EduAI <span className="text-blue-600 font-normal">| Tutoría Inteligente</span>
            </h1>
            <p className="text-[10px] text-slate-500 mt-1 uppercase font-medium tracking-wider">
              {profile.academicLevel === 'basica' && 'Educación Básica'}
              {profile.academicLevel === 'media' && 'Enseñanza Media • Preparación PAES'}
              {profile.academicLevel === 'superior' && 'Educación Superior • CFT/IP/Univ'}
            </p>
          </div>
        </div>

        {/* Global Nav tabs if registered (WCAG 4.5:1 compliant text tags) */}
        {profile.isRegistered && (
          <nav className="hidden md:flex gap-8 select-none">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`font-semibold text-sm flex items-center gap-2 pb-1.5 border-b-2 transition-all ${
                currentView === 'dashboard'
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-905'
              }`}
            >
              <Compass className="w-4.5 h-4.5" />
              Ruta Temática
            </button>
            <button
              onClick={() => {
                // Return to previous parameters or load default
                setChatParams(null);
                setCurrentView('chat');
              }}
              className={`font-semibold text-sm flex items-center gap-2 pb-1.5 border-b-2 transition-all ${
                currentView === 'chat'
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-905'
              }`}
            >
              <MessageSquare className="w-4.5 h-4.5" />
              Chat Tutor
            </button>
          </nav>
        )}

        {/* User initials & profile controls */}
        {profile.isRegistered ? (
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <span className="block text-sm font-semibold text-slate-900">{profile.name}</span>
              <span className="block text-[10px] text-slate-500 uppercase font-medium tracking-wider">
                Estilo: {profile.learningStyle}
              </span>
            </div>

            <button
              onClick={handleLogout}
              aria-label="Cerrar sesión de estudiante"
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-sm select-none hover:opacity-90 transition-opacity cursor-pointer duration-150"
            >
              <span className="uppercase">{profile.name.slice(0, 2) || '@'}</span>
            </button>
          </div>
        ) : (
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Prototipo Escolar
          </div>
        )}
      </header>

      {/* Main Container Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-10 pt-24 pb-20 md:pb-12 mt-1 select-all">
        {currentView === 'register' && (
          <RegisterForm onRegister={handleRegister} />
        )}

        {currentView === 'dashboard' && profile.isRegistered && (
          <Dashboard
            profile={profile}
            history={history}
            onSelectTopic={handleSelectTopicToChat}
            onStartQuiz={handleStartExam}
          />
        )}

        {currentView === 'chat' && profile.isRegistered && (
          <ChatTutor
            profile={profile}
            initialSubjectId={chatParams?.subjectId}
            initialTopicName={chatParams?.topicName}
            onStartQuiz={handleStartExam}
            onAddStudyMinutes={handleAddMinutes}
            onAddCompletedLesson={handleAddCompletedLesson}
          />
        )}

        {currentView === 'quiz' && profile.isRegistered && quizParams && (
          <QuizSection
            subjectId={quizParams.subjectId}
            topicName={quizParams.topicName}
            level={profile.academicLevel}
            style={profile.learningStyle}
            onFinishQuiz={handleFinishQuiz}
            onExit={() => {
              setQuizParams(null);
              setCurrentView('dashboard');
            }}
          />
        )}
      </main>

      {/* Dynamic Nav on Mobile (Docked Bottom bar) */}
      {profile.isRegistered && (
        <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-4 pt-2 bg-white border-t border-slate-205 shadow-lg z-20">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`flex flex-col items-center justify-center rounded-2xl py-2 px-5 transition-all outline-none ${
              currentView === 'dashboard'
                ? 'bg-slate-100 text-blue-600 scale-105'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[10px] font-bold mt-1">Ruta</span>
          </button>

          <button
            onClick={() => {
              setChatParams(null);
              setCurrentView('chat');
            }}
            className={`flex flex-col items-center justify-center rounded-2xl py-2 px-5 transition-all outline-none ${
              currentView === 'chat'
                ? 'bg-slate-100 text-blue-600 scale-105'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-[10px] font-bold mt-1">Chat</span>
          </button>

          <button
            onClick={handleLogout}
            className={`flex flex-col items-center justify-center rounded-2xl py-2 px-5 transition-all text-red-500 hover:text-red-700 outline-none`}
            aria-label="Reiniciar App"
          >
            <LogOut className="w-5 h-5 text-red-500" />
            <span className="text-[10px] font-bold text-red-500 mt-1">Reiniciar</span>
          </button>
        </nav>
      )}
    </div>
  );
}
