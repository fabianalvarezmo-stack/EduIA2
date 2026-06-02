/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserProfile, EducationalLevel, LearningStyle } from '../types';
import { ESTILO_INFO } from '../data';
import { School, ArrowRight, Mail, Lock, CheckCircle } from 'lucide-react';

interface RegisterFormProps {
  onRegister: (profile: UserProfile) => void;
}

export default function RegisterForm({ onRegister }: RegisterFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [academicLevel, setAcademicLevel] = useState<EducationalLevel | ''>('');
  const [learningStyle, setLearningStyle] = useState<LearningStyle | ''>('');
  
  // Real-time validation errors
  const [emailError, setEmailError] = useState('');
  const [showValidation, setShowValidation] = useState(false);

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (!val) {
      setEmailError('El correo electrónico es requerido.');
    } else if (!/\S+@\S+\.\S+/.test(val)) {
      setEmailError('Ingresa un formato de correo válido (ej: tu@correo.com).');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowValidation(true);

    if (!name || name.trim().length < 2) {
      return;
    }
    if (!email || emailError) {
      return;
    }
    if (!password || password.length < 6) {
      return;
    }
    if (!academicLevel) {
      return;
    }
    if (!learningStyle) {
      return;
    }

    // Success
    onRegister({
      name: name.trim(),
      email: email.trim(),
      academicLevel,
      learningStyle,
      isRegistered: true,
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 md:p-10 shadow-sm relative z-10 my-4">
      <div className="mb-8 text-center pt-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mb-4 shadow-xs">
          <School className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2 font-display">
          Comienza tu Viaje de Aprendizaje
        </h1>
        <p className="text-base text-slate-600">
          Personaliza tu tutor inteligente configurando tu perfil.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Account Details */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
            Cuenta de Estudiante
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="name">
                Nombre de Estudiante
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full h-11 px-4 rounded-xl border bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none text-sm transition-all ${
                  showValidation && (!name || name.trim().length < 2)
                    ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                    : 'border-slate-200'
                }`}
                placeholder="Ingresa tu nombre"
              />
              {showValidation && (!name || name.trim().length < 2) && (
                <p className="text-xs text-red-600 mt-1">El nombre debe tener al menos 2 letras.</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="email">
                Correo Electrónico
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  className={`w-full h-11 px-4 rounded-xl border bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none text-sm transition-all ${
                    emailError || (showValidation && !email) 
                      ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' 
                      : 'border-slate-200'
                  }`}
                  placeholder="tu@correo.com"
                />
              </div>
              {(emailError || (showValidation && !email)) && (
                <p className="text-xs text-red-600 mt-1">
                  {emailError || 'El correo electrónico es requerido.'}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="password">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full h-11 px-4 rounded-xl border bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none text-sm transition-all ${
                  showValidation && (!password || password.length < 6)
                    ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                    : 'border-slate-200'
                }`}
                placeholder="••••••••"
              />
              {showValidation && (!password || password.length < 6) && (
                <p className="text-xs text-red-600 mt-1">
                  La contraseña debe tener al menos 6 caracteres.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Academic Level */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
            Nivel Académico
          </h2>
          <div>
            <label className="sr-only" htmlFor="academic-level">
              Selecciona tu nivel académico
            </label>
            <select
              id="academic-level"
              value={academicLevel}
              onChange={(e) => setAcademicLevel(e.target.value as EducationalLevel)}
              className={`w-full h-11 px-4 rounded-xl border bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none text-sm cursor-pointer ${
                showValidation && !academicLevel 
                  ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' 
                  : 'border-slate-200'
              }`}
            >
              <option value="" disabled>
                Selecciona tu nivel...
              </option>
              <option value="basica">Educación Básica</option>
              <option value="media">Enseñanza Media (Preparación PAES)</option>
              <option value="superior">Educación Superior (CFT/IP/Universidad)</option>
            </select>
            {showValidation && !academicLevel && (
              <p className="text-xs text-red-600 mt-1">Por favor selecciona un nivel educativo.</p>
            )}
          </div>
        </section>

        {/* Learning Style */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
            Estilo de Aprendizaje Principal
          </h2>
          <p className="text-sm text-slate-600">
            ¿Cómo prefieres que EduAI te explique los conceptos?
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(ESTILO_INFO).map(([key, value]) => {
              const estKey = key as LearningStyle;
              const isSelected = learningStyle === estKey;
              return (
                <label
                  key={key}
                  className={`relative cursor-pointer block h-full rounded-2xl border p-5 text-center transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500/20 ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50/60'
                  }`}
                >
                  <input
                    type="radio"
                    name="learning-style"
                    value={key}
                    checked={isSelected}
                    onChange={() => setLearningStyle(estKey)}
                    className="sr-only"
                  />
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                        isSelected ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {/* Dynamically match icon strings to symbols */}
                      {estKey === 'visual' && <span className="text-lg">🎨</span>}
                      {estKey === 'practico' && <span className="text-lg">🛠️</span>}
                      {estKey === 'teorico' && <span className="text-lg">📚</span>}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">{value.title}</h3>
                    <p className="text-xs text-slate-500 leading-normal">{value.desc}</p>
                  </div>

                  {isSelected && (
                    <div className="absolute top-2 right-2 text-blue-650">
                      <CheckCircle className="w-5 h-5 fill-current text-blue-600 inline-block" />
                    </div>
                  )}
                </label>
              );
            })}
          </div>
          {showValidation && !learningStyle && (
            <p className="text-xs text-red-600 mt-1">Por favor selecciona tu estilo de aprendizaje.</p>
          )}
        </section>

        {/* Submit */}
        <div className="pt-6 border-t border-slate-100 text-center">
          <button
            type="submit"
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-semibold focus:ring-2 focus:ring-blue-500/40 focus:ring-offset-2 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            Registrarme
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <p className="mt-4 text-xs text-slate-500">
            ¿Quieres explorar sin registrarte?{' '}
            <button
              type="button"
              onClick={() =>
                onRegister({
                  name: 'Invitado',
                  email: 'invitado@eduai.cl',
                  academicLevel: 'media',
                  learningStyle: 'visual',
                  isRegistered: true,
                })
              }
              className="text-blue-600 hover:underline font-bold bg-transparent border-none cursor-pointer"
            >
              Prueba la Demo Directamente
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}
