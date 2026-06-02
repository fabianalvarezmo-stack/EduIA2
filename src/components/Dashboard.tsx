/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserProfile, Subject, AcademicHistory } from '../types';
import { SUBJECTS } from '../data';
import {
  Play,
  Search,
  BookOpen,
  Clock,
  ArrowRight,
  GraduationCap,
  Sparkles,
  Award,
  BookMarked
} from 'lucide-react';

interface DashboardProps {
  profile: UserProfile;
  history: AcademicHistory;
  onSelectTopic: (subjectId: string, topicName: string) => void;
  onStartQuiz: (subjectId: string, topicName: string) => void;
}

export default function Dashboard({
  profile,
  history,
  onSelectTopic,
  onStartQuiz
}: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  // Personalized highlight based on Educational Level
  const currentLevelFocus =
    profile.academicLevel === 'basica'
      ? {
          subjectId: 'matematica',
          topicName: 'Álgebra y Ecuaciones',
          title: 'Fracciones y Ecuaciones Simples',
          desc: 'Explora de forma entretenida cómo despejar la incógnita X usando analogías cotidianas.'
        }
      : profile.academicLevel === 'media'
      ? {
          subjectId: 'matematica',
          topicName: 'Derivadas Trigonométricas',
          title: 'Cálculo Diferencial - PAES',
          desc: 'Domina los conceptos clave de derivadas trigonométricas y límites para potenciar tu puntaje PAES.'
        }
      : {
          subjectId: 'programacion',
          topicName: 'Concepto de Polimorfismo',
          title: 'Programación - Polimorfismo',
          desc: 'Profundiza en la sobrescritura y sobrecarga de clases en lenguajes estructurados y orientados a objetos.'
        };

  // Filter subjects based on search query
  const filteredSubjects = SUBJECTS.filter((sub) =>
    sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Get average score and color
  const avgGrade = history.averageGrade;
  const gradeColor =
    avgGrade >= 6.0
      ? 'text-emerald-700 border-emerald-250 bg-emerald-50/55 font-bold'
      : avgGrade >= 4.0
      ? 'text-blue-700 border-blue-200 bg-blue-50/55 font-bold'
      : 'text-red-700 border-red-250 bg-red-50/55 font-bold';

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Welcome Header */}
      <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 font-display">
            Hola, {profile.name}
          </h1>
          <p className="text-lg text-slate-600 mt-2 flex items-center gap-2">
            ¿Qué te gustaría aprender hoy?
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 capitalize">
              Estilo: {profile.learningStyle}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white p-3 px-4 rounded-2xl border border-slate-200 shadow-xs">
          <GraduationCap className="h-10 w-10 text-blue-605" style={{ color: '#2563eb' }} />
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Nivel de Estudio
            </div>
            <div className="text-sm font-bold text-slate-900">
              {profile.academicLevel === 'basica' && 'Educación Básica'}
              {profile.academicLevel === 'media' && 'Enseñanza Media / PAES'}
              {profile.academicLevel === 'superior' && 'Educación Superior'}
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="max-w-2xl relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-401 h-5 w-5" style={{ color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Busca materias, temas específicos (ej. límites, polimorfismo, historia)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none outline-none transition-all text-base text-slate-800 shadow-xs font-sans"
            aria-label="Buscar temarios y asignaturas"
          />
        </div>
      </section>

      {/* Bento Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Continuar aprendiendo card (Col span 8 on desktop) */}
        <div
          onClick={() => onSelectTopic(currentLevelFocus.subjectId, currentLevelFocus.topicName)}
          className="md:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs relative overflow-hidden group hover:shadow-sm hover:border-slate-300 transition-all cursor-pointer outline-none focus:ring-2 focus:ring-blue-500/20"
          tabIndex={0}
          aria-label={`Continuar lección actual: ${currentLevelFocus.title}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onSelectTopic(currentLevelFocus.subjectId, currentLevelFocus.topicName);
            }
          }}
        >
          {/* Growth bar decoration - Solid blue gradient */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
            <div className="space-y-2 pt-2">
              <span className="inline-flex px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-xs font-semibold">
                Continuar aprendiendo
              </span>
              <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors font-display">
                {currentLevelFocus.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-xl">
                {currentLevelFocus.desc}
              </p>
            </div>
            
            <button
              className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform shrink-0 shadow-sm cursor-pointer"
              aria-hidden="true"
            >
              <Play className="h-5 w-5 fill-current ml-0.5" />
            </button>
          </div>

          <div className="mt-8">
            <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2">
              <span>Progreso aproximado de la asignatura</span>
              <span>{profile.academicLevel === 'superior' ? '40%' : '65%'}</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: profile.academicLevel === 'superior' ? '40%' : '65%' }}
              ></div>
            </div>
          </div>
        </div>

        {/* Weekly Progress Widget (Col span 4 on desktop) */}
        <div className="md:col-span-4 bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 relative overflow-hidden flex flex-col justify-between shadow-xs">
          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-10 translate-x-10 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-8 -translate-x-8 pointer-events-none"></div>

          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-blue-400 font-display">
            <Sparkles className="w-5 h-5 text-blue-400" />
            Tu Progreso Semanal
          </h3>

          <div className="flex flex-col items-center justify-center my-3 relative">
            {/* SVG Circular progress matching mockup exactly (82%) */}
            <div className="relative w-28 h-28">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                {/* Underlay tracking circle */}
                <path
                  className="stroke-slate-800"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  strokeWidth="3.5"
                ></path>
                {/* Overlay calculated progress */}
                <path
                  className="stroke-blue-500"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  strokeDasharray="82, 100"
                  strokeLinecap="round"
                  strokeWidth="3.5"
                ></path>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
                <span className="text-2xl font-black text-white">82%</span>
                <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase mt-1">META</span>
              </div>
            </div>
            <p className="text-xs text-center text-blue-200 mt-4 max-w-[190px] leading-relaxed">
              ¡Estás a solo 2 ejercicios de completar tu meta semanal!
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-450 text-slate-400">
            <span>Racha actual: 5 días ⚡</span>
            <span>Estudiado: {history.studyTimeMin} min 🔹</span>
          </div>
        </div>
      </div>

      {/* Dynamic Academic Metrics Dashboard Card Row */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 font-display">
          <BookMarked className="w-5 h-5 text-blue-600" />
          Métricas de Aprendizaje (Escala Chilena 1.0 - 7.0)
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className={`p-4 rounded-xl border transition-all ${gradeColor}`}>
            <span className="block text-2xl md:text-3xl font-black">
              {avgGrade.toFixed(1)}
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mt-1 block">
              Promedio de Notas
            </span>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
            <span className="block text-2xl md:text-3xl font-black text-slate-900">
              {history.quizzesTaken}
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mt-1 block">
              Evaluaciones
            </span>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
            <span className="block text-2xl md:text-3xl font-black text-blue-600">
              {history.completedLessons}
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mt-1 block">
              Temas Estudiados
            </span>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
            <span className="block text-2xl md:text-3xl font-black text-slate-855">
              {Math.round(history.studyTimeMin / 60)}h{' '}
              {history.studyTimeMin % 60}m
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mt-1 block">
              Tiempo Invertido
            </span>
          </div>
        </div>

        {avgGrade >= 4.0 ? (
          <div className="mt-4 text-xs font-medium text-emerald-800 bg-emerald-50 px-3 py-2 rounded-lg flex items-center gap-2 border border-emerald-100">
            <span className="text-base">✓</span> ¡Estado académico aprobado! Tu promedio ({avgGrade.toFixed(1)}) se encuentra sobre la nota exigida de aprobación chilena (4.0).
          </div>
        ) : history.quizzesTaken > 0 ? (
          <div className="mt-4 text-xs font-medium text-red-800 bg-red-55 px-3 py-2 rounded-lg flex items-center gap-2 border border-red-100">
            <span className="text-base">⚠</span> Tu promedio está bajo la nota de aprobación chilena de 4.0. ¡Te sugerimos realizar más mini-quizzes de repaso pedagógico!
          </div>
        ) : null}
      </section>

      {/* Subjects Grid Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-display">Tus Materias</h2>
            <p className="text-sm text-slate-500">Haz clic en una materia para abrir los contenidos de estudio.</p>
          </div>
          {selectedSubject && (
            <button
              onClick={() => setSelectedSubject(null)}
              className="text-blue-600 hover:underline text-sm font-semibold select-none cursor-pointer"
            >
              Ver todas las materias
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {filteredSubjects.map((sub) => {
            const isSelected = selectedSubject?.id === sub.id;
            return (
              <div
                key={sub.id}
                onClick={() => setSelectedSubject(isSelected ? null : sub)}
                className={`bg-white rounded-2xl border p-5 flex flex-col justify-between shadow-xs relative overflow-hidden group hover:shadow-sm hover:border-slate-300 transition-all cursor-pointer outline-none focus:ring-2 focus:ring-blue-500/20 select-none ${
                  isSelected ? 'border-blue-600 ring-1 ring-blue-500/20 bg-blue-50/10' : 'border-slate-200'
                }`}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSelectedSubject(isSelected ? null : sub);
                  }
                }}
                aria-expanded={isSelected}
              >
                {/* Content Growth Color border decoration - Blue primary highlight */}
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>

                <div className="space-y-4 pt-1">
                  <div className="w-10 h-10 rounded-xl bg-slate-55 flex items-center justify-center text-slate-600 bg-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xs">
                    {sub.iconName === 'calculate' ? <span className="text-base">➗</span> :
                     sub.iconName === 'code' ? <span className="text-base">💻</span> :
                     sub.iconName === 'history_edu' ? <span className="text-base">📜</span> :
                     <span>🧪</span>}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-650 leading-snug">
                      {sub.name}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-wider">
                      {sub.topics.length} temas integrados
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">
                    Progreso: {sub.progress}%
                  </span>
                  <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${sub.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Subjects Topics & Quick-start Menu */}
        {selectedSubject && (
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 shadow-xs animate-fade-in space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-3 gap-2">
              <div>
                <h4 className="text-lg font-bold text-slate-900 font-display">
                  Asignatura: {selectedSubject.name}
                </h4>
                <p className="text-xs text-slate-500">
                  Selecciona un tema para conversar con el tutor o iniciar un mini-quiz de preparación interactiva.
                </p>
              </div>
              <span className="text-xs font-semibold bg-white border border-slate-205 text-blue-600 px-3 py-1 rounded-full w-max shadow-2xs">
                {selectedSubject.topics.length} Temas disponibles
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedSubject.topics.map((topic, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 p-4 hover:border-blue-500 hover:shadow-xs transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-3 group/item"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400">TEMA #{idx + 1}</span>
                    <h5 className="text-sm font-bold text-slate-805 group-hover/item:text-blue-600 leading-snug">
                      {topic}
                    </h5>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
                    <button
                      onClick={() => onSelectTopic(selectedSubject.id, topic)}
                      className="flex-1 md:flex-none text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3.5 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5" />
                      Aprender
                    </button>
                    <button
                      onClick={() => onStartQuiz(selectedSubject.id, topic)}
                      className="flex-1 md:flex-none text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Award className="w-4 h-4" />
                      Quiz
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Quiz History section */}
      {history.history.length > 0 && (
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 font-display">
              <span>📜</span>
              Historial de Evaluaciones Recientes
            </h3>
            <span className="text-xs font-bold text-slate-400">Últimas 5 calificaciones chilenas</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-150 text-slate-400 font-bold text-xs uppercase tracking-wider">
                  <th className="py-2.5">Fecha</th>
                  <th className="py-2.5">Asignatura</th>
                  <th className="py-2.5">Tema</th>
                  <th className="py-2.5">Correctas</th>
                  <th className="py-2.5 text-right">Nota Chilena</th>
                </tr>
              </thead>
              <tbody>
                {history.history.slice(-5).reverse().map((entry) => {
                  const passed = entry.grade >= 4.0;
                  return (
                    <tr key={entry.id} className="border-b border-slate-100 hover:bg-slate-55 transition-colors">
                      <td className="py-3 text-slate-500 font-medium">{entry.date}</td>
                      <td className="py-3 text-slate-900 font-bold">{entry.subjectName}</td>
                      <td className="py-3 text-slate-700">{entry.topicName}</td>
                      <td className="py-3 font-semibold text-slate-800">
                        {entry.score} / {entry.totalQuestions}
                      </td>
                      <td className="py-3 text-right">
                        <span
                          className={`inline-block font-bold text-sm px-2.5 py-1 rounded-lg ${
                            passed ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-red-50 text-red-800 border border-red-100'
                          }`}
                        >
                          {entry.grade.toFixed(1)} {passed ? '✓' : '✗'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
