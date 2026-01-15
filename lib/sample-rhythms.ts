import { Rhythm } from './types';

/**
 * Ritmos auténticos de pandereta gallega basados en Xabier Díaz
 * Fuente: https://xabierdiaz.com/es/curso-de-pandeireta/
 */

export const SAMPLE_RHYTHMS: Rhythm[] = [
  // NIVEL 1 - BÁSICO
  {
    id: 'rhythm-1',
    name: 'Patrones Ternarios Simples',
    description: 'Primeros patrones rítmicos de 3 tiempos. Golpes adelante y atrás alternados.',
    level: 1,
    bpm: 80,
    pattern: 'po-ro-po | po-ro-po | po-ro-po',
    type: 'basic',
  },
  {
    id: 'rhythm-2',
    name: 'Patrones Binarios Simples',
    description: 'Patrones rítmicos de 2 tiempos. Base para la jota.',
    level: 1,
    bpm: 100,
    pattern: 'po-ro | po-ro | po-ro',
    type: 'basic',
  },
  {
    id: 'rhythm-3',
    name: 'Golpe Adelante',
    description: 'Técnica fundamental: golpe con los dedos hacia adelante (po).',
    level: 1,
    bpm: 60,
    pattern: 'po | po | po | po',
    type: 'basic',
  },
  {
    id: 'rhythm-4',
    name: 'Golpe Atrás',
    description: 'Técnica fundamental: golpe con los dedos hacia atrás (ro).',
    level: 1,
    bpm: 60,
    pattern: 'ro | ro | ro | ro',
    type: 'basic',
  },

  // NIVEL 2 - INTERMEDIO
  {
    id: 'rhythm-5',
    name: 'Muiñeira Simple',
    description: 'Ritmo tradicional gallego básico. Patrón: poporo pero x3, poporo poporo poporo pero.',
    level: 2,
    bpm: 110,
    pattern: 'po-ro-ro pero | po-ro-ro pero | po-ro-ro po-ro-ro po-ro-ro pero',
    type: 'intermediate',
  },
  {
    id: 'rhythm-6',
    name: 'Introducción al Riscado',
    description: 'Técnica de rasgueo (pero): riscado + pulgar. Fundamental para la muiñeira.',
    level: 2,
    bpm: 90,
    pattern: 'pero | pero | pero | pero',
    type: 'intermediate',
  },
  {
    id: 'rhythm-7',
    name: 'Sonoridad Grave',
    description: 'Técnica para obtener sonidos profundos y resonantes en la pandereta.',
    level: 2,
    bpm: 100,
    pattern: 'pó (grave) | pó (grave) | pó (grave)',
    type: 'intermediate',
  },
  {
    id: 'rhythm-8',
    name: 'Jota Básica',
    description: 'Ritmo binario tradicional. Patrón: adelante, atrás, adelante, atrás, adelante.',
    level: 2,
    bpm: 120,
    pattern: 'po-ro-po-ro-po',
    type: 'intermediate',
  },

  // NIVEL 3 - AVANZADO
  {
    id: 'rhythm-9',
    name: 'Muiñeira con Riscado',
    description: 'Muiñeira completa con técnica de riscado integrada. Patrón auténtico de Xabier Díaz.',
    level: 3,
    bpm: 130,
    pattern: 'po-ro-ro pero | po-ro-ro pero | po-ro-ro po-ro-ro po-ro-ro pero',
    type: 'intermediate',
  },
  {
    id: 'rhythm-10',
    name: 'Xota',
    description: 'Variante rápida de la jota. Ritmo energético y festivo.',
    level: 3,
    bpm: 140,
    pattern: 'po-ro-po-ro-po (rápido)',
    type: 'intermediate',
  },
  {
    id: 'rhythm-11',
    name: 'Puño Acentuado',
    description: 'Golpe con el puño cerrado, acentuado. Cierre de frases rítmicas (pó).',
    level: 3,
    bpm: 110,
    pattern: 'po-ro-ro pero | pó (acentuado)',
    type: 'intermediate',
  },

  // NIVEL 4 - EXPERTO
  {
    id: 'rhythm-12',
    name: 'Aleluya',
    description: 'Ritmo festivo y celebratorio. Se toca sin cantar primero, luego se canta al unísono.',
    level: 4,
    bpm: 120,
    pattern: 'Patrón específico que acompaña la melodía',
    type: 'intermediate',
  },
  {
    id: 'rhythm-13',
    name: 'Variaciones de Muiñeira',
    description: 'Muiñeira con variaciones y adornos. Técnicas avanzadas de sonoridad.',
    level: 4,
    bpm: 140,
    pattern: 'Variaciones del patrón base con riscado y sonoridad',
    type: 'intermediate',
  },
  {
    id: 'rhythm-14',
    name: 'Combinaciones de Ritmos',
    description: 'Combinación de múltiples ritmos en una secuencia. Transiciones fluidas.',
    level: 4,
    bpm: 130,
    pattern: 'Muiñeira → Jota → Muiñeira',
    type: 'intermediate',
  },

  // NIVEL 5 - MAESTRÍA
  {
    id: 'rhythm-15',
    name: 'Improvisación Libre',
    description: 'Improvisación sobre patrones de muiñeira. Técnicas avanzadas y expresión personal.',
    level: 5,
    bpm: 150,
    pattern: 'Libre basado en muiñeira',
    type: 'intermediate',
  },
  {
    id: 'rhythm-16',
    name: 'Interpretación Profesional',
    description: 'Interpretación completa de piezas tradicionales gallegas con técnica profesional.',
    level: 5,
    bpm: 140,
    pattern: 'Piezas completas tradicionales',
    type: 'intermediate',
  },
];

/**
 * Información sobre técnicas de pandereta gallega
 */
export const TECHNIQUE_GUIDE = {
  techniques: [
    {
      name: 'Golpe Adelante (po)',
      description: 'Golpe con los dedos hacia adelante. Sonido claro y brillante.',
      level: 1,
      onomatopoeia: 'po',
    },
    {
      name: 'Golpe Atrás (ro)',
      description: 'Golpe con los dedos hacia atrás. Sonido complementario al adelante.',
      level: 1,
      onomatopoeia: 'ro',
    },
    {
      name: 'Riscado (pero)',
      description: 'Técnica de rasgueo con los dedos + pulgar. Característica de la pandereta gallega.',
      level: 2,
      onomatopoeia: 'pero',
    },
    {
      name: 'Puño Acentuado (pó)',
      description: 'Golpe con el puño cerrado, acentuado. Cierre de frases y énfasis rítmico.',
      level: 2,
      onomatopoeia: 'pó',
    },
    {
      name: 'Sonoridad Grave',
      description: 'Técnica para obtener sonidos profundos y resonantes. Golpes más fuertes y controlados.',
      level: 2,
      onomatopoeia: 'pó (grave)',
    },
  ],
  rhythms: [
    {
      name: 'Muiñeira',
      description: 'Ritmo tradicional gallego más importante. Patrón ternario con riscado.',
      pattern: 'poporo pero x3, poporo poporo poporo pero',
      bpmRange: '110-140',
      difficulty: 'Intermedio-Avanzado',
    },
    {
      name: 'Jota',
      description: 'Ritmo binario tradicional. Patrón: adelante, atrás, adelante, atrás, adelante.',
      pattern: 'po-ro-po-ro-po',
      bpmRange: '120-150',
      difficulty: 'Intermedio',
    },
    {
      name: 'Xota',
      description: 'Variante rápida de la jota. Ritmo energético y festivo.',
      pattern: 'po-ro-po-ro-po (rápido)',
      bpmRange: '140-180',
      difficulty: 'Avanzado',
    },
    {
      name: 'Aleluya',
      description: 'Ritmo festivo y celebratorio. Se toca con canto al unísono.',
      pattern: 'Patrón específico que acompaña la melodía',
      bpmRange: '100-130',
      difficulty: 'Avanzado',
    },
  ],
};
