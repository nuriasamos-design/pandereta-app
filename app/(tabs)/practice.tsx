import { ScrollView, Text, View, Pressable, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useState, useEffect, useRef } from "react";
import * as Haptics from "expo-haptics";
import { Rhythm } from "@/lib/types";

const DEFAULT_RHYTHMS: Rhythm[] = [
  {
    id: "basic-1",
    name: "Pulso Básico",
    description: "Toque simple de pandereta",
    level: 1,
    bpm: 80,
    pattern: "1 - 2 - 3 - 4",
    type: "basic",
  },
  {
    id: "basic-2",
    name: "Doble Toque",
    description: "Dos toques por pulso",
    level: 1,
    bpm: 80,
    pattern: "1 1 2 2 3 3 4 4",
    type: "basic",
  },
  {
    id: "basic-3",
    name: "Toque Sincopado",
    description: "Ritmo sincopado básico",
    level: 2,
    bpm: 100,
    pattern: "1 - 2 - 3 - 4 -",
    type: "basic",
  },
  {
    id: "intermediate-1",
    name: "Rumba",
    description: "Ritmo de rumba cubana",
    level: 3,
    bpm: 120,
    pattern: "1 2 - 3 - 4 -",
    type: "intermediate",
  },
  {
    id: "intermediate-2",
    name: "Samba",
    description: "Ritmo brasileño de samba",
    level: 3,
    bpm: 140,
    pattern: "1 - 2 - 3 - 4",
    type: "intermediate",
  },
];

export default function PracticeScreen() {
  const colors = useColors();
  const [rhythms] = useState<Rhythm[]>(DEFAULT_RHYTHMS);
  const [selectedRhythm, setSelectedRhythm] = useState<Rhythm | null>(null);
  const [bpm, setBpm] = useState(80);
  const [level, setLevel] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [isMetronomeActive, setIsMetronomeActive] = useState(false);
  const [view, setView] = useState<"list" | "practice">("list");
  const metronomeRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (metronomeRef.current) clearInterval(metronomeRef.current);
    };
  }, []);

  const startMetronome = () => {
    if (isMetronomeActive) {
      if (metronomeRef.current) clearInterval(metronomeRef.current);
      setIsMetronomeActive(false);
      return;
    }

    setIsMetronomeActive(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const beatInterval = (60 / bpm) * 1000;
    let beatCount = 0;

    metronomeRef.current = setInterval(() => {
      beatCount++;
      if (beatCount > 4) beatCount = 1;

      if (beatCount === 1) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }, beatInterval);
  };

  const selectRhythm = (rhythm: Rhythm) => {
    setSelectedRhythm(rhythm);
    setBpm(rhythm.bpm);
    setLevel(rhythm.level);
    setView("practice");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const renderRhythmItem = ({ item }: { item: Rhythm }) => (
    <Pressable
      onPress={() => selectRhythm(item)}
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
      className="bg-surface rounded-lg p-4 mb-3 flex-row items-center gap-3"
    >
      <View
        className={`w-12 h-12 rounded-lg items-center justify-center ${
          item.level === 1
            ? "bg-success/10"
            : item.level === 2
              ? "bg-warning/10"
              : "bg-error/10"
        }`}
      >
        <IconSymbol name="music.note" size={24} color={colors.primary} />
      </View>
      <View className="flex-1">
        <Text className="text-foreground font-semibold">{item.name}</Text>
        <Text className="text-muted text-xs">{item.description}</Text>
        <View className="flex-row gap-2 mt-1">
          <Text className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
            Nivel {item.level}
          </Text>
          <Text className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded">
            {item.bpm} BPM
          </Text>
        </View>
      </View>
      <IconSymbol name="chevron.right" size={20} color={colors.muted} />
    </Pressable>
  );

  if (view === "practice" && selectedRhythm) {
    return (
      <ScreenContainer className="p-0">
        {/* Header */}
        <View className="bg-primary px-6 pt-6 pb-4 flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-2xl font-bold text-white">{selectedRhythm.name}</Text>
            <Text className="text-white/70 text-sm">{selectedRhythm.description}</Text>
          </View>
          <Pressable
            onPress={() => {
              setView("list");
              if (isMetronomeActive) startMetronome();
            }}
            className="p-2"
          >
            <IconSymbol name="xmark" size={24} color="white" />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1 px-6 py-6">
          {/* Pattern Display */}
          <View className="bg-surface rounded-2xl p-6 mb-6">
            <Text className="text-muted text-sm mb-3">Patrón</Text>
            <View className="bg-primary/10 rounded-lg p-4 mb-4">
              <Text className="text-foreground text-2xl font-mono font-bold text-center">
                {selectedRhythm.pattern}
              </Text>
            </View>
            <Text className="text-muted text-xs">
              Sigue este patrón mientras practicas
            </Text>
          </View>

          {/* BPM Control */}
          <View className="bg-surface rounded-2xl p-6 mb-6">
            <Text className="text-muted text-sm mb-4">Velocidad (BPM)</Text>
            <View className="flex-row items-center justify-between mb-4">
              <Pressable
                onPress={() => setBpm(Math.max(40, bpm - 10))}
                className="bg-primary/10 rounded-lg p-3"
              >
                <IconSymbol name="minus" size={20} color={colors.primary} />
              </Pressable>
              <Text className="text-4xl font-bold text-foreground">{bpm}</Text>
              <Pressable
                onPress={() => setBpm(Math.min(200, bpm + 10))}
                className="bg-primary/10 rounded-lg p-3"
              >
                <IconSymbol name="plus" size={20} color={colors.primary} />
              </Pressable>
            </View>
            <View className="flex-row gap-2">
              {[60, 80, 100, 120, 140].map((speed) => (
                <Pressable
                  key={speed}
                  onPress={() => setBpm(speed)}
                  style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                  className={`flex-1 py-2 rounded-lg ${
                    bpm === speed
                      ? "bg-primary"
                      : "bg-border"
                  }`}
                >
                  <Text
                    className={`text-center text-sm font-semibold ${
                      bpm === speed ? "text-white" : "text-foreground"
                    }`}
                  >
                    {speed}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Level Control */}
          <View className="bg-surface rounded-2xl p-6 mb-6">
            <Text className="text-muted text-sm mb-4">Nivel de Dificultad</Text>
            <View className="flex-row gap-2">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <Pressable
                  key={lvl}
                  onPress={() => setLevel(lvl as 1 | 2 | 3 | 4 | 5)}
                  style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                  className={`flex-1 py-3 rounded-lg ${
                    level === lvl
                      ? "bg-primary"
                      : "bg-border"
                  }`}
                >
                  <Text
                    className={`text-center font-semibold ${
                      level === lvl ? "text-white" : "text-foreground"
                    }`}
                  >
                    {lvl}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Metronome Button */}
          <Pressable
            onPress={startMetronome}
            style={({ pressed }) => [
              {
                backgroundColor: isMetronomeActive ? colors.error : colors.primary,
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              },
            ]}
            className="rounded-full py-4 items-center justify-center mb-6"
          >
            <View className="flex-row items-center gap-2">
              <IconSymbol
                name={isMetronomeActive ? "pause.fill" : "play.fill"}
                size={24}
                color="white"
              />
              <Text className="text-white font-semibold text-lg">
                {isMetronomeActive ? "Pausar Metrónomo" : "Iniciar Metrónomo"}
              </Text>
            </View>
          </Pressable>

          {/* Recording Button */}
          <Pressable
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              },
            ]}
            className="rounded-full py-4 items-center justify-center border-2 border-primary"
          >
            <View className="flex-row items-center gap-2">
              <IconSymbol name="mic.fill" size={24} color={colors.primary} />
              <Text className="text-primary font-semibold text-lg">
                Grabar Práctica
              </Text>
            </View>
          </Pressable>
        </ScrollView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-0">
      {/* Header */}
      <View className="bg-primary px-6 pt-6 pb-4">
        <Text className="text-2xl font-bold text-white mb-2">Practicar</Text>
        <Text className="text-white/70 text-sm">
          Selecciona un ritmo para comenzar
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        {/* Rhythm Categories */}
        <View className="px-6 py-6">
          {/* Basic Rhythms */}
          <Text className="text-lg font-semibold text-foreground mb-3">Toques Básicos</Text>
          <FlatList
            data={rhythms.filter((r) => r.type === "basic")}
            renderItem={renderRhythmItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            className="mb-6"
          />

          {/* Intermediate Rhythms */}
          <Text className="text-lg font-semibold text-foreground mb-3">Ritmos Intermedios</Text>
          <FlatList
            data={rhythms.filter((r) => r.type === "intermediate")}
            renderItem={renderRhythmItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
