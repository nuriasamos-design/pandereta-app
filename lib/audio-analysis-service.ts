/**
 * Servicio de análisis de audio y generación de patrones de ritmo personalizados
 */

export interface AudioAnalysisResult {
  bpm: number;
  confidence: number; // 0-100
  timeSignature: string; // "4/4", "3/4", "6/8", etc.
  keySignature: string; // "C", "G", "D", etc.
  duration: number; // en segundos
  energyLevel: number; // 0-100
  danceability: number; // 0-100
}

export interface GeneratedPattern {
  id: string;
  name: string;
  beats: PatternBeat[];
  bpm: number;
  timeSignature: string;
  difficulty: number; // 1-5
  description: string;
}

export interface PatternBeat {
  position: number; // 0-indexed
  type: 'po' | 'ro' | 'pero' | 'silence';
  intensity: number; // 0-1
  duration: number; // en milisegundos
}

/**
 * Simula análisis de audio (en producción usaría Spotify API, Web Audio API, etc.)
 */
export async function analyzeAudio(audioUri: string): Promise<AudioAnalysisResult> {
  // Simulación de análisis
  // En producción, esto usaría Web Audio API o una API externa
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        bpm: 120 + Math.random() * 40, // 120-160 BPM
        confidence: 75 + Math.random() * 25, // 75-100%
        timeSignature: '4/4',
        keySignature: 'G',
        duration: 180 + Math.random() * 120, // 3-5 minutos
        energyLevel: 60 + Math.random() * 40, // 60-100
        danceability: 70 + Math.random() * 30, // 70-100
      });
    }, 2000);
  });
}

/**
 * Genera patrones de ritmo basados en análisis de audio
 */
export function generatePatternsFromAnalysis(
  analysis: AudioAnalysisResult,
  songName: string
): GeneratedPattern[] {
  const patterns: GeneratedPattern[] = [];

  // Patrón 1: Básico (Nivel 1)
  patterns.push({
    id: `${songName}-basic`,
    name: `${songName} - Básico`,
    beats: generateBasicPattern(analysis.bpm),
    bpm: Math.round(analysis.bpm),
    timeSignature: analysis.timeSignature,
    difficulty: 1,
    description: 'Patrón básico para principiantes',
  });

  // Patrón 2: Intermedio (Nivel 2-3)
  patterns.push({
    id: `${songName}-intermediate`,
    name: `${songName} - Intermedio`,
    beats: generateIntermediatePattern(analysis.bpm),
    bpm: Math.round(analysis.bpm),
    timeSignature: analysis.timeSignature,
    difficulty: 2,
    description: 'Patrón intermedio con variaciones',
  });

  // Patrón 3: Avanzado (Nivel 4-5)
  patterns.push({
    id: `${songName}-advanced`,
    name: `${songName} - Avanzado`,
    beats: generateAdvancedPattern(analysis.bpm),
    bpm: Math.round(analysis.bpm),
    timeSignature: analysis.timeSignature,
    difficulty: 4,
    description: 'Patrón avanzado con técnicas complejas',
  });

  // Patrón 4: Personalizado (basado en energía)
  if (analysis.energyLevel > 75) {
    patterns.push({
      id: `${songName}-energetic`,
      name: `${songName} - Energético`,
      beats: generateEnergeticPattern(analysis.bpm),
      bpm: Math.round(analysis.bpm),
      timeSignature: analysis.timeSignature,
      difficulty: 3,
      description: 'Patrón rápido y energético',
    });
  }

  // Patrón 5: Personalizado (basado en danceability)
  if (analysis.danceability > 75) {
    patterns.push({
      id: `${songName}-dance`,
      name: `${songName} - Danza`,
      beats: generateDancePattern(analysis.bpm),
      bpm: Math.round(analysis.bpm),
      timeSignature: analysis.timeSignature,
      difficulty: 3,
      description: 'Patrón rítmico para danza',
    });
  }

  return patterns;
}

/**
 * Genera patrón básico (po-ro-ro-pero)
 */
function generateBasicPattern(bpm: number): PatternBeat[] {
  const beatDuration = (60000 / bpm) * 2; // Duración de una negra

  return [
    { position: 0, type: 'po', intensity: 1, duration: beatDuration },
    { position: 1, type: 'ro', intensity: 0.8, duration: beatDuration },
    { position: 2, type: 'ro', intensity: 0.8, duration: beatDuration },
    { position: 3, type: 'pero', intensity: 0.9, duration: beatDuration },
  ];
}

/**
 * Genera patrón intermedio con variaciones
 */
function generateIntermediatePattern(bpm: number): PatternBeat[] {
  const beatDuration = (60000 / bpm) * 2;

  return [
    { position: 0, type: 'po', intensity: 1, duration: beatDuration },
    { position: 1, type: 'ro', intensity: 0.8, duration: beatDuration },
    { position: 2, type: 'po', intensity: 0.9, duration: beatDuration },
    { position: 3, type: 'pero', intensity: 0.9, duration: beatDuration },
    { position: 4, type: 'ro', intensity: 0.8, duration: beatDuration },
    { position: 5, type: 'po', intensity: 1, duration: beatDuration },
    { position: 6, type: 'pero', intensity: 0.9, duration: beatDuration },
    { position: 7, type: 'ro', intensity: 0.8, duration: beatDuration },
  ];
}

/**
 * Genera patrón avanzado con técnicas complejas
 */
function generateAdvancedPattern(bpm: number): PatternBeat[] {
  const beatDuration = (60000 / bpm) * 2;
  const halfBeat = beatDuration / 2;

  return [
    { position: 0, type: 'po', intensity: 1, duration: beatDuration },
    { position: 1, type: 'ro', intensity: 0.8, duration: halfBeat },
    { position: 1.5, type: 'pero', intensity: 0.9, duration: halfBeat },
    { position: 2, type: 'po', intensity: 1, duration: beatDuration },
    { position: 3, type: 'pero', intensity: 0.9, duration: beatDuration },
    { position: 4, type: 'ro', intensity: 0.8, duration: halfBeat },
    { position: 4.5, type: 'po', intensity: 1, duration: halfBeat },
    { position: 5, type: 'pero', intensity: 0.9, duration: beatDuration },
    { position: 6, type: 'ro', intensity: 0.8, duration: beatDuration },
    { position: 7, type: 'po', intensity: 1, duration: beatDuration },
  ];
}

/**
 * Genera patrón energético (rápido y dinámico)
 */
function generateEnergeticPattern(bpm: number): PatternBeat[] {
  const beatDuration = (60000 / bpm) * 2;
  const quarterBeat = beatDuration / 4;

  return [
    { position: 0, type: 'po', intensity: 1, duration: quarterBeat },
    { position: 0.25, type: 'ro', intensity: 0.9, duration: quarterBeat },
    { position: 0.5, type: 'po', intensity: 1, duration: quarterBeat },
    { position: 0.75, type: 'pero', intensity: 0.95, duration: quarterBeat },
    { position: 1, type: 'ro', intensity: 0.8, duration: beatDuration },
    { position: 2, type: 'po', intensity: 1, duration: beatDuration },
    { position: 3, type: 'pero', intensity: 0.9, duration: beatDuration },
    { position: 4, type: 'ro', intensity: 0.8, duration: beatDuration },
  ];
}

/**
 * Genera patrón para danza
 */
function generateDancePattern(bpm: number): PatternBeat[] {
  const beatDuration = (60000 / bpm) * 2;

  return [
    { position: 0, type: 'po', intensity: 1, duration: beatDuration },
    { position: 1, type: 'pero', intensity: 0.95, duration: beatDuration },
    { position: 2, type: 'ro', intensity: 0.85, duration: beatDuration },
    { position: 3, type: 'pero', intensity: 0.95, duration: beatDuration },
    { position: 4, type: 'po', intensity: 1, duration: beatDuration },
    { position: 5, type: 'pero', intensity: 0.95, duration: beatDuration },
    { position: 6, type: 'ro', intensity: 0.85, duration: beatDuration },
    { position: 7, type: 'pero', intensity: 0.95, duration: beatDuration },
  ];
}

/**
 * Valida y ajusta un patrón generado
 */
export function validateAndAdjustPattern(pattern: GeneratedPattern): GeneratedPattern {
  // Validar que el patrón tenga al menos 4 beats
  if (pattern.beats.length < 4) {
    pattern.beats = generateBasicPattern(pattern.bpm);
  }

  // Ajustar intensidades
  pattern.beats = pattern.beats.map((beat) => ({
    ...beat,
    intensity: Math.max(0, Math.min(1, beat.intensity)),
  }));

  return pattern;
}

/**
 * Exporta un patrón a formato JSON
 */
export function exportPatternToJSON(pattern: GeneratedPattern): string {
  return JSON.stringify(pattern, null, 2);
}

/**
 * Importa un patrón desde JSON
 */
export function importPatternFromJSON(json: string): GeneratedPattern | null {
  try {
    const pattern = JSON.parse(json) as GeneratedPattern;
    return validateAndAdjustPattern(pattern);
  } catch (error) {
    console.error('Error importing pattern:', error);
    return null;
  }
}

/**
 * Calcula similitud entre dos patrones (0-100)
 */
export function calculatePatternSimilarity(
  pattern1: GeneratedPattern,
  pattern2: GeneratedPattern
): number {
  let similarity = 0;

  // Comparar BPM (máximo 20 puntos)
  const bpmDiff = Math.abs(pattern1.bpm - pattern2.bpm);
  similarity += Math.max(0, 20 - (bpmDiff / 10) * 20);

  // Comparar dificultad (máximo 20 puntos)
  const diffDiff = Math.abs(pattern1.difficulty - pattern2.difficulty);
  similarity += Math.max(0, 20 - (diffDiff / 4) * 20);

  // Comparar beats (máximo 60 puntos)
  const minBeats = Math.min(pattern1.beats.length, pattern2.beats.length);
  let matchingBeats = 0;

  for (let i = 0; i < minBeats; i++) {
    if (pattern1.beats[i].type === pattern2.beats[i].type) {
      matchingBeats++;
    }
  }

  const beatSimilarity = (matchingBeats / Math.max(pattern1.beats.length, pattern2.beats.length)) * 60;
  similarity += beatSimilarity;

  return Math.round(similarity);
}

/**
 * Genera sugerencias de mejora para un patrón
 */
export function generatePatternSuggestions(pattern: GeneratedPattern): string[] {
  const suggestions: string[] = [];

  // Sugerencia 1: Duración del patrón
  if (pattern.beats.length < 4) {
    suggestions.push('Considera agregar más beats para mayor variedad');
  }

  // Sugerencia 2: Intensidad promedio
  const avgIntensity =
    pattern.beats.reduce((sum, beat) => sum + beat.intensity, 0) / pattern.beats.length;
  if (avgIntensity < 0.5) {
    suggestions.push('El patrón es muy suave, considera aumentar la intensidad');
  }
  if (avgIntensity > 0.95) {
    suggestions.push('El patrón es muy intenso, considera agregar variaciones más suaves');
  }

  // Sugerencia 3: Variedad de técnicas
  const techniques = new Set(pattern.beats.map((b) => b.type));
  if (techniques.size < 3) {
    suggestions.push('Agrega más variedad de técnicas (po, ro, pero)');
  }

  // Sugerencia 4: Dificultad
  if (pattern.difficulty < 2 && pattern.beats.length > 8) {
    suggestions.push('Considera aumentar la dificultad para este patrón complejo');
  }

  if (suggestions.length === 0) {
    suggestions.push('¡Patrón bien balanceado! Listo para practicar.');
  }

  return suggestions;
}
