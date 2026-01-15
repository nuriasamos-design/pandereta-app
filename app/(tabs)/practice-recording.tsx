import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import * as Audio from 'expo-audio';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  analyzeAudioForBeats,
  compareWithPattern,
  generateMuineirPattern,
  generateJotaPattern,
  generateExpectedPattern,
  calculateFinalScore,
  type AnalysisResult,
} from '@/lib/rhythm-analysis-service';

export default function PracticeRecordingScreen() {
  const colors = useColors();
  const router = useRouter();
  const params = useLocalSearchParams<{ rhythmId?: string; bpm?: string }>();

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [audioRecorder, setAudioRecorder] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const bpm = parseInt(params.bpm || '120', 10);
  const rhythmId = params.rhythmId || 'muineira';

  // Inicializar grabadora
  useEffect(() => {
    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecording: true,
          playsInSilentMode: true,
        });
      } catch (error) {
        console.error('Error setting up audio:', error);
      }
    };

    setupAudio();

    return () => {
      if (audioRecorder) {
        audioRecorder.stopAndUnloadAsync();
      }
    };
  }, []);

  // Actualizar tiempo de grabación
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const recording = new (Audio as any).Recording();
      await recording.prepareToRecordAsync(
        (Audio as any).RecordingPresets.HIGH_QUALITY
      );
      await recording.startAsync();
      setAudioRecorder(recording);
      setIsRecording(true);
      setRecordingTime(0);
      setAnalysisResult(null);
    } catch (error) {
      console.error('Error starting recording:', error);
      Alert.alert('Error', 'No se pudo iniciar la grabación');
    }
  };

  const stopRecording = async () => {
    if (!audioRecorder) return;

    try {
      setIsRecording(false);
      await audioRecorder.stopAndUnloadAsync();

      // Simular análisis
      setIsAnalyzing(true);
      setTimeout(() => {
        // Generar patrón esperado
        let expectedPattern;
        if (rhythmId === 'muineira') {
          expectedPattern = generateMuineirPattern(bpm);
        } else if (rhythmId === 'jota') {
          expectedPattern = generateJotaPattern(bpm);
        } else {
          expectedPattern = generateExpectedPattern(bpm, 8, 'Patrón');
        }

        // Simular análisis de audio (en producción, analizaría el audio real)
        const simulatedBeats = expectedPattern.beats.map((time, i) => ({
          timestamp: time + (Math.random() - 0.5) * 50, // Añadir pequeña variación
          intensity: 0.7 + Math.random() * 0.3,
          frequency: 200 + Math.random() * 200,
        }));

        // Comparar con patrón
        const result = compareWithPattern(simulatedBeats, expectedPattern);
        const finalScore = calculateFinalScore(result);

        setAnalysisResult({
          ...result,
          score: finalScore,
        });
        setIsAnalyzing(false);
      }, 1500);

      setAudioRecorder(null);
    } catch (error) {
      console.error('Error stopping recording:', error);
      Alert.alert('Error', 'Error al detener la grabación');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return colors.success;
    if (score >= 75) return '#FFA500';
    if (score >= 60) return '#FFD700';
    return colors.error;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return '¡Excelente!';
    if (score >= 75) return '¡Muy bien!';
    if (score >= 60) return 'Bien';
    if (score >= 40) return 'Necesita práctica';
    return 'Sigue practicando';
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="gap-6">
          {/* Encabezado */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">
              Grabar Práctica
            </Text>
            <Text className="text-base text-muted">
              Practica el ritmo y obtén feedback automático
            </Text>
          </View>

          {/* Información del ritmo */}
          <View
            className="p-4 rounded-lg gap-2"
            style={{ backgroundColor: colors.surface }}
          >
            <Text className="text-sm text-muted">Ritmo:</Text>
            <Text className="text-xl font-semibold text-foreground">
              {rhythmId === 'muineira' ? 'Muiñeira' : 'Jota'}
            </Text>
            <Text className="text-sm text-muted">
              Velocidad: {bpm} BPM
            </Text>
          </View>

          {/* Controles de grabación */}
          {!analysisResult && (
            <View className="gap-4">
              {/* Tiempo de grabación */}
              <View
                className="p-6 rounded-lg items-center justify-center"
                style={{ backgroundColor: colors.surface }}
              >
                <Text className="text-5xl font-bold text-primary">
                  {formatTime(recordingTime)}
                </Text>
                <Text className="text-sm text-muted mt-2">
                  {isRecording ? 'Grabando...' : 'Listo para grabar'}
                </Text>
              </View>

              {/* Botones de control */}
              <View className="gap-3">
                {!isRecording ? (
                  <Pressable
                    onPress={startRecording}
                    style={({ pressed }) => [
                      {
                        backgroundColor: colors.success,
                        padding: 16,
                        borderRadius: 12,
                        opacity: pressed ? 0.8 : 1,
                      },
                    ]}
                  >
                    <Text className="text-center font-semibold text-white text-lg">
                      Comenzar Grabación
                    </Text>
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={stopRecording}
                    style={({ pressed }) => [
                      {
                        backgroundColor: colors.error,
                        padding: 16,
                        borderRadius: 12,
                        opacity: pressed ? 0.8 : 1,
                      },
                    ]}
                  >
                    <Text className="text-center font-semibold text-white text-lg">
                      Detener Grabación
                    </Text>
                  </Pressable>
                )}
              </View>

              {/* Instrucciones */}
              <View
                className="p-4 rounded-lg gap-2"
                style={{ backgroundColor: colors.surface }}
              >
                <Text className="text-sm font-semibold text-foreground">
                  Instrucciones:
                </Text>
                <Text className="text-xs text-muted leading-relaxed">
                  1. Haz clic en "Comenzar Grabación"{'\n'}
                  2. Toca el ritmo con tu pandereta{'\n'}
                  3. Intenta mantener el tempo{'\n'}
                  4. Haz clic en "Detener" cuando termines
                </Text>
              </View>
            </View>
          )}

          {/* Resultados del análisis */}
          {isAnalyzing && (
            <View
              className="p-6 rounded-lg items-center justify-center gap-4"
              style={{ backgroundColor: colors.surface }}
            >
              <Text className="text-lg font-semibold text-foreground">
                Analizando tu práctica...
              </Text>
              <View className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            </View>
          )}

          {analysisResult && (
            <View className="gap-4">
              {/* Puntuación */}
              <View
                className="p-6 rounded-lg items-center justify-center gap-3"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: getScoreColor(analysisResult.score),
                  borderWidth: 2,
                }}
              >
                <Text
                  className="text-5xl font-bold"
                  style={{ color: getScoreColor(analysisResult.score) }}
                >
                  {analysisResult.score}%
                </Text>
                <Text
                  className="text-lg font-semibold"
                  style={{ color: getScoreColor(analysisResult.score) }}
                >
                  {getScoreLabel(analysisResult.score)}
                </Text>
              </View>

              {/* Estadísticas detalladas */}
              <View className="gap-3">
                <View
                  className="p-4 rounded-lg gap-3"
                  style={{ backgroundColor: colors.surface }}
                >
                  <Text className="text-sm font-semibold text-foreground">
                    Estadísticas:
                  </Text>

                  <View className="flex-row justify-between">
                    <Text className="text-sm text-muted">Precisión General:</Text>
                    <Text className="text-sm font-semibold text-foreground">
                      {analysisResult.accuracy}%
                    </Text>
                  </View>

                  <View className="flex-row justify-between">
                    <Text className="text-sm text-muted">Precisión de Timing:</Text>
                    <Text className="text-sm font-semibold text-foreground">
                      {analysisResult.timingAccuracy}%
                    </Text>
                  </View>

                  <View className="flex-row justify-between">
                    <Text className="text-sm text-muted">Golpes Detectados:</Text>
                    <Text className="text-sm font-semibold text-foreground">
                      {analysisResult.beatDetection.matched}/
                      {analysisResult.beatDetection.expected}
                    </Text>
                  </View>
                </View>

                {/* Feedback */}
                <View
                  className="p-4 rounded-lg gap-2"
                  style={{ backgroundColor: colors.surface }}
                >
                  <Text className="text-sm font-semibold text-foreground">
                    Feedback:
                  </Text>
                  {analysisResult.feedback.map((item, index) => (
                    <Text key={index} className="text-xs text-muted leading-relaxed">
                      • {item}
                    </Text>
                  ))}
                </View>

                {/* Detalles de golpes */}
                {analysisResult.deviations.length > 0 && (
                  <View
                    className="p-4 rounded-lg gap-2"
                    style={{ backgroundColor: colors.surface }}
                  >
                    <Text className="text-sm font-semibold text-foreground">
                      Detalles de Golpes:
                    </Text>
                    {analysisResult.deviations.slice(0, 5).map((dev, index) => (
                      <View key={index} className="flex-row justify-between">
                        <Text className="text-xs text-muted">
                          Golpe #{dev.beat}:
                        </Text>
                        <Text
                          className="text-xs font-semibold"
                          style={{
                            color:
                              dev.deviation < 50
                                ? colors.success
                                : dev.deviation < 100
                                  ? '#FFA500'
                                  : colors.error,
                          }}
                        >
                          {dev.deviation < 0 ? '—' : `${dev.deviation.toFixed(0)}ms`}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>

              {/* Botones de acción */}
              <View className="gap-3">
                <Pressable
                  onPress={() => {
                    setAnalysisResult(null);
                    setRecordingTime(0);
                  }}
                  style={({ pressed }) => [
                    {
                      backgroundColor: colors.primary,
                      padding: 12,
                      borderRadius: 8,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <Text className="text-center font-semibold text-white">
                    Grabar de Nuevo
                  </Text>
                </Pressable>

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
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
