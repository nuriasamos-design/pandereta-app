import { ScrollView, Text, View, Pressable, Alert, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useStorage } from "@/lib/storage-context";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useState, useEffect, useRef } from "react";
import * as Haptics from "expo-haptics";
import * as Audio from "expo-audio";
import { Recording } from "@/lib/types";
import * as FileSystem from "expo-file-system/legacy";
import { useRouter } from "expo-router";

export default function RecordScreen() {
  const router = useRouter();
  const { songs, recordings, addRecording, addClassSession } = useStorage();
  const colors = useColors();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedSongs, setSelectedSongs] = useState<string[]>([]);
  const recordingRef = useRef<any>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });

      const recording = new (Audio as any).Recording();
      await recording.prepareToRecordAsync((Audio as any).RecordingPresets.HIGH_QUALITY);
      await recording.startAsync();
      recordingRef.current = recording;

      setIsRecording(true);
      setRecordingTime(0);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      Alert.alert("Error", "No se pudo iniciar la grabación");
    }
  };

  const stopRecording = async () => {
    try {
      if (!recordingRef.current) return;

      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();

      if (timerRef.current) clearInterval(timerRef.current);
      setIsRecording(false);

      if (uri) {
        const newRecording: Recording = {
          id: Date.now().toString(),
          uri,
          duration: recordingTime * 1000,
          createdAt: Date.now(),
          type: "class",
          songId: selectedSongs[0],
          classSessionId: `class_${new Date().toDateString()}`,
        };

        await addRecording(newRecording);

        // Create class session
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const classSession = {
          id: `class_${today.getTime()}`,
          date: today.getTime(),
          songIds: selectedSongs,
          createdAt: Date.now(),
        };
        await addClassSession(classSession);

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert("Éxito", "Grabación guardada correctamente");
        setRecordingTime(0);
        setSelectedSongs([]);
      }

      recordingRef.current = null;
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar la grabación");
    }
  };

  const toggleSongSelection = (songId: string) => {
    setSelectedSongs((prev) =>
      prev.includes(songId) ? prev.filter((id) => id !== songId) : [...prev, songId]
    );
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const renderRecordingItem = ({ item }: { item: Recording }) => (
    <Pressable
      onPress={() => router.push(`/(tabs)/recording-transcription?recordingId=${item.id}` as any)}
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
      className="bg-surface rounded-lg p-4 mb-3 flex-row items-center gap-3"
    >
      <View className="bg-error/10 rounded-lg p-2">
        <IconSymbol name="mic.fill" size={20} color={colors.error} />
      </View>
      <View className="flex-1">
        <Text className="text-foreground font-semibold">{Math.round(item.duration / 1000)}s</Text>
        <Text className="text-muted text-xs">{new Date(item.createdAt).toLocaleDateString("es-ES")}</Text>
      </View>
      <IconSymbol name="chevron.right" size={20} color={colors.muted} />
    </Pressable>
  );

  const renderSongItem = ({ item }: { item: any }) => (
    <Pressable
      onPress={() => toggleSongSelection(item.id)}
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
      className="bg-surface rounded-lg p-4 mb-3 flex-row items-center gap-3"
    >
      <View
        className={`w-6 h-6 rounded-md border-2 items-center justify-center ${
          selectedSongs.includes(item.id)
            ? "bg-primary border-primary"
            : "border-border"
        }`}
      >
        {selectedSongs.includes(item.id) && (
          <IconSymbol name="checkmark" size={16} color="white" />
        )}
      </View>
      <View className="flex-1">
        <Text className="text-foreground font-semibold">{item.title}</Text>
      </View>
    </Pressable>
  );

  return (
    <ScreenContainer className="p-0">
      {/* Header */}
      <View className="bg-primary px-6 pt-6 pb-4">
        <Text className="text-2xl font-bold text-white mb-2">Grabar Clase</Text>
        <Text className="text-white/70 text-sm">
          Selecciona las canciones y comienza a grabar
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        {/* Recording Status */}
        <View className="px-6 py-6 bg-surface mx-6 mt-6 rounded-2xl">
          <View className="items-center mb-6">
            {isRecording && (
              <View className="mb-4">
                <View className="w-16 h-16 rounded-full bg-error/20 items-center justify-center">
                  <View className="w-12 h-12 rounded-full bg-error items-center justify-center">
                    <IconSymbol name="mic.fill" size={28} color="white" />
                  </View>
                </View>
              </View>
            )}
            <Text className="text-4xl font-bold text-foreground font-mono">
              {formatTime(recordingTime)}
            </Text>
            {isRecording && (
              <Text className="text-primary font-semibold mt-2">Grabando...</Text>
            )}
          </View>

          {/* Record Button */}
          <Pressable
            onPress={isRecording ? stopRecording : startRecording}
            style={({ pressed }) => [
              {
                backgroundColor: isRecording ? colors.error : colors.primary,
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              },
            ]}
            className="rounded-full py-4 items-center justify-center"
          >
            <Text className="text-white font-semibold text-lg">
              {isRecording ? "Detener Grabación" : "Iniciar Grabación"}
            </Text>
          </Pressable>
        </View>

        {/* Song Selection */}
        {songs.length > 0 && (
          <View className="px-6 py-6">
            <Text className="text-lg font-semibold text-foreground mb-4">
              Canciones de Hoy ({selectedSongs.length})
            </Text>
            <FlatList
              data={songs}
              renderItem={renderSongItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        )}

        {/* Empty State */}
        {songs.length === 0 && (
          <View className="flex-1 items-center justify-center px-6 py-12">
            <View className="bg-surface rounded-full p-6 mb-4">
              <IconSymbol name="music.note" size={48} color={colors.primary} />
            </View>
            <Text className="text-lg font-semibold text-foreground mb-2">
              Sin canciones
            </Text>
            <Text className="text-center text-muted">
              Agrega canciones a tu biblioteca primero
            </Text>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
