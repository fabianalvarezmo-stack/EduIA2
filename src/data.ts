/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Subject, EducationalLevel, LearningStyle, QuizQuestion } from './types';

export const ESTILO_INFO = {
  visual: {
    title: 'Visual / Metáforas',
    desc: 'Explicaciones gráficas y analogías creativas.',
    icon: 'palette'
  },
  practico: {
    title: 'Práctico / Ejercicios',
    desc: 'Aprender haciendo, resolución de problemas paso a paso.',
    icon: 'construction'
  },
  teorico: {
    title: 'Teórico / Formal',
    desc: 'Definiciones precisas, estructura y rigor académico.',
    icon: 'menu_book'
  }
};

export const SUBJECTS: Subject[] = [
  {
    id: 'matematica',
    name: 'Matemáticas',
    iconName: 'calculate',
    color: 'emerald',
    progress: 65,
    topics: ['Álgebra y Ecuaciones', 'Límites y Continuidad', 'Derivadas Trigonométricas', 'Geometría Analítica']
  },
  {
    id: 'programacion',
    name: 'Programación',
    iconName: 'code',
    color: 'teal',
    progress: 40,
    topics: ['Concepto de Polimorfismo', 'Lógica de Control con JS', 'Manejo de API con Python', 'Estructuras de Datos']
  },
  {
    id: 'historia',
    name: 'Historia de Chile',
    iconName: 'history_edu',
    color: 'amber',
    progress: 80,
    topics: ['Independencia de Chile', 'Constituciones Chilenas', 'El Salitre y Cambios Sociales', 'El Siglo XX en Chile']
  },
  {
    id: 'ciencias',
    name: 'Ciencias',
    iconName: 'science',
    color: 'sky',
    progress: 55,
    topics: ['Cinemática y Dinámica', 'Leyes de Termodinámica', 'Genética Mendeliana', 'Química Orgánica Básica']
  }
];

// Helper to calculate score to Chilean scale (1.0 to 7.0) with requirement of 60% standard approval
// 60% of score corresponds to a 4.0 grade.
export function calculateGrade(score: number, total: number): number {
  if (total === 0) return 1.0;
  
  const pct = score / total;
  let grade = 1.0;
  
  if (pct < 0.6) {
    // 1.0 + pct * (3.0 / 0.6)
    grade = 1.0 + pct * 5.0;
  } else {
    // 4.0 + (pct - 0.6) * (3.0 / 0.4)
    grade = 4.0 + (pct - 0.6) * 7.5;
  }
  
  // Round to 1 decimal place
  return Math.round(grade * 10) / 10;
}

// Generate high quality interactive Quizzes on the fly based on parameters
export function getQuizForTopic(subjectId: string, topicName: string, level: EducationalLevel, style: LearningStyle): QuizQuestion[] {
  // Let's build pre-defined rich educational questions for Chile PAES & Higher Ed
  if (subjectId === 'programacion') {
    return [
      {
        question: '¿Cuál es la idea central detrás del Polimorfismo en Programación Orientada a Objetos?',
        options: [
          'La habilidad de ocultar el código fuente de una clase usando modificadores privados.',
          'Permitir que diferentes clases de objetos respondan al mismo mensaje o firma de método de formas distintas.',
          'La capacidad de ejecutar múltiples hilos de procesamiento de forma simultánea en la CPU.',
          'Crear una copia idéntica de un objeto en memoria dinámica.'
        ],
        correctOptionIndex: 1,
        explanation: 'El polimorfismo ("muchas formas") nos permite tratar objetos de distintas subclases a través de la interfaz común de una superclase, permitiendo que cada subclase proporcione una implementación especializada de dicho método.'
      },
      {
        question: 'En Javascript, si queremos sobrescribir un método heredado de una clase base, ¿cómo llamamos al método original de la clase base?',
        options: [
          'Usando la palabra clave "parent.metodo()"',
          'Llamando a "this.metodo()" directamente',
          'Usando "super.metodo()"',
          'No se puede llamar al método de la clase base una vez sobrescrito'
        ],
        correctOptionIndex: 2,
        explanation: 'En clases ES6+, "super" hace referencia a la clase superior inmediata de la que se hereda, permitiendo llamar a su constructor o a sus métodos sobrescritos.'
      },
      {
        question: '¿Cuál es la diferencia principal entre Sobrecarga (Overloading) y Sobrescritura (Overriding)?',
        options: [
          'La sobrecarga ocurre en tiempo de ejecución, mientras que la sobrescritura es en tiempo de compilación.',
          'La sobrecarga define el mismo método en diferentes clases; la sobrescritura define métodos con el mismo nombre y firmas de parámetros distintas en la misma clase.',
          'La sobrecarga permite el mismo nombre con firmas o cantidad de parámetros diferentes en una misma clase; la sobrescritura redefine un método heredado con idéntica firma en una subclase.',
          'No hay diferencias sustanciales, son sinónimos del mismo concepto.'
        ],
        correctOptionIndex: 2,
        explanation: 'Correcto. La sobrecarga (Overloading) añade nuevas firmas de parámetros para un método en la misma clase (común en lenguajes como C++ o Java, simulado en JS), mientras que la sobrescritura (Overriding) reemplaza la implementación heredada en una subclase.'
      }
    ];
  } else if (subjectId === 'matematica') {
    return [
      {
        question: 'Si f(x) = sen(3x), ¿cuál es su derivada con respecto a x aplicando la regla de la cadena?',
        options: [
          'f\'(x) = cos(3x)',
          'f\'(x) = 3 cos(3x)',
          'f\'(x) = -3 cos(3x)',
          'f\'(x) = 3 sen(3x)'
        ],
        correctOptionIndex: 1,
        explanation: 'Para f(x) = sen(3x), derivamos la función exterior (sen(u) => cos(u)) y multiplicamos por la derivada del argumento interior (u = 3x => u\' = 3). Resultado: 3 cos(3x).'
      },
      {
        question: '¿Qué representa geométricamente la derivada de una función en un punto dado?',
        options: [
          'La línea perpendicular al eje de las abscisas.',
          'El área acumulada bajo la curva desde cero hasta ese punto.',
          'La pendiente de la recta tangente a la curva de la función en ese punto.',
          'El radio de curvatura de un círculo concéntrico.'
        ],
        correctOptionIndex: 2,
        explanation: 'La derivada f\'(a) es precisamente el valor de la pendiente (m) de la recta tangente en el punto (a, f(a)). Mide la tasa de cambio instantánea.'
      },
      {
        question: 'En la preparación de la PAES, ¿cuál es la solución de la ecuación cuadrática x² - 5x + 6 = 0?',
        options: [
          'x = 1 y x = 6',
          'x = -2 y x = -3',
          'x = 2 y x = 3',
          'x = 5 y x = 0'
        ],
        correctOptionIndex: 2,
        explanation: 'Factorizando la ecuación cuadrática tenemos (x - 2)(x - 3) = 0. Por ende, las soluciones raíz son x = 2 y x = 3. También es comprobable sumando ambas soluciones (5) o multiplicándolas (6).'
      }
    ];
  } else if (subjectId === 'historia') {
    return [
      {
        question: '¿Cuál de estos eventos marca formalmente el inicio del proceso de Independencia en Chile, celebrado el 18 de Septiembre?',
        options: [
          'La Batalla de Maipú en 1818.',
          'La instalación de la Primera Junta Nacional de Gobierno en 1810.',
          'El Cruce de los Andes por el Ejército Libertador.',
          'La firma del Acta de la Independencia en Talca.'
        ],
        correctOptionIndex: 1,
        explanation: 'La Primera Junta de Gobierno de 1810 fue convocada para gobernar en ausencia del cautivo rey Fernando VII, siendo el primer paso de autonomía republicana que impulsó el proceso soberano definitivo.'
      },
      {
        question: '¿En qué consistió históricamente la Época del Salitre y su peso económico en el desarrollo urbano de Chile?',
        options: [
          'Un monopolio agrícola del trigo exportado a California.',
          'Un auge de explotación del nitrato de sodio en la pampa del norte que financió una parte mayoritaria del presupuesto fiscal entre fines del s. XIX e inicios del s. XX.',
          'La extracción aurífera en los lavaderos de Valdivia que enriqueció a la corona española.',
          'La nacionalización del cobre impulsada a mediados del siglo XX.'
        ],
        correctOptionIndex: 1,
        explanation: 'La minería del salitre en Tarapacá y Antofagasta atrajo enorme mano de obra (pampa salitrera) y generó inmensos impuestos de exportación para el Estado chileno hasta el invento del salitre sintético alemán.'
      },
      {
        question: '¿Qué constitución rigió de manera prolongada en Chile durante gran parte del siglo XIX instaurando el orden presidencialista autoritario del régimen conservador?',
        options: [
          'La Constitución de 1823 o Moralista.',
          'La Constitución Liberal de 1828.',
          'La Constitución de 1833, de fuerte inspiración portaliana.',
          'La Constitución de 1925 liderada por Alessandri.'
        ],
        correctOptionIndex: 2,
        explanation: 'La Constitución de 1833, redactada por Mariano Egaña y Manuel José Gandarillas, consagró un ejecutivo presidencial híper-poderoso con derecho a veto y reelección, dando estabilidad al régimen conservador decimonónico.'
      }
    ];
  } else {
    // Ciencias
    return [
      {
        question: '¿Qué ley de la física fundamental estipula que a toda acción se opone siempre una reacción igual y opuesta?',
        options: [
          'La Primera Ley de Newton o Inercia.',
          'La Segunda Ley de Newton o de Fuerza y aceleración (F = m*a).',
          'La Tercera Ley de Newton, conocida como Acción y Reacción.',
          'La Ley de Gravitación Universal.'
        ],
        correctOptionIndex: 2,
        explanation: 'La Tercera ley de Newton explica que si un cuerpo ejerce una fuerza sobre otro, el segundo ejerce una fuerza de igual magnitud pero sentido opuesto sobre el primero.'
      },
      {
        question: 'En Genética, ¿cuál es la diferencia entre el Genotipo y el Fenotipo de un organismo?',
        options: [
          'El genotipo es el mapa metabólico celular; el fenotipo es la tasa de replicación del ADN.',
          'El genotipo es la composición genética de un alelo; el fenotipo es la expresión observable física y funcional de dichas características influenciada por el ambiente.',
          'El genotipo mide los caracteres adquiridos; el fenotipo es siempre heredable de forma inalterable.',
          'Son términos idénticos.'
        ],
        correctOptionIndex: 1,
        explanation: 'El genotipo representa el conjunto de genes en el ADN. El fenotipo es el desarrollo real medible y visible del individuo (morfología, fisiología, conducta), determinado por el genotipo y el ambiente.'
      },
      {
        question: '¿Qué tipo de enlace químico se produce entre átomos que comparten electrones para alcanzar el octeto de estabilidad?',
        options: [
          'Enlace Iónico o Electrovalente por transferencia neta.',
          'Enlace Covalente.',
          'Enlace Metálico por nube libre de electrones.',
          'Enlaces de puentes de Hidrógeno.'
        ],
        correctOptionIndex: 1,
        explanation: 'En los enlaces covalentes, los átomos (típicamente no metales) comparten un par o más de electrones de valencia para adquirir la configuración estable de un gas noble.'
      }
    ];
  }
}

// Empathy-driven simulated AI response generator that yields highly pedagogical content based on styles.
// Features clean LaTeX math simulations, diagrams, structured outputs and helpful tips.
export function generateSimulatedResponse(
  userInput: string,
  subjectId: string,
  topicName: string,
  level: EducationalLevel,
  style: LearningStyle
): string {
  const normInput = userInput.toLowerCase();
  
  // Custom responses reflecting level + style combinations
  const levelGreeting = 
    level === 'basica' ? '¡Hola! Qué buena pregunta. Vamos a entenderla de forma muy fácil juntos. 😊' :
    level === 'media' ? 'Hola. Un gusto examinar este tema contigo; esto es de alta relevancia para consolidar tus aprendizajes de Enseñanza Media y preparar la PAES. 💪' :
    'Estimado(a) estudiante. A nivel académico superior, el rigor crítico y formal de esta materia nos permite estructurar el análisis con solidez teórica. Analicemos detalladamente: 🎓';

  let subjectContext = '';
  let mainConcept = '';

  if (subjectId === 'programacion') {
    if (normInput.includes('polimorfismo') || normInput.includes('polimor') || normInput.includes('clase') || normInput.includes('codigo') || normInput.includes('python') || normInput.includes('js')) {
      if (style === 'visual') {
        mainConcept = `
### 🎨 Analogía Visual: "El control universal de la TV"

Imagina que tienes un control remoto universal con un solo botón marcado como **▶ PLAY**. 
No necesitas saber de qué marca es la tele o el parlante; simplemente presionas el botón.

\`\`\`
[ Control Universal ] 
        │
        ▼  Señal: "PLAY()"
 ┌───────────────┬────────────────┐
 │               │                │
 ▼               ▼                ▼
[SmartTV]    [ReproductorCD]   [ConsolaJuego]
 (Dibuja        (Gira el          (Inicia el
 imagen)        disco)            motor gráfico)
\`\`\`

Cada uno de estos aparatos sabe exactamente qué hacer ante la orden \`PLAY()\` pero lo ejecutan de maneras completamente distintas. ¡Eso es Polimorfismo!

**Ejemplo Práctico en código sencillo:**
\`\`\`js
class Instrumento {
  tocar() { return "Genera sonido base"; }
}

class Guitarra extends Instrumento {
  tocar() { return "🎸 ¡Do-Re-Mi con distorsión!"; }
}

class Piano extends Instrumento {
  tocar() { return "🎹 ¡Melodía clásica suave!"; }
}
\`\`\`
Si tenemos una lista mixta de instrumentos y ejecutamos \`.tocar()\` en cada uno, cada cual se expresará en su "propia forma".`;
      } else if (style === 'practico') {
        mainConcept = `
### 🛠️ Código de Ejemplo y Desafío Rápido

Vamos a implementar Polimorfismo por sobrescritura de clases en **TypeScript / Modern JS**. El objetivo es procesar una nómina de empleados chilenos donde cada cargo tiene un cálculo salarial distinto:

\`\`\`typescript
// Clase base
class Empleado {
  constructor(public nombre: string, public sueldoBase: number) {}

  calcularLiquidacion(): number {
    return this.sueldoBase; // Retorno base
  }
}

// Subclase con bono de venta (Vendedor)
class Vendedor extends Empleado {
  constructor(nombre: string, sueldoBase: number, public comisionVentas: number) {
    super(nombre, sueldoBase);
  }

  // Sobrescribimos el método original
  calcularLiquidacion(): number {
    return this.sueldoBase + this.comisionVentas;
  }
}

// Subclase con honorarios por horas extra (Ingeniero)
class Ingeniero extends Empleado {
  constructor(nombre: string, sueldoBase: number, public valorHoraExtra: number, public horasExtra: number) {
    super(nombre, sueldoBase);
  }

  calcularLiquidacion(): number {
    return this.sueldoBase + (this.valorHoraExtra * this.horasExtra);
  }
}
\`\`\`

**🚀 Cómo aplicarlo dinámicamente:**
\`\`\`javascript
const equipo: Empleado[] = [
  new Vendedor("Sofía", 460000, 150000),
  new Ingeniero("Andrés", 1200000, 15000, 8)
];

equipo.forEach(emp => {
  console.log(\`Empleado: \${emp.nombre} | Total a pagar: $\${emp.calcularLiquidacion()}\`);
});
\`\`\`
Ves cómo la función que recorre al equipo no le importa la clase exacta (\`Vendedor\` o \`Ingeniero\`), solo confía en que toda entidad heredada de \`Empleado\` responde fielmente a \`calcularLiquidacion()\`.`;
      } else { // teorico
        mainConcept = `
### 📖 Definición Formal y Axiomas del Polimorfismo

En la teoría de sistemas computacionales o sistemas orientados a objetos (Coad, Yourdon, Booch), el **Polimorfismo** representa la propiedad por la cual un elemento de software puede tomar múltiples firmas formales de tipos de datos asociados o bien resolver de forma tardía (ejecución binding) el despacho de un procedimiento.

#### 1. Tipos de Polimorfismo:
* **Polimorfismo Ad-hoc (Sobrecarga):** Múltiples funciones con idéntico identificador pero firmas y parámetros formalmente asimétricos. Resuelto estáticamente por el enlazador en tiempo de compilación.
* **Polimorfismo Paramétrico (Generics):** Definición de algoritmos parametrizando el tipo de dato abstracto sin ligarse de antemano a uno estricto (ej. \`List<T>\`).
* **Subtipado (Polimorfismo de Herencia / Inclusión):** Habilidad de una instancia de tipo derivado de actuar en lugar de su tipo ancestro en contextos de asignación rígidos.

#### 2. Principio de Sustitución de Liskov (LSP):
Formulado originalmente por Bárbara Liskov:
> Sea $\\phi(x)$ una propiedad comprobable acerca de objetos $x$ de tipo $T$. Entonces $\\phi(y)$ debe ser verdadero para objetos $y$ de tipo $S$ donde $S$ es un subtipo de $T$.

_Implicancia:_ Si una jerarquía polimórfica corrompe el comportamiento esperado por la clase base, se viola el principio fundacional de la arquitectura de software de calidad.`;
      }
    } else {
      mainConcept = `Excelente tema sobre programación. ¿Te gustaría que profundicemos más sobre cómo implementar funciones, clases o analizar la arquitectura orientado a objetos segun tu estilo de aprendizaje **${style}**?`;
    }
  } else if (subjectId === 'matematica') {
    if (normInput.includes('derivada') || normInput.includes('deriv') || normInput.includes('line') || normInput.includes('límite') || normInput.includes('limit') || normInput.includes('ecuac')) {
      if (style === 'visual') {
        mainConcept = `
### 📈 Comprensión Curva-Tangente e Interpretación Geométrica

Visualiza una montaña rusa en una pantalla. Si apagas el motor del carrito y este saliera volando por inercia en un segundo exacto, la dirección recta en la que sale proyectado es la **Recta Tangente**.

\`\`\`
          / (Recta tangente - trayectoria de inercia)
         /
    .---/---.  (Curva de la montaña rusa)
   /   *     \\
  /  (Punto de contacto "P")
\`\`\`

La **derivada** en ese punto de la curva es exactamente la pendiente o "inclinación" de esa recta. Si la derivada es:
- **Positiva ($>0$):** El carrito va subiendo la pendiente.
- **Cero ($=0$):** El carrito está en la cima o fondo plano por un instante.
- **Negativa ($<0$):** El carrito va de bajada.

**Ejemplo de Derivada Clásica:**
Si la posición del carrito en metros viene dada por la ecuación cuadrática:  
$s(t) = t^2 + 2t$

La función de su velocidad en cualquier instante es la primera derivada temporal:  
$v(t) = s'(t) = 2t + 2$`;
      } else if (style === 'practico') {
        mainConcept = `
### 📝 Ejercicios Resueltos Paso a Paso para la PAES M1/M2 o Cálculo I

Vamos a derivar paso a paso una función trigonométrica compuesta de alta presencia en certámenes universitarios.

**Función a evaluar:**
$f(x) = \\cos(4x^3)$

**Paso 1: Identificar la función interna y externa**
* Función externa: $g(u) = \\cos(u)$
* Función interna: $u(x) = 4x^3$

**Paso 2: Aplicar la regla de la cadena**
La regla especifica:
$\\frac{df}{dx} = g'(u) \\cdot u'(x)$

* Derivada de la externa: $g'(u) = -\\operatorname{sen}(u) = -\\operatorname{sen}(4x^3)$
* Derivada de la interna: $u'(x) = 4 \\cdot 3x^2 = 12x^2$

**Paso 3: Ensamblar la respuesta final**
$f'(x) = -12x^2 \\operatorname{sen}(4x^3)$

_¡Listo! Puedes practicar con estos ejercicios rápidos para ganar confianza antes de tus exámenes._`;
      } else { // teorico
        mainConcept = `
### 📐 Definición de la Derivada mediante Límites Formales

En análisis matemático riguroso, la **derivada** de una función real $f(x)$ en un punto perteneciente al dominio abierto se define formalmente como el valor límite de la razón incremental cuando el incremento tiende a cero:

$$f'(x) = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}$$

#### 📑 Teoremas Importantes de Derivabilidad:
1. **Teorema de Continuidad:** Si una función $f(x)$ es derivable en un punto $a$, entonces es necesariamente continua en $a$. Cabe notar que la inversa no siempre es verdadera (el contraejemplo clásico es la función valor absoluto $f(x) = |x|$ en $x=0$).
2. **Teorema de Rolle:** Si $f(x)$ es continua en el intervalo cerrado $[a,b]$, derivable en el abierto $(a,b)$ y cumple que $f(a) = f(b)$, entonces existe al menos un punto $c \\in (a,b)$ tal que $f'(c) = 0$.

Esto sustenta matemáticamente el análisis de optimización y mínimos locales de ingeniería.`;
      }
    } else {
      mainConcept = `Excelente pregunta sobre matemáticas. Los contenidos matemáticos son fundamentales para la PAES de Acceso Superior en Chile. ¿Deseas resolver algún ejercicio específico hoy?`;
    }
  } else if (subjectId === 'historia') {
    if (normInput.includes('independencia') || normInput.includes('patria') || normInput.includes('chile') || normInput.includes('guerra') || normInput.includes('constitu')) {
      if (style === 'visual') {
        mainConcept = `
### 🗺️ Línea de Tiempo de la Independencia de Chile (1810 - 1818)

Visualicemos las tres etapas fundamentales del nacimiento de nuestra República con las figuras políticas más emblemáticas:

\`\`\`
 [ 1810 ] ──────► [ 1814 ] ───────► [ 1817 ] ──────► [ 1818 ]
  Patria Vieja       Reconquista         Patria Nueva       Independencia
  • Primera Junta    • Derrota Rancagua  • Cruce Andes      • Firma Acta (Talca)
  • Carrera manda    • Represión         • Batalla Chacabuco • Batalla de Maipú
  • Primeros símbolos                    • O'Higgins Director • Consolidación
\`\`\`

**📌 Analogía del Proceso Histórico:**
La Independencia no fue un evento de un solo día, fue como "hornear pan". La Primera Junta de 1810 echó los ingredientes de la autonomía conservando lealtad provisional al rey; los hermanos Carrera encendieron el horno con ideas patriotas radicales; España retiró la mezcla a la fuerza encarcelando líderes (conspiración de San Mateo); finalizando con San Martín y O'Higgins que trajeron la fuerza unificada para amasar la victoria definitiva en Maipú.`;
      } else if (style === 'practico') {
        mainConcept = `
### 📜 Guía de Estudio Rápido: Preguntas Tipo PAES con Justificación

Analicemos cómo suele evaluarse el período de Independencia y la organización de la República en las pruebas chilenas de ingreso nacional:

**Pregunta típica PAES:**
> Tras la abdicación de Bernardo O'Higgins en 1823, se inició un periodo de debate político conocido como "Organización de la República" o "Anarquía". ¿Cuál fue el principal foco de discusión socio-política entre pipiolos y pelucones en esta época?

* **Alternativa Correcta:** Definir el grado de centralización del Estado, la relación de la Iglesia Católica con el aparato estatal y el límite de las libertades constitucionales ciudadanas individuales.
* **Por qué es correcta:** Los **pelucones** (conservadores) promovían un poder central autoritario sólido bajo dogmas tradicionales y clericales, en oposición a los **pipiolos** (liberales) que demandaban federalismo o división de poderes amplia con garantías de libertades públicas.

**✏️ Tarjeta de Síntesis:**
* **1823-1830:** Ensayos constitucionales (Moralistas, Federales, Liberales).
* **1830:** Batalla de Lircay derrota liberal dando pie a los decenios Conservadores dominados doctrinariamente por Diego Portales.`;
      } else { // teorico
        mainConcept = `
### 🏛️ Análisis Historiográfico: El Ideario Portaliano y la Constitución de 1833

El desarrollo institucional chileno en el siglo XIX estuvo fuertemente condicionado por la visión pragmática-autoritaria de **Diego Portales Palazuelos**. A diferencia de los teorizadores de corte doctrinario liberal de la Ilustración, el pensamiento político de Portales se caracterizó por un fuerte asidero realista empírico.

#### 📝 Carta a José M. Cea (Marzo de 1822) - Extracto Axiomático:
> *"La democracia que tanto pregonan los ilusos es un absurdo en los países de América, llenos de vicios y donde los ciudadanos carecen de toda virtud, como es necesario para establecer una verdadera República. La monarquía no es tampoco el ideal americano... La República es el sistema que hay que adoptar; ¿pero sabe cómo yo la entiendo para estos países? Un Gobierno fuerte, centralizador, cuyos hombres sean modelos de virtud y patriotismo, y así enderezar a los ciudadanos por el camino del orden y las virtudes."*

Este pragmatismo sustenta la estructura dogmática de la **Constitución de 1833**:
1. **Ejecutivo Hipertrofiado:** Concesión de facultades extraordinarias al Presidente de la República (declarar estado de sitio, reelección inmediata por otros 5 años, veto de leyes).
2. **Sufragio Censitario:** Limitación del espectro electoral a hombres que supieran leer y escribir que además contaran con capital pecuniario o patrimonio acreditable.
3. **Oficialidad Confesional:** Artículo 5º consagra la religión Católica, Apostólica y Romana con exclusión del ejercicio público de cualquier otra.`;
      }
    } else {
      mainConcept = `Excelente interés sobre la historia de nuestro país. La Historia de Chile abarca desde los pueblos originarios, la conquista hispana, la independencia, hasta el salitre e industrialización moderna. ¿Qué etapa o evento chileno te interesa estudiar en detalle hoy bajo el enfoque **${style}**?`;
    }
  } else {
    // Ciencias
    if (style === 'visual') {
      mainConcept = `
### 🧬 Diagrama Visual del Átomo y Enlaces Químicos

Imagínate el enlace químico como una pista de baile donde los electrones de valencia son los bailarines:

* **Enlace Iónico (Transferencia):** Un átomo muy fuerte y egoísta (como el Cloro) le arrebata el bailarín al Sodio. Quedan atraídos magnéticamente por amor-odio de cargas positivas y negativas.
* **Enlace Covalente (Compartir):** Dos amigos cercanos prestan sus electrones conjuntamente. Ninguno pierde, ambos bailan tomados de las manos.

\`\`\`
Enlace Covalente: H : H (Compartición de 2 electrones)
Enlace Iónico:      [Na]+  [:Cl:]- (Atracción electrostática)
\`\`\`

Este intercambio crea asombrosas estructuras moleculares que sostienen la vida celular.`;
    } else if (style === 'practico') {
      mainConcept = `
### 🧪 Leyes de Newton y Resolución Práctica

Hagamos un cálculo dinámico de física muy común en las evaluaciones chilenas de ciencias:

**Enunciado:**
> Un bloque de $15 \\text{ kg}$ se desliza sobre una superficie plana horizontal arrastrado por una fuerza de $50 \\text{ N}$. Si el coeficiente de roce dinámico es $\\mu_k = 0.2$, calcula la aceleración del bloque. (Usa aceleración de gravedad $g = 10 \\text{ m/s}^2$).

**Procedimiento:**
1. **Calcular la fuerza de roce ($f_r$):**
   * Fuerza normal $N = m \\cdot g = 15 \\text{ kg} \\cdot 10 \\text{ m/s}^2 = 150 \\text{ N}$
   * $f_r = \\mu_k \\cdot N = 0.2 \\cdot 150 \\text{ N} = 30 \\text{ N}$ en sentido opuesto al movimiento.
2. **Fuerza Neta ($F_{\\text{neta}}$):**
   * $F_{\\text{neta}} = F_{\\text{aplicada}} - f_r = 50 \\text{ N} - 30 \\text{ N} = 20 \\text{ N}$
3. **Calcular aceleración ($a$):**
   * $a = \\frac{F_{\\text{neta}}}{m} = \\frac{20 \\text{ N}}{15 \\text{ kg}} = 1.33 \\text{ m/s}^2$

La aceleración resultante es de $1.33 \\text{ m/s}^2$.`;
    } else { // teorico
      mainConcept = `
### ⚛️ Las Leyes de la Termodinámica: Fundamentación Teórica

Las leyes de la física térmica rigen todos los sistemas moleculares del universo macroscópico observable. A continuación, enunciamos y analizamos formalmente sus principios:

#### 1. Ley Cero (Equilibrio Térmico):
> Si dos sistemas termodinámicos $A$ y $B$ están en equilibrio térmico con un tercero $C$, entonces se encuentran también en equilibrio térmico recíproco entre sí.

Este axioma es la base matemática que permite la calibración y validez de la invención de los termómetros.

#### 2. Primera Ley (Conservación de la Energía):
La variación de energía interna $(\\Delta U)$ en un sistema cerrado es igual al calor neto $(Q)$ absorbido por el sistema menos el trabajo $(W)$ realizado por el mismo:

$$\\Delta U = Q - W$$

*Implicancia:* La energía no puede crease ni destruirse de la nada, solo cambia de forma o vector de transferencia.

#### 3. Segunda Ley (Entropía y Tendencia):
> En cualquier proceso termodinámico espontáneo en un sistema aislado, la entropía total del sistema siempre aumenta o permanece constante en equilibrios reversibles:

$$\\Delta S_{\\text{universo}} \\ge 0$$

Mide el grado de dispersión térmica o desorden estadístico intrínseco de los microestados locales.`;
    }
  }

  return `
${levelGreeting}

${mainConcept}

---
💡 **Consejo de Tutor EduAI:** ¿Tienes dudas sobre este tema o quieres que pongamos a prueba tus habilidades con un mini-cuestionario? Puedes hacer clic en **"Practicar Ejercicios"** o pedirme que te pregunte algo.
  `.trim();
}
