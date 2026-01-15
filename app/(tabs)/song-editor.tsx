import { ScrollView, Text, View, Pressable, TextInput, Alert, ActivityIndicator, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useStorage } from "@/lib/storage-context";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useState, useEffect } from "react";
import * as Haptics from "expo-haptics";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Song, SongSection, SectionType } from "@/lib/types";
import { processSongImage, formatSectionsForDisplay, editableTextToSections } from "@/lib/ocr-service";

export default function SongEditorScreen() {
  const router = useRouter();
  const { updateSong, songs } = useStorage();
  const colors = useColors();
  const { songId } = useLocalSearchParams();

  const [song, setSong] = useState<Song | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState("");
  const [selectedSection, setSelectedSection] = useState<SongSection | null>(null);
  const [view, setView] = useState<"sections" | "edit" | "preview">("sections");

  useEffect(() => {
    if (songId && typeof songId === "string") {
      const foundSong = songs.find((s) => s.id === songId);
      if (foundSong) {
        setSong(foundSong);
        setEditText(formatSectionsForDisplay(foundSong.sections || []));
      }
    }
  }, [songId, songs]);

  const handleProcessOCR = async () => {
    if (!song?.imageUri) return;

    try {
      setIsProcessing(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

      const result = await processSongImage(song.imageUri);
      const updatedSong: Song = {
        ...song,
        ...result,
      };

      setSong(updatedSong);
      await updateSong(updatedSong);
      setEditText(formatSectionsForDisplay(updatedSong.sections || []));

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Éxito", "Canción procesada correctamente");
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", "No se pudo procesar la imagen");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const sections = editableTextToSections(editText);
      const updatedSong: Song = {
        ...song!,
        sections,
        fullText: editText,
        updatedAt: Date.now(),
      };

      setSong(updatedSong);
      await updateSong(updatedSong);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Guardado", "Cambios guardados correctamente");
      setEditMode(false);
    } catch (error) {
      Alert.alert("Error", "No se pudieron guardar los cambios");
    }
  };

  const handleEditSection = (section: SongSection) => {
    setSelectedSection(section);
    setEditMode(true);
  };

  const handleSaveSectionEdit = async () => {
    if (!selectedSection || !song) return;

    try {
      const updatedSections = (song.sections || []).map((s) =>
        s.id === selectedSection.id ? selectedSection : s
      );

      const updatedSong: Song = {
        ...song,
        sections: updatedSections,
        updatedAt: Date.now(),
      };

      setSong(updatedSong);
      await updateSong(updatedSong);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setSelectedSection(null);
      setEditMode(false);
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar la sección");
    }
  };

  if (!song) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-foreground">Canción no encontrada</Text>
      </ScreenContainer>
    );
  }

  if (isProcessing) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="text-foreground mt-4">Procesando imagen...</Text>
      </ScreenContainer>
    );
  }

  if (selectedSection && editMode) {
    return (
      <ScreenContainer className="p-0">
        <View className="bg-primary px-6 pt-6 pb-4">
          <Text className="text-2xl font-bold text-white mb-2">Editar Sección</Text>
          <Text className="text-white/70 text-sm">{selectedSection.type}</Text>
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1 px-6 py-6">
          {/* Tipo de Sección */}
          <View className="mb-6">
            <Text className="text-foreground font-semibold mb-3">Tipo</Text>
            <View className="bg-surface rounded-lg p-3">
              <Text className="text-foreground capitalize">{selectedSection.type}</Text>
            </View>
          </View>

          {/* Título */}
          <View className="mb-6">
            <Text className="text-foreground font-semibold mb-3">Título (opcional)</Text>
            <TextInput
              value={selectedSection.title || ""}
              onChangeText={(text) =>
                setSelectedSection({ ...selectedSection, title: text || undefined })
              }
              placeholder="Ej: Estrofa 1"
              placeholderTextColor={colors.muted}
              className="bg-surface text-foreground p-3 rounded-lg border border-border"
            />
          </View>

          {/* Letra */}
          <View className="mb-6">
            <Text className="text-foreground font-semibold mb-3">Letra</Text>
            <TextInput
              value={selectedSection.lyrics}
              onChangeText={(text) =>
                setSelectedSection({ ...selectedSection, lyrics: text })
              }
              placeholder="Ingresa la letra..."
              placeholderTextColor={colors.muted}
              multiline
              numberOfLines={6}
              className="bg-surface text-foreground p-3 rounded-lg border border-border"
              style={{ textAlignVertical: "top" }}
            />
          </View>

          {/* Notas de Entonación */}
          <View className="mb-6">
            <Text className="text-foreground font-semibold mb-3">Notas de Entonación</Text>
            <TextInput
              value={selectedSection.notes || ""}
              onChangeText={(text) =>
                setSelectedSection({ ...selectedSection, notes: text || undefined })
              }
              placeholder="Ej: Más lento, con énfasis..."
              placeholderTextColor={colors.muted}
              multiline
              numberOfLines={3}
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
              }}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              className="flex-1 bg-border rounded-lg py-3 items-center justify-center"
            >
              <Text className="text-foreground font-semibold">Cancelar</Text>
            </Pressable>

            <Pressable
              onPress={handleSaveSectionEdit}
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

  if (view === "edit") {
    return (
      <ScreenContainer className="p-0">
        <View className="bg-primary px-6 pt-6 pb-4 flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-2xl font-bold text-white">Editar Canción</Text>
          </View>
          <Pressable onPress={() => setView("sections")} className="p-2">
            <IconSymbol name="xmark" size={24} color="white" />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1 px-6 py-6">
          <TextInput
            value={editText}
            onChangeText={setEditText}
            placeholder="Edita el texto de la canción..."
            placeholderTextColor={colors.muted}
            multiline
            numberOfLines={20}
            className="bg-surface text-foreground p-4 rounded-lg border border-border flex-1"
            style={{ textAlignVertical: "top" }}
          />

          <Pressable
            onPress={handleSaveChanges}
            style={({ pressed }) => [
              {
                backgroundColor: colors.primary,
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              },
            ]}
            className="rounded-lg py-3 items-center justify-center mt-4"
          >
            <Text className="text-white font-semibold">Guardar Cambios</Text>
          </Pressable>
        </ScrollView>
      </ScreenContainer>
    );
  }

  if (view === "preview") {
    return (
      <ScreenContainer className="p-0">
        <View className="bg-primary px-6 pt-6 pb-4 flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-2xl font-bold text-white">Vista Previa</Text>
          </View>
          <Pressable onPress={() => setView("sections")} className="p-2">
            <IconSymbol name="xmark" size={24} color="white" />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1 px-6 py-6">
          <View className="bg-surface rounded-lg p-6">
            <Text className="text-2xl font-bold text-foreground mb-2">{song.title}</Text>
            <Text className="text-muted text-sm mb-6">
              {new Date(song.createdAt).toLocaleDateString("es-ES")}
            </Text>

            {song.sections && song.sections.length > 0 ? (
              song.sections
                .sort((a, b) => a.order - b.order)
                .map((section) => (
                  <View key={section.id} className="mb-6">
                    <Text className="text-primary font-bold text-lg mb-2">
                      [{section.type.toUpperCase()}]
                      {section.title && ` - ${section.title}`}
                    </Text>
                    <Text className="text-foreground leading-relaxed mb-2 whitespace-pre-wrap">
                      {section.lyrics}
                    </Text>
                    {section.notes && (
                      <Text className="text-muted italic text-sm">
                        Nota: {section.notes}
                      </Text>
                    )}
                  </View>
                ))
            ) : (
              <Text className="text-muted">Sin contenido</Text>
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
          <Text className="text-2xl font-bold text-white">{song.title}</Text>
          <Text className="text-white/70 text-sm">
            {song.source === "photo" && "📷 Foto"}
            {song.source === "pdf" && "📄 PDF"}
            {song.source === "web" && "🌐 Web"}
            {song.source === "manual" && "✏️ Manual"}
          </Text>
        </View>
        <Pressable onPress={() => router.back()} className="p-2">
          <IconSymbol name="xmark" size={24} color="white" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1 px-6 py-6">
        {/* Acciones */}
        <View className="flex-row gap-3 mb-6">
          {song.imageUri && !song.ocrProcessed && (
            <Pressable
              onPress={handleProcessOCR}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              className="flex-1 bg-warning rounded-lg py-3 items-center justify-center"
            >
              <View className="flex-row items-center gap-2">
                <IconSymbol name="doc.fill" size={18} color="white" />
                <Text className="text-white font-semibold">Procesar OCR</Text>
              </View>
            </Pressable>
          )}

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
            onPress={() => setView("edit")}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            className="flex-1 bg-primary rounded-lg py-3 items-center justify-center"
          >
            <View className="flex-row items-center gap-2">
              <IconSymbol name="pencil" size={18} color="white" />
              <Text className="text-white font-semibold">Editar</Text>
            </View>
          </Pressable>
        </View>

        {/* Secciones */}
        <Text className="text-lg font-semibold text-foreground mb-4">
          Secciones ({song.sections?.length || 0})
        </Text>

        {song.sections && song.sections.length > 0 ? (
          <FlatList
            data={song.sections.sort((a, b) => a.order - b.order)}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleEditSection(item)}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                className="bg-surface rounded-lg p-4 mb-3"
              >
                <View className="flex-row items-start justify-between">
                  <View className="flex-1">
                    <Text className="text-primary font-bold mb-1">
                      [{item.type.toUpperCase()}]
                    </Text>
                    {item.title && (
                      <Text className="text-foreground font-semibold mb-2">{item.title}</Text>
                    )}
                    <Text className="text-muted text-sm line-clamp-2">{item.lyrics}</Text>
                    {item.notes && (
                      <Text className="text-warning text-xs mt-2">📝 Nota: {item.notes}</Text>
                    )}
                  </View>
                  <IconSymbol name="chevron.right" size={20} color={colors.muted} />
                </View>
              </Pressable>
            )}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        ) : (
          <View className="bg-surface rounded-lg p-6 items-center">
            <IconSymbol name="music.note" size={32} color={colors.muted} />
            <Text className="text-muted mt-2">Sin secciones. Procesa la imagen o edita manualmente.</Text>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
