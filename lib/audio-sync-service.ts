import { RecordingTranscription, SongSection } from './types';

/**
 * Servicio de sincronización entre audio y transcripción
 * Mapea posiciones de tiempo con secciones de texto
 */

export interface TimestampedSection extends SongSection {
  startTime: number; // en ms
  endTime: number; // en ms
}

export interface AudioSyncData {
  recordingId: string;
  totalDuration: number;
  sections: TimestampedSection[];
}

/**
 * Calcula timestamps para secciones basado en duración total
 * Distribuye el tiempo de forma proporcional entre secciones
 */
export function calculateSectionTimestamps(
  transcription: RecordingTranscription,
  totalDuration: number
): TimestampedSection[] {
  if (!transcription.sections || transcription.sections.length === 0) {
    return [];
  }

  const sections = transcription.sections.sort((a, b) => a.order - b.order);
  const timestampedSections: TimestampedSection[] = [];
  
  // Calcular duración promedio por sección
  const avgDurationPerSection = totalDuration / sections.length;
  
  sections.forEach((section, index) => {
    const startTime = index * avgDurationPerSection;
    const endTime = (index + 1) * avgDurationPerSection;
    
    timestampedSections.push({
      ...section,
      startTime: Math.round(startTime),
      endTime: Math.round(Math.min(endTime, totalDuration)),
    });
  });

  return timestampedSections;
}

/**
 * Encuentra la sección actual basada en el tiempo de reproducción
 */
export function getCurrentSection(
  currentTime: number,
  sections: TimestampedSection[]
): TimestampedSection | null {
  return sections.find(
    (section) => currentTime >= section.startTime && currentTime < section.endTime
  ) || null;
}

/**
 * Calcula el porcentaje de progreso dentro de una sección
 */
export function getSectionProgress(
  currentTime: number,
  section: TimestampedSection
): number {
  if (section.endTime === section.startTime) return 0;
  const progress = (currentTime - section.startTime) / (section.endTime - section.startTime);
  return Math.max(0, Math.min(1, progress));
}

/**
 * Obtiene el rango de caracteres de una sección que debe ser resaltado
 */
export function getHighlightedTextRange(
  section: TimestampedSection,
  currentTime: number
): { start: number; end: number } {
  const progress = getSectionProgress(currentTime, section);
  const textLength = section.lyrics.length;
  const highlightedChars = Math.round(textLength * progress);
  
  return {
    start: 0,
    end: highlightedChars,
  };
}

/**
 * Formatea la transcripción con información de timing
 */
export function formatTranscriptionWithTimings(
  transcription: RecordingTranscription,
  totalDuration: number
): TimestampedSection[] {
  return calculateSectionTimestamps(transcription, totalDuration);
}

/**
 * Calcula el tiempo en formato MM:SS
 */
export function formatTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Convierte formato MM:SS a milisegundos
 */
export function timeStringToMilliseconds(timeString: string): number {
  const [minutes, seconds] = timeString.split(':').map(Number);
  return (minutes * 60 + seconds) * 1000;
}

/**
 * Genera datos de visualización de onda de audio (simulado)
 */
export function generateWaveformData(
  totalDuration: number,
  bars: number = 50
): number[] {
  // Simula datos de onda de audio
  const waveformData: number[] = [];
  for (let i = 0; i < bars; i++) {
    // Genera valores aleatorios entre 0 y 1 para simular amplitud
    waveformData.push(Math.random() * 0.8 + 0.2);
  }
  return waveformData;
}

/**
 * Calcula el índice de barra de onda para una posición de tiempo
 */
export function getWaveformBarIndex(
  currentTime: number,
  totalDuration: number,
  totalBars: number = 50
): number {
  return Math.floor((currentTime / totalDuration) * totalBars);
}

/**
 * Obtiene todas las secciones que deben ser resaltadas hasta el tiempo actual
 */
export function getCompletedSections(
  currentTime: number,
  sections: TimestampedSection[]
): TimestampedSection[] {
  return sections.filter((section) => currentTime >= section.endTime);
}

/**
 * Obtiene la siguiente sección a reproducir
 */
export function getNextSection(
  currentTime: number,
  sections: TimestampedSection[]
): TimestampedSection | null {
  return sections.find((section) => currentTime < section.startTime) || null;
}

/**
 * Calcula el tiempo restante de reproducción
 */
export function getRemainingTime(
  currentTime: number,
  totalDuration: number
): number {
  return Math.max(0, totalDuration - currentTime);
}

/**
 * Busca la posición de tiempo de una sección específica
 */
export function seekToSection(
  section: TimestampedSection
): number {
  return section.startTime;
}

/**
 * Valida que los timestamps sean válidos
 */
export function validateTimestamps(sections: TimestampedSection[]): boolean {
  for (let i = 0; i < sections.length - 1; i++) {
    if (sections[i].endTime > sections[i + 1].startTime) {
      return false;
    }
  }
  return true;
}
