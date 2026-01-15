import { RecordingTranscription, Recording } from './types';
import { TimestampedSection, formatTime } from './audio-sync-service';

/**
 * Servicio para exportar transcripciones a PDF
 */

export interface PDFExportOptions {
  includeMetadata?: boolean;
  includeTimestamps?: boolean;
  includeNotes?: boolean;
  pageSize?: 'A4' | 'Letter';
  orientation?: 'portrait' | 'landscape';
}

/**
 * Genera contenido HTML para la transcripción
 */
export function generateTranscriptionHTML(
  recording: Recording,
  transcription: RecordingTranscription,
  sections: TimestampedSection[],
  options: PDFExportOptions = {}
): string {
  const {
    includeMetadata = true,
    includeTimestamps = true,
    includeNotes = true,
    orientation = 'portrait',
  } = options;

  const recordingDate = new Date(recording.createdAt).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const recordingTime = new Date(recording.createdAt).toLocaleTimeString('es-ES');

  let html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Transcripción - Pandereta Master</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
          line-height: 1.6;
          background: white;
          padding: 40px;
          ${orientation === 'landscape' ? 'width: 11in; height: 8.5in;' : 'width: 8.5in; height: 11in;'}
        }
        
        .header {
          border-bottom: 3px solid #E91E63;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        
        .title {
          font-size: 28px;
          font-weight: bold;
          color: #E91E63;
          margin-bottom: 10px;
        }
        
        .metadata {
          font-size: 12px;
          color: #666;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 10px;
        }
        
        .metadata-item {
          display: flex;
          justify-content: space-between;
        }
        
        .metadata-label {
          font-weight: bold;
          margin-right: 10px;
        }
        
        .section {
          margin-bottom: 25px;
          page-break-inside: avoid;
        }
        
        .section-header {
          background-color: #E91E63;
          color: white;
          padding: 10px 15px;
          border-radius: 4px;
          margin-bottom: 10px;
          font-weight: bold;
          font-size: 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .section-type {
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: 1px;
        }
        
        .section-time {
          font-size: 11px;
          opacity: 0.9;
        }
        
        .section-content {
          background-color: #f9f9f9;
          padding: 15px;
          border-left: 4px solid #E91E63;
          border-radius: 2px;
        }
        
        .lyrics {
          font-size: 13px;
          line-height: 1.8;
          margin-bottom: 10px;
          white-space: pre-wrap;
          word-wrap: break-word;
        }
        
        .notes {
          font-size: 11px;
          color: #666;
          font-style: italic;
          padding-top: 10px;
          border-top: 1px solid #ddd;
          margin-top: 10px;
        }
        
        .notes-label {
          font-weight: bold;
          color: #E91E63;
          margin-bottom: 5px;
        }
        
        .confidence {
          background-color: #2196F3;
          color: white;
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 12px;
          margin-top: 20px;
          display: inline-block;
        }
        
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          font-size: 10px;
          color: #999;
          text-align: center;
        }
        
        @media print {
          body {
            padding: 20px;
          }
          .section {
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">📋 Transcripción de Grabación</div>
        ${
          includeMetadata
            ? `
          <div class="metadata">
            <div class="metadata-item">
              <span class="metadata-label">Fecha:</span>
              <span>${recordingDate}</span>
            </div>
            <div class="metadata-item">
              <span class="metadata-label">Hora:</span>
              <span>${recordingTime}</span>
            </div>
            <div class="metadata-item">
              <span class="metadata-label">Duración:</span>
              <span>${formatTime(recording.duration)}</span>
            </div>
            <div class="metadata-item">
              <span class="metadata-label">Tipo:</span>
              <span>${recording.type === 'class' ? 'Clase' : recording.type === 'practice' ? 'Práctica' : 'Libre'}</span>
            </div>
            ${
              recording.songId
                ? `<div class="metadata-item">
                <span class="metadata-label">Canción:</span>
                <span>Grabación vinculada a canción</span>
              </div>`
                : ''
            }
            ${
              transcription.confidence
                ? `<div class="metadata-item">
                <span class="metadata-label">Confianza:</span>
                <span>${Math.round((transcription.confidence || 0) * 100)}%</span>
              </div>`
                : ''
            }
          </div>
        `
            : ''
        }
      </div>
      
      <div class="content">
  `;

  // Agregar secciones
  if (sections && sections.length > 0) {
    sections.forEach((section) => {
      html += `
        <div class="section">
          <div class="section-header">
            <span class="section-type">${section.type}</span>
            ${
              includeTimestamps
                ? `<span class="section-time">${formatTime(section.startTime)} - ${formatTime(section.endTime)}</span>`
                : ''
            }
          </div>
          <div class="section-content">
            <div class="lyrics">${escapeHTML(section.lyrics)}</div>
            ${
              includeNotes && section.notes
                ? `
              <div class="notes">
                <div class="notes-label">📝 Nota de entonación:</div>
                ${escapeHTML(section.notes)}
              </div>
            `
                : ''
            }
          </div>
        </div>
      `;
    });
  } else {
    // Si no hay secciones, mostrar texto completo
    html += `
      <div class="section">
        <div class="section-content">
          <div class="lyrics">${escapeHTML(transcription.text)}</div>
        </div>
      </div>
    `;
  }

  html += `
      </div>
      
      ${
        transcription.confidence
          ? `
        <div class="confidence">
          ✓ Confianza de transcripción: ${Math.round((transcription.confidence || 0) * 100)}%
        </div>
      `
          : ''
      }
      
      <div class="footer">
        <p>Generado por Pandereta Master | ${new Date().toLocaleDateString('es-ES')} a las ${new Date().toLocaleTimeString('es-ES')}</p>
      </div>
    </body>
    </html>
  `;

  return html;
}

/**
 * Escapa caracteres HTML especiales
 */
function escapeHTML(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Genera un nombre de archivo para la exportación
 */
export function generateFileName(recording: Recording): string {
  const date = new Date(recording.createdAt);
  const dateString = date.toISOString().split('T')[0];
  const timeString = date.toTimeString().split(' ')[0].replace(/:/g, '-');
  return `transcripcion_${dateString}_${timeString}.pdf`;
}

/**
 * Crea un blob de PDF a partir del HTML
 */
export async function generatePDFBlob(
  recording: Recording,
  transcription: RecordingTranscription,
  sections: TimestampedSection[],
  options?: PDFExportOptions
): Promise<Blob> {
  const html = generateTranscriptionHTML(recording, transcription, sections, options);

  // En producción, esto usaría una librería como html2pdf o similar
  // Por ahora, retornamos un blob simulado
  return new Blob([html], { type: 'text/html' });
}

/**
 * Genera una URL para descargar el PDF
 */
export function generatePDFDownloadURL(blob: Blob): string {
  return URL.createObjectURL(blob);
}

/**
 * Limpia la URL de descarga
 */
export function revokePDFDownloadURL(url: string): void {
  URL.revokeObjectURL(url);
}

/**
 * Exporta la transcripción completa como texto plano
 */
export function exportAsPlainText(
  recording: Recording,
  transcription: RecordingTranscription,
  sections: TimestampedSection[],
  includeTimestamps: boolean = true
): string {
  const recordingDate = new Date(recording.createdAt).toLocaleDateString('es-ES');
  const recordingTime = new Date(recording.createdAt).toLocaleTimeString('es-ES');

  let text = `TRANSCRIPCIÓN DE GRABACIÓN - PANDERETA MASTER\n`;
  text += `${'='.repeat(50)}\n\n`;
  text += `Fecha: ${recordingDate}\n`;
  text += `Hora: ${recordingTime}\n`;
  text += `Duración: ${formatTime(recording.duration)}\n`;
  text += `Tipo: ${recording.type === 'class' ? 'Clase' : recording.type === 'practice' ? 'Práctica' : 'Libre'}\n`;

  if (transcription.confidence) {
    text += `Confianza: ${Math.round((transcription.confidence || 0) * 100)}%\n`;
  }

  text += `\n${'='.repeat(50)}\n\n`;

  if (sections && sections.length > 0) {
    sections.forEach((section) => {
      text += `[${section.type.toUpperCase()}]`;
      if (includeTimestamps) {
        text += ` (${formatTime(section.startTime)} - ${formatTime(section.endTime)})`;
      }
      text += `\n`;
      text += `${section.lyrics}\n`;

      if (section.notes) {
        text += `Nota: ${section.notes}\n`;
      }

      text += `\n`;
    });
  } else {
    text += `${transcription.text}\n`;
  }

  text += `\n${'='.repeat(50)}\n`;
  text += `Generado: ${new Date().toLocaleDateString('es-ES')} a las ${new Date().toLocaleTimeString('es-ES')}\n`;

  return text;
}

/**
 * Exporta como CSV para análisis
 */
export function exportAsCSV(
  transcription: RecordingTranscription,
  sections: TimestampedSection[]
): string {
  let csv = 'Tipo,Inicio,Fin,Letra,Notas\n';

  if (sections && sections.length > 0) {
    sections.forEach((section) => {
      const startTime = formatTime(section.startTime);
      const endTime = formatTime(section.endTime);
      const lyrics = `"${section.lyrics.replace(/"/g, '""')}"`;
      const notes = section.notes ? `"${section.notes.replace(/"/g, '""')}"` : '""';

      csv += `${section.type},${startTime},${endTime},${lyrics},${notes}\n`;
    });
  }

  return csv;
}
