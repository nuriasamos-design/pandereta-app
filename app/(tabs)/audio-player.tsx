import { ScrollView, Text, View, Pressable, Alert, ActivityIndicator, FlatList, Dimensions } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useStorage } from "@/lib/storage-context";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useState, useEffect, useRef } from "react";
import * as Haptics from "expo-haptics";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Recording, RecordingTranscription } from "@/lib/types";
import { WaveformVisualizer, ProgressBar, SyncedTextSection } from "@/components/waveform-visualizer";
import {
  calculateSectionTimestamps,
  getCurrentSection,
  getSectionProgress,
  formatTime,
  generateWaveformData,
  getCompletedSections,
  seekToSection,
  TimestampedSection,
} from "@/lib/audio-sync-service";
import * as Audio from "expo-audio";

export default function AudioPlayerScreen() {
  const router = useRouter();
  const { recordings } = useStorage();
  const colors = useColors();
  const { recordingId } = useLocalSearchParams();

  const [recording, setRecording] = useState<Recording | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [timestampedSections, setTimestampedSections] = useState<TimestampedSection[]>([]);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const audioPlayerRef = useRef<Audio.AudioPlayer | null>(null);
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (recordingId && typeof recordingId === "string") {
      const foundRecording = recordings.find((r) => r.id === recordingId);
      if (foundRecording) {
        setRecording(foundRecording);
        initializePlayer(foundRecording);
      }
    }

    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
      if (audioPlayerRef.current) {
        audioPlayerRef.current.release();
      }
    };
  }, [recordingId, recordings]);

  const initializePlayer = async (rec: Recording) => {
    try {
      setIsLoading(true);

      // Inicializar transcripción con timestamps
      if (rec.transcription) {
        const sections = calculateSectionTimestamps(rec.transcription, rec.duration);
        setTimestampedSections(sections);
      }

      // Generar datos de onda
      const waveform = generateWaveformData(rec.duration, 60);
      setWaveformData(waveform);

      setIsLoading(false);
    } catch (error) {
      console.error("Error inicializando reproductor:", error);
      Alert.alert("Error", "No se pudo cargar la grabación");
      setIsLoading(false);
    }
  };

  const handlePlayPause = async () => {
    try {
      if (isPlaying) {
        setIsPlaying(false);
        if (updateIntervalRef.current) {
          clearInterval(updateIntervalRef.current);
        }
      } else {
        setIsPlaying(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const interval = setInterval(() => {
          setCurrentTime((prev) => {
            const newTime = prev + 100;
            if (newTime >= (recording?.duration || 0)) {
              setIsPlaying(false);
              if (updateIntervalRef.current) {
                clearInterval(updateIntervalRef.current);
              }
              return recording?.duration || 0;
            }
            return newTime;
          });
        }, 100);
        updateIntervalRef.current = interval as any;
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo reproducir el audio");
    }
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current);
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSeek = (time: number) => {
    setCurrentTime(Math.max(0, Math.min(time, recording?.duration || 0)));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSectionSeek = (section: TimestampedSection) => {
    const seekTime = seekToSection(section);
    handleSeek(seekTime);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  if (!recording) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-foreground">Grabación no encontrada</Text>
      </ScreenContainer>
    );
  }

  if (isLoading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="text-foreground mt-4">Cargando reproductor...</Text>
      </ScreenContainer>
    );
  }

  const currentSection = getCurrentSection(currentTime, timestampedSections);
  const completedSections = getCompletedSections(currentTime, timestampedSections);
  const progress = recording.duration > 0 ? currentTime / recording.duration : 0;

  return (
    <ScreenContainer className="p-0">
      {/* Header */}
      <View className="bg-primary px-6 pt-6 pb-4 flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-2xl font-bold text-white">Reproductor</Text>
          <Text className="text-white/70 text-sm">
            {new Date(recording.createdAt).toLocaleDateString("es-ES")}
          </Text>
        </View>
        <Pressable onPress={() => router.back()} className="p-2">
          <IconSymbol name="xmark" size={24} color="white" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1 px-6 py-6">
        {/* Visualizador de Onda */}
        {waveformData.length > 0 && (
          <View className="mb-6">
            <WaveformVisualizer
              waveformData={waveformData}
              currentProgress={progress}
              height={60}
            />
          </View>
        )}

        {/* Barra de Progreso */}
        <View className="mb-4">
          <ProgressBar
            currentTime={currentTime}
            totalDuration={recording.duration}
            onSeek={handleSeek}
          />
        </View>

        {/* Tiempo */}
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-muted text-sm">{formatTime(currentTime)}</Text>
          <Text className="text-muted text-sm">{formatTime(recording.duration)}</Text>
        </View>

        {/* Controles de Reproducción */}
        <View className="flex-row items-center justify-center gap-4 mb-8">
          <Pressable
            onPress={handleStop}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            className="bg-error/10 rounded-full p-3"
          >
            <IconSymbol name="stop.fill" size={24} color={colors.error} />
          </Pressable>

          <Pressable
            onPress={handlePlayPause}
            style={({ pressed }) => [
              {
                backgroundColor: colors.primary,
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.95 : 1 }],
              },
            ]}
            className="rounded-full p-6 items-center justify-center"
          >
            <IconSymbol
              name={isPlaying ? "pause.fill" : "play.fill"}
              size={32}
              color="white"
            />
          </Pressable>

          <Pressable
            onPress={() => handleSeek(Math.max(0, currentTime - 5000))}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            className="bg-primary/10 rounded-full p-3"
          >
            <IconSymbol name="gobackward.5" size={24} color={colors.primary} />
          </Pressable>
        </View>

        {/* Control de Velocidad */}
        <View className="mb-8">
          <Text className="text-foreground font-semibold mb-3">Velocidad: {playbackSpeed.toFixed(1)}x</Text>
          <View className="flex-row gap-2">
            {[0.5, 0.75, 1.0, 1.25, 1.5].map((speed) => (
              <Pressable
                key={speed}
                onPress={() => handleSpeedChange(speed)}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                className={`flex-1 py-2 rounded-lg ${
                  playbackSpeed === speed
                    ? "bg-primary"
                    : "bg-border"
                }`}
              >
                <Text
                  className={`text-center text-sm font-semibold ${
                    playbackSpeed === speed
                      ? "text-white"
                      : "text-foreground"
                  }`}
                >
                  {speed}x
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Secciones Sincronizadas */}
        {timestampedSections.length > 0 && (
          <View>
            <Text className="text-lg font-semibold text-foreground mb-4">
              Transcripción Sincronizada
            </Text>

            <FlatList
              data={timestampedSections}
              renderItem={({ item }) => {
                const isActive = currentSection?.id === item.id;
                const isCompleted = completedSections.some((s) => s.id === item.id);
                const highlightProgress = isActive ? getSectionProgress(currentTime, item) : 0;

                return (
                  <Pressable
                    onPress={() => handleSectionSeek(item)}
                    style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                  >
                    <SyncedTextSection
                      text={item.lyrics}
                      isActive={isActive}
                      isCompleted={isCompleted}
                      highlightProgress={highlightProgress}
                      type={item.type}
                    />
                  </Pressable>
                );
              }}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        )}

        {/* Información de Confianza */}
        {recording.transcription?.confidence && (
          <View className="bg-surface rounded-lg p-4 mt-6">
            <Text className="text-muted text-sm">
              Confianza de transcripción: {Math.round((recording.transcription.confidence || 0) * 100)}%
            </Text>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
