import { Song } from './types';

/**
 * Letras educativas originales para los 16 episodios del curso de Xabier Díaz
 * Estas letras enseñan los conceptos de cada episodio de forma divertida
 * Pueden ser reemplazadas con las letras oficiales del curso
 */

export const COURSE_SONGS: Song[] = [
  // EPISODIO 0: Introducción al instrumento
  {
    id: 'course-ep-00',
    title: 'Bienvenida a la Pandereta',
    source: 'manual',
    notes: 'Episodio 0: Introducción al instrumento',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    fullText: `[INTRO]
Bienvenida, bienvenida
A la pandereta gallega
Un instrumento de tradición
Que llena el alma de magia

[VERSO 1]
La pandereta es un círculo
De metal y de sonoridad
Lleva dentro campanillas
Que crean musicalidad

[ESTRIBILLO]
Pandereta, pandereta
Instrumento tradicional
Gallego de corazón
Que hace soñar a cualquiera

[VERSO 2]
En tus manos va a vivir
La música de Galicia
Ritmos que vienen del alma
Con mucha sabiduría

[PUENTE]
Aprenderemos juntos
Todos los toques y ritmos
La técnica y la pasión
Que hacen maestros a los míos`,
    sections: [
      {
        id: 'course-ep-00-sec-1',
        type: 'intro',
        lyrics: 'Bienvenida, bienvenida\nA la pandereta gallega',
        notes: 'Introducción suave',
        order: 1,
      },
      {
        id: 'course-ep-00-sec-2',
        type: 'verso',
        lyrics: 'La pandereta es un círculo\nDe metal y de sonoridad',
        notes: 'Verso descriptivo',
        order: 2,
      },
      {
        id: 'course-ep-00-sec-3',
        type: 'estribillo',
        lyrics: 'Pandereta, pandereta\nInstrumento tradicional',
        notes: 'Estribillo memorable',
        order: 3,
      },
    ],
  },

  // EPISODIO 1: La sujeción
  {
    id: 'course-ep-01',
    title: 'Cómo Sujetar la Pandereta',
    source: 'manual',
    notes: 'Episodio 1: La sujeción (How to hold the tambourine)',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    fullText: `[VERSO 1]
Agarra con la mano izquierda
Firme pero con delicadeza
Deja que los dedos respiren
Con naturalidad y belleza

[ESTRIBILLO]
Sujeción correcta
Es la base fundamental
Para tocar la pandereta
Con técnica profesional

[VERSO 2]
La mano derecha lista
Para golpear con precisión
Adelante y atrás
Con ritmo y con pasión

[VERSO 3]
Posición cómoda y natural
Sin tensión en los brazos
Que fluya la energía
Desde el corazón a los dedos

[CIERRE]
Cuando domines la sujeción
Habrás ganado la batalla
El resto vendrá con práctica
Y la música te hablará`,
    sections: [
      {
        id: 'course-ep-01-sec-1',
        type: 'verso',
        lyrics: 'Agarra con la mano izquierda',
        notes: 'Técnica de sujeción',
        order: 1,
      },
      {
        id: 'course-ep-01-sec-2',
        type: 'estribillo',
        lyrics: 'Sujeción correcta\nEs la base fundamental',
        notes: 'Mensaje clave',
        order: 2,
      },
    ],
  },

  // EPISODIO 2: Configura tu pandereta
  {
    id: 'course-ep-02',
    title: 'Configurando tu Pandereta',
    source: 'manual',
    notes: 'Episodio 2: Configura a túa pandereta',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    fullText: `[VERSO 1]
Ajusta las sonajas bien
Que suenen claras y brillantes
Ni muy sueltas ni muy apretadas
Que vibren en cada instante

[ESTRIBILLO]
Configuración perfecta
Para el sonido que buscas
Cada pandereta es única
Con su propia música

[VERSO 2]
Revisa el cuero o el plástico
Que sea resistente y fuerte
Limpia las campanillas
Para que suene con suerte

[VERSO 3]
Prueba diferentes tensiones
Encuentra tu sonoridad
La pandereta que te hable
Es la que debes tocar`,
    sections: [
      {
        id: 'course-ep-02-sec-1',
        type: 'verso',
        lyrics: 'Ajusta las sonajas bien',
        notes: 'Configuración',
        order: 1,
      },
      {
        id: 'course-ep-02-sec-2',
        type: 'estribillo',
        lyrics: 'Configuración perfecta',
        notes: 'Mensaje principal',
        order: 2,
      },
    ],
  },

  // EPISODIO 3: Primeras articulaciones
  {
    id: 'course-ep-03',
    title: 'Primeras Articulaciones',
    source: 'manual',
    notes: 'Episodio 3: Primeiras articulacións',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    fullText: `[VERSO 1]
Los dedos son instrumentos
De precisión y de arte
Cada movimiento cuenta
Cada gesto es importante

[ESTRIBILLO]
Articulaciones claras
Movimientos bien definidos
El camino hacia la música
Comienza con los dedos

[VERSO 2]
Practica cada movimiento
Con paciencia y dedicación
Lento al principio siempre
Que fluya la coordinación

[VERSO 3]
Siente cómo responden
Los dedos a tu voluntad
La pandereta te escucha
Y responde con libertad`,
    sections: [
      {
        id: 'course-ep-03-sec-1',
        type: 'verso',
        lyrics: 'Los dedos son instrumentos',
        notes: 'Importancia de articulaciones',
        order: 1,
      },
    ],
  },

  // EPISODIO 4: Primeros patrones rítmicos
  {
    id: 'course-ep-04',
    title: 'Primeros Patrones Rítmicos',
    source: 'manual',
    notes: 'Episodio 4: Primeiros patróns rítmicos',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    fullText: `[VERSO 1]
Po-ro, po-ro, po-ro
El primer patrón que aprendes
Adelante y hacia atrás
Que la pandereta te entiende

[ESTRIBILLO]
Patrones rítmicos
Son la base de la música
Repite una y otra vez
Hasta que sea automática

[VERSO 2]
Lento, lento, muy lento
Que cada golpe sea claro
Cuando domines la lentitud
Acelerarás sin reparo

[VERSO 3]
Po-ro, po-ro, po-ro
Escucha el sonido que haces
La pandereta responde
A cada uno de tus golpes`,
    sections: [
      {
        id: 'course-ep-04-sec-1',
        type: 'verso',
        lyrics: 'Po-ro, po-ro, po-ro',
        notes: 'Patrón básico',
        order: 1,
      },
    ],
  },

  // EPISODIO 5: Patrones ternarios
  {
    id: 'course-ep-05',
    title: 'Patrones Ternarios',
    source: 'manual',
    notes: 'Episodio 5: Primeiros patróns rítmicos a 3',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    fullText: `[VERSO 1]
Uno, dos, tres, uno, dos, tres
El ritmo de tres tiempos
Que es la base de la muiñeira
Y muchos ritmos gallegos

[ESTRIBILLO]
Ternario, ternario
Ritmo de tres tiempos
La pandereta gallega
Vive en este compás

[VERSO 2]
Po-ro-po, po-ro-po
Tres golpes en cada compás
Siente cómo fluye el ritmo
Como agua natural

[VERSO 3]
Practica con paciencia
Que el ternario es fundamental
Para dominar la muiñeira
Y otros ritmos tradicionales`,
    sections: [
      {
        id: 'course-ep-05-sec-1',
        type: 'verso',
        lyrics: 'Uno, dos, tres',
        notes: 'Ritmo ternario',
        order: 1,
      },
    ],
  },

  // EPISODIO 6: Patrones binarios
  {
    id: 'course-ep-06',
    title: 'Patrones Binarios',
    source: 'manual',
    notes: 'Episodio 6: Algúns patróns rítmicos binarios',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    fullText: `[VERSO 1]
Uno, dos, uno, dos
El ritmo de dos tiempos
Base de la jota gallega
Y otros ritmos tradicionales

[ESTRIBILLO]
Binario, binario
Ritmo de dos tiempos
Adelante y atrás
Que fluya naturalmente

[VERSO 2]
Po-ro, po-ro, po-ro
Dos golpes en cada compás
Diferente del ternario
Pero igual de importante

[VERSO 3]
La jota vive en este ritmo
Rápido y muy energético
Cuando domines el binario
Serás un músico completo`,
    sections: [
      {
        id: 'course-ep-06-sec-1',
        type: 'verso',
        lyrics: 'Uno, dos, uno, dos',
        notes: 'Ritmo binario',
        order: 1,
      },
    ],
  },

  // EPISODIO 7: Nuestra primera muiñeira
  {
    id: 'course-ep-07',
    title: 'Nuestra Primera Muiñeira',
    source: 'manual',
    notes: 'Episodio 7: A nosa primeira muiñeira',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    fullText: `[VERSO 1]
Poporo pero, poporo pero
Poporo poporo poporo pero
La muiñeira comienza así
Ritmo gallego tradicional

[ESTRIBILLO]
Muiñeira, muiñeira
Reina de los ritmos gallegos
Que suene la pandereta
Con el alma de Galicia

[VERSO 2]
Po adelante, ro atrás
Pero es el riscado
Juntos crean la magia
De la muiñeira sagrada

[VERSO 3]
Practica este ritmo
Que es el más importante
La muiñeira te llevará
A ser un músico gigante

[PUENTE]
Cuando domines la muiñeira
Habrás aprendido lo esencial
La pandereta gallega
Vivirá en tu corazón`,
    sections: [
      {
        id: 'course-ep-07-sec-1',
        type: 'verso',
        lyrics: 'Poporo pero, poporo pero',
        notes: 'Patrón de muiñeira',
        order: 1,
      },
      {
        id: 'course-ep-07-sec-2',
        type: 'estribillo',
        lyrics: 'Muiñeira, muiñeira',
        notes: 'Estribillo principal',
        order: 2,
      },
    ],
  },

  // EPISODIO 8: Sonoridad grave
  {
    id: 'course-ep-08',
    title: 'Sonoridad Grave',
    source: 'manual',
    notes: 'Episodio 8: Sonoridade grave',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    fullText: `[VERSO 1]
Golpes profundos y resonantes
Que vibren en el alma
La sonoridad grave
Es la voz de la pandereta

[ESTRIBILLO]
Grave, grave, muy grave
Sonido profundo y fuerte
La pandereta tiene voces
Y la grave es la más fuerte

[VERSO 2]
Golpea con más fuerza
Pero con control y arte
Que resuene en el pecho
Que llegue al corazón

[VERSO 3]
Alterna entre agudo y grave
Crea contrastes en la música
La sonoridad es expresión
Del sentimiento que llevas`,
    sections: [
      {
        id: 'course-ep-08-sec-1',
        type: 'verso',
        lyrics: 'Golpes profundos y resonantes',
        notes: 'Sonoridad grave',
        order: 1,
      },
    ],
  },

  // EPISODIO 9: O riscado
  {
    id: 'course-ep-09',
    title: 'O Riscado - El Rasgueo',
    source: 'manual',
    notes: 'Episodio 9: O riscado',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    fullText: `[VERSO 1]
Pero, pero, pero
El riscado es rasgueo
Dedos y pulgar juntos
Crean un sonido especial

[ESTRIBILLO]
Riscado, riscado
Técnica gallega por excelencia
El rasgueo de la pandereta
Es la marca de la experiencia

[VERSO 2]
Dedos hacia adelante
Pulgar hacia atrás
Juntos crean la magia
Del riscado tradicional

[VERSO 3]
Practica el riscado lentamente
Que sea fluido y natural
Cuando lo domines completamente
Serás un maestro de verdad

[PUENTE]
El riscado es la firma
De quien toca pandereta
Es lo que diferencia
Al principiante del maestro`,
    sections: [
      {
        id: 'course-ep-09-sec-1',
        type: 'verso',
        lyrics: 'Pero, pero, pero',
        notes: 'Técnica de riscado',
        order: 1,
      },
    ],
  },

  // EPISODIOS 10-16: Continuación del curso
  {
    id: 'course-ep-10',
    title: 'Ritmo y Expresión',
    source: 'manual',
    notes: 'Episodio 10: Ritmo y Expresión',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    fullText: `[VERSO 1]
El ritmo es el corazón
De toda la música
Pero la expresión es el alma
Que da vida a cada nota

[ESTRIBILLO]
Ritmo y expresión
Dos caras de la misma moneda
Juntas crean la magia
De la música verdadera

[VERSO 2]
No es solo golpear
Es contar una historia
Cada ritmo tiene emoción
Que debes expresar con gloria`,
    sections: [
      {
        id: 'course-ep-10-sec-1',
        type: 'verso',
        lyrics: 'El ritmo es el corazón',
        notes: 'Expresión musical',
        order: 1,
      },
    ],
  },

  {
    id: 'course-ep-11',
    title: 'Velocidad y Control',
    source: 'manual',
    notes: 'Episodio 11: Velocidad y Control',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    fullText: `[VERSO 1]
Comienza siempre lentamente
Que cada golpe sea claro
Cuando domines la lentitud
Acelera sin reparo

[ESTRIBILLO]
Velocidad y control
Dos fuerzas que deben convivir
Rápido pero preciso
Es el arte de la pandereta

[VERSO 2]
Practica con metrónomo
Aumenta poco a poco
La velocidad viene con práctica
No hay prisa en el aprendizaje`,
    sections: [
      {
        id: 'course-ep-11-sec-1',
        type: 'verso',
        lyrics: 'Comienza siempre lentamente',
        notes: 'Velocidad progresiva',
        order: 1,
      },
    ],
  },

  {
    id: 'course-ep-12',
    title: 'La Jota Gallega',
    source: 'manual',
    notes: 'Episodio 12: La Jota Gallega',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    fullText: `[VERSO 1]
Po-ro-po-ro-po
La jota en cinco golpes
Ritmo binario rápido
Que hace bailar a la gente

[ESTRIBILLO]
Jota, jota, jota
Ritmo de dos tiempos
Energía y alegría
En cada golpe de la pandereta

[VERSO 2]
Diferente de la muiñeira
Pero igual de importante
La jota es la diversión
De la música tradicional`,
    sections: [
      {
        id: 'course-ep-12-sec-1',
        type: 'verso',
        lyrics: 'Po-ro-po-ro-po',
        notes: 'Patrón de jota',
        order: 1,
      },
    ],
  },

  {
    id: 'course-ep-13',
    title: 'Variaciones y Adornos',
    source: 'manual',
    notes: 'Episodio 13: Variaciones y Adornos',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    fullText: `[VERSO 1]
Cuando domines los ritmos básicos
Llega la hora de crear
Variaciones y adornos
Que hagan tuya la música

[ESTRIBILLO]
Variaciones y adornos
Expresión de tu creatividad
La pandereta es un lienzo
Donde pintas tu verdad

[VERSO 2]
Experimenta con los ritmos
Crea nuevas combinaciones
La tradición es la base
Pero la creatividad es la libertad`,
    sections: [
      {
        id: 'course-ep-13-sec-1',
        type: 'verso',
        lyrics: 'Cuando domines los ritmos básicos',
        notes: 'Creatividad musical',
        order: 1,
      },
    ],
  },

  {
    id: 'course-ep-14',
    title: 'Improvisación',
    source: 'manual',
    notes: 'Episodio 14: Improvisación',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    fullText: `[VERSO 1]
Improvisa sobre la muiñeira
Deja que tus manos hablen
La pandereta es tu voz
Y la música es tu lenguaje

[ESTRIBILLO]
Improvisación, improvisación
Libertad dentro de la tradición
Crea en el momento
Lo que tu corazón siente

[VERSO 2]
No tengas miedo de experimentar
La música es un diálogo
Entre tú y la pandereta
Entre tú y la tradición`,
    sections: [
      {
        id: 'course-ep-14-sec-1',
        type: 'verso',
        lyrics: 'Improvisa sobre la muiñeira',
        notes: 'Improvisación libre',
        order: 1,
      },
    ],
  },

  {
    id: 'course-ep-15',
    title: 'Interpretación Profesional',
    source: 'manual',
    notes: 'Episodio 15: Interpretación Profesional',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    fullText: `[VERSO 1]
Ahora que dominas la técnica
Es hora de interpretar
Con sentimiento y pasión
Lo que la música quiere contar

[ESTRIBILLO]
Interpretación profesional
Es el arte de la pandereta
Técnica más emoción
Igual a la verdadera música

[VERSO 2]
Escucha a los maestros
Aprende de su experiencia
Pero mantén tu propia voz
Tu propia esencia`,
    sections: [
      {
        id: 'course-ep-15-sec-1',
        type: 'verso',
        lyrics: 'Ahora que dominas la técnica',
        notes: 'Interpretación avanzada',
        order: 1,
      },
    ],
  },

  {
    id: 'course-ep-16',
    title: 'Maestría y Enseñanza',
    source: 'manual',
    notes: 'Episodio 16: Maestría y Enseñanza',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    fullText: `[VERSO 1]
Has llegado al final del viaje
Pero es solo el comienzo
Ahora puedes enseñar
Lo que has aprendido

[ESTRIBILLO]
Maestría y enseñanza
El ciclo de la tradición
Aprender y luego enseñar
Es la verdadera transmisión

[VERSO 2]
Comparte tu conocimiento
Mantén viva la tradición
La pandereta gallega
Vive en tu corazón

[PUENTE]
Gracias por este viaje
De aprendizaje y pasión
La pandereta te ha hablado
Y tú has escuchado su canción`,
    sections: [
      {
        id: 'course-ep-16-sec-1',
        type: 'verso',
        lyrics: 'Has llegado al final del viaje',
        notes: 'Conclusión del curso',
        order: 1,
      },
    ],
  },
];
