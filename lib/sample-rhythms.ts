import { Rhythm } from './types';

/**
 * Ritmos auténticos de pandereta gallega según metodología de Xabier Díaz
 * Nomenclatura correcta: Ti (adelante), Co (atrás), Riscado, Puño, Sonido Grave
 * Partitura: Ti encima de línea, Co debajo de línea
 * Fuente: https://xabierdiaz.com/es/curso-de-pandeireta/
 */

export const SAMPLE_RHYTHMS: Rhythm[] = [
  // NIVEL 1 - BÁSICO: Ti-Co
  {
    id: 'rhythm-1',
    name: 'Ti-Co Básico',
    description: 'Patrón fundamental: Ti (adelante) y Co (atrás) alternados. Base de toda la pandereta.',
    level: 1,
    bpm: 80,
    pattern: 'Ti-Co-Ti-Co',
    type: 'basic',
  },
  {
    id: 'rhythm-2',
    name: 'Ti Adelante',
    description: 'Técnica fundamental: golpe con los dedos hacia adelante (Ti). Sonido agudo y claro.',
    level: 1,
    bpm: 60,
    pattern: 'Ti | Ti | Ti | Ti',
    type: 'basic',
  },
  {
    id: 'rhythm-3',
    name: 'Co Atrás',
    description: 'Técnica fundamental: golpe con los dedos hacia atrás (Co). Complementa el Ti.',
    level: 1,
    bpm: 60,
    pattern: 'Co | Co | Co | Co',
    type: 'basic',
  },
  {
    id: 'rhythm-4',
    name: 'Alternancia Ti-Co',
    description: 'Práctica de alternancia fluida entre Ti (adelante) y Co (atrás).',
    level: 1,
    bpm: 100,
    pattern: 'Ti-Co | Ti-Co | Ti-Co',
    type: 'basic',
  },

  // NIVEL 2 - INTERMEDIO: Riscado y Sonido Grave
  {
    id: 'rhythm-5',
    name: 'Muiñeira Simple',
    description: 'Ritmo tradicional gallego básico. Patrón: Ti-Co-Ti-Co con riscado final.',
    level: 2,
    bpm: 110,
    pattern: 'Ti-Co-Ti-Co-Riscado',
    type: 'intermediate',
  },
  {
    id: 'rhythm-6',
    name: 'Introducción al Riscado',
    description: 'Técnica de fricción rápida (Riscado): movimiento rápido en la membrana.',
    level: 2,
    bpm: 90,
    pattern: 'Riscado | Riscado | Riscado',
    type: 'intermediate',
  },
  {
    id: 'rhythm-7',
    name: 'Sonido Grave',
    description: 'Técnica para obtener sonidos profundos: golpe con pulgar en zona central.',
    level: 2,
    bpm: 100,
    pattern: 'Ti-Co-Sonido Grave | Ti-Co-Sonido Grave',
    type: 'intermediate',
  },
  {
    id: 'rhythm-8',
    name: 'Jota Básica',
    description: 'Ritmo binario tradicional gallego. Patrón: Ti-Co-Ti-Co-Ti.',
    level: 2,
    bpm: 120,
    pattern: 'Ti-Co-Ti-Co-Ti',
    type: 'intermediate',
  },

  // NIVEL 3 - AVANZADO: Combinaciones
  {
    id: 'rhythm-9',
    name: 'Muiñeira con Riscado',
    description: 'Muiñeira completa con técnica de riscado integrada. Patrón auténtico de Xabier Díaz.',
    level: 3,
    bpm: 130,
    pattern: 'Ti-Co-Ti-Co-Riscado-Ti-Co',
    type: 'intermediate',
  },
  {
    id: 'rhythm-10',
    name: 'Xota',
    description: 'Variante rápida de la jota. Ritmo energético: Ti-Co-Ti-Co-Ti-Co.',
    level: 3,
    bpm: 140,
    pattern: 'Ti-Co-Ti-Co-Ti-Co',
    type: 'intermediate',
  },
  {
    id: 'rhythm-11',
    name: 'Puño Acentuado',
    description: 'Golpe con el puño cerrado para acentuar. Cierre de frases rítmicas.',
    level: 3,
    bpm: 110,
    pattern: 'Ti-Co-Ti-Co-Puño',
    type: 'intermediate',
  },
  {
    id: 'rhythm-12',
    name: 'Aleluya Básica',
    description: 'Ritmo festivo y celebratorio. Patrón: Ti-Co-Riscado-Co-Ti.',
    level: 3,
    bpm: 100,
    pattern: 'Ti-Co-Riscado-Co-Ti',
    type: 'intermediate',
  },

  // NIVEL 4 - EXPERTO: Técnicas Avanzadas
  {
    id: 'rhythm-13',
    name: 'Muiñeira Avanzada',
    description: 'Muiñeira con todas las técnicas: Ti, Co, Riscado, Puño, Sonido Grave.',
    level: 4,
    bpm: 140,
    pattern: 'Ti-Co-Ti-Riscado-Co-Puño-Sonido Grave',
    type: 'intermediate',
  },
  {
    id: 'rhythm-14',
    name: 'Jota Avanzada',
    description: 'Jota con técnicas avanzadas: Ti-Co-Ti-Riscado-Co-Puño.',
    level: 4,
    bpm: 130,
    pattern: 'Ti-Co-Ti-Riscado-Co-Puño',
    type: 'intermediate',
  },
  {
    id: 'rhythm-15',
    name: 'Xota Avanzada',
    description: 'Xota con riscado y sonido grave para mayor expresión.',
    level: 4,
    bpm: 150,
    pattern: 'Ti-Co-Riscado-Ti-Puño-Co-Sonido Grave',
    type: 'intermediate',
  },
  {
    id: 'rhythm-16',
    name: 'Aleluya Completa',
    description: 'Aleluya con técnicas avanzadas: Ti-Co-Riscado-Puño-Sonido Grave.',
    level: 4,
    bpm: 110,
    pattern: 'Ti-Co-Riscado-Puño-Ti-Co-Sonido Grave',
    type: 'intermediate',
  },

  // NIVEL 5 - MAESTRÍA: Interpretación Profesional
  {
    id: 'rhythm-17',
    name: 'Improvisación Muiñeira',
    description: 'Improvisación sobre patrones de muiñeira con todas las técnicas.',
    level: 5,
    bpm: 160,
    pattern: 'Libre basado en muiñeira',
    type: 'intermediate',
  },
  {
    id: 'rhythm-18',
    name: 'Interpretación Profesional',
    description: 'Interpretación completa de piezas tradicionales gallegas con técnica profesional.',
    level: 5,
    bpm: 150,
    pattern: 'Piezas completas tradicionales',
    type: 'intermediate',
  },
];

/**
 * Información sobre técnicas de pandereta gallega según Xabier Díaz
 * Partitura: Ti encima de línea, Co debajo de línea
 */
export const TECHNIQUE_GUIDE = {
  techniques: [
    {
      name: 'Ti (Adelante)',
      description: 'Golpe con los dedos hacia adelante. Sonido agudo y claro.',
      level: 1,
      notation: 'Encima de la línea en partitura',
      sound: 'Agudo y brillante',
    },
    {
      name: 'Co (Atrás)',
      description: 'Golpe con los dedos hacia atrás. Complementa el Ti.',
      level: 1,
      notation: 'Debajo de la línea en partitura',
      sound: 'Agudo y claro',
    },
    {
      name: 'Riscado',
      description: 'Técnica de fricción rápida en la membrana. Sonido continuo y zumbante.',
      level: 2,
      notation: 'Símbolo especial en partitura',
      sound: 'Continuo y zumbante',
    },
    {
      name: 'Puño',
      description: 'Golpe con la mano cerrada. Sonido grave y profundo.',
      level: 3,
      notation: 'Símbolo de puño en partitura',
      sound: 'Grave y profundo',
    },
    {
      name: 'Sonido Grave',
      description: 'Golpe con el pulgar en la zona central. Sonido grave y sordo.',
      level: 2,
      notation: 'Símbolo de grave en partitura',
      sound: 'Grave y sordo',
    },
  ],
  rhythms: [
    {
      name: 'Muiñeira',
      description: 'Ritmo tradicional gallego más importante. Patrón ternario con riscado.',
      pattern: 'Ti-Co-Ti-Co-Riscado',
      bpmRange: '110-160',
      difficulty: 'Intermedio-Experto',
      techniques: ['Ti', 'Co', 'Riscado', 'Puño', 'Sonido Grave'],
    },
    {
      name: 'Jota',
      description: 'Ritmo binario tradicional. Patrón: Ti-Co-Ti-Co-Ti.',
      pattern: 'Ti-Co-Ti-Co-Ti',
      bpmRange: '100-140',
      difficulty: 'Intermedio-Avanzado',
      techniques: ['Ti', 'Co', 'Riscado', 'Puño'],
    },
    {
      name: 'Xota',
      description: 'Variante rápida de la jota. Ritmo energético y festivo.',
      pattern: 'Ti-Co-Ti-Co-Ti-Co',
      bpmRange: '130-170',
      difficulty: 'Avanzado-Experto',
      techniques: ['Ti', 'Co', 'Riscado', 'Puño', 'Sonido Grave'],
    },
    {
      name: 'Aleluya',
      description: 'Ritmo festivo y celebratorio. Se toca con canto al unísono.',
      pattern: 'Ti-Co-Riscado-Co-Ti',
      bpmRange: '90-130',
      difficulty: 'Intermedio-Avanzado',
      techniques: ['Ti', 'Co', 'Riscado', 'Puño', 'Sonido Grave'],
    },
  ],
};
