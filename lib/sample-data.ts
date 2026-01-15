import { Song, Recording, RecordingTranscription, SongSection, ClassSession } from './types';

/**
 * Datos de ejemplo para pruebas y demostración
 */

export const SAMPLE_SONGS: Song[] = [
  {
    id: 'song-1',
    title: 'Alegrías',
    source: 'manual',
    notes: 'Canción tradicional de ejemplo',
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now(),
    fullText: `[ESTROFA 1]
Cuando te vi por primera vez
Sentí que el mundo se detenía
Tus ojos brillaban con luz
Que iluminaba todo mi camino

[ESTRIBILLO]
¡Alegrías, alegrías!
Del corazón que siente
La música que toca
En cada momento presente

[ESTROFA 2]
La pandereta suena
Con ritmo y con pasión
Cada golpe es una historia
Que nace del corazón

[PUENTE]
Sigue, sigue el ritmo
Que no pare de sonar
La pandereta canta
Lo que no puedo expresar`,
    sections: [
      {
        id: 'sec-1',
        type: 'verso',
        lyrics: 'Cuando te vi por primera vez\nSentí que el mundo se detenía',
        notes: 'Entonación suave y melancólica',
        order: 1,
      },
      {
        id: 'sec-2',
        type: 'estribillo',
        lyrics: '¡Alegrías, alegrías!\nDel corazón que siente',
        notes: 'Aumentar volumen y energía',
        order: 2,
      },
    ],
  },
  {
    id: 'song-2',
    title: 'Tangos',
    source: 'manual',
    notes: 'Ritmo profundo y apasionado',
    createdAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now(),
    fullText: `[ESTROFA 1]
En la noche madrileña
Suena la pandereta
Con un ritmo que hipnotiza
Y el alma se despierta

[ESTRIBILLO]
Tangos, tangos de pasión
Que llenan el corazón
Con cada nota que suena
La vida se hace más buena

[ESTROFA 2]
El compás es la medida
Del sentimiento profundo
Cada golpe es una palabra
Que resuena en todo el mundo

[PUENTE]
Siente el ritmo en tu pecho
Deja que te lleve
La pandereta es magia
Que nunca se muere`,
    sections: [
      {
        id: 'sec-3',
        type: 'verso',
        lyrics: 'En la noche madrileña\nSuena la pandereta',
        notes: 'Ritmo lento y profundo',
        order: 1,
      },
      {
        id: 'sec-4',
        type: 'estribillo',
        lyrics: 'Tangos, tangos de pasión',
        notes: 'Aumentar intensidad',
        order: 2,
      },
    ],
  },
  {
    id: 'song-3',
    title: 'Bulerías',
    source: 'manual',
    notes: 'Ritmo rápido y energético',
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now(),
    fullText: `[ESTROFA 1]
Rápido, rápido, sin parar
La pandereta debe sonar
Con velocidad y precisión
Que sienta todo el corazón

[ESTRIBILLO]
¡Bulerías! ¡Qué emoción!
Ritmo rápido y sin fin
La pandereta es la canción
Que nos hace sentir así

[ESTROFA 2]
Cada golpe es un latido
Del corazón que palpita
La velocidad es la vida
Que en la pandereta habita`,
    sections: [
      {
        id: 'sec-5',
        type: 'verso',
        lyrics: 'Rápido, rápido, sin parar',
        notes: 'Muy rápido, energético',
        order: 1,
      },
      {
        id: 'sec-6',
        type: 'estribillo',
        lyrics: '¡Bulerías! ¡Qué emoción!',
        notes: 'Mantener velocidad alta',
        order: 2,
      },
    ],
  },
];

export const SAMPLE_TRANSCRIPTION: RecordingTranscription = {
  id: 'trans-1',
  recordingId: 'rec-1',
  text: 'Transcripción de ejemplo de la clase de pandereta',
  sections: [
    {
      id: 'trans-sec-1',
      type: 'verso',
      lyrics: 'Hoy aprendimos los ritmos básicos de la pandereta',
      notes: 'Entonación clara y pausada',
      order: 1,
    },
    {
      id: 'trans-sec-2',
      type: 'estribillo',
      lyrics: 'El compás es muy importante para mantener el ritmo',
      notes: 'Énfasis en la importancia',
      order: 2,
    },
    {
      id: 'trans-sec-3',
      type: 'verso',
      lyrics: 'Practicamos con diferentes velocidades',
      notes: 'Ritmo progresivo',
      order: 3,
    },
  ],
  confidence: 0.92,
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

export const SAMPLE_RECORDINGS: Recording[] = [
  {
    id: 'rec-1',
    type: 'class',
    songId: 'song-1',
    duration: 180000, // 3 minutos
    uri: 'file://example/recording1.m4a',
    transcription: SAMPLE_TRANSCRIPTION,
    notes: 'Primera clase de pandereta - Alegrías',
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'rec-2',
    type: 'practice',
    songId: 'song-2',
    duration: 120000, // 2 minutos
    uri: 'file://example/recording2.m4a',
    notes: 'Práctica de Tangos - Nivel 2',
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'rec-3',
    type: 'free',
    duration: 90000, // 1.5 minutos
    uri: 'file://example/recording3.m4a',
    notes: 'Grabación libre - Experimentando con ritmos',
    createdAt: Date.now(),
  },
];

export const SAMPLE_CLASS_SESSIONS: ClassSession[] = [
  {
    id: 'session-1',
    date: Date.now() - 2 * 24 * 60 * 60 * 1000,
    songIds: ['song-1'],
    notes: 'Primera clase - Introducción a Alegrías',
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'session-2',
    date: Date.now() - 1 * 24 * 60 * 60 * 1000,
    songIds: ['song-2'],
    notes: 'Práctica de Tangos',
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
];

/**
 * Inicializa el almacenamiento con datos de ejemplo
 */
export function initializeSampleData() {
  return {
    songs: SAMPLE_SONGS,
    recordings: SAMPLE_RECORDINGS,
    classSessions: SAMPLE_CLASS_SESSIONS,
  };
}
