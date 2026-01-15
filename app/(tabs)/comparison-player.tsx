import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface TimelineEvent {
  time: number;
  type: 'expected' | 'recorded';
  label: string;
  deviation?: number;
  color: string;
}

export default function ComparisonPlayerScreen() {
  const colors = useColors();
  const router = useRouter();
  const params = useLocalSearchParams<{ recordingId?: string }>();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30000); // 30 segundos simulado
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Datos simulados de comparación
  const expectedBeats = [
    { time: 0, label: 'po', type: 'expected' },
    { time: 500, label: 'ro', type: 'expected' },
    { time: 1000, label: 'ro', type: 'expected' },
    { time: 1500, label: 'pero', type: 'expected' },
    { time: 2000, label: 'po', type: 'expected' },
    { time: 2500, label: 'ro', type: 'expected' },
    { time: 3000, label: 'ro', type: 'expected' },
    { time: 3500, label: 'pero', type: 'expected' },
  ];

  const recordedBeats = [
    { time: 50, label: 'po', type: 'recorded', deviation: 50 },
    { time: 480, label: 'ro', type: 'recorded', deviation: -20 },
    { time: 1050, label: 'ro', type: 'recorded', deviation: 50 },
    { time: 1480, label: 'pero', type: 'recorded', deviation: -20 },
    { time: 2100, label: 'po', type: 'recorded', deviation: 100 },
    { time: 2520, label: 'ro', type: 'recorded', deviation: 20 },
    { time: 3050, label: 'ro', type: 'recorded', deviation: 50 },
    { time: 3480, label: 'pero', type: 'recorded', deviation: -20 },
  ];

  // Simular reproducción
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 50 / playbackSpeed;
          if (next >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return next;
        });
      }, 50);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, playbackSpeed, duration]);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = Math.floor((ms % 1000) / 100);
    return `${seconds}.${milliseconds}s`;
  };

  const getDeviationColor = (deviation?: number) => {
    if (!deviation) return colors.muted;
    if (Math.abs(deviation) < 30) return colors.success;
    if (Math.abs(deviation) < 75) return '#FFA500';
    return colors.error;
  };

  const getDeviationLabel = (deviation?: number) => {
    if (!deviation) return 'Esperado';
    if (deviation > 0) return `+${deviation}ms`;
    return `${deviation}ms`;
  };

  // Combinar y ordenar eventos
  const timelineEvents: TimelineEvent[] = [
    ...expectedBeats.map((b) => ({
      time: b.time,
      type: 'expected' as const,
      label: b.label,
      color: '#7C3AED',
    })),
    ...recordedBeats.map((b) => ({
      time: b.time,
      type: 'recorded' as const,
      label: b.label,
      deviation: b.deviation,
      color: '#06B6D4',
    })),
  ].sort((a, b) => a.time - b.time);

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="gap-6">
          {/* Encabezado */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">
              Comparar Grabación
            </Text>
            <Text className="text-base text-muted">
              Visualiza tu grabación vs el patrón correcto
            </Text>
          </View>

          {/* Reproductor */}
          <View
            className="p-6 rounded-lg gap-4"
            style={{ backgroundColor: colors.surface }}
          >
            {/* Tiempo actual */}
            <View className="items-center gap-2">
              <Text className="text-5xl font-bold text-primary">
                {formatTime(currentTime)}
              </Text>
              <Text className="text-sm text-muted">
                de {formatTime(duration)}
              </Text>
            </View>

            {/* Barra de progreso */}
            <View className="gap-2">
              <View
                className="h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: colors.border }}
              >
                <View
                  style={{
                    height: '100%',
                    backgroundColor: colors.primary,
                    width: `${(currentTime / duration) * 100}%`,
                  }}
                />
              </View>
              <View className="flex-row justify-between">
                <Text className="text-xs text-muted">
                  {formatTime(currentTime)}
                </Text>
                <Text className="text-xs text-muted">
                  {formatTime(duration)}
                </Text>
              </View>
            </View>

            {/* Controles de reproducción */}
            <View className="flex-row gap-3 justify-center">
              <Pressable
                onPress={() => setCurrentTime(Math.max(0, currentTime - 2000))}
                style={({ pressed }) => [
                  {
                    backgroundColor: colors.primary,
                    padding: 12,
                    borderRadius: 8,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <IconSymbol name="backward.fill" size={20} color="white" />
              </Pressable>

              <Pressable
                onPress={() => setIsPlaying(!isPlaying)}
                style={({ pressed }) => [
                  {
                    backgroundColor: colors.primary,
                    paddingHorizontal: 24,
                    paddingVertical: 12,
                    borderRadius: 8,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <IconSymbol
                  name={isPlaying ? 'pause.fill' : 'play.fill'}
                  size={20}
                  color="white"
                />
              </Pressable>

              <Pressable
                onPress={() => setCurrentTime(Math.min(duration, currentTime + 2000))}
                style={({ pressed }) => [
                  {
                    backgroundColor: colors.primary,
                    padding: 12,
                    borderRadius: 8,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <IconSymbol name="forward.fill" size={20} color="white" />
              </Pressable>
            </View>

            {/* Control de velocidad */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">
                Velocidad: {playbackSpeed.toFixed(1)}x
              </Text>
              <View className="flex-row gap-2">
                {[0.5, 0.75, 1, 1.25, 1.5].map((speed) => (
                  <Pressable
                    key={speed}
                    onPress={() => setPlaybackSpeed(speed)}
                    style={({ pressed }) => [
                      {
                        backgroundColor:
                          playbackSpeed === speed
                            ? colors.primary
                            : colors.border,
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 6,
                        opacity: pressed ? 0.8 : 1,
                      },
                    ]}
                  >
                    <Text
                      className="text-xs font-semibold"
                      style={{
                        color:
                          playbackSpeed === speed
                            ? 'white'
                            : colors.foreground,
                      }}
                    >
                      {speed}x
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>

          {/* Línea de tiempo comparativa */}
          <View
            className="p-4 rounded-lg gap-4"
            style={{ backgroundColor: colors.surface }}
          >
            <Text className="text-sm font-semibold text-foreground">
              Línea de Tiempo:
            </Text>

            {/* Leyenda */}
            <View className="flex-row gap-4">
              <View className="flex-row items-center gap-2">
                <View
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: '#7C3AED' }}
                />
                <Text className="text-xs text-muted">Esperado</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <View
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: '#06B6D4' }}
                />
                <Text className="text-xs text-muted">Grabado</Text>
              </View>
            </View>

            {/* Eventos en línea de tiempo */}
            <View className="gap-3 max-h-64">
              {timelineEvents.slice(0, 16).map((event, index) => (
                <View
                  key={index}
                  className="flex-row items-center gap-3 p-2 rounded-lg"
                  style={{
                    backgroundColor:
                      Math.abs(event.time - currentTime) < 200
                        ? `${event.color}20`
                        : 'transparent',
                  }}
                >
                  {/* Indicador de tipo */}
                  <View
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: event.color }}
                  />

                  {/* Información */}
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-sm font-semibold text-foreground">
                        {event.label.toUpperCase()}
                      </Text>
                      <Text
                        className="text-xs font-semibold"
                        style={{
                          color: getDeviationColor(event.deviation),
                        }}
                      >
                        {getDeviationLabel(event.deviation)}
                      </Text>
                    </View>
                    <Text className="text-xs text-muted">
                      {formatTime(event.time)}
                    </Text>
                  </View>

                  {/* Indicador de precisión */}
                  {event.type === 'recorded' && (
                    <View
                      className="w-6 h-6 rounded-full items-center justify-center"
                      style={{
                        backgroundColor: getDeviationColor(event.deviation),
                      }}
                    >
                      <Text className="text-xs font-bold text-white">
                        {Math.abs(event.deviation || 0) < 30 ? '✓' : '!'}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Estadísticas de comparación */}
          <View
            className="p-4 rounded-lg gap-3"
            style={{ backgroundColor: colors.surface }}
          >
            <Text className="text-sm font-semibold text-foreground">
              Estadísticas:
            </Text>

            <View className="flex-row justify-between">
              <Text className="text-sm text-muted">Golpes Correctos:</Text>
              <Text className="text-sm font-semibold text-success">
                {recordedBeats.filter((b) => (b.deviation || 0) < 30).length}/
                {recordedBeats.length}
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-sm text-muted">Desviación Promedio:</Text>
              <Text className="text-sm font-semibold text-foreground">
                {(
                  recordedBeats.reduce((sum, b) => sum + Math.abs(b.deviation || 0), 0) /
                  recordedBeats.length
                ).toFixed(0)}
                ms
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-sm text-muted">Precisión General:</Text>
              <Text className="text-sm font-semibold text-primary">
                {Math.round(
                  ((recordedBeats.length -
                    recordedBeats.filter((b) => (b.deviation || 0) > 75).length) /
                    recordedBeats.length) *
                    100
                )}
                %
              </Text>
            </View>
          </View>

          {/* Botón de volver */}
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              {
                backgroundColor: colors.surface,
                padding: 12,
                borderRadius: 8,
                borderColor: colors.border,
                borderWidth: 1,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Text className="text-center font-semibold text-foreground">
              Volver
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
