# Diseño de Interfaz - Pandereta Master

## Orientación y Principios
- **Orientación**: Retrato (9:16)
- **Uso**: Una mano
- **Estilo**: Alineado con Apple Human Interface Guidelines (HIG)
- **Objetivo**: Interfaz intuitiva, limpia y enfocada en la práctica musical

---

## Pantallas Principales

### 1. **Home (Inicio)**
- **Contenido**: Acceso rápido a las tres secciones principales
- **Elementos**:
  - Botón grande: "Mi Biblioteca" (acceso a canciones guardadas)
  - Botón grande: "Grabar Clase" (iniciar grabación de clase)
  - Botón grande: "Practicar" (acceso a ejercicios y ritmos)
  - Botón flotante inferior: "Micrófono" (grabadora rápida)
  - Indicador de canciones guardadas / últimas grabaciones

### 2. **Biblioteca de Canciones**
- **Contenido**: Lista de todas las canciones guardadas
- **Elementos**:
  - Barra de búsqueda
  - Lista de canciones con:
    - Título de canción
    - Fecha de agregación
    - Icono de fuente (foto/PDF/web)
    - Botón de reproducción (si hay audio asociado)
  - Botón flotante: "+" para agregar nueva canción
  - Filtros: Por fecha, por fuente, por etiqueta

### 3. **Agregar Canción (Modal/Pantalla)**
- **Contenido**: Múltiples opciones de importación
- **Elementos**:
  - Opción 1: Capturar foto de partitura
  - Opción 2: Importar PDF
  - Opción 3: Buscar en la web
  - Opción 4: Escribir manualmente
  - Vista previa de la canción agregada

### 4. **Detalle de Canción**
- **Contenido**: Información completa de una canción
- **Elementos**:
  - Imagen/foto de la partitura (ampliable)
  - Título y metadatos
  - Botones de acción:
    - "Grabar con esta canción"
    - "Practicar"
    - "Editar"
    - "Eliminar"
  - Historial de grabaciones vinculadas
  - Notas personales

### 5. **Grabación de Clase**
- **Contenido**: Interfaz de grabación vinculada a canciones
- **Elementos**:
  - Selector de fecha/clase
  - Lista de canciones de hoy (con checkboxes)
  - Botón grande de grabación (rojo cuando está activo)
  - Cronómetro visible
  - Botón de pausa/reanudar
  - Botón de detener
  - Opción: Grabar sin canción específica
  - Indicador de nivel de micrófono

### 6. **Grabaciones Guardadas**
- **Contenido**: Historial de todas las grabaciones
- **Elementos**:
  - Filtro por fecha/clase
  - Filtro por canción
  - Lista de grabaciones con:
    - Fecha y hora
    - Duración
    - Canción asociada (si aplica)
    - Botón de reproducción
    - Botón de eliminar
  - Reproductor integrado

### 7. **Reconocimiento de Canción**
- **Contenido**: Identificar canción por audio
- **Elementos**:
  - Botón grande: "Escuchar canción"
  - Indicador de escucha (onda de sonido animada)
  - Resultados: Canción identificada con opción de guardar
  - Alternativas si hay múltiples coincidencias

### 8. **Práctica - Inicio**
- **Contenido**: Seleccionar tipo de práctica
- **Elementos**:
  - Opción 1: "Toques Básicos" (ritmos simples)
  - Opción 2: "Ritmos Intermedios"
  - Opción 3: "Canciones Completas"
  - Opción 4: "Práctica Libre"
  - Selector de dificultad/velocidad

### 9. **Práctica - Ejercicio**
- **Contenido**: Interfaz de práctica con guía interactiva
- **Elementos**:
  - Nombre del ejercicio/ritmo
  - Selector de velocidad (BPM)
  - Selector de nivel (1-5)
  - Botón de reproducción de guía
  - Visualización de patrón (barras de ritmo)
  - Botón de grabación para autoevaluación
  - Botón de metrónomo
  - Botón de siguiente/anterior ejercicio
  - Indicador de progreso

### 10. **Práctica - Metrónomo**
- **Contenido**: Metrónomo interactivo
- **Elementos**:
  - Selector de BPM (deslizador)
  - Selector de compás (2/4, 3/4, 4/4, etc.)
  - Botón de inicio/pausa
  - Indicador visual del pulso
  - Sonido configurable

### 11. **Configuración**
- **Contenido**: Ajustes de la aplicación
- **Elementos**:
  - Tema (claro/oscuro)
  - Volumen de micrófono
  - Calidad de grabación
  - Permisos de micrófono/cámara
  - Información de la app

---

## Flujos de Usuario Principales

### Flujo 1: Agregar Canción y Grabar
1. Usuario toca "Mi Biblioteca"
2. Toca "+" para agregar canción
3. Selecciona método (foto/PDF/web)
4. Canción se guarda
5. Usuario toca "Grabar con esta canción"
6. Se abre grabadora vinculada a esa canción
7. Grabación se guarda con fecha y canción asociada

### Flujo 2: Grabar Clase Completa
1. Usuario toca "Grabar Clase"
2. Selecciona fecha (hoy por defecto)
3. Selecciona canciones que se tocarán
4. Inicia grabación
5. Puede cambiar entre canciones durante la grabación
6. Detiene grabación
7. Sistema vincula grabación a la clase y canciones

### Flujo 3: Identificar Canción por Audio
1. Usuario toca botón de micrófono
2. Selecciona "Identificar canción"
3. Escucha la canción (de fondo o en vivo)
4. Sistema identifica la canción
5. Usuario puede guardarla en biblioteca

### Flujo 4: Practicar Ritmo
1. Usuario toca "Practicar"
2. Selecciona tipo de ejercicio
3. Selecciona velocidad y nivel
4. Escucha guía de ritmo
5. Practica con metrónomo
6. Puede grabar su práctica para autoevaluación

---

## Paleta de Colores

| Elemento | Color | Uso |
|----------|-------|-----|
| **Primario** | #E91E63 (Rosa vibrante) | Botones principales, acentos, grabación activa |
| **Secundario** | #2196F3 (Azul) | Botones secundarios, información |
| **Éxito** | #4CAF50 (Verde) | Grabación completada, práctica exitosa |
| **Fondo** | #FFFFFF (Blanco) / #121212 (Gris oscuro) | Fondo general |
| **Superficie** | #F5F5F5 (Gris claro) / #1E1E1E (Gris oscuro) | Tarjetas, superficies elevadas |
| **Texto** | #212121 (Negro) / #FFFFFF (Blanco) | Texto principal |
| **Muted** | #757575 (Gris) | Texto secundario |
| **Advertencia** | #FF9800 (Naranja) | Advertencias, permisos |
| **Error** | #F44336 (Rojo) | Errores, eliminar |

---

## Componentes Reutilizables

- **Botón primario**: Rosa (#E91E63), redondeado, con feedback háptico
- **Botón secundario**: Azul (#2196F3), contorno
- **Tarjeta de canción**: Imagen + título + metadatos
- **Reproductor mínimo**: Botón play + duración
- **Grabadora flotante**: Botón rojo grande con indicador de grabación
- **Selector de velocidad**: Deslizador con valores BPM
- **Visualizador de audio**: Onda de sonido animada

---

## Consideraciones de Accesibilidad

- Botones grandes (mínimo 44x44 pt) para toque fácil con una mano
- Contraste suficiente entre texto y fondo
- Iconos con etiquetas de texto
- Retroalimentación háptica para acciones críticas
- Tamaño de fuente legible (mínimo 16pt para cuerpo)
