# Pandereta Master - TODO

## Fase 1: Estructura Base y Navegación
- [x] Configurar navegación por pestañas (Home, Biblioteca, Grabar, Practicar, Configuración)
- [x] Crear componentes base: ScreenContainer, Card, Button
- [x] Implementar tema de colores (rosa #E91E63, azul #2196F3)
- [ ] Crear logo y actualizar app.config.ts

## Fase 2: Biblioteca de Canciones
- [x] Crear pantalla de biblioteca con lista de canciones
- [x] Implementar almacenamiento local (AsyncStorage) para canciones
- [x] Crear modal de agregar canción
- [x] Integrar captura de foto (expo-image-picker)
- [x] Integrar importación de PDF (expo-document-picker)
- [ ] Implementar búsqueda de canciones en web (API o web scraping)
- [ ] Crear pantalla de detalle de canción
- [ ] Implementar edición y eliminación de canciones
- [x] Agregar búsqueda y filtros en biblioteca

## Fase 3: Sistema de Grabación
- [x] Crear pantalla de grabación de clase
- [x] Integrar micrófono (expo-audio)
- [ ] Implementar grabadora básica (play, pause, stop)
- [x] Crear almacenamiento de grabaciones
- [x] Vincular grabaciones a fechas de clase
- [x] Vincular grabaciones a canciones específicas
- [ ] Crear pantalla de historial de grabaciones
- [ ] Implementar reproductor de grabaciones
- [ ] Agregar indicador de nivel de micrófono

## Fase 4: Reconocimiento de Audio
- [ ] Investigar opciones de reconocimiento de canciones (Shazam API o similar)
- [ ] Implementar captura de audio para identificación
- [ ] Crear interfaz de identificación de canción
- [ ] Vincular canciones identificadas a biblioteca
- [ ] Agregar opción de guardar canción identificada

## Fase 5: Sección de Práctica
- [x] Crear pantalla de selección de práctica
- [x] Implementar biblioteca de ritmos/toques básicos
- [x] Crear interfaz de práctica con guía interactiva
- [x] Implementar selector de velocidad (BPM)
- [x] Implementar selector de nivel (1-5)
- [x] Crear metrónomo interactivo
- [x] Agregar visualización de patrón de ritmo
- [ ] Implementar grabación de práctica para autoevaluación
- [ ] Crear sistema de progresión/estadísticas

## Fase 6: Interfaz de Usuario Completa
- [ ] Implementar navegación fluida entre pantallas
- [ ] Agregar animaciones y transiciones suaves
- [ ] Implementar feedback háptico (Haptics)
- [ ] Crear barra de estado y headers consistentes
- [ ] Agregar iconos personalizados
- [ ] Implementar modo oscuro/claro
- [ ] Optimizar para una mano (tamaños de botones, posicionamiento)

## Fase 7: Configuración y Ajustes
- [x] Crear pantalla de configuración
- [x] Implementar selector de tema
- [x] Agregar control de volumen de micrófono
- [ ] Crear gestor de permisos (micrófono, cámara, almacenamiento)
- [x] Agregar información de la app

## Fase 8: Pruebas y Pulido
- [ ] Probar flujos de usuario completos
- [ ] Validar almacenamiento de datos
- [ ] Probar grabación y reproducción de audio
- [ ] Verificar permisos en iOS y Android
- [ ] Optimizar rendimiento
- [ ] Corregir bugs identificados
- [ ] Crear checkpoint final


## Fase 9: OCR y Edición de Canciones (NUEVO)
- [x] Integrar OCR (Tesseract o Google Vision API) para convertir fotos en texto
- [x] Crear pantalla de edición de canciones con estructura de estrofas/estribillos
- [x] Implementar editor de texto con soporte para notas de entonación
- [x] Agregar vista previa de canción formateada
- [x] Permitir corrección y edición manual de texto OCR
- [x] Guardar canciones con metadatos de estructura (estrofa, estribillo, verso)

## Fase 10: Transcripción de Audio (NUEVO)
- [x] Integrar API de speech-to-text (Google Cloud Speech o similar)
- [x] Crear funcionalidad de transcripción de grabaciones
- [x] Implementar pantalla de reproducción con transcripción sincronizada
- [x] Permitir edición de transcripciones
- [x] Vincular transcripciones a grabaciones guardadas
- [x] Agregar notas de entonación en transcripciones


## Fase 11: Reproductor Sincronizado (NUEVO)
- [x] Crear servicio de sincronización de audio y texto
- [x] Implementar reproductor de audio con controles (play, pause, stop)
- [x] Agregar visualización de onda de audio
- [x] Resaltar texto en tiempo real según posición de reproducción
- [x] Crear barra de progreso interactiva
- [x] Implementar navegación por secciones
- [x] Agregar velocidad de reproducción ajustable
- [x] Crear pantalla de reproductor con transcripción sincronizada


## Fase 12: Exportación a PDF (NUEVO)
- [x] Crear servicio de generación de PDF con transcripción
- [x] Incluir marcas de tiempo en PDF
- [x] Agregar información de secciones y notas de entonación
- [x] Implementar compartir PDF
- [x] Crear botón de exportación en pantalla de transcripción
- [x] Agregar opciones de formato (vertical, horizontal)
- [x] Incluir metadatos de grabación (fecha, duración, confianza)
