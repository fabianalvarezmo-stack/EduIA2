/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { EducationalLevel, LearningStyle, QuizQuestion, QuizSession } from '../types';
import { getQuizForTopic, calculateGrade } from '../data';
import { Award, CheckCircle2, XCircle, ArrowRight, Home, RefreshCw, MessageSquare } from 'lucide-react';

interface QuizSectionProps {
  subjectId: string;
  topicName: string;
  level: EducationalLevel;
  style: LearningStyle;
  onFinishQuiz: (score: number, total: number, grade: number) => void;
  onExit: () => void;
}

export default function QuizSection({
  subjectId,
  topicName,
  level,
  style,
  onFinishQuiz,
  onExit
}: QuizSectionProps) {
  // Load questions based on selected topic context
  const [questions, setQuestions] = useState<QuizQuestion[]>(() =>
    getQuizForTopic(subjectId, topicName, level, style)
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userSelected, setUserSelected] = useState<number | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [completedScores, setCompletedScores] = useState<Record<number, number>>({});
  const [showSummary, setShowSummary] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  // Handle choice selection with active outline and high contrast focus
  const handleSelectOption = (optIdx: number) => {
    if (hasChecked) return;
    setUserSelected(optIdx);
  };

  const handleCheckAnswer = () => {
    if (userSelected === null || hasChecked) return;
    setHasChecked(true);

    const isCorrect = userSelected === currentQuestion.correctOptionIndex;
    setCompletedScores((prev) => ({
      ...prev,
      [currentIndex]: isCorrect ? 1 : 0
    }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // Calculate grade in Chile scale (1.0 to 7.0)
      const correctCount = (Object.values(completedScores) as number[]).reduce((acc: number, curr: number) => acc + (curr || 0), 0);
      const computedGrade = calculateGrade(correctCount, questions.length);
      onFinishQuiz(correctCount, questions.length, computedGrade);
      setShowSummary(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setUserSelected(null);
      setHasChecked(false);
    }
  };

  // Score metrics
  const totalCorrect = (Object.values(completedScores) as number[]).reduce((acc: number, curr: number) => acc + (curr || 0), 0);
  const finalGrade = calculateGrade(totalCorrect, questions.length);
  const isPassed = finalGrade >= 4.0;

  if (showSummary) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 text-center shadow-md relative overflow-hidden animate-scale-up">
        {/* Blue professional header line */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600"></div>

        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mb-6 border border-blue-100">
          <Award className="w-8 h-8 text-blue-600" />
        </div>

        <h2 className="text-3xl font-bold font-display text-slate-900 tracking-tight">¡Práctica Completada!</h2>
        <p className="text-xs text-slate-500 mt-1.5 uppercase font-bold tracking-wider">
          Asignatura: {subjectId.toUpperCase()} • Tema: {topicName}
        </p>

        {/* Chile Scale Grade Display Card */}
        <div className="my-8 max-w-sm mx-auto p-6 rounded-2xl border border-slate-200 bg-slate-50/50 relative overflow-hidden shadow-2xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
            Calificación del Estudiante
          </div>
          <div className="text-6xl font-black text-slate-900 tracking-tight my-2">
            Nota: {finalGrade.toFixed(1)}
          </div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Escala de Notas en Chile (1.0 - 7.0)
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200">
            {isPassed ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-50 border border-emerald-150 text-emerald-800 px-3 py-1.5 rounded-full">
                ✓ Aprobado (Nota mínima de aprobación: 4.0)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-red-50 border border-red-150 text-red-800 px-3 py-1.5 rounded-full">
                ✗ Reprobado (Nota exigida de aprobación: 4.0)
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2 max-w-md mx-auto text-sm text-slate-600 leading-relaxed mb-8">
          <p className="font-semibold text-slate-800">
            Tu puntaje: {totalCorrect} de {questions.length} respuestas correctas.
          </p>
          <p className="text-xs text-slate-400 leading-normal">
            {isPassed
              ? '¡Excelente trabajo! Has consolidado con éxito la adquisición de estos conocimientos de forma de alto impacto pedagógico.'
              : 'No te desanimes. El error es un peldaño del aprendizaje. Te sugerimos chatear más con tu Tutor EduAI e intentarlo nuevamente.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center text-sm font-bold max-w-md mx-auto">
          <button
            onClick={onExit}
            className="flex-1 bg-white border border-slate-200 text-slate-700 py-3.5 rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-3xs"
          >
            <Home className="w-4 h-4" />
            Volver al Dashboard
          </button>
          
          <button
            onClick={() => {
              // Restart Quiz
              setCurrentIndex(0);
              setUserSelected(null);
              setHasChecked(false);
              setCompletedScores({});
              setShowSummary(false);
            }}
            className="flex-1 bg-blue-600 text-white py-3.5 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Repetir Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs">
      {/* Quiz Progress header bar */}
      <div className="flex justify-between items-center border-b border-slate-150 pb-4 mb-6">
        <div>
          <span className="text-[10px] text-blue-700 bg-blue-50 border border-blue-105 font-bold px-2.5 py-1 rounded-md">
            Evaluación Chilena
          </span>
          <h3 className="text-sm font-bold text-slate-900 mt-2 leading-snug line-clamp-1 font-display">
            {topicName}
          </h3>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold text-slate-400 block uppercase">Pregunta</span>
          <span className="text-sm font-extrabold text-slate-900 font-mono">
            {currentIndex + 1} de {questions.length}
          </span>
        </div>
      </div>

      {/* Progress linear bar */}
      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-8" aria-hidden="true">
        <div
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
        ></div>
      </div>

      {/* Question Form */}
      <div className="space-y-6">
        <h4 className="text-lg font-bold text-slate-905 leading-snug select-all">
          {currentQuestion.question}
        </h4>

        {/* Options Stack (Heuristic #4: Consistency & WCAG minimum size targets) */}
        <div className="space-y-3">
          {currentQuestion.options.map((opt, oIdx) => {
            const isSelected = userSelected === oIdx;
            const isCorrectOption = oIdx === currentQuestion.correctOptionIndex;
            
            // feedback background-border-text pairing classes
            let optionStyle = 'border-slate-200 bg-white hover:bg-slate-50 hover:border-blue-500 text-slate-700';
            
            if (hasChecked) {
              if (isSelected) {
                optionStyle = isCorrectOption
                  ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 pointer-events-none'
                  : 'border-red-500 bg-red-50/50 text-red-900 pointer-events-none';
              } else if (isCorrectOption) {
                // Highlight correct one even if they didn't pick it
                optionStyle = 'border-emerald-500 bg-emerald-50/30 text-emerald-900 font-semibold pointer-events-none';
              } else {
                optionStyle = 'border-slate-100 bg-slate-50/50 text-slate-400 pointer-events-none';
              }
            } else if (isSelected) {
              optionStyle = 'border-blue-600 bg-blue-50/20 ring-1 ring-blue-500/20 text-blue-700 font-semibold';
            }

            return (
              <button
                key={oIdx}
                disabled={hasChecked}
                onClick={() => handleSelectOption(oIdx)}
                className={`w-full min-h-[50px] p-4 text-left rounded-xl border text-sm transition-all flex items-start gap-3 outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer ${optionStyle}`}
                aria-label={`Opción ${oIdx + 1}: ${opt}`}
              >
                {/* Numeric bullet indicator */}
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-xs uppercase ${
                    isSelected ? 'bg-blue-600 text-white animate-pulse' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {String.fromCharCode(65 + oIdx)}
                </span>
                
                <span className="flex-1 leading-snug">{opt}</span>
              </button>
            );
          })}
        </div>

        {/* ACCESSIBILITY COMPLIANT IMMEDIATE TEXT FEEDBACK (No color reliance) */}
        {hasChecked && (
          <div
            className={`p-5 rounded-2xl border text-sm animate-fade-in ${
              userSelected === currentQuestion.correctOptionIndex
                ? 'bg-emerald-50 border-emerald-250 text-emerald-950'
                : 'bg-red-50 border-red-250 text-red-950'
            }`}
          >
            <div className="flex items-center gap-2 mb-2 font-black text-base">
              {userSelected === currentQuestion.correctOptionIndex ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                  <span>✓ ¡Correcto!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-650" />
                  <span>✗ Incorrecto</span>
                </>
              )}
            </div>
            
            <p className="leading-relaxed text-slate-700 select-all">
              <strong className="block text-slate-900 font-extrabold mb-1">Fundamento Pedagógico:</strong>
              {currentQuestion.explanation}
            </p>
          </div>
        )}

        {/* Action Controls */}
        <div className="pt-6 border-t border-slate-250 flex justify-between items-center">
          <button
            onClick={onExit}
            className="text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1 hover:underline cursor-pointer"
          >
            Descartar Práctica
          </button>

          {!hasChecked ? (
            <button
              onClick={handleCheckAnswer}
              disabled={userSelected === null}
              className={`h-11 px-6 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-3xs ${
                userSelected !== null
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              Comprobar Respuesta
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              {isLastQuestion ? 'Obtener Nota Final' : 'Siguiente Pregunta'}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
