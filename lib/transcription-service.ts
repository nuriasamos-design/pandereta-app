import { RecordingTranscription, SongSection } from './types';

/**
 * Servicio de transcripción de audio a texto
 * Nota: En producción, usaría Google Cloud Speech-to-Text o similar
 */

interface TranscriptionResult {
  text: string;
  sections: SongSection[];
  confidence: number;
}

/**
 * Simula transcripción de audio (en producción usaría API real)
 */
export async function transcribeAudio(audioUri: string): Promise<string> {
  console.log('Transcribiendo audio:', audioUri);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Primera estrofa de la canción
Línea dos de la canción

Estribillo
Coro coro coro
Coro repetido

Segunda estrofa
Línea tres de la canción
Línea cuatro de la canción`);
    }, 3000);
  });
}

/**
 * Parsea texto transcrito en secciones
 */
export function parseTranscribedText(text: string): SongSection[] {
  const lines = text.split('\n').filter(line => line.trim());
  const sections: SongSection[] = [];
  let currentSection: Partial<SongSection> | null = null;
  let sectionOrder = 0;

  const sectionKeywords: Record<string, string> = {
    'estrofa': 'estrofa',
    'verso': 'verso',
    'estribillo': 'estribillo',
    'coro': 'estribillo',
    'puente': 'puente',
    'intro': 'intro',
    'outro': 'outro',
  };

  for (const line of lines) {
    const trimmed = line.trim();
    let sectionType: string | null = null;

    for (const [keyword, type] of Object.entries(sectionKeywords)) {
      if (trimmed.toLowerCase().includes(keyword)) {
        sectionType = type;
        break;
      }
    }

    if (sectionType) {
      if (currentSection && currentSection.lyrics) {
        sections.push({
          id: `transcription_section_${sectionOrder}`,
          type: (currentSection.type as any) || 'verso',
          title: currentSection.title,
          lyrics: currentSection.lyrics.trim(),
          notes: currentSection.notes,
          order: sectionOrder,
        });
        sectionOrder++;
      }

      currentSection = {
        type: sectionType as any,
        title: trimmed,
        lyrics: '',
        order: sectionOrder,
      };
    } else if (currentSection) {
      currentSection.lyrics = (currentSection.lyrics || '') + (currentSection.lyrics ? '\n' : '') + trimmed;
    } else if (trimmed) {
      currentSection = {
        type: 'verso' as any,
        lyrics: trimmed,
        order: sectionOrder,
      };
    }
  }

  if (currentSection && currentSection.lyrics) {
    sections.push({
      id: `transcription_section_${sectionOrder}`,
      type: (currentSection.type as any) || 'verso',
      title: currentSection.title,
      lyrics: currentSection.lyrics.trim(),
      notes: currentSection.notes,
      order: sectionOrder,
    });
  }

  return sections;
}

/**
 * Procesa una grabación de audio y genera transcripción
 */
export async function processRecordingTranscription(
  recordingId: string,
  audioUri: string
): Promise<RecordingTranscription> {
  try {
    // Transcribir audio
    const transcribedText = await transcribeAudio(audioUri);
    
    // Parsear en secciones
    const sections = parseTranscribedText(transcribedText);

    return {
      id: `transcription_${Date.now()}`,
      recordingId,
      text: transcribedText,
      sections,
      confidence: 0.82,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  } catch (error) {
    console.error('Error en transcripción:', error);
    throw new Error('No se pudo transcribir el audio');
  }
}

/**
 * Formatea transcripción para mostrar
 */
export function formatTranscriptionForDisplay(transcription: RecordingTranscription): string {
  if (transcription.sections && transcription.sections.length > 0) {
    return transcription.sections
      .sort((a, b) => a.order - b.order)
      .map(section => {
        const header = `[${section.type.toUpperCase()}]${section.title ? ` - ${section.title}` : ''}`;
        const notes = section.notes ? `\n(Nota: ${section.notes})` : '';
        return `${header}\n${section.lyrics}${notes}`;
      })
      .join('\n\n');
  }
  return transcription.text;
}

/**
 * Actualiza notas de entonación en una transcripción
 */
export function updateTranscriptionNotes(
  transcription: RecordingTranscription,
  sectionId: string,
  notes: string
): RecordingTranscription {
  return {
    ...transcription,
    sections: transcription.sections?.map(section =>
      section.id === sectionId
        ? { ...section, notes }
        : section
    ),
    updatedAt: Date.now(),
  };
}

/**
 * Actualiza texto de una sección en la transcripción
 */
export function updateTranscriptionSectionText(
  transcription: RecordingTranscription,
  sectionId: string,
  newText: string
): RecordingTranscription {
  return {
    ...transcription,
    sections: transcription.sections?.map(section =>
      section.id === sectionId
        ? { ...section, lyrics: newText }
        : section
    ),
    updatedAt: Date.now(),
  };
}

/**
 * Exporta transcripción como texto formateado
 */
export function exportTranscriptionAsText(transcription: RecordingTranscription): string {
  const timestamp = new Date(transcription.createdAt).toLocaleString('es-ES');
  const header = `Transcripción de grabación\nFecha: ${timestamp}\nConfianza: ${Math.round((transcription.confidence || 0) * 100)}%\n\n`;
  
  const content = formatTranscriptionForDisplay(transcription);
  
  return header + content;
}
