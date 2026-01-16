import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/use-colors';
import { RhythmNotation } from './rhythm-notation';
import { cn } from '@/lib/utils';

export interface VisualMetronomeProps {
  bpm: number;
  isActive: boolean;
  onToggle: () => void;
  pattern?: 'muineira' | 'jota' | 'xota' | 'aleluya' | 'basic';
}

interface BeatVisual {
  id: number;
  technique: 'Ti' | 'Co' | 'Riscado' | 'Puño' | 'Sonido Grave';
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
  const [currentBeatIndex, setCurrentBeatIndex] = useState(0);
  const metronomeRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Definir patrones con nomenclatura correcta (Ti-Co)
  const getPatternBeats = (): BeatVisual[] => {
    if (pattern === 'muineira') {
      return [
        { id: 0, technique: 'Ti', label: 'Ti', color: '#D4A574', intensity: 1 },
        { id: 1, technique: 'Co', label: 'Co', color: '#C9956B', intensity: 0.8 },
        { id: 2, technique: 'Ti', label: 'Ti', color: '#D4A574', intensity: 1 },
        { id: 3, technique: 'Co', label: 'Co', color: '#C9956B', intensity: 0.8 },
        { id: 4, technique: 'Riscado', label: 'Riscado', color: '#B88456', intensity: 0.9 },
      ];
    } else if (pattern === 'jota') {
      return [
        { id: 0, technique: 'Ti', label: 'Ti', color: '#D4A574', intensity: 1 },
        { id: 1, technique: 'Co', label: 'Co', color: '#C9956B', intensity: 0.8 },
        { id: 2, technique: 'Ti', label: 'Ti', color: '#D4A574', intensity: 1 },
        { id: 3, technique: 'Co', label: 'Co', color: '#C9956B', intensity: 0.8 },
        { id: 4, technique: 'Ti', label: 'Ti', color: '#D4A574', intensity: 1 },
      ];
    } else if (pattern === 'xota') {
      return [
        { id: 0, technique: 'Ti', label: 'Ti', color: '#D4A574', intensity: 1 },
        { id: 1, technique: 'Co', label: 'Co', color: '#C9956B', intensity: 0.8 },
        { id: 2, technique: 'Ti', label: 'Ti', color: '#D4A574', intensity: 1 },
        { id: 3, technique: 'Co', label: 'Co', color: '#C9956B', intensity: 0.8 },
        { id: 4, technique: 'Ti', label: 'Ti', color: '#D4A574', intensity: 1 },
        { id: 5, technique: 'Co', label: 'Co', color: '#C9956B', intensity: 0.8 },
      ];
    } else if (pattern === 'aleluya') {
      return [
        { id: 0, technique: 'Ti', label: 'Ti', color: '#D4A574', intensity: 1 },
        { id: 1, technique: 'Co', label: 'Co', color: '#C9956B', intensity: 0.8 },
        { id: 2, technique: 'Riscado', label: 'Riscado', color: '#B88456', intensity: 0.9 },
        { id: 3, technique: 'Co', label: 'Co', color: '#C9956B', intensity: 0.8 },
        { id: 4, technique: 'Ti', label: 'Ti', color: '#D4A574', intensity: 1 },
      ];
    } else {
      // Patrón básico: Ti-Co
      return [
        { id: 0, technique: 'Ti', label: 'Ti', color: '#D4A574', intensity: 1 },
        { id: 1, technique: 'Co', label: 'Co', color: '#C9956B', intensity: 0.8 },
      ];
    }
  };

  const beats = getPatternBeats();
  const beatDuration = (60 / bpm) * 1000; // Duración de cada beat en ms

  useEffect(() => {
    if (isActive) {
      metronomeRef.current = setInterval(() => {
        const nextIndex = (currentBeatIndex + 1) % beats.length;
        setCurrentBeatIndex(nextIndex);
        setCurrentBeat(beats[nextIndex]);
        setBeatCount((prev) => prev + 1);

        // Haptic feedback
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }, beatDuration);
    } else {
      if (metronomeRef.current) {
        clearInterval(metronomeRef.current);
      }
    }

    return () => {
      if (metronomeRef.current) {
        clearInterval(metronomeRef.current);
      }
    };
  }, [isActive, beatDuration, beats, currentBeatIndex]);

  const patternNames = beats.map((b) => b.technique);

  return (
    <View className="gap-6 p-4">
      {/* Partitura Visual */}
      <RhythmNotation
        pattern={patternNames}
        currentIndex={currentBeatIndex}
        size="medium"
        showLabels={true}
      />

      {/* Indicador Visual del Beat Actual */}
      <View className="items-center gap-4">
        <View
          className="w-24 h-24 rounded-full items-center justify-center border-4"
          style={{
            borderColor: currentBeat?.color || colors.primary,
            backgroundColor: currentBeat ? `${currentBeat.color}20` : 'transparent',
          }}
        >
          <Text
            className="text-3xl font-bold"
            style={{
              color: currentBeat?.color || colors.primary,
            }}
          >
            {currentBeat?.label || '—'}
          </Text>
        </View>

        {/* Información del Beat */}
        {currentBeat && (
          <View className="items-center gap-1">
            <Text className="text-lg font-semibold text-foreground">
              {currentBeat.technique}
            </Text>
            <Text className="text-sm text-muted">
              BPM: {bpm} | Beat: {currentBeatIndex + 1}/{beats.length}
            </Text>
          </View>
        )}
      </View>

      {/* Botón de Control */}
      <Pressable
        onPress={onToggle}
        className={cn(
          'py-3 px-6 rounded-lg items-center justify-center',
          isActive ? 'bg-error' : 'bg-primary'
        )}
      >
        <Text className="text-base font-semibold text-background">
          {isActive ? 'Detener' : 'Iniciar'} Metrónomo
        </Text>
      </Pressable>

      {/* Información de Técnicas */}
      <View className="bg-surface rounded-lg p-4 gap-2">
        <Text className="text-sm font-semibold text-foreground mb-2">
          Patrón: {pattern.charAt(0).toUpperCase() + pattern.slice(1)}
        </Text>
        <View className="gap-1">
          {beats.map((beat) => (
            <View
              key={beat.id}
              className={cn(
                'flex-row items-center gap-2 p-2 rounded',
                currentBeatIndex === beat.id && 'bg-primary/20'
              )}
            >
              <View
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: beat.color }}
              />
              <Text className="text-xs text-foreground flex-1">
                {beat.technique}
              </Text>
              <Text className="text-xs text-muted">
                {beat.id + 1}/{beats.length}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
