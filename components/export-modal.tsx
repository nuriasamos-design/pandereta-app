import { Modal, View, Text, Pressable, ScrollView, Switch, Alert } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";
import { Recording, RecordingTranscription } from "@/lib/types";
import { TimestampedSection } from "@/lib/audio-sync-service";
import {
  generateTranscriptionHTML,
  generateFileName,
  exportAsPlainText,
  exportAsCSV,
} from "@/lib/pdf-export-service";

interface ExportModalProps {
  visible: boolean;
  onClose: () => void;
  recording: Recording;
  transcription: RecordingTranscription;
  sections: TimestampedSection[];
}

export function ExportModal({
  visible,
  onClose,
  recording,
  transcription,
  sections,
}: ExportModalProps) {
  const colors = useColors();
  const [format, setFormat] = useState<"pdf" | "txt" | "csv">("pdf");
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [includeTimestamps, setIncludeTimestamps] = useState(true);
  const [includeNotes, setIncludeNotes] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

      let content: string;
      let fileName: string;
      let mimeType: string;

      if (format === "pdf") {
        const html = generateTranscriptionHTML(recording, transcription, sections, {
          includeMetadata,
          includeTimestamps,
          includeNotes,
        });
        content = html;
        fileName = generateFileName(recording).replace(".pdf", ".html");
        mimeType = "text/html";
      } else if (format === "txt") {
        content = exportAsPlainText(recording, transcription, sections, includeTimestamps);
        fileName = generateFileName(recording).replace(".pdf", ".txt");
        mimeType = "text/plain";
      } else {
        content = exportAsCSV(transcription, sections);
        fileName = generateFileName(recording).replace(".pdf", ".csv");
        mimeType = "text/csv";
      }

      // Guardar archivo
      const filePath = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.writeAsStringAsync(filePath, content, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // Compartir archivo
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath, {
          mimeType,
          dialogTitle: `Compartir transcripción (${format.toUpperCase()})`,
        });
      } else {
        Alert.alert(
          "Archivo guardado",
          `Transcripción guardada como ${fileName}`
        );
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onClose();
    } catch (error) {
      console.error("Error exportando:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", "No se pudo exportar la transcripción");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View className="flex-1 bg-black/50">
        <View className="flex-1 bg-background rounded-t-3xl mt-auto">
          {/* Header */}
          <View className="bg-primary px-6 pt-6 pb-4 flex-row items-center justify-between rounded-t-3xl">
            <Text className="text-2xl font-bold text-white">Exportar Transcripción</Text>
            <Pressable onPress={onClose} className="p-2">
              <IconSymbol name="xmark" size={24} color="white" />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1 px-6 py-6">
            {/* Formato */}
            <View className="mb-8">
              <Text className="text-lg font-semibold text-foreground mb-4">Formato</Text>
              <View className="flex-row gap-3">
                {(["pdf", "txt", "csv"] as const).map((fmt) => (
                  <Pressable
                    key={fmt}
                    onPress={() => {
                      setFormat(fmt);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                    className={`flex-1 py-3 rounded-lg items-center justify-center border-2 ${
                      format === fmt
                        ? "bg-primary border-primary"
                        : "bg-surface border-border"
                    }`}
                  >
                    <View className="flex-row items-center gap-2">
                      <IconSymbol
                        name={
                          fmt === "pdf"
                            ? "doc.fill"
                            : fmt === "txt"
                              ? "doc.text"
                              : "tablecells"
                        }
                        size={18}
                        color={format === fmt ? "white" : colors.foreground}
                      />
                      <Text
                        className={`font-semibold ${
                          format === fmt ? "text-white" : "text-foreground"
                        }`}
                      >
                        {fmt.toUpperCase()}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Opciones */}
            <View className="mb-8">
              <Text className="text-lg font-semibold text-foreground mb-4">Opciones</Text>

              <View className="bg-surface rounded-lg overflow-hidden border border-border">
                {/* Metadatos */}
                <View className="p-4 border-b border-border flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <IconSymbol name="info.circle" size={20} color={colors.primary} />
                    <Text className="text-foreground font-medium">Incluir Metadatos</Text>
                  </View>
                  <Switch
                    value={includeMetadata}
                    onValueChange={setIncludeMetadata}
                    trackColor={{ false: colors.border, true: colors.primary }}
                  />
                </View>

                {/* Marcas de Tiempo */}
                <View className="p-4 border-b border-border flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <IconSymbol name="clock" size={20} color={colors.primary} />
                    <Text className="text-foreground font-medium">Incluir Marcas de Tiempo</Text>
                  </View>
                  <Switch
                    value={includeTimestamps}
                    onValueChange={setIncludeTimestamps}
                    trackColor={{ false: colors.border, true: colors.primary }}
                  />
                </View>

                {/* Notas de Entonación */}
                <View className="p-4 flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <IconSymbol name="music.note" size={20} color={colors.primary} />
                    <Text className="text-foreground font-medium">Incluir Notas</Text>
                  </View>
                  <Switch
                    value={includeNotes}
                    onValueChange={setIncludeNotes}
                    trackColor={{ false: colors.border, true: colors.primary }}
                  />
                </View>
              </View>
            </View>

            {/* Vista Previa */}
            <View className="mb-8">
              <Text className="text-lg font-semibold text-foreground mb-3">Vista Previa</Text>
              <View className="bg-surface rounded-lg p-4 border border-border">
                <Text className="text-xs text-muted mb-2">Nombre del archivo:</Text>
                <Text className="text-sm font-mono text-foreground">
                  {generateFileName(recording).replace(".pdf", `.${format}`)}
                </Text>
              </View>
            </View>

            {/* Botones */}
            <View className="flex-row gap-3 mb-6">
              <Pressable
                onPress={onClose}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                className="flex-1 bg-border rounded-lg py-3 items-center justify-center"
              >
                <Text className="text-foreground font-semibold">Cancelar</Text>
              </Pressable>

              <Pressable
                onPress={handleExport}
                disabled={isExporting}
                style={({ pressed }) => [
                  {
                    backgroundColor: colors.primary,
                    opacity: pressed || isExporting ? 0.7 : 1,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                  },
                ]}
                className="flex-1 rounded-lg py-3 items-center justify-center"
              >
                <View className="flex-row items-center gap-2">
                  <IconSymbol
                    name={isExporting ? "hourglass" : "arrow.down.doc"}
                    size={18}
                    color="white"
                  />
                  <Text className="text-white font-semibold">
                    {isExporting ? "Exportando..." : "Exportar"}
                  </Text>
                </View>
              </Pressable>
            </View>

            {/* Información */}
            <View className="bg-primary/10 rounded-lg p-4 border border-primary/20">
              <View className="flex-row gap-2 mb-2">
                <IconSymbol name="lightbulb.fill" size={18} color={colors.primary} />
                <Text className="text-primary font-semibold flex-1">Consejo</Text>
              </View>
              <Text className="text-sm text-foreground">
                {format === "pdf"
                  ? "El PDF incluye toda la transcripción con formato profesional, ideal para imprimir."
                  : format === "txt"
                    ? "El archivo de texto es compatible con cualquier editor, perfecto para edición posterior."
                    : "El CSV es ideal para importar a hojas de cálculo y hacer análisis."}
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
