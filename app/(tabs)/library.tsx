import { ScrollView, Text, View, Pressable, TextInput, FlatList, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useStorage } from "@/lib/storage-context";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useState, useCallback } from "react";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { Song } from "@/lib/types";

export default function LibraryScreen() {
  const { songs, addSong } = useStorage();
  const colors = useColors();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddMenu, setShowAddMenu] = useState(false);

  const filteredSongs = songs.filter((song) =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddFromPhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const newSong: Song = {
          id: Date.now().toString(),
          title: `Canción ${songs.length + 1}`,
          source: "photo",
          imageUri: result.assets[0].uri,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        await addSong(newSong);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setShowAddMenu(false);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo capturar la foto");
    }
  };

  const handleAddFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const newSong: Song = {
          id: Date.now().toString(),
          title: `Canción ${songs.length + 1}`,
          source: "photo",
          imageUri: result.assets[0].uri,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        await addSong(newSong);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setShowAddMenu(false);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo seleccionar la imagen");
    }
  };

  const handleAddFromPDF = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });

      if (result.assets && result.assets[0]) {
        const newSong: Song = {
          id: Date.now().toString(),
          title: result.assets[0].name || `Canción ${songs.length + 1}`,
          source: "pdf",
          imageUri: result.assets[0].uri,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        await addSong(newSong);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setShowAddMenu(false);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo seleccionar el PDF");
    }
  };

  const handleAddManual = () => {
    Alert.prompt(
      "Nueva Canción",
      "Ingresa el nombre de la canción",
      [
        { text: "Cancelar", onPress: () => {}, style: "cancel" },
        {
          text: "Agregar",
          onPress: async (title: string | undefined) => {
            if (title && title.trim()) {
              const newSong: Song = {
                id: Date.now().toString(),
                title: title.trim(),
                source: "manual",
                createdAt: Date.now(),
                updatedAt: Date.now(),
              };
              await addSong(newSong);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              setShowAddMenu(false);
            }
          },
        },
      ],
      "plain-text"
    );
  };

  const renderSongItem = ({ item }: { item: Song }) => (
    <Pressable
      onPress={() => router.push(`/(tabs)/song-editor?songId=${item.id}` as any)}
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
      className="bg-surface rounded-lg p-4 mb-3 flex-row items-center gap-3"
    >
      {item.imageUri && (
        <View className="w-12 h-12 bg-primary/10 rounded-lg overflow-hidden">
          {/* Placeholder for image - actual image display would require Image component */}
          <View className="flex-1 items-center justify-center">
            <IconSymbol name="music.note" size={24} color={colors.primary} />
          </View>
        </View>
      )}
      {!item.imageUri && (
        <View className="w-12 h-12 bg-primary/10 rounded-lg items-center justify-center">
          <IconSymbol name="music.note" size={24} color={colors.primary} />
        </View>
      )}
      <View className="flex-1">
        <Text className="text-foreground font-semibold text-base">{item.title}</Text>
        <Text className="text-muted text-xs">
          {item.source === "photo" && "📷 Foto"}
          {item.source === "pdf" && "📄 PDF"}
          {item.source === "web" && "🌐 Web"}
          {item.source === "manual" && "✏️ Manual"}
          {" • "}
          {new Date(item.createdAt).toLocaleDateString("es-ES")}
        </Text>
      </View>
      <IconSymbol name="chevron.right" size={20} color={colors.muted} />
    </Pressable>
  );

  return (
    <ScreenContainer className="p-0">
      {/* Header */}
      <View className="bg-primary px-6 pt-6 pb-4">
        <Text className="text-2xl font-bold text-white mb-4">Mi Biblioteca</Text>

        {/* Search Bar */}
        <View className="flex-row items-center bg-white/20 rounded-full px-4 py-2 gap-2">
          <IconSymbol name="magnifyingglass" size={18} color="white" />
          <TextInput
            placeholder="Buscar canción..."
            placeholderTextColor="rgba(255,255,255,0.6)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 text-white text-base"
          />
        </View>
      </View>

      {/* Content */}
      {filteredSongs.length > 0 ? (
        <FlatList
          data={filteredSongs}
          renderItem={renderSongItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          scrollEnabled={false}
        />
      ) : (
        <View className="flex-1 items-center justify-center px-6">
          <View className="bg-surface rounded-full p-6 mb-4">
            <IconSymbol name="music.note" size={48} color={colors.primary} />
          </View>
          <Text className="text-lg font-semibold text-foreground mb-2">
            {searchQuery ? "No hay resultados" : "Sin canciones"}
          </Text>
          <Text className="text-center text-muted mb-6">
            {searchQuery
              ? "Intenta con otro término de búsqueda"
              : "Agrega tu primera canción para comenzar"}
          </Text>
        </View>
      )}

      {/* Add Button */}
      <Pressable
        onPress={() => setShowAddMenu(!showAddMenu)}
        style={({ pressed }) => [
          {
            backgroundColor: colors.primary,
            opacity: pressed ? 0.9 : 1,
            transform: [{ scale: pressed ? 0.95 : 1 }],
          },
        ]}
        className="absolute bottom-24 right-6 w-14 h-14 rounded-full items-center justify-center shadow-lg"
      >
        <IconSymbol name="plus" size={28} color="white" />
      </Pressable>

      {/* Add Menu */}
      {showAddMenu && (
        <View className="absolute bottom-32 right-6 bg-surface rounded-2xl shadow-lg overflow-hidden border border-border">
          <Pressable
            onPress={handleAddFromPhoto}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            className="px-6 py-4 flex-row items-center gap-3 border-b border-border"
          >
            <IconSymbol name="camera.fill" size={20} color={colors.primary} />
            <Text className="text-foreground font-medium">Capturar foto</Text>
          </Pressable>

          <Pressable
            onPress={handleAddFromGallery}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            className="px-6 py-4 flex-row items-center gap-3 border-b border-border"
          >
            <IconSymbol name="photo.fill" size={20} color={colors.primary} />
            <Text className="text-foreground font-medium">Galería</Text>
          </Pressable>

          <Pressable
            onPress={handleAddFromPDF}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            className="px-6 py-4 flex-row items-center gap-3 border-b border-border"
          >
            <IconSymbol name="doc.fill" size={20} color={colors.primary} />
            <Text className="text-foreground font-medium">PDF</Text>
          </Pressable>

          <Pressable
            onPress={handleAddManual}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            className="px-6 py-4 flex-row items-center gap-3"
          >
            <IconSymbol name="pencil" size={20} color={colors.primary} />
            <Text className="text-foreground font-medium">Escribir</Text>
          </Pressable>
        </View>
      )}
    </ScreenContainer>
  );
}
