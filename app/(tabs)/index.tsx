import { ScrollView, Text, View, TouchableOpacity, Pressable } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useRouter } from "expo-router";
import { useStorage } from "@/lib/storage-context";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import * as Haptics from "expo-haptics";

export default function HomeScreen() {
  const router = useRouter();
  const { songs, recordings } = useStorage();
  const colors = useColors();

  const handleNavigate = (screen: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/(tabs)/${screen}` as any);
  };

  const recentSongs = songs.slice(-3).reverse();
  const recentRecordings = recordings.slice(-3).reverse();

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        {/* Header */}
        <View className="bg-primary px-6 pt-8 pb-6">
          <Text className="text-4xl font-bold text-white mb-2">Pandereta Master</Text>
          <Text className="text-base text-white opacity-90">Aprende, practica y graba</Text>
        </View>

        {/* Main Actions */}
        <View className="px-6 py-8 gap-4">
          {/* Biblioteca */}
          <Pressable
            onPress={() => handleNavigate("library")}
            style={({ pressed }) => [
              {
                backgroundColor: colors.primary,
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              },
            ]}
            className="rounded-2xl p-6 flex-row items-center gap-4"
          >
            <View className="bg-white/20 rounded-full p-3">
              <IconSymbol name="books.vertical.fill" size={32} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-white text-lg font-semibold">Mi Biblioteca</Text>
              <Text className="text-white/70 text-sm">
                {songs.length} canción{songs.length !== 1 ? "es" : ""}
              </Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color="white" />
          </Pressable>

          {/* Grabar Clase */}
          <Pressable
            onPress={() => handleNavigate("record")}
            style={({ pressed }) => [
              {
                backgroundColor: "#2196F3",
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              },
            ]}
            className="rounded-2xl p-6 flex-row items-center gap-4"
          >
            <View className="bg-white/20 rounded-full p-3">
              <IconSymbol name="mic.fill" size={32} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-white text-lg font-semibold">Grabar Clase</Text>
              <Text className="text-white/70 text-sm">
                {recordings.length} grabación{recordings.length !== 1 ? "es" : ""}
              </Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color="white" />
          </Pressable>

          {/* Practicar */}
          <Pressable
            onPress={() => handleNavigate("practice")}
            style={({ pressed }) => [
              {
                backgroundColor: colors.success,
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              },
            ]}
            className="rounded-2xl p-6 flex-row items-center gap-4"
          >
            <View className="bg-white/20 rounded-full p-3">
              <IconSymbol name="music.note" size={32} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-white text-lg font-semibold">Practicar</Text>
              <Text className="text-white/70 text-sm">Ritmos y ejercicios</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color="white" />
          </Pressable>
        </View>

        {/* Recent Songs */}
        {recentSongs.length > 0 && (
          <View className="px-6 py-6 border-t border-border">
            <Text className="text-lg font-semibold text-foreground mb-4">Canciones Recientes</Text>
            <View className="gap-3">
              {recentSongs.map((song) => (
                <Pressable
                  key={song.id}
                  onPress={() => router.push(`/(tabs)/library?songId=${song.id}` as any)}
                  style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                  className="bg-surface rounded-lg p-4 flex-row items-center gap-3"
                >
                  <View className="bg-primary/10 rounded-lg p-2">
                    <IconSymbol name="music.note" size={20} color={colors.primary} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-foreground font-medium">{song.title}</Text>
                    <Text className="text-muted text-xs">
                      {new Date(song.createdAt).toLocaleDateString("es-ES")}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Recent Recordings */}
        {recentRecordings.length > 0 && (
          <View className="px-6 py-6 border-t border-border">
            <Text className="text-lg font-semibold text-foreground mb-4">Grabaciones Recientes</Text>
            <View className="gap-3">
              {recentRecordings.map((recording) => (
                <View
                  key={recording.id}
                  className="bg-surface rounded-lg p-4 flex-row items-center gap-3"
                >
                  <View className="bg-error/10 rounded-lg p-2">
                    <IconSymbol name="mic.fill" size={20} color={colors.error} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-foreground font-medium">
                      {recording.type === "class" ? "Clase" : "Práctica"}
                    </Text>
                    <Text className="text-muted text-xs">
                      {new Date(recording.createdAt).toLocaleDateString("es-ES")} •{" "}
                      {Math.round(recording.duration / 1000)}s
                    </Text>
                  </View>
                  <IconSymbol name="play.fill" size={20} color={colors.primary} />
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Empty State */}
        {recentSongs.length === 0 && recentRecordings.length === 0 && (
          <View className="flex-1 items-center justify-center px-6 py-12">
            <View className="bg-surface rounded-full p-6 mb-4">
              <IconSymbol name="music.note" size={48} color={colors.primary} />
            </View>
            <Text className="text-lg font-semibold text-foreground mb-2">Comienza tu viaje</Text>
            <Text className="text-center text-muted">
              Agrega canciones a tu biblioteca o comienza a grabar tus clases
            </Text>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
