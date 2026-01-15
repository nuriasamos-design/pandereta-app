import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { IconSymbol } from '@/components/ui/icon-symbol';
import {
  analyzeAudio,
  generatePatternsFromAnalysis,
  generatePatternSuggestions,
  type AudioAnalysisResult,
  type GeneratedPattern,
} from '@/lib/audio-analysis-service';
import * as Haptics from 'expo-haptics';

export default function UploadSongScreen() {
  const colors = useColors();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AudioAnalysisResult | null>(null);
  const [patterns, setPatterns] = useState<GeneratedPattern[]>([]);
  const [selectedPattern, setSelectedPattern] = useState<GeneratedPattern | null>(null);
  const [step, setStep] = useState<'upload' | 'analyze' | 'patterns' | 'details'>('upload');

  const handleFileSelect = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setSelectedFile(asset.uri);
        setFileName(asset.name);
        setStep('analyze');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (error) {
      console.error('Error selecting file:', error);
    }
  };

  const handleAnalyzeAudio = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const result = await analyzeAudio(selectedFile);
      setAnalysis(result);

      // Generar patrones basados en análisis
      const songName = fileName.replace(/\.[^/.]+$/, '');
      const generatedPatterns = generatePatternsFromAnalysis(result, songName);
      setPatterns(generatedPatterns);
      setSelectedPattern(generatedPatterns[0]);

      setStep('patterns');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error analyzing audio:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectPattern = (pattern: GeneratedPattern) => {
    setSelectedPattern(pattern);
    setStep('details');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSavePattern = () => {
    if (selectedPattern) {
      // Aquí se guardaría el patrón en la base de datos
      console.log('Guardando patrón:', selectedPattern);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      // Navegar de vuelta a la biblioteca
    }
  };

  return (
    <ScreenContainer className="p-0">
      {/* Header */}
      <View className="bg-primary px-6 pt-6 pb-4">
        <Text className="text-2xl font-bold text-white mb-2">Subir Canción</Text>
        <Text className="text-white/70 text-sm">
          Carga tu música y genera patrones personalizados
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="px-6 py-6 gap-6">
          {/* Paso 1: Seleccionar archivo */}
          {step === 'upload' && (
            <>
              <View className="gap-4">
                <Text className="text-lg font-semibold text-foreground">Paso 1: Selecciona tu canción</Text>

                <Pressable
                  onPress={handleFileSelect}
                  style={({ pressed }) => [
                    {
                      opacity: pressed ? 0.9 : 1,
                      transform: [{ scale: pressed ? 0.97 : 1 }],
                      borderColor: colors.primary,
                    },
                  ]}
                  className="border-2 border-dashed rounded-lg p-8 items-center justify-center gap-3"
                >
                  <IconSymbol name="music.note.list" size={48} color={colors.primary} />
                  <Text className="text-center">
                    <Text className="text-foreground font-semibold">Toca para seleccionar</Text>
                    {'\n'}
                    <Text className="text-sm text-muted">MP3, WAV, M4A, etc.</Text>
                  </Text>
                </Pressable>

                {selectedFile && (
                  <View
                    className="p-4 rounded-lg gap-2"
                    style={{ backgroundColor: colors.surface }}
                  >
                    <View className="flex-row items-center gap-2">
                      <IconSymbol name="checkmark.circle.fill" size={24} color={colors.success} />
                      <View className="flex-1">
                        <Text className="text-sm font-semibold text-foreground">{fileName}</Text>
                        <Text className="text-xs text-muted">Archivo seleccionado</Text>
                      </View>
                    </View>
                  </View>
                )}
              </View>

              {/* Botón siguiente */}
              <Pressable
                onPress={handleAnalyzeAudio}
                disabled={!selectedFile || isAnalyzing}
                style={({ pressed }) => [
                  {
                    backgroundColor: selectedFile && !isAnalyzing ? colors.primary : colors.muted,
                    opacity: pressed && selectedFile && !isAnalyzing ? 0.9 : 1,
                    transform: [{ scale: pressed && selectedFile && !isAnalyzing ? 0.97 : 1 }],
                  },
                ]}
                className="rounded-full py-4 items-center justify-center"
              >
                {isAnalyzing ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-semibold text-lg">Analizar Canción</Text>
                )}
              </Pressable>
            </>
          )}

          {/* Paso 2: Análisis */}
          {step === 'analyze' && isAnalyzing && (
            <View className="gap-4 items-center justify-center py-12">
              <ActivityIndicator size="large" color={colors.primary} />
              <Text className="text-foreground font-semibold">Analizando canción...</Text>
              <Text className="text-sm text-muted text-center">
                Detectando BPM, tiempo y características musicales
              </Text>
            </View>
          )}

          {/* Paso 3: Patrones generados */}
          {step === 'patterns' && analysis && (
            <>
              <View className="gap-4">
                <View>
                  <Text className="text-lg font-semibold text-foreground mb-2">
                    Análisis de la Canción
                  </Text>
                  <View
                    className="p-4 rounded-lg gap-3"
                    style={{ backgroundColor: colors.surface }}
                  >
                    <View className="flex-row justify-between">
                      <Text className="text-sm text-muted">BPM</Text>
                      <Text className="text-sm font-semibold text-foreground">
                        {Math.round(analysis.bpm)}
                      </Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-sm text-muted">Confianza</Text>
                      <Text className="text-sm font-semibold text-foreground">
                        {Math.round(analysis.confidence)}%
                      </Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-sm text-muted">Energía</Text>
                      <Text className="text-sm font-semibold text-foreground">
                        {Math.round(analysis.energyLevel)}%
                      </Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-sm text-muted">Danzabilidad</Text>
                      <Text className="text-sm font-semibold text-foreground">
                        {Math.round(analysis.danceability)}%
                      </Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-sm text-muted">Duración</Text>
                      <Text className="text-sm font-semibold text-foreground">
                        {Math.round(analysis.duration)}s
                      </Text>
                    </View>
                  </View>
                </View>

                <View>
                  <Text className="text-lg font-semibold text-foreground mb-3">
                    Patrones Generados ({patterns.length})
                  </Text>
                  {patterns.map((pattern) => (
                    <Pressable
                      key={pattern.id}
                      onPress={() => handleSelectPattern(pattern)}
                      style={({ pressed }) => ({
                        opacity: pressed ? 0.9 : 1,
                        transform: [{ scale: pressed ? 0.97 : 1 }],
                        backgroundColor:
                          selectedPattern?.id === pattern.id ? `${colors.primary}20` : colors.surface,
                        borderColor:
                          selectedPattern?.id === pattern.id ? colors.primary : colors.border,
                        borderWidth: 2,
                        marginBottom: 12,
                        padding: 16,
                        borderRadius: 8,
                      })}
                    >
                      <View className="flex-row items-start justify-between">
                        <View className="flex-1">
                          <Text className="text-sm font-semibold text-foreground">
                            {pattern.name}
                          </Text>
                          <Text className="text-xs text-muted mt-1">{pattern.description}</Text>
                          <View className="flex-row gap-3 mt-2">
                            <View className="flex-row items-center gap-1">
                              <Text className="text-xs text-muted">Nivel:</Text>
                              <Text className="text-xs font-semibold text-foreground">
                                {pattern.difficulty}/5
                              </Text>
                            </View>
                            <View className="flex-row items-center gap-1">
                              <Text className="text-xs text-muted">Beats:</Text>
                              <Text className="text-xs font-semibold text-foreground">
                                {pattern.beats.length}
                              </Text>
                            </View>
                          </View>
                        </View>
                        {selectedPattern?.id === pattern.id && (
                          <IconSymbol
                            name="checkmark.circle.fill"
                            size={24}
                            color={colors.primary}
                          />
                        )}
                      </View>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Botón siguiente */}
              <Pressable
                onPress={() => setStep('details')}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.9 : 1,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                    backgroundColor: colors.primary,
                  },
                ]}
                className="rounded-full py-4 items-center justify-center"
              >
                <Text className="text-white font-semibold text-lg">Ver Detalles</Text>
              </Pressable>
            </>
          )}

          {/* Paso 4: Detalles del patrón */}
          {step === 'details' && selectedPattern && (
            <>
              <View className="gap-4">
                <View>
                  <Text className="text-lg font-semibold text-foreground mb-3">
                    Detalles del Patrón
                  </Text>

                  <View
                    className="p-4 rounded-lg gap-4"
                    style={{ backgroundColor: colors.surface }}
                  >
                    <View>
                      <Text className="text-sm font-semibold text-foreground mb-1">Nombre</Text>
                      <Text className="text-base text-foreground">{selectedPattern.name}</Text>
                    </View>

                    <View>
                      <Text className="text-sm font-semibold text-foreground mb-1">Descripción</Text>
                      <Text className="text-sm text-muted">{selectedPattern.description}</Text>
                    </View>

                    <View className="gap-2">
                      <View className="flex-row justify-between">
                        <Text className="text-sm text-muted">BPM</Text>
                        <Text className="text-sm font-semibold text-foreground">
                          {selectedPattern.bpm}
                        </Text>
                      </View>
                      <View className="flex-row justify-between">
                        <Text className="text-sm text-muted">Tiempo</Text>
                        <Text className="text-sm font-semibold text-foreground">
                          {selectedPattern.timeSignature}
                        </Text>
                      </View>
                      <View className="flex-row justify-between">
                        <Text className="text-sm text-muted">Dificultad</Text>
                        <Text className="text-sm font-semibold text-foreground">
                          {selectedPattern.difficulty}/5
                        </Text>
                      </View>
                      <View className="flex-row justify-between">
                        <Text className="text-sm text-muted">Beats</Text>
                        <Text className="text-sm font-semibold text-foreground">
                          {selectedPattern.beats.length}
                        </Text>
                      </View>
                    </View>

                    <View>
                      <Text className="text-sm font-semibold text-foreground mb-2">
                        Secuencia de Beats
                      </Text>
                      <View className="flex-row flex-wrap gap-2">
                        {selectedPattern.beats.map((beat, idx) => (
                          <View
                            key={idx}
                            className="px-3 py-2 rounded-full"
                            style={{
                              backgroundColor:
                                beat.type === 'po'
                                  ? '#D4A574'
                                  : beat.type === 'ro'
                                    ? '#C9956B'
                                    : beat.type === 'pero'
                                      ? '#B88456'
                                      : colors.border,
                            }}
                          >
                            <Text className="text-xs font-bold text-white">
                              {beat.type === 'silence' ? '-' : beat.type}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>

                    {/* Sugerencias */}
                    <View>
                      <Text className="text-sm font-semibold text-foreground mb-2">Sugerencias</Text>
                      {generatePatternSuggestions(selectedPattern).map((suggestion, idx) => (
                        <View key={idx} className="flex-row gap-2 mb-2">
                          <Text className="text-base">💡</Text>
                          <Text className="text-sm text-muted flex-1">{suggestion}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              </View>

              {/* Botones de acción */}
              <View className="gap-3">
                <Pressable
                  onPress={handleSavePattern}
                  style={({ pressed }) => [
                    {
                      opacity: pressed ? 0.9 : 1,
                      transform: [{ scale: pressed ? 0.97 : 1 }],
                      backgroundColor: colors.primary,
                    },
                  ]}
                  className="rounded-full py-4 items-center justify-center"
                >
                  <View className="flex-row items-center gap-2">
                    <IconSymbol name="checkmark" size={20} color="white" />
                    <Text className="text-white font-semibold text-lg">Guardar Patrón</Text>
                  </View>
                </Pressable>

                <Pressable
                  onPress={() => setStep('patterns')}
                  style={({ pressed }) => [
                    {
                      opacity: pressed ? 0.9 : 1,
                      transform: [{ scale: pressed ? 0.97 : 1 }],
                    },
                  ]}
                  className="rounded-full py-4 items-center justify-center border-2 border-primary"
                >
                  <Text className="text-primary font-semibold text-lg">Seleccionar Otro</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
