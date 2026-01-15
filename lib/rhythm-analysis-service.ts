/**
 * Servicio de análisis de ritmo para comparar grabaciones con patrones esperados
 * Detecta golpes, timing y precisión
 */

export interface RhythmBeat {
  timestamp: number; // Tiempo en milisegundos
  intensity: number; // 0-1, intensidad del golpe
  frequency: number; // Frecuencia dominante (Hz)
}

export interface RhythmPattern {
  beats: number[]; // Tiempos esperados de los golpes en ms
  name: string;
  bpm: number;
}

export interface AnalysisResult {
  recordedBeats: RhythmBeat[];
  expectedPattern: RhythmPattern;
  accuracy: number; // 0-100, porcentaje de precisión general
  timingAccuracy: number; // 0-100, precisión de timing
  beatDetection: {
    detected: number; // Golpes detectados
    expected: number; // Golpes esperados
    matched: number; // Golpes que coincidieron
  };
  deviations: {
    beat: number; // Número de golpe
    expectedTime: number; // Tiempo esperado
    actualTime: number; // Tiempo real
    deviation: number; // Desviación en ms
  }[];
  feedback: string[];
  score: number; // 0-100, puntuación final
}

/**
 * Analiza una grabación de audio y detecta golpes
 * Simula análisis de frecuencia para detectar picos de sonido
 */
export function analyzeAudioForBeats(
  audioData: Float32Array,
  sampleRate: number
): RhythmBeat[] {
  const beats: RhythmBeat[] = [];
  
  // Simular detección de golpes basada en amplitud
  // En una implementación real, usaría FFT o análisis de espectro
  const threshold = 0.3; // Umbral de detección
  const minBeatDistance = Math.floor(sampleRate * 0.1); // Mínimo 100ms entre golpes
  
  let lastBeatTime = -minBeatDistance;
  
  for (let i = 0; i < audioData.length; i++) {
    const amplitude = Math.abs(audioData[i]);
    
    if (amplitude > threshold && i - lastBeatTime > minBeatDistance) {
      const timestamp = (i / sampleRate) * 1000; // Convertir a ms
      const intensity = Math.min(amplitude, 1);
      
      // Estimar frecuencia dominante (simplificado)
      const frequency = 100 + intensity * 400; // 100-500 Hz
      
      beats.push({
        timestamp,
        intensity,
        frequency,
      });
      
      lastBeatTime = i;
    }
  }
  
  return beats;
}

/**
 * Compara golpes grabados con un patrón esperado
 */
export function compareWithPattern(
  recordedBeats: RhythmBeat[],
  pattern: RhythmPattern
): AnalysisResult {
  const deviations: AnalysisResult['deviations'] = [];
  let matchedBeats = 0;
  const toleranceMs = 100; // Tolerancia de ±100ms
  
  // Comparar cada golpe esperado con los grabados
  const usedRecordedIndices = new Set<number>();
  
  for (let i = 0; i < pattern.beats.length; i++) {
    const expectedTime = pattern.beats[i];
    let bestMatch = -1;
    let bestDeviation = toleranceMs + 1;
    
    // Encontrar el golpe grabado más cercano
    for (let j = 0; j < recordedBeats.length; j++) {
      if (usedRecordedIndices.has(j)) continue;
      
      const deviation = Math.abs(recordedBeats[j].timestamp - expectedTime);
      if (deviation < bestDeviation) {
        bestDeviation = deviation;
        bestMatch = j;
      }
    }
    
    if (bestMatch >= 0 && bestDeviation <= toleranceMs) {
      usedRecordedIndices.add(bestMatch);
      matchedBeats++;
      deviations.push({
        beat: i + 1,
        expectedTime,
        actualTime: recordedBeats[bestMatch].timestamp,
        deviation: bestDeviation,
      });
    } else {
      deviations.push({
        beat: i + 1,
        expectedTime,
        actualTime: -1,
        deviation: bestDeviation,
      });
    }
  }
  
  // Calcular precisión
  const beatDetection = {
    detected: recordedBeats.length,
    expected: pattern.beats.length,
    matched: matchedBeats,
  };
  
  const timingAccuracy = Math.max(
    0,
    100 - (deviations.reduce((sum, d) => sum + Math.abs(d.deviation), 0) / 
           (pattern.beats.length * toleranceMs)) * 100
  );
  
  const beatAccuracy = (matchedBeats / pattern.beats.length) * 100;
  const accuracy = (timingAccuracy + beatAccuracy) / 2;
  
  // Generar feedback
  const feedback = generateFeedback(
    accuracy,
    beatDetection,
    deviations,
    pattern
  );
  
  return {
    recordedBeats,
    expectedPattern: pattern,
    accuracy: Math.round(accuracy),
    timingAccuracy: Math.round(timingAccuracy),
    beatDetection,
    deviations,
    feedback,
    score: Math.round(accuracy),
  };
}

/**
 * Genera feedback basado en el análisis
 */
function generateFeedback(
  accuracy: number,
  beatDetection: AnalysisResult['beatDetection'],
  deviations: AnalysisResult['deviations'],
  pattern: RhythmPattern
): string[] {
  const feedback: string[] = [];
  
  // Feedback sobre precisión general
  if (accuracy >= 90) {
    feedback.push('¡Excelente! Tu ritmo es muy preciso.');
  } else if (accuracy >= 75) {
    feedback.push('¡Muy bien! Tu ritmo es bastante preciso.');
  } else if (accuracy >= 60) {
    feedback.push('Bien, pero hay espacio para mejorar.');
  } else if (accuracy >= 40) {
    feedback.push('Necesitas practicar más para mejorar la precisión.');
  } else {
    feedback.push('Sigue practicando. La precisión mejorará con el tiempo.');
  }
  
  // Feedback sobre golpes detectados
  if (beatDetection.detected < beatDetection.expected) {
    feedback.push(
      `Detectamos ${beatDetection.detected} golpes de ${beatDetection.expected} esperados. ` +
      `Intenta ser más consistente.`
    );
  } else if (beatDetection.detected > beatDetection.expected) {
    feedback.push(
      `Detectamos ${beatDetection.detected} golpes (${beatDetection.expected} esperados). ` +
      `Intenta no agregar golpes extra.`
    );
  }
  
  // Feedback sobre timing
  const avgDeviation = deviations.reduce((sum, d) => sum + Math.abs(d.deviation), 0) / 
                       deviations.length;
  
  if (avgDeviation > 50) {
    feedback.push('Tu timing está un poco atrasado. Intenta seguir el metrónomo más de cerca.');
  } else if (avgDeviation > 25) {
    feedback.push('Pequeñas variaciones en el timing. Practica con metrónomo para mejorar.');
  }
  
  // Feedback sobre velocidad
  if (pattern.bpm > 0) {
    feedback.push(`Patrón: ${pattern.name} a ${pattern.bpm} BPM`);
  }
  
  // Feedback específico sobre golpes problemáticos
  const problematicBeats = deviations.filter(d => d.deviation > 75);
  if (problematicBeats.length > 0) {
    feedback.push(
      `Golpes con mayor desviación: ${problematicBeats.map(b => `#${b.beat}`).join(', ')}. ` +
      `Enfócate en estos golpes.`
    );
  }
  
  return feedback;
}

/**
 * Genera un patrón esperado basado en BPM y número de golpes
 */
export function generateExpectedPattern(
  bpm: number,
  numberOfBeats: number,
  patternName: string = 'Patrón'
): RhythmPattern {
  const beatDuration = (60 / bpm) * 1000; // Duración de cada golpe en ms
  const beats: number[] = [];
  
  for (let i = 0; i < numberOfBeats; i++) {
    beats.push(i * beatDuration);
  }
  
  return {
    beats,
    name: patternName,
    bpm,
  };
}

/**
 * Crea un patrón personalizado para muiñeira
 * Patrón: poporo pero (po-ro-ro pero) repetido
 */
export function generateMuineirPattern(bpm: number): RhythmPattern {
  const beatDuration = (60 / bpm) * 1000;
  
  // Patrón: po(0), ro(1), ro(2), pero(3) - repetido 2 veces
  // Cada nota tiene una duración relativa
  const pattern = [0, 1, 2, 3, 4, 5, 6, 7]; // 8 golpes en un ciclo de muiñeira
  const beats = pattern.map(i => i * (beatDuration / 2));
  
  return {
    beats,
    name: 'Muiñeira',
    bpm,
  };
}

/**
 * Crea un patrón personalizado para jota
 * Patrón: po-ro-po-ro-po (5 golpes)
 */
export function generateJotaPattern(bpm: number): RhythmPattern {
  const beatDuration = (60 / bpm) * 1000;
  
  // Patrón: po(0), ro(1), po(2), ro(3), po(4)
  const pattern = [0, 1, 2, 3, 4];
  const beats = pattern.map(i => i * beatDuration);
  
  return {
    beats,
    name: 'Jota',
    bpm,
  };
}

/**
 * Calcula la puntuación final basada en múltiples factores
 */
export function calculateFinalScore(result: AnalysisResult): number {
  const weights = {
    accuracy: 0.5,
    beatDetection: 0.3,
    consistency: 0.2,
  };
  
  // Puntuación de detección de golpes
  const beatScore = (result.beatDetection.matched / result.beatDetection.expected) * 100;
  
  // Puntuación de consistencia (basada en desviación estándar)
  const deviations = result.deviations.map(d => d.deviation);
  const avgDeviation = deviations.reduce((a, b) => a + b, 0) / deviations.length;
  const variance = deviations.reduce((sum, d) => sum + Math.pow(d - avgDeviation, 2), 0) / 
                   deviations.length;
  const stdDev = Math.sqrt(variance);
  const consistencyScore = Math.max(0, 100 - stdDev);
  
  const finalScore = 
    (result.accuracy * weights.accuracy) +
    (beatScore * weights.beatDetection) +
    (consistencyScore * weights.consistency);
  
  return Math.round(Math.min(100, finalScore));
}
