import React from 'react';
import { View, Text } from 'react-native';
import { cn } from '@/lib/utils';

/**
 * Componente de notación rítmica visual para pandereta gallega
 * Basado en la metodología de Xabier Díaz
 * 
 * Símbolos:
 * - Ti: Corcheta con cabeza ENCIMA de la línea (golpe adelante)
 * - Co: Corcheta con cabeza DEBAJO de la línea (golpe atrás)
 * - Riscado: Símbolo especial de fricción
 * - Puño: Símbolo de puño cerrado
 * - Sonido Grave: Símbolo de nota grave
 */

export interface RhythmNotationProps {
  pattern: string[]; // Array de técnicas: ['Ti', 'Co', 'Ti', 'Co', 'Riscado']
  currentIndex?: number; // Índice de la nota actual siendo tocada
  size?: 'small' | 'medium' | 'large';
  showLabels?: boolean;
  interactive?: boolean;
  onNotePress?: (index: number) => void;
}

const NOTATION_SYMBOLS = {
  Ti: {
    name: 'Ti (Adelante)',
    symbol: '♪',
    position: 'above', // Encima de la línea
    description: 'Golpe con dedos hacia adelante',
  },
  Co: {
    name: 'Co (Atrás)',
    symbol: '♪',
    position: 'below', // Debajo de la línea
    description: 'Golpe con dedos hacia atrás',
  },
  Riscado: {
    name: 'Riscado',
    symbol: '≈',
    position: 'middle',
    description: 'Técnica de fricción rápida',
  },
  Puño: {
    name: 'Puño',
    symbol: '✊',
    position: 'middle',
    description: 'Golpe con mano cerrada',
  },
  'Sonido Grave': {
    name: 'Sonido Grave',
    symbol: '●',
    position: 'middle',
    description: 'Golpe grave con pulgar',
  },
};

const SIZE_CONFIG = {
  small: {
    noteSize: 16,
    lineHeight: 40,
    spacing: 12,
    fontSize: 10,
  },
  medium: {
    noteSize: 24,
    lineHeight: 60,
    spacing: 16,
    fontSize: 12,
  },
  large: {
    noteSize: 32,
    lineHeight: 80,
    spacing: 20,
    fontSize: 14,
  },
};

export function RhythmNotation({
  pattern,
  currentIndex,
  size = 'medium',
  showLabels = false,
  interactive = false,
  onNotePress,
}: RhythmNotationProps) {
  const config = SIZE_CONFIG[size];
  const lineY = config.lineHeight / 2;

  return (
    <View className="items-center gap-2">
      {/* Partitura */}
      <View
        className="bg-surface rounded-lg p-4"
        style={{
          minHeight: config.lineHeight + 40,
          minWidth: '100%',
        }}
      >
        {/* Línea de partitura */}
        <View
          className="absolute left-4 right-4 border-b border-foreground"
          style={{
            top: lineY + 20,
          }}
        />

        {/* Notas */}
        <View
          className="flex-row items-center justify-center gap-2"
          style={{
            paddingVertical: 20,
            paddingHorizontal: 16,
          }}
        >
          {pattern.map((technique, index) => {
            const notation = NOTATION_SYMBOLS[technique as keyof typeof NOTATION_SYMBOLS];
            const isActive = index === currentIndex;

            return (
              <View
                key={`${technique}-${index}`}
                className={cn(
                  'items-center justify-center rounded',
                  isActive && 'bg-primary/20',
                  interactive && 'active:opacity-70'
                )}
                style={{
                  width: config.noteSize + 8,
                  height: config.lineHeight + 20,
                  paddingVertical: 10,
                }}
                onTouchEnd={() => interactive && onNotePress?.(index)}
              >
                {/* Nota encima de la línea (Ti) */}
                {notation.position === 'above' && (
                  <Text
                    className={cn(
                      'font-bold',
                      isActive && 'text-primary'
                    )}
                    style={{
                      fontSize: config.noteSize,
                      marginBottom: config.lineHeight / 2 + 8,
                    }}
                  >
                    {notation.symbol}
                  </Text>
                )}

                {/* Nota debajo de la línea (Co) */}
                {notation.position === 'below' && (
                  <Text
                    className={cn(
                      'font-bold',
                      isActive && 'text-primary'
                    )}
                    style={{
                      fontSize: config.noteSize,
                      marginTop: config.lineHeight / 2 + 8,
                    }}
                  >
                    {notation.symbol}
                  </Text>
                )}

                {/* Nota en el medio (Riscado, Puño, Sonido Grave) */}
                {notation.position === 'middle' && (
                  <Text
                    className={cn(
                      'font-bold',
                      isActive && 'text-primary'
                    )}
                    style={{
                      fontSize: config.noteSize,
                    }}
                  >
                    {notation.symbol}
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      </View>

      {/* Etiquetas (opcional) */}
      {showLabels && (
        <View className="flex-row gap-2 flex-wrap justify-center">
          {pattern.map((technique, index) => {
            const notation = NOTATION_SYMBOLS[technique as keyof typeof NOTATION_SYMBOLS];
            const isActive = index === currentIndex;

            return (
              <View
                key={`label-${technique}-${index}`}
                className={cn(
                  'px-2 py-1 rounded-full bg-surface',
                  isActive && 'bg-primary'
                )}
              >
                <Text
                  className={cn(
                    'text-xs font-semibold text-foreground',
                    isActive && 'text-background'
                  )}
                >
                  {notation.name}
                </Text>
              </View>
            );
          })}
        </View>
      )}

      {/* Leyenda de técnicas */}
      <View className="w-full gap-2 mt-4">
        <Text className="text-sm font-semibold text-foreground">Técnicas:</Text>
        <View className="gap-1">
          {Object.entries(NOTATION_SYMBOLS).map(([key, notation]) => (
            <View key={key} className="flex-row items-center gap-2">
              <Text className="text-base font-bold text-primary" style={{ fontSize: 16 }}>
                {notation.symbol}
              </Text>
              <View className="flex-1">
                <Text className="text-xs font-semibold text-foreground">
                  {notation.name}
                </Text>
                <Text className="text-xs text-muted">
                  {notation.description}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

/**
 * Componente de partitura compacta para visualización rápida
 */
export function CompactRhythmNotation({
  pattern,
  currentIndex,
}: {
  pattern: string[];
  currentIndex?: number;
}) {
  return (
    <View className="flex-row items-center gap-1 bg-surface rounded-lg p-2">
      {pattern.map((technique, index) => {
        const notation = NOTATION_SYMBOLS[technique as keyof typeof NOTATION_SYMBOLS];
        const isActive = index === currentIndex;

        return (
          <View
            key={`compact-${technique}-${index}`}
            className={cn(
              'w-6 h-6 items-center justify-center rounded',
              isActive && 'bg-primary'
            )}
          >
            <Text
              className={cn(
                'text-xs font-bold',
                isActive ? 'text-background' : 'text-foreground'
              )}
            >
              {notation.symbol.charAt(0)}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
