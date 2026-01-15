/**
 * Tipos principales para la aplicación Pandereta Master
 */

/**
 * Fuente de donde proviene una canción
 */
export type SongSource = 'photo' | 'pdf' | 'web' | 'manual';

/**
 * Tipo de sección en una canción
 */
export type SectionType = 'estrofa' | 'estribillo' | 'verso' | 'puente' | 'intro' | 'outro';

/**
 * Estructura de una estrofa o estribillo
 */
export interface SongSection {
  id: string;
  type: SectionType;
  title?: string;
  lyrics: string;
  notes?: string;
  order: number;
}

/**
 * Canción en la biblioteca
 */
export interface Song {
  id: string;
  title: string;
  source: SongSource;
  imageUri?: string;
  webUrl?: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
  tags?: string[];
  sections?: SongSection[];
  fullText?: string;
  ocrProcessed?: boolean;
  ocrRawText?: string;
}

/**
 * Clase de un día específico
 */
export interface ClassSession {
  id: string;
  date: number;
  songIds: string[];
  notes?: string;
  createdAt: number;
}

/**
 * Transcripción de una grabación
 */
export interface RecordingTranscription {
  id: string;
  recordingId: string;
  text: string;
  sections?: SongSection[];
  confidence?: number;
  createdAt: number;
  updatedAt: number;
  notes?: string;
}

/**
 * Grabación de audio
 */
export interface Recording {
  id: string;
  uri: string;
  duration: number;
  createdAt: number;
  classSessionId?: string;
  songId?: string;
  notes?: string;
  type: 'class' | 'practice' | 'free';
  transcriptionId?: string;
  transcription?: RecordingTranscription;
}

/**
 * Ritmo/Toque de práctica
 */
export interface Rhythm {
  id: string;
  name: string;
  description: string;
  level: 1 | 2 | 3 | 4 | 5;
  bpm: number;
  pattern: string;
  audioUri?: string;
  type: 'basic' | 'intermediate' | 'song';
}

/**
 * Sesión de práctica
 */
export interface PracticeSession {
  id: string;
  rhythmId: string;
  bpm: number;
  level: 1 | 2 | 3 | 4 | 5;
  recordingId?: string;
  startedAt: number;
  completedAt?: number;
  notes?: string;
}

/**
 * Configuración de la aplicación
 */
export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  microphoneVolume: number;
  recordingQuality: 'low' | 'medium' | 'high';
  hapticFeedback: boolean;
  soundEnabled: boolean;
}

/**
 * Estadísticas de práctica
 */
export interface PracticeStats {
  rhythmId: string;
  totalSessions: number;
  totalDuration: number;
  averageBpm: number;
  lastPracticed: number;
  level: 1 | 2 | 3 | 4 | 5;
}
