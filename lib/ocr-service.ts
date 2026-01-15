import { Song, SongSection, SectionType } from './types';

/**
 * Servicio de OCR para procesar imágenes de partituras
 * Nota: En producción, esto usaría una API real como Google Vision o Tesseract
 */

interface OCRResult {
  rawText: string;
  sections: SongSection[];
  confidence: number;
}

/**
 * Procesa texto OCR bruto y lo estructura en secciones
 */
export function parseOCRText(rawText: string): OCRResult {
  const lines = rawText.split('\n').filter(line => line.trim());
  const sections: SongSection[] = [];
  let currentSection: Partial<SongSection> | null = null;
  let sectionOrder = 0;

  const sectionKeywords: Record<string, SectionType> = {
    'estrofa': 'estrofa',
    'verso': 'verso',
    'estribillo': 'estribillo',
    'coro': 'estribillo',
    'puente': 'puente',
    'intro': 'intro',
    'outro': 'outro',
    'pre-coro': 'estribillo',
  };

  for (const line of lines) {
    const trimmed = line.trim();
    
    // Detectar encabezados de sección
    let sectionType: SectionType | null = null;
    for (const [keyword, type] of Object.entries(sectionKeywords)) {
      if (trimmed.toLowerCase().includes(keyword)) {
        sectionType = type;
        break;
      }
    }

    if (sectionType) {
      // Guardar sección anterior si existe
      if (currentSection && currentSection.lyrics) {
        sections.push({
          id: `section_${sectionOrder}`,
          type: currentSection.type || 'verso',
          title: currentSection.title,
          lyrics: currentSection.lyrics.trim(),
          notes: currentSection.notes,
          order: sectionOrder,
        });
        sectionOrder++;
      }

      // Iniciar nueva sección
      currentSection = {
        type: sectionType,
        title: trimmed,
        lyrics: '',
        order: sectionOrder,
      };
    } else if (currentSection) {
      // Agregar línea a la sección actual
      currentSection.lyrics = (currentSection.lyrics || '') + (currentSection.lyrics ? '\n' : '') + trimmed;
    } else if (trimmed) {
      // Si no hay sección definida, crear una por defecto
      currentSection = {
        type: 'verso',
        lyrics: trimmed,
        order: sectionOrder,
      };
    }
  }

  // Guardar última sección
  if (currentSection && currentSection.lyrics) {
    sections.push({
      id: `section_${sectionOrder}`,
      type: currentSection.type || 'verso',
      title: currentSection.title,
      lyrics: currentSection.lyrics.trim(),
      notes: currentSection.notes,
      order: sectionOrder,
    });
  }

  return {
    rawText,
    sections,
    confidence: 0.85, // Confianza estimada
  };
}

/**
 * Simula OCR de una imagen (en producción usaría Google Vision API o similar)
 */
export async function performOCR(imageUri: string): Promise<string> {
  // En producción, esto haría una llamada a una API de OCR real
  // Por ahora retornamos un placeholder
  console.log('Procesando imagen para OCR:', imageUri);
  
  // Simulación de OCR
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Estrofa 1
Línea 1 de la canción
Línea 2 de la canción

Estribillo
Coro de la canción
Coro repetido

Estrofa 2
Línea 3 de la canción
Línea 4 de la canción`);
    }, 2000);
  });
}

/**
 * Procesa una canción con OCR y estructura el texto
 */
export async function processSongImage(imageUri: string): Promise<Partial<Song>> {
  try {
    // Realizar OCR
    const ocrText = await performOCR(imageUri);
    
    // Parsear el texto OCR
    const { sections, confidence } = parseOCRText(ocrText);
    
    // Generar texto completo formateado
    const fullText = sections
      .map(section => `[${section.type.toUpperCase()}]${section.title ? ` - ${section.title}` : ''}\n${section.lyrics}`)
      .join('\n\n');

    return {
      sections,
      fullText,
      ocrProcessed: true,
      ocrRawText: ocrText,
    };
  } catch (error) {
    console.error('Error en OCR:', error);
    throw new Error('No se pudo procesar la imagen');
  }
}

/**
 * Formatea secciones para mostrar en la UI
 */
export function formatSectionsForDisplay(sections: SongSection[]): string {
  return sections
    .sort((a, b) => a.order - b.order)
    .map(section => {
      const header = `[${section.type.toUpperCase()}]${section.title ? ` - ${section.title}` : ''}`;
      const notes = section.notes ? `\n(Nota: ${section.notes})` : '';
      return `${header}\n${section.lyrics}${notes}`;
    })
    .join('\n\n');
}

/**
 * Convierte secciones a formato editable
 */
export function sectionsToEditableText(sections: SongSection[]): string {
  return sections
    .sort((a, b) => a.order - b.order)
    .map((section, index) => {
      return `${index + 1}. [${section.type}] ${section.title || 'Sin título'}\n${section.lyrics}${section.notes ? `\nNota: ${section.notes}` : ''}`;
    })
    .join('\n\n---\n\n');
}

/**
 * Parsea texto editable de vuelta a secciones
 */
export function editableTextToSections(text: string): SongSection[] {
  const sections: SongSection[] = [];
  const parts = text.split('---').map(p => p.trim()).filter(p => p);

  parts.forEach((part, index) => {
    const lines = part.split('\n');
    const headerLine = lines[0];
    
    // Extraer tipo y título del encabezado
    const headerMatch = headerLine.match(/\d+\.\s*\[(.*?)\]\s*(.*)/);
    if (headerMatch) {
      const type = (headerMatch[1].toLowerCase() as SectionType) || 'verso';
      const title = headerMatch[2] || undefined;
      
      // Extraer contenido y notas
      const contentLines = lines.slice(1);
      let lyrics = '';
      let notes = '';
      
      for (const line of contentLines) {
        if (line.startsWith('Nota:')) {
          notes = line.replace('Nota:', '').trim();
        } else if (line.trim()) {
          lyrics += (lyrics ? '\n' : '') + line;
        }
      }

      if (lyrics) {
        sections.push({
          id: `section_${index}`,
          type,
          title,
          lyrics: lyrics.trim(),
          notes: notes || undefined,
          order: index,
        });
      }
    }
  });

  return sections;
}
