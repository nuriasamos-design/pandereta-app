/**
 * Tipos principales para la aplicación Pandereta Master
 */

/**
 * Fuente de donde proviene una canción
 */
export type SongSource = 'photo' | 'pdf' | 'web' | 'manual';

/**
 * Canción en la biblioteca
 */
export interface Song {
  id: string;
  title: string;
  source: SongSource;
  imageUri?: string; // URI local de foto/PDF
  webUrl?: string; // URL si fue importada de web
  notes?: string; // Notas personales del usuario
  createdAt: number; // Timestamp
  updatedAt: number; // Timestamp
  tags?: string[]; // Etiquetas personalizadas
}

/**
 * Clase de un día específico
 */
export interface ClassSession {
  id: string;
  date: number; // Timestamp del día
  songIds: string[]; // IDs de canciones tocadas en esa clase
  notes?: string;
  createdAt: number;
}

/**
 * Grabación de audio
 */
export interface Recording {
  id: string;
  uri: string; // URI local del archivo de audio
  duration: number; // Duración en ms
  createdAt: number; // Timestamp
  classSessionId?: string; // ID de la clase asociada (opcional)
  songId?: string; // ID de la canción asociada (opcional)
  notes?: string;
  type: 'class' | 'practice' | 'free'; // Tipo de grabación
}

/**
 * Ritmo/Toque de práctica
 */
export interface Rhythm {
  id: string;
  name: string;
  description: string;
  level: 1 | 2 | 3 | 4 | 5; // Nivel de dificultad
  bpm: number; // Tempo base
  pattern: string; // Descripción del patrón (ej: "1-2-3-4")
  audioUri?: string; // URI del audio de guía
  type: 'basic' | 'intermediate' | 'song'; // Tipo de ritmo
}

/**
 * Sesión de práctica
 */
export interface PracticeSession {
  id: string;
  rhythmId: string;
  bpm: number; // BPM actual
  level: 1 | 2 | 3 | 4 | 5;
  recordingId?: string; // Grabación de la práctica
  startedAt: number;
  completedAt?: number;
  notes?: string;
}

/**
 * Configuración de la aplicación
 */
export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  microphoneVolume: number; // 0-1
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
  totalDuration: number; // en ms
  averageBpm: number;
  lastPracticed: number; // timestamp
  level: 1 | 2 | 3 | 4 | 5;
}
