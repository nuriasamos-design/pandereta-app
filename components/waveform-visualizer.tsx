import { View, Dimensions } from "react-native";
import { useColors } from "@/hooks/use-colors";

interface WaveformVisualizerProps {
  waveformData: number[];
  currentProgress: number; // 0-1
  height?: number;
  barWidth?: number;
  barGap?: number;
}

export function WaveformVisualizer({
  waveformData,
  currentProgress,
  height = 50,
  barWidth = 3,
  barGap = 1,
}: WaveformVisualizerProps) {
  const colors = useColors();
  const screenWidth = Dimensions.get("window").width;
  const totalBars = waveformData.length;
  const currentBarIndex = Math.floor(currentProgress * totalBars);

  return (
    <View
      className="bg-surface rounded-lg overflow-hidden"
      style={{
        height,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        paddingHorizontal: 8,
      }}
    >
      {waveformData.map((amplitude, index) => {
        const isPlayed = index < currentBarIndex;
        const barHeight = amplitude * height * 0.8;

        return (
          <View
            key={index}
            style={{
              width: barWidth,
              height: barHeight,
              backgroundColor: isPlayed ? colors.primary : colors.border,
              borderRadius: barWidth / 2,
              marginHorizontal: barGap / 2,
            }}
          />
        );
      })}
    </View>
  );
}

interface ProgressBarProps {
  currentTime: number;
  totalDuration: number;
  onSeek?: (time: number) => void;
  height?: number;
}

export function ProgressBar({
  currentTime,
  totalDuration,
  onSeek,
  height = 4,
}: ProgressBarProps) {
  const colors = useColors();
  const progress = totalDuration > 0 ? currentTime / totalDuration : 0;

  return (
    <View
      style={{
        height,
        backgroundColor: colors.border,
        borderRadius: height / 2,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          height: "100%",
          width: `${Math.max(0, Math.min(100, progress * 100))}%`,
          backgroundColor: colors.primary,
          borderRadius: height / 2,
        }}
      />
    </View>
  );
}

interface TextHighlighterProps {
  text: string;
  highlightEnd: number;
  highlightColor?: string;
  normalColor?: string;
}

export function TextHighlighter({
  text,
  highlightEnd,
  highlightColor,
  normalColor,
}: TextHighlighterProps) {
  const colors = useColors();
  const hColor = highlightColor || colors.primary;
  const nColor = normalColor || colors.foreground;

  const highlightedText = text.substring(0, highlightEnd);
  const normalText = text.substring(highlightEnd);

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
      <View>
        <Text style={{ color: hColor, fontWeight: "600" }}>
          {highlightedText}
        </Text>
      </View>
      <View>
        <Text style={{ color: nColor }}>{normalText}</Text>
      </View>
    </View>
  );
}

import { Text } from "react-native";

/**
 * Componente para mostrar secciones de texto con sincronización
 */
interface SyncedTextSectionProps {
  text: string;
  isActive: boolean;
  isCompleted: boolean;
  highlightProgress?: number; // 0-1
  type: string;
}

export function SyncedTextSection({
  text,
  isActive,
  isCompleted,
  highlightProgress = 0,
  type,
}: SyncedTextSectionProps) {
  const colors = useColors();

  const highlightEnd = Math.round(text.length * highlightProgress);

  return (
    <View
      className={`rounded-lg p-4 mb-3 border-l-4 ${
        isActive
          ? "bg-primary/10 border-l-primary"
          : isCompleted
            ? "bg-success/10 border-l-success"
            : "bg-surface border-l-border"
      }`}
    >
      <Text
        className={`text-xs font-semibold mb-2 ${
          isActive ? "text-primary" : isCompleted ? "text-success" : "text-muted"
        }`}
      >
        [{type.toUpperCase()}]
      </Text>

      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {isActive && highlightProgress > 0 ? (
          <>
            <Text
              style={{
                color: colors.primary,
                fontWeight: "600",
                lineHeight: 24,
              }}
            >
              {text.substring(0, highlightEnd)}
            </Text>
            <Text
              style={{
                color: colors.foreground,
                lineHeight: 24,
              }}
            >
              {text.substring(highlightEnd)}
            </Text>
          </>
        ) : (
          <Text
            className={`leading-relaxed ${
              isCompleted ? "text-success" : "text-foreground"
            }`}
          >
            {text}
          </Text>
        )}
      </View>
    </View>
  );
}
