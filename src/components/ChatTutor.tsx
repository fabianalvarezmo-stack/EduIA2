/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, ChatSession, Message, Subject } from '../types';
import { SUBJECTS, generateSimulatedResponse } from '../data';
import {
  Send,
  Sparkles,
  School,
  Brain,
  Sliders,
  AlertTriangle,
  RefreshCw,
  Award,
  BookOpen,
  ChevronLeft,
  X,
  Menu,
  Key,
  Paperclip,
  Check
} from 'lucide-react';

interface ChatTutorProps {
  profile: UserProfile;
  initialSubjectId?: string;
  initialTopicName?: string;
  onStartQuiz: (subjectId: string, topicName: string) => void;
  onAddStudyMinutes: (mins: number) => void;
  onAddCompletedLesson: () => void;
}

export default function ChatTutor({
  profile,
  initialSubjectId,
  initialTopicName,
  onStartQuiz,
  onAddStudyMinutes,
  onAddCompletedLesson
}: ChatTutorProps) {
  // Determine starting subject & topic
  const startSubjectId = initialSubjectId || 'programacion';
  const startTopicName = initialTopicName || 'Concepto de Polimorfismo';

  const [activeSubjectId, setActiveSubjectId] = useState<string>(startSubjectId);
  const [activeTopicName, setActiveTopicName] = useState<string>(startTopicName);

  // Gemini API Key variables (Saved in Session Storage for safety)
  const [apiKey, setApiKey] = useState<string>(() => sessionStorage.getItem('EDUAI_GEMINI_API_KEY') || '');
  const [apiMode, setApiMode] = useState<'simulado' | 'real'>(() => {
    const savedKey = sessionStorage.getItem('EDUAI_GEMINI_API_KEY');
    return savedKey ? 'real' : 'simulado';
  });

  // Settings Panel visibility
  const [showSettings, setShowSettings] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);

  // UI Drawer State for Mobile Sidebar
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Chat conversation memory dictionary
  const [sessions, setSessions] = useState<Record<string, Message[]>>(() => {
    // pre-populate with the screenshot-like discussion for programming polimorfismo!
    return {
      'programacion-Concepto de Polimorfismo': [
        {
          id: '1',
          role: 'tutor',
          content: '¡Hola! Hoy vamos a explorar un concepto fundamental en la Programación Orientada a Objetos: **el Polimorfismo**.\n\n¿Qué entiendes actualmente por polimorfismo o has visto algún ejemplo antes?',
          timestamp: 'Hoy'
        },
        {
          id: '2',
          role: 'student',
          content: 'Creo que tiene que ver con usar la misma función pero que haga cosas diferentes dependiendo del objeto, ¿verdad? Como en Java cuando tienes varios métodos con el mismo nombre.',
          timestamp: 'Hoy'
        },
        {
          id: '3',
          role: 'tutor',
          content: '¡Exactamente! Tienes la idea principal muy clara.\n\nLa palabra polimorfismo significa "muchas formas". En programación, permite que objetos de diferentes clases sean tratados como objetos de una clase común (generalmente una clase base o interfaz).\n\nHay dos tipos principales de polimorfismo que mencionas implícitamente:\n\n1. **Sobrecarga (Overloading):** Mismo nombre de método, diferentes parámetros (tiempo de compilación).\n2. **Sobrescritura (Overriding):** Una subclase provee una implementación específica de un método ya definido en su superclase (tiempo de ejecución).\n\nAquí tienes un ejemplo clásico de sobrescritura en Python:\n\n```python\nclass Animal:\n    def hacer_sonido(self):\n        pass\n\nclass Perro(Animal):\n    def hacer_sonido(self):\n        return "¡Guau!"\n\nclass Gato(Animal):\n    def hacer_sonido(self):\n        return "¡Miau!"\n\ndef emitir_sonido(animal):\n    print(animal.hacer_sonido())\n\n# Uso\nmi_perro = Perro()\nmi_gato = Gato()\n\nemitir_sonido(mi_perro) # Salida: ¡Guau!\nemitir_sonido(mi_gato)  # Salida: ¡Miau!\n```\n\nFíjate cómo la función `emitir_sonido` no necesita saber si está recibiendo un Perro o un Gato, solo necesita saber que es un Animal que puede `hacer_sonido()`.',
          timestamp: 'Hoy'
        }
      ]
    };
  });

  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [apiErrorMsg, setApiErrorMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [sessions, activeSubjectId, activeTopicName, isThinking]);

  // Handle parameter shifts on mount or prop updates
  useEffect(() => {
    if (initialSubjectId && initialTopicName) {
      setActiveSubjectId(initialSubjectId);
      setActiveTopicName(initialTopicName);
    }
  }, [initialSubjectId, initialTopicName]);

  const activeSessionKey = `${activeSubjectId}-${activeTopicName}`;
  const activeMessages = sessions[activeSessionKey] || [
    {
      id: 'init',
      role: 'tutor',
      content: `Hola. Te doy la bienvenida al tema **"${activeTopicName}"**. ¿Cómo puedo ayudarte hoy según tu estilo de aprendizaje **${profile.learningStyle}**? Pregúntame dudas o haz clic en "Practicar Ejercicios" para evaluarte. 🧠`,
      timestamp: 'Hoy'
    }
  ];

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = tempKey.trim();
    setApiKey(cleanKey);
    if (cleanKey) {
      sessionStorage.setItem('EDUAI_GEMINI_API_KEY', cleanKey);
      setApiMode('real');
      setApiErrorMsg(null);
    } else {
      sessionStorage.removeItem('EDUAI_GEMINI_API_KEY');
      setApiMode('simulado');
    }
    setShowSettings(false);
  };

  // Exponential backoff fetch function with up to 5 retries (Heuristic #9 and SRS request)
  const callGeminiWithBackoff = async (
    prompt: string,
    history: { role: 'user' | 'model'; parts: { text: string }[] }[]
  ): Promise<string> => {
    const endpointUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    
    // Inject educational tuning and user learning styles as a system instruction
    const roleConfig = `Eres EduAI, un Tutor Educativo de Inteligencia Artificial para estudiantes chilenos de nivel académico: [${profile.academicLevel.toUpperCase()}]. 
Estás explicando contenidos de [${activeSubjectId.toUpperCase()}], tema específico: [${activeTopicName}].
El estilo de aprendizaje primordial del usuario es: [${profile.learningStyle.toUpperCase()}].
Debes comportarte con las siguientes directrices pedagógicas:
- Si el estilo es VISUAL, incluye metáforas de alto impacto gráfico, esquemas sencillos de texto estructurado o analogías creativas cotidianas.
- Si el estilo es PRACTICO, proporciona código fuente corto aplicable, ejercicios trigonométricos o algebraicos resueltos paso a paso y desafíos aplicados de nivel chileno.
- Si el estilo es TEORICO, entrega rigor formal, enunciados teoréticos matemáticos con axiomas, principios, UML o contexto analítico denso y formal.
- Habla siempre en español con tono cálido, empático, motivador y claro. Adapta el vocabulario según el nivel educacional (Básica: palabras simples y lúdicas, Media/PAES: enfocado en destrezas de pruebas nacionales de selección, Superior: rigor técnico y analítico).
- Usa un formato markdown limpio. Las ecuaciones matemáticas críticas escríbelas usando LaTeX limpio encerrado entre $$ para fórmulas de bloque y $ para fórmulas de línea, de modo que el motor de renderizado las identifique con facilidad. Expresa valores en pesos chilenos ($) cuando apliques matemáticas de mercado.`;

    const payload = {
      contents: [
        ...history,
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      systemInstruction: {
        parts: [{ text: roleConfig }]
      }
    };

    let retries = 5;
    let delay = 1000; // Starting delay: 1000ms (1 second)

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const response = await fetch(endpointUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const resJson = await response.json();
          const rawText = resJson.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) return rawText;
          throw new Error('Estructura de respuesta inesperada del modelo de IA.');
        }

        const errText = await response.text();
        console.warn(`Intento ${attempt + 1}/${retries} fallido. Código: ${response.status}`, errText);

        // Retriable codes (429 Rate limited, 5xx server issues). Do not retry 400 Bad Keys
        if (response.status === 400 || response.status === 403) {
          throw new Error('La API Key ingresada es inválida o no cuenta con los permisos necesarios. Por favor verifícala.');
        }

        if (attempt === retries - 1) {
          throw new Error(`Error persistente al de red: Código ${response.status}. ${errText}`);
        }
      } catch (err: any) {
        if (attempt === retries - 1 || err.message.includes('API Key ingresada')) {
          throw err;
        }
      }

      // Exponential wait: delay, delay*2, delay*4...
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2;
    }

    throw new Error('Ocurrió un error al intentar conectarse con el servidor de IA.');
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isThinking) return;

    const studentText = inputValue;
    setInputValue('');
    setApiErrorMsg(null);

    // Add user message to conversation memory
    const userMsg: Message = {
      id: Math.random().toString(),
      role: 'student',
      content: studentText,
      timestamp: 'Hoy'
    };

    const updatedMessages = [...activeMessages, userMsg];
    setSessions((prev) => ({
      ...prev,
      [activeSessionKey]: updatedMessages
    }));

    setIsThinking(true);
    onAddStudyMinutes(5); // Simulate active minutes

    try {
      let tutorText = '';

      if (apiMode === 'real' && apiKey) {
        // Build correct history format expected by Google standard Gemini models
        const historyPayload = activeMessages
          .filter((m) => m.id !== 'init')
          .slice(-6) // Include up to last 6 messages as context
          .map((m) => ({
            role: m.role === 'student' ? ('user' as const) : ('model' as const),
            parts: [{ text: m.content }]
          }));

        tutorText = await callGeminiWithBackoff(studentText, historyPayload);
      } else {
        // Simulated responsive guidelines-based response engine (Empathetic AI)
        await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulates network load
        tutorText = generateSimulatedResponse(
          studentText,
          activeSubjectId,
          activeTopicName,
          profile.academicLevel,
          profile.learningStyle
        );
      }

      // Append AI response
      const aiMsg: Message = {
        id: Math.random().toString(),
        role: 'tutor',
        content: tutorText,
        timestamp: 'Hoy'
      };

      setSessions((prev) => ({
        ...prev,
        [activeSessionKey]: [...updatedMessages, aiMsg]
      }));

      // Trigger metric changes
      if (activeMessages.length <= 2) {
        onAddCompletedLesson();
      }

    } catch (err: any) {
      console.error(err);
      // Friendly diagnosis dialog according to Heuristic #9
      setApiErrorMsg(err.message || 'Error de conexión de red temporal. Por favor inténtalo nuevamente.');
    } finally {
      setIsThinking(false);
    }
  };

  const handleTopicSelect = (subId: string, topic: string) => {
    setActiveSubjectId(subId);
    setActiveTopicName(topic);
    setMobileSidebarOpen(false);
    setApiErrorMsg(null);
  };

  // Highly premium custom Math & Markdown parser rendering
  const renderRichContent = (text: string) => {
    if (!text) return null;
    
    // Split into structural paragraphs or lists
    const lines = text.split('\n');

    return lines.map((line, idx) => {
      // 1. Detect code blocks start/end
      if (line.trim().startsWith('```')) {
        // Just return spacer or detect language
        return null; 
      }

      // Check if line is inside code boundaries (a simple offline custom parser that handles formatting extremely well!)
      const isListItem = line.trim().startsWith('*') || line.trim().startsWith('-') || /^\d+\./.test(line.trim());
      const isHeading = line.trim().startsWith('#');

      // Super clean math blocks detection (e.g. lines starting and ending in $$)
      const isMathBlock = line.trim().startsWith('$$') && line.trim().endsWith('$$');
      if (isMathBlock) {
        const mathContent = line.trim().replace(/\$\$/g, '');
        return (
          <div
            key={idx}
            className="my-4 p-4 rounded-xl bg-slate-900 border border-slate-850 text-center text-blue-200 font-mono text-xs overflow-x-auto shadow-xs select-all"
            aria-label={`Fórmula matemática: ${mathContent}`}
          >
            {/* Visual simulation of fractions and math operators beautifully formatted */}
            <span className="block text-[10px] text-slate-500 font-sans tracking-wider uppercase mb-1 font-bold">
              Fórmula en Código LaTeX
            </span>
            <span className="text-sm tracking-wider font-semibold block">{mathContent}</span>
          </div>
        );
      }

      // Parse inline LaTeX single dollars or code highlights
      let parsedNode: React.ReactNode = line;

      // Render Headings
      if (isHeading) {
        const level = line.match(/^#+/)?.[0].length || 1;
        const headingText = line.replace(/^#+\s*/, '');
        const sizeClass = level === 1 ? 'text-2xl mt-4 mb-2' : level === 2 ? 'text-xl mt-3 mb-2' : 'text-base mt-2 mb-1';
        return (
          <h4 key={idx} className={`font-bold text-slate-900 tracking-tight border-b border-slate-100 pb-1 ${sizeClass}`}>
            {headingText}
          </h4>
        );
      }

      // Parse markdown inline bolders (**text**) and code highlights (`code`)
      let lineSegments = [line];
      
      // Highlight inline backticks myCode
      const boldRegex = /\*\*([^*]+)\*\*/g;
      const codeRegex = /`([^`]+)`/g;
      const inlineMathRegex = /\$([^$]+)\$/g;

      // Transform text highlights
      let rawHtml = line
        .replace(boldRegex, '<strong class="font-extrabold text-slate-900">$1</strong>')
        .replace(codeRegex, '<code class="bg-blue-50 text-blue-700 font-mono text-xs px-1.5 py-0.5 rounded border border-blue-100/50">$1</code>')
        .replace(inlineMathRegex, '<span class="font-mono italic font-semibold text-blue-800 px-1 bg-blue-50 rounded border border-blue-100/30">$1</span>');

      return (
        <p
          key={idx}
          className={`leading-relaxed text-sm text-slate-705 ${isListItem ? 'pl-4 py-0.5 border-l-2 border-blue-550/30' : 'py-1'}`}
          dangerouslySetInnerHTML={{ __html: rawHtml }}
        />
      );
    });
  };

  return (
    <div className="h-[calc(100dvh-140px)] min-h-[500px] flex rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs relative">
      
      {/* SIDEBAR COLUMN (Left column on desktop, collapsible menu on mobile) */}
      <aside
        className={`w-80 border-r border-slate-200 bg-[#FAFAFB] flex flex-col shrink-0 transition-transform duration-300 z-30 absolute md:static top-0 bottom-0 left-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Mobile Header indicator inside Sidebar */}
        <div className="p-4 border-b border-slate-200 flex justify-between items-center md:hidden bg-white">
          <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5 font-display">
            <School className="w-4 h-4 text-blue-600" />
            Asignaturas EduAI
          </span>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Cerrar menú lateral"
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of subjects / topics (Heuristic #4: Consistency & standards) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">
              Tus Asignaturas
            </span>
            <div className="space-y-1">
              {SUBJECTS.map((sub) => (
                <div key={sub.id} className="space-y-1">
                  <div className="flex items-center gap-2 p-2 rounded-lg font-bold text-sm text-slate-800">
                    <span className="opacity-80">
                      {sub.id === 'matematica' ? '➗' :
                       sub.id === 'programacion' ? '💻' :
                       sub.id === 'historia' ? '📜' : '🧪'}
                    </span>
                    <span className="font-semibold">{sub.name}</span>
                  </div>
                  {/* Topic items within subject */}
                  <div className="pl-6 space-y-0.5">
                    {sub.topics.map((topic, tIdx) => {
                      const isCurrent = activeSubjectId === sub.id && activeTopicName === topic;
                      return (
                        <button
                          key={tIdx}
                          onClick={() => handleTopicSelect(sub.id, topic)}
                          className={`w-full text-left text-xs p-2 rounded-xl transition-colors block border font-medium ${
                            isCurrent
                              ? 'bg-blue-50/50 border-blue-550/30 text-blue-700 shadow-xs font-semibold'
                              : 'border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                          }`}
                        >
                          {topic}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Configuration settings block at bottom of custom sidebar */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3 shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 font-display">
              <Key className="w-3.5 h-3.5 text-blue-600" />
              Motor de Respuestas
            </span>
            <span
              className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                apiMode === 'real'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-blue-50 border-blue-100 text-blue-800'
              }`}
            >
              {apiMode === 'real' ? 'Real (Gemini 2.5)' : 'Simulado AI'}
            </span>
          </div>

          <div className="space-y-1.5">
            {apiMode === 'real' && !apiKey ? (
              <p className="text-[10px] text-red-650 leading-normal">
                Modo real activo pero no hay API Key guardada. Se usará la simulación.
              </p>
            ) : (
              <p className="text-[10px] text-slate-500 leading-normal">
                {apiMode === 'real'
                  ? 'Conexión directa activa utilizando tu API Key local segura.'
                  : 'Modo simulación pedagógica empática optimizado según tu estilo.'}
              </p>
            )}

            <button
              onClick={() => setShowSettings(true)}
              className="w-full text-center py-2.5 border border-slate-205 bg-white hover:bg-slate-50 rounded-xl text-xs font-bold text-blue-600 transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
            >
              <Sliders className="w-3 h-3 text-blue-600" />
              Configurar API Key
            </button>
            
            {apiKey && (
              <p className="text-[10px] text-emerald-600 text-center font-semibold">
                ✓ API Key guardada.
              </p>
            )}
          </div>
        </div>
      </aside>

      {/* CHAT INTERACTIVE PANEL (Right Column) */}
      <section className="flex-1 flex flex-col bg-white overflow-hidden relative">
        
        {/* Dynamic Navigation AppBar Header */}
        <header className="px-4 py-3 border-b border-slate-200 flex justify-between items-center bg-[#FAFAFB] shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Abrir catálogo o materias"
              className="md:hidden w-10 h-10 rounded-full flex items-center justify-center text-slate-900 hover:bg-slate-100 outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-105 px-2 py-0.5 rounded-md">
                Tema de Estudio
              </span>
              <h2 className="text-sm font-bold text-slate-900 mt-1 line-clamp-1 font-display">
                {activeTopicName}
              </h2>
            </div>
          </div>

          {/* Quick-reply interactive CTAs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onStartQuiz(activeSubjectId, activeTopicName)}
              className="bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl py-1.5 px-3 hover:bg-emerald-100 transition-colors text-xs font-bold flex items-center gap-1.5 cursor-pointer outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <Award className="w-4 h-4 text-emerald-700" />
              Practicar Tema
            </button>
          </div>
        </header>

        {/* Message scrolling area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth bg-slate-50/30">
          {activeMessages.map((msg) => {
            const isTutor = msg.role === 'tutor';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${
                  isTutor ? 'self-start mr-auto' : 'self-end ml-auto flex-row-reverse'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center border font-bold text-xs uppercase shadow-xs ${
                    isTutor
                      ? 'bg-slate-100 text-blue-600 border-slate-200'
                      : 'bg-blue-600 text-white border-blue-600'
                  }`}
                >
                  {isTutor ? 'AI' : profile.name.slice(0, 2)}
                </div>

                {/* Bubble content */}
                <div
                  className={`p-4 rounded-2xl border text-sm shadow-2xs ${
                    isTutor
                      ? 'bg-white border-slate-200 text-slate-800 rounded-tl-sm'
                      : 'bg-blue-600 border-blue-600 text-white rounded-tr-sm'
                  }`}
                >
                  {isTutor ? (
                    <div className="space-y-2">
                      {renderRichContent(msg.content)}
                    </div>
                  ) : (
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  )}
                </div>
              </div>
            );
          })}

          {/* Thinking simulator dot loading */}
          {isThinking && (
            <div className="flex gap-3 max-w-[70%] self-start mr-auto animate-pulse">
              <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-blue-600 text-xs font-bold shadow-xs animate-bounce">
                AI
              </div>
              <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-sm flex items-center h-12 shadow-2xs">
                <span className="text-xs text-slate-500 font-semibold italic flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  EduAI pensando en forma {profile.learningStyle}...
                </span>
              </div>
            </div>
          )}

          {/* Error diagnose dialog according to Heuristic #9 */}
          {apiErrorMsg && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3 text-sm text-red-800 animate-fade-in max-w-2xl mx-auto shadow-xs">
              <AlertTriangle className="w-5 h-5 shrink-0 text-red-600" />
              <div className="space-y-2">
                <h4 className="font-bold">Error de Conexión de IA</h4>
                <p className="text-xs">{apiErrorMsg}</p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => handleSendMessage()}
                    className="bg-white border border-red-200 text-red-800 rounded-xl px-3 py-1.5 text-xs hover:bg-red-100 font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-3xs"
                  >
                    <RefreshCw className="w-3 h-3" /> Reintentar
                  </button>
                  <button
                    onClick={() => {
                      setApiMode('simulado');
                      setApiErrorMsg(null);
                    }}
                    className="text-xs font-semibold underline text-red-800 hover:text-red-900 cursor-pointer"
                  >
                    Cambiar a Modo Simulado (Seguro)
                  </button>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="px-4 py-4 border-t border-slate-200 bg-white shrink-0 z-10 select-all">
          <form
            onSubmit={handleSendMessage}
            className="max-w-3xl mx-auto bg-slate-50 border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/25 rounded-2xl p-1.5 flex gap-2 transition-all shadow-inner"
          >
            <button
              type="button"
              aria-label="Adjuntar archivo o capturar pantalla"
              onClick={() => alert('Simulado: Puedes adjuntar apuntes en PDF o capturas de código en la aplicación final.')}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors shrink-0 outline-none cursor-pointer"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={`Escribe tu consulta sobre ${activeTopicName}...`}
              className="flex-1 bg-transparent border-0 focus:ring-0 outline-none text-sm leading-relaxed text-gray-800 max-h-24 min-h-[40px] py-2 resize-none placeholder:text-gray-400 font-sans"
              rows={1}
              aria-label="Mensaje para el tutor"
            />

            <button
              type="submit"
              disabled={!inputValue.trim() || isThinking}
              aria-label="Enviar mensaje"
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                inputValue.trim() ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="max-w-3xl mx-auto mt-2 text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            EduAI puede cometer errores. Verifica el código generado.
          </div>
        </div>
      </section>

      {/* DISCRETE DIALOG: Configurations and secure API Key session storage entry */}
      {showSettings && (
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xl max-w-md w-full animate-scale-up">
            <div className="flex justify-between items-start mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-display">
                <Key className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold">Configuración de Gemini API Key</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveApiKey} className="space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed">
                Ingresa tu <strong>Gemini API Key</strong> de Google para probar el <strong>Modo de Conexión Real</strong>. 
                Los datos se guardan estrictamente en la memoria de la sesión (Session Storage) de tu navegador local.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="api-key-input">
                  Google Gemini API Key
                </label>
                <input
                  id="api-key-input"
                  type="password"
                  value={tempKey}
                  onChange={(e) => setTempKey(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
                  placeholder="AIzaSy..."
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-blue-50/50 border border-blue-100">
                <div className="space-y-0.5">
                  <span className="block text-xs font-bold text-slate-900">Activar Modo Real</span>
                  <span className="block text-[10px] text-slate-500">
                    Cambia la simulación por el endpoint oficial 2.5
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={apiMode === 'real'}
                  disabled={!tempKey.trim() && !apiKey}
                  onChange={(e) => setApiMode(e.target.checked ? 'real' : 'simulado')}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 text-xs font-semibold pt-4 border-t border-slate-150">
                <button
                  type="button"
                  onClick={() => {
                    setTempKey('');
                    setApiKey('');
                    sessionStorage.removeItem('EDUAI_GEMINI_API_KEY');
                    setApiMode('simulado');
                    setShowSettings(false);
                  }}
                  className="px-3 py-2 text-red-650 hover:underline cursor-pointer font-bold"
                >
                  Quitar Key / Usar Simulado
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white hover:bg-blue-700 rounded-xl px-4 py-2.5 shadow-sm font-bold cursor-pointer"
                >
                  Guardar Configuración
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
