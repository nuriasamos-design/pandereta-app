import { ScrollView, Text, View, Pressable, Switch, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useStorage } from "@/lib/storage-context";
import { useColors } from "@/hooks/use-colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useState, useEffect } from "react";
import * as Haptics from "expo-haptics";

export default function SettingsScreen() {
  const { settings, updateSettings } = useStorage();
  const colors = useColors();
  const colorScheme = useColorScheme();
  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleThemeChange = (value: string) => {
    const newSettings = {
      ...localSettings,
      theme: value as "light" | "dark" | "auto",
    };
    setLocalSettings(newSettings);
    updateSettings(newSettings);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleToggle = (key: keyof typeof localSettings, value: boolean) => {
    const newSettings = {
      ...localSettings,
      [key]: value,
    };
    setLocalSettings(newSettings);
    updateSettings(newSettings);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleVolumeChange = (delta: number) => {
    const newVolume = Math.max(0, Math.min(1, localSettings.microphoneVolume + delta));
    const newSettings = {
      ...localSettings,
      microphoneVolume: newVolume,
    };
    setLocalSettings(newSettings);
    updateSettings(newSettings);
  };

  const handleClearData = () => {
    Alert.alert(
      "Eliminar Datos",
      "¿Estás seguro de que deseas eliminar todos los datos? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", onPress: () => {}, style: "cancel" },
        {
          text: "Eliminar",
          onPress: () => {
            Alert.alert("Datos Eliminados", "Todos los datos han sido eliminados");
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <ScreenContainer className="p-0">
      {/* Header */}
      <View className="bg-primary px-6 pt-6 pb-4">
        <Text className="text-2xl font-bold text-white mb-2">Ajustes</Text>
        <Text className="text-white/70 text-sm">
          Personaliza tu experiencia
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1 px-6 py-6">
        {/* Appearance Section */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-foreground mb-4">Apariencia</Text>

          <View className="bg-surface rounded-2xl overflow-hidden border border-border">
            {/* Theme Selection */}
            <View className="p-4 border-b border-border">
              <Text className="text-foreground font-medium mb-3">Tema</Text>
              <View className="flex-row gap-2">
                {["light", "dark", "auto"].map((theme) => (
                  <Pressable
                    key={theme}
                    onPress={() => handleThemeChange(theme)}
                    style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                    className={`flex-1 py-2 rounded-lg ${
                      localSettings.theme === theme
                        ? "bg-primary"
                        : "bg-border"
                    }`}
                  >
                    <Text
                      className={`text-center text-sm font-semibold ${
                        localSettings.theme === theme
                          ? "text-white"
                          : "text-foreground"
                      }`}
                    >
                      {theme === "light"
                        ? "Claro"
                        : theme === "dark"
                          ? "Oscuro"
                          : "Auto"}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Audio Section */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-foreground mb-4">Audio</Text>

          <View className="bg-surface rounded-2xl overflow-hidden border border-border">
            {/* Microphone Volume */}
            <View className="p-4 border-b border-border">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-foreground font-medium">Volumen del Micrófono</Text>
                <Text className="text-primary font-semibold">
                  {Math.round(localSettings.microphoneVolume * 100)}%
                </Text>
              </View>
              <View className="flex-row items-center gap-3">
                <Pressable
                  onPress={() => handleVolumeChange(-0.1)}
                  className="bg-primary/10 rounded-lg p-2"
                >
                  <IconSymbol name="minus" size={18} color={colors.primary} />
                </Pressable>
                <View className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                  <View
                    className="h-full bg-primary"
                    style={{ width: `${localSettings.microphoneVolume * 100}%` }}
                  />
                </View>
                <Pressable
                  onPress={() => handleVolumeChange(0.1)}
                  className="bg-primary/10 rounded-lg p-2"
                >
                  <IconSymbol name="plus" size={18} color={colors.primary} />
                </Pressable>
              </View>
            </View>

            {/* Sound Enabled */}
            <View className="p-4 border-b border-border flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <IconSymbol name="speaker.wave.2.fill" size={20} color={colors.primary} />
                <Text className="text-foreground font-medium">Sonidos</Text>
              </View>
              <Switch
                value={localSettings.soundEnabled}
                onValueChange={(value) => handleToggle("soundEnabled", value)}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>

            {/* Haptic Feedback */}
            <View className="p-4 flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <IconSymbol name="waveform" size={20} color={colors.primary} />
                <Text className="text-foreground font-medium">Retroalimentación Háptica</Text>
              </View>
              <Switch
                value={localSettings.hapticFeedback}
                onValueChange={(value) => handleToggle("hapticFeedback", value)}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>
          </View>
        </View>

        {/* Recording Section */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-foreground mb-4">Grabación</Text>

          <View className="bg-surface rounded-2xl overflow-hidden border border-border">
            {/* Recording Quality */}
            <View className="p-4">
              <Text className="text-foreground font-medium mb-3">Calidad de Grabación</Text>
              <View className="gap-2">
                {["low", "medium", "high"].map((quality) => (
                  <Pressable
                    key={quality}
                    onPress={() => {
                      const newSettings = {
                        ...localSettings,
                        recordingQuality: quality as "low" | "medium" | "high",
                      };
                      setLocalSettings(newSettings);
                      updateSettings(newSettings);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                    className={`p-3 rounded-lg flex-row items-center gap-2 ${
                      localSettings.recordingQuality === quality
                        ? "bg-primary/10 border border-primary"
                        : "bg-border/50"
                    }`}
                  >
                    <View
                      className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                        localSettings.recordingQuality === quality
                          ? "border-primary bg-primary"
                          : "border-muted"
                      }`}
                    >
                      {localSettings.recordingQuality === quality && (
                        <View className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </View>
                    <Text
                      className={`font-medium ${
                        localSettings.recordingQuality === quality
                          ? "text-primary"
                          : "text-foreground"
                      }`}
                    >
                      {quality === "low"
                        ? "Baja (Menor espacio)"
                        : quality === "medium"
                          ? "Media (Recomendado)"
                          : "Alta (Mejor calidad)"}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* About Section */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-foreground mb-4">Acerca de</Text>

          <View className="bg-surface rounded-2xl overflow-hidden border border-border">
            <View className="p-4 border-b border-border">
              <Text className="text-muted text-sm">Versión</Text>
              <Text className="text-foreground font-semibold">1.0.0</Text>
            </View>

            <View className="p-4">
              <Text className="text-muted text-sm">Desarrollado con ❤️ para músicos</Text>
            </View>
          </View>
        </View>

        {/* Danger Zone */}
        <View className="mb-8">
          <Pressable
            onPress={handleClearData}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            className="bg-error/10 rounded-2xl p-4 border border-error"
          >
            <View className="flex-row items-center gap-3">
              <IconSymbol name="trash" size={20} color={colors.error} />
              <Text className="text-error font-semibold">Eliminar Todos los Datos</Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
