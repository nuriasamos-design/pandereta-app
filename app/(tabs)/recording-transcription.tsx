import { ScrollView, Text, View, Pressable, TextInput, Alert, ActivityIndicator, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useStorage } from "@/lib/storage-context";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useState, useEffect } from "react";
import * as Haptics from "expo-haptics";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Recording, RecordingTranscription, SongSection } from "@/lib/types";
import { processRecordingTranscription, formatTranscriptionForDisplay, updateTranscriptionNotes, updateTranscriptionSectionText } from "@/lib/transcription-service";

export default function RecordingTranscriptionScreen() {
  const router = useRouter();
  const { recordings } = useStorage();
  const colors = useColors();
  const { recordingId } = useLocalSearchParams();

  const [recording, setRecording] = useState<Recording | null>(null);
  const [transcription, setTranscription] = useState<RecordingTranscription | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedSection, setSelectedSection] = useState<SongSection | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [view, setView] = useState<"transcription" | "edit-section" | "preview">("transcription");

  useEffect(() => {
    if (recordingId && typeof recordingId === "string") {
      const foundRecording = recordings.find((r) => r.id === recordingId);
      if (foundRecording) {
        setRecording(foundRecording);
        if (foundRecording.transcription) {
          setTranscription(foundRecording.transcription);
        }
      }
    }
  }, [recordingId, recordings]);

  const handleTranscribe = async () => {
    if (!recording?.uri) return;

    try {
      setIsProcessing(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

      const result = await processRecordingTranscription(recording.id, recording.uri);
      setTranscription(result);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Éxito", "Grabación transcrita correctamente");
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", "No se pudo transcribir la grabación");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditSectionNotes = (section: SongSection) => {
    setSelectedSection(section);
    setEditMode(true);
    setView("edit-section");
  };

  const handleSaveNotes = async () => {
    if (!selectedSection || !transcription) return;

    try {
      const updatedTranscription = updateTranscriptionNotes(
        transcription,
        selectedSection.id,
        selectedSection.notes || ""
      );
      setTranscription(updatedTranscription);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Guardado", "Notas guardadas correctamente");
      setSelectedSection(null);
      setEditMode(false);
      setView("transcription");
    } catch (error) {
      Alert.alert("Error", "No se pudieron guardar las notas");
    }
  };

  if (isProcessing) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="text-foreground mt-4">Transcribiendo grabación...</Text>
        <Text className="text-muted text-sm mt-2">Esto puede tomar unos momentos</Text>
      </ScreenContainer>
    );
  }

  if (!recording) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-foreground">Grabación no encontrada</Text>
      </ScreenContainer>
    );
  }

  if (view === "edit-section" && selectedSection && transcription) {
    return (
      <ScreenContainer className="p-0">
        <View className="bg-primary px-6 pt-6 pb-4">
          <Text className="text-2xl font-bold text-white mb-2">Editar Notas</Text>
          <Text className="text-white/70 text-sm">{selectedSection.type}</Text>
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1 px-6 py-6">
          {/* Letra */}
          <View className="mb-6">
            <Text className="text-foreground font-semibold mb-3">Letra Transcrita</Text>
            <View className="bg-surface rounded-lg p-4 border border-border">
              <Text className="text-foreground leading-relaxed">{selectedSection.lyrics}</Text>
            </View>
          </View>

          {/* Notas de Entonación */}
          <View className="mb-6">
            <Text className="text-foreground font-semibold mb-3">Notas de Entonación</Text>
            <TextInput
              value={selectedSection.notes || ""}
              onChangeText={(text) =>
                setSelectedSection({ ...selectedSection, notes: text || undefined })
              }
              placeholder="Ej: Más lento, con énfasis, cambio de tono..."
              placeholderTextColor={colors.muted}
              multiline
              numberOfLines={4}
              className="bg-surface text-foreground p-3 rounded-lg border border-border"
              style={{ textAlignVertical: "top" }}
            />
          </View>

          {/* Botones */}
          <View className="flex-row gap-3">
            <Pressable
              onPress={() => {
                setSelectedSection(null);
                setEditMode(false);
                setView("transcription");
              }}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              className="flex-1 bg-border rounded-lg py-3 items-center justify-center"
            >
              <Text className="text-foreground font-semibold">Cancelar</Text>
            </Pressable>

            <Pressable
              onPress={handleSaveNotes}
              style={({ pressed }) => [
                {
                  backgroundColor: colors.primary,
                  opacity: pressed ? 0.9 : 1,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                },
              ]}
              className="flex-1 rounded-lg py-3 items-center justify-center"
            >
              <Text className="text-white font-semibold">Guardar</Text>
            </Pressable>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  if (view === "preview" && transcription) {
    return (
      <ScreenContainer className="p-0">
        <View className="bg-primary px-6 pt-6 pb-4 flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-2xl font-bold text-white">Vista Previa</Text>
          </View>
          <Pressable onPress={() => setView("transcription")} className="p-2">
            <IconSymbol name="xmark" size={24} color="white" />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1 px-6 py-6">
          <View className="bg-surface rounded-lg p-6">
            <Text className="text-muted text-sm mb-4">
              Confianza: {Math.round((transcription.confidence || 0) * 100)}%
            </Text>

            {transcription.sections && transcription.sections.length > 0 ? (
              transcription.sections
                .sort((a, b) => a.order - b.order)
                .map((section) => (
                  <View key={section.id} className="mb-6">
                    <Text className="text-primary font-bold text-lg mb-2">
                      [{section.type.toUpperCase()}]
                    </Text>
                    <Text className="text-foreground leading-relaxed mb-2 whitespace-pre-wrap">
                      {section.lyrics}
                    </Text>
                    {section.notes && (
                      <Text className="text-muted italic text-sm">
                        📝 {section.notes}
                      </Text>
                    )}
                  </View>
                ))
            ) : (
              <Text className="text-muted">{transcription.text}</Text>
            )}
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-0">
      {/* Header */}
      <View className="bg-primary px-6 pt-6 pb-4 flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-2xl font-bold text-white">Transcripción</Text>
          <Text className="text-white/70 text-sm">
            {new Date(recording.createdAt).toLocaleDateString("es-ES")} • {Math.round(recording.duration / 1000)}s
          </Text>
        </View>
        <Pressable onPress={() => router.back()} className="p-2">
          <IconSymbol name="xmark" size={24} color="white" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1 px-6 py-6">
        {!transcription ? (
          <View className="items-center justify-center flex-1">
            <View className="bg-surface rounded-full p-6 mb-4">
              <IconSymbol name="mic.fill" size={48} color={colors.primary} />
            </View>
            <Text className="text-lg font-semibold text-foreground mb-2">
              Sin transcripción
            </Text>
            <Text className="text-center text-muted mb-6">
              Transcribe esta grabación para obtener el texto y notas de entonación
            </Text>

            <Pressable
              onPress={handleTranscribe}
              style={({ pressed }) => [
                {
                  backgroundColor: colors.primary,
                  opacity: pressed ? 0.9 : 1,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                },
              ]}
              className="rounded-lg py-3 px-6 items-center justify-center"
            >
              <View className="flex-row items-center gap-2">
                <IconSymbol name="waveform" size={20} color="white" />
                <Text className="text-white font-semibold">Transcribir Ahora</Text>
              </View>
            </Pressable>
          </View>
        ) : (
          <>
            {/* Acciones */}
            <View className="flex-row gap-3 mb-6">
              <Pressable
                onPress={() => setView("preview")}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                className="flex-1 bg-secondary rounded-lg py-3 items-center justify-center"
              >
                <View className="flex-row items-center gap-2">
                  <IconSymbol name="eye.fill" size={18} color="white" />
                  <Text className="text-white font-semibold">Vista Previa</Text>
                </View>
              </Pressable>

              <Pressable
                onPress={handleTranscribe}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                className="flex-1 bg-warning rounded-lg py-3 items-center justify-center"
              >
                <View className="flex-row items-center gap-2">
                  <IconSymbol name="arrow.clockwise" size={18} color="white" />
                  <Text className="text-white font-semibold">Re-transcribir</Text>
                </View>
              </Pressable>
            </View>

            {/* Secciones */}
            <Text className="text-lg font-semibold text-foreground mb-4">
              Secciones ({transcription.sections?.length || 0})
            </Text>

            {transcription.sections && transcription.sections.length > 0 ? (
              <FlatList
                data={transcription.sections.sort((a, b) => a.order - b.order)}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => handleEditSectionNotes(item)}
                    style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                    className="bg-surface rounded-lg p-4 mb-3"
                  >
                    <View className="flex-row items-start justify-between">
                      <View className="flex-1">
                        <Text className="text-primary font-bold mb-2">
                          [{item.type.toUpperCase()}]
                        </Text>
                        <Text className="text-muted text-sm line-clamp-2 mb-2">
                          {item.lyrics}
                        </Text>
                        {item.notes ? (
                          <Text className="text-warning text-xs">📝 {item.notes}</Text>
                        ) : (
                          <Text className="text-muted text-xs italic">
                            Toca para agregar notas de entonación
                          </Text>
                        )}
                      </View>
                      <IconSymbol name="pencil" size={18} color={colors.primary} />
                    </View>
                  </Pressable>
                )}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            ) : (
              <View className="bg-surface rounded-lg p-6 items-center">
                <Text className="text-muted">Texto transcrito sin estructura de secciones</Text>
                <Text className="text-foreground mt-4 leading-relaxed">
                  {transcription.text}
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
