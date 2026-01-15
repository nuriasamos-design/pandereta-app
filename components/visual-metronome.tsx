import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/use-colors';

export interface VisualMetronomeProps {
  bpm: number;
  isActive: boolean;
  onToggle: () => void;
  pattern?: string; // 'muineira' | 'jota' | 'basic'
}

interface BeatVisual {
  id: number;
  type: 'po' | 'ro' | 'pero' | 'pó';
  label: string;
  color: string;
  intensity: number;
}

export function VisualMetronome({
  bpm,
  isActive,
  onToggle,
  pattern = 'basic',
}: VisualMetronomeProps) {
  const colors = useColors();
  const [beatCount, setBeatCount] = useState(0);
  const [currentBeat, setCurrentBeat] = useState<BeatVisual | null>(null);
  const metronomeRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Definir patrones visuales
  const getPatternBeats = (): BeatVisual[] => {
    if (pattern === 'muineira') {
      return [
        { id: 0, type: 'po', label: 'po', color: '#7C3AED', intensity: 1 },
        { id: 1, type: 'ro', label: 'ro', color: '#06B6D4', intensity: 0.8 },
        { id: 2, type: 'ro', label: 'ro', color: '#06B6D4', intensity: 0.8 },
        { id: 3, type: 'pero', label: 'pero', color: '#10B981', intensity: 0.9 },
        { id: 4, type: 'po', label: 'po', color: '#7C3AED', intensity: 1 },
        { id: 5, type: 'ro', label: 'ro', color: '#06B6D4', intensity: 0.8 },
        { id: 6, type: 'ro', label: 'ro', color: '#06B6D4', intensity: 0.8 },
        { id: 7, type: 'pero', label: 'pero', color: '#10B981', intensity: 0.9 },
      ];
    } else if (pattern === 'jota') {
      return [
        { id: 0, type: 'po', label: 'po', color: '#7C3AED', intensity: 1 },
        { id: 1, type: 'ro', label: 'ro', color: '#06B6D4', intensity: 0.8 },
        { id: 2, type: 'po', label: 'po', color: '#7C3AED', intensity: 1 },
        { id: 3, type: 'ro', label: 'ro', color: '#06B6D4', intensity: 0.8 },
        { id: 4, type: 'po', label: 'po', color: '#7C3AED', intensity: 1 },
      ];
    }
    return [
      { id: 0, type: 'po', label: 'po', color: '#7C3AED', intensity: 1 },
      { id: 1, type: 'ro', label: 'ro', color: '#06B6D4', intensity: 0.8 },
    ];
  };

  const patternBeats = getPatternBeats();

  // Efecto de animación de escala
  useEffect(() => {
    if (currentBeat) {
      scaleAnim.setValue(1.2);
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [currentBeat]);

  // Controlar metrónomo
  useEffect(() => {
    if (!isActive) {
      if (metronomeRef.current) {
        clearInterval(metronomeRef.current);
        metronomeRef.current = null;
      }
      return;
    }

    const beatDuration = (60 / bpm) * 1000;
    let count = 0;

    metronomeRef.current = setInterval(() => {
      const beat = patternBeats[count % patternBeats.length];
      setCurrentBeat(beat);
      setBeatCount(count);

      // Haptic feedback
      if (beat.type === 'po' || beat.type === 'pero') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      count++;
    }, beatDuration);

    return () => {
      if (metronomeRef.current) {
        clearInterval(metronomeRef.current);
      }
    };
  }, [isActive, bpm, pattern, patternBeats]);

  return (
    <View className="gap-4">
      {/* Visualización de golpe actual */}
      <View className="items-center justify-center gap-4">
        {/* Círculo grande de animación */}
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: currentBeat
              ? currentBeat.color
              : colors.surface,
            opacity: currentBeat ? 0.3 : 0.1,
          }}
        />

        {/* Información del golpe actual */}
        {currentBeat && (
          <View className="items-center gap-2">
            <Text className="text-4xl font-bold" style={{ color: currentBeat.color }}>
              {currentBeat.label.toUpperCase()}
            </Text>
            <Text className="text-sm text-muted">
              {currentBeat.type === 'po'
                ? 'Golpe Adelante'
                : currentBeat.type === 'ro'
                  ? 'Golpe Atrás'
                  : currentBeat.type === 'pero'
                    ? 'Riscado'
                    : 'Puño Acentuado'}
            </Text>
          </View>
        )}

        {/* BPM actual */}
        <Text className="text-lg font-semibold text-foreground">
          {bpm} BPM
        </Text>
      </View>

      {/* Patrón visual completo */}
      <View
        className="p-4 rounded-lg gap-3"
        style={{ backgroundColor: colors.surface }}
      >
        <Text className="text-sm font-semibold text-foreground">Patrón:</Text>
        <View className="flex-row gap-2 flex-wrap">
          {patternBeats.map((beat, index) => (
            <View
              key={beat.id}
              className="flex-1 min-w-[45px] items-center justify-center p-2 rounded-lg"
              style={{
                backgroundColor:
                  currentBeat?.id === beat.id
                    ? beat.color
                    : `${beat.color}20`,
                borderWidth: currentBeat?.id === beat.id ? 2 : 0,
                borderColor: beat.color,
              }}
            >
              <Text
                className="font-bold text-xs"
                style={{
                  color:
                    currentBeat?.id === beat.id
                      ? '#fff'
                      : beat.color,
                }}
              >
                {beat.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Leyenda de técnicas */}
      <View
        className="p-3 rounded-lg gap-2"
        style={{ backgroundColor: colors.surface }}
      >
        <Text className="text-xs font-semibold text-foreground mb-2">
          Técnicas:
        </Text>
        <View className="gap-1">
          <View className="flex-row items-center gap-2">
            <View
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: '#7C3AED' }}
            />
            <Text className="text-xs text-muted">po = Golpe Adelante</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <View
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: '#06B6D4' }}
            />
            <Text className="text-xs text-muted">ro = Golpe Atrás</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <View
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: '#10B981' }}
            />
            <Text className="text-xs text-muted">pero = Riscado</Text>
          </View>
        </View>
      </View>

      {/* Botón de control */}
      <Pressable
        onPress={onToggle}
        style={({ pressed }) => [
          {
            backgroundColor: isActive ? colors.error : colors.success,
            padding: 16,
            borderRadius: 12,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <Text className="text-center font-semibold text-white text-lg">
          {isActive ? 'Detener Metrónomo' : 'Iniciar Metrónomo'}
        </Text>
      </Pressable>
    </View>
  );
}
