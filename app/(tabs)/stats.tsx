import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { IconSymbol } from '@/components/ui/icon-symbol';
import {
  calculateOverallStatistics,
  generateProgressChartData,
  generateRhythmComparisonData,
  calculateAchievements,
  getRecentSessionsSummary,
  formatDuration,
  type PracticeSession,
} from '@/lib/statistics-service';

// Datos simulados de sesiones de práctica
const SAMPLE_SESSIONS: PracticeSession[] = [
  {
    id: '1',
    rhythmId: 'muineira',
    rhythmName: 'Muiñeira',
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    duration: 1200,
    score: 72,
    accuracy: 75,
    timingAccuracy: 70,
    bpm: 120,
    level: 2,
  },
  {
    id: '2',
    rhythmId: 'jota',
    rhythmName: 'Jota',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    duration: 900,
    score: 78,
    accuracy: 80,
    timingAccuracy: 76,
    bpm: 100,
    level: 1,
  },
  {
    id: '3',
    rhythmId: 'muineira',
    rhythmName: 'Muiñeira',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    duration: 1500,
    score: 85,
    accuracy: 87,
    timingAccuracy: 83,
    bpm: 120,
    level: 3,
  },
  {
    id: '4',
    rhythmId: 'jota',
    rhythmName: 'Jota',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    duration: 1100,
    score: 82,
    accuracy: 84,
    timingAccuracy: 80,
    bpm: 110,
    level: 2,
  },
  {
    id: '5',
    rhythmId: 'muineira',
    rhythmName: 'Muiñeira',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    duration: 1800,
    score: 88,
    accuracy: 90,
    timingAccuracy: 86,
    bpm: 130,
    level: 3,
  },
  {
    id: '6',
    rhythmId: 'jota',
    rhythmName: 'Jota',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    duration: 1300,
    score: 90,
    accuracy: 92,
    timingAccuracy: 88,
    bpm: 120,
    level: 2,
  },
  {
    id: '7',
    rhythmId: 'muineira',
    rhythmName: 'Muiñeira',
    date: new Date(),
    duration: 1600,
    score: 92,
    accuracy: 94,
    timingAccuracy: 90,
    bpm: 140,
    level: 4,
  },
];

export default function StatsScreen() {
  const colors = useColors();
  const [sessions] = useState<PracticeSession[]>(SAMPLE_SESSIONS);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'rhythms' | 'achievements'>('overview');

  const stats = calculateOverallStatistics(sessions);
  const recentSummary = getRecentSessionsSummary(sessions, 7);
  const achievements = calculateAchievements(sessions);
  const rhythmComparison = generateRhythmComparisonData(sessions);

  const getScoreColor = (score: number) => {
    if (score >= 90) return colors.success;
    if (score >= 75) return '#FFA500';
    if (score >= 60) return '#FFD700';
    return colors.error;
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return '📈';
    if (trend < 0) return '📉';
    return '➡️';
  };

  return (
    <ScreenContainer className="p-0">
      {/* Header */}
      <View className="bg-primary px-6 pt-6 pb-4">
        <Text className="text-2xl font-bold text-white mb-2">Mis Estadísticas</Text>
        <Text className="text-white/70 text-sm">
          Sigue tu progreso y mejora tu técnica
        </Text>
      </View>

      {/* Tabs */}
      <View className="flex-row bg-surface border-b border-border">
        {(['overview', 'rhythms', 'achievements'] as const).map((tab) => (
          <Pressable
            key={tab}
            onPress={() => setSelectedTab(tab)}
            className="flex-1 py-4 items-center justify-center"
            style={{
              borderBottomWidth: selectedTab === tab ? 2 : 0,
              borderBottomColor: colors.primary,
            }}
          >
            <Text
              className="font-semibold text-sm"
              style={{
                color: selectedTab === tab ? colors.primary : colors.muted,
              }}
            >
              {tab === 'overview'
                ? 'General'
                : tab === 'rhythms'
                  ? 'Ritmos'
                  : 'Logros'}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="px-6 py-6 gap-6">
          {selectedTab === 'overview' && (
            <>
              {/* Tarjetas de resumen */}
              <View className="gap-3">
                <View
                  className="p-4 rounded-lg gap-2"
                  style={{ backgroundColor: colors.surface }}
                >
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm text-muted">Puntuación Promedio</Text>
                    <Text
                      className="text-2xl font-bold"
                      style={{ color: getScoreColor(stats.averageScore) }}
                    >
                      {Math.round(stats.averageScore)}%
                    </Text>
                  </View>
                </View>

                <View
                  className="p-4 rounded-lg gap-2"
                  style={{ backgroundColor: colors.surface }}
                >
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm text-muted">Mejor Puntuación</Text>
                    <Text
                      className="text-2xl font-bold"
                      style={{ color: colors.success }}
                    >
                      {Math.round(stats.bestScore)}%
                    </Text>
                  </View>
                </View>

                <View
                  className="p-4 rounded-lg gap-2"
                  style={{ backgroundColor: colors.surface }}
                >
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm text-muted">Tiempo Total</Text>
                    <Text className="text-2xl font-bold text-foreground">
                      {formatDuration(stats.totalPracticeTime)}
                    </Text>
                  </View>
                </View>

                <View
                  className="p-4 rounded-lg gap-2"
                  style={{ backgroundColor: colors.surface }}
                >
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm text-muted">Total de Sesiones</Text>
                    <Text className="text-2xl font-bold text-foreground">
                      {stats.totalSessions}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Resumen de últimos 7 días */}
              <View
                className="p-4 rounded-lg gap-3"
                style={{ backgroundColor: colors.surface }}
              >
                <Text className="text-sm font-semibold text-foreground">
                  Últimos 7 Días
                </Text>
                <View className="gap-2">
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-muted">Sesiones:</Text>
                    <Text className="text-sm font-semibold text-foreground">
                      {recentSummary.sessionsCount}
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-muted">Tiempo:</Text>
                    <Text className="text-sm font-semibold text-foreground">
                      {formatDuration(recentSummary.totalTime)}
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-muted">Promedio:</Text>
                    <Text
                      className="text-sm font-semibold"
                      style={{ color: getScoreColor(recentSummary.averageScore) }}
                    >
                      {Math.round(recentSummary.averageScore)}%
                    </Text>
                  </View>
                </View>
              </View>

              {/* Últimas sesiones */}
              <View
                className="p-4 rounded-lg gap-3"
                style={{ backgroundColor: colors.surface }}
              >
                <Text className="text-sm font-semibold text-foreground">
                  Últimas Sesiones
                </Text>
                {sessions.slice(-5).reverse().map((session) => (
                  <View
                    key={session.id}
                    className="flex-row items-center justify-between py-2 border-b border-border"
                  >
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-foreground">
                        {session.rhythmName}
                      </Text>
                      <Text className="text-xs text-muted">
                        {new Date(session.date).toLocaleDateString('es-ES')} •{' '}
                        {formatDuration(session.duration)}
                      </Text>
                    </View>
                    <View
                      className="px-3 py-1 rounded-full"
                      style={{
                        backgroundColor: getScoreColor(session.score),
                      }}
                    >
                      <Text className="text-xs font-bold text-white">
                        {Math.round(session.score)}%
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}

          {selectedTab === 'rhythms' && (
            <>
              <View
                className="p-4 rounded-lg gap-3"
                style={{ backgroundColor: colors.surface }}
              >
                <Text className="text-sm font-semibold text-foreground mb-2">
                  Comparación de Ritmos
                </Text>
                {rhythmComparison.map((rhythm) => (
                  <View key={rhythm.name} className="gap-2 pb-3 border-b border-border">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1">
                        <View className="flex-row items-center gap-2">
                          <Text className="text-sm font-semibold text-foreground">
                            {rhythm.name}
                          </Text>
                          <Text className="text-xs text-muted">
                            {rhythm.totalSessions} sesiones
                          </Text>
                        </View>
                        <Text className="text-xs text-muted mt-1">
                          Promedio: {Math.round(rhythm.averageScore)}% • Mejor:{' '}
                          {Math.round(rhythm.bestScore)}%
                        </Text>
                      </View>
                      <Text className="text-lg">{getTrendIcon(rhythm.trend)}</Text>
                    </View>

                    {/* Barra de progreso */}
                    <View className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.border }}>
                      <View
                        style={{
                          height: '100%',
                          backgroundColor: getScoreColor(rhythm.averageScore),
                          width: `${rhythm.averageScore}%`,
                        }}
                      />
                    </View>
                  </View>
                ))}
              </View>

              {/* Distribución por nivel */}
              <View
                className="p-4 rounded-lg gap-3"
                style={{ backgroundColor: colors.surface }}
              >
                <Text className="text-sm font-semibold text-foreground mb-2">
                  Distribución por Nivel
                </Text>
                {[1, 2, 3, 4, 5].map((level) => {
                  const count = sessions.filter((s) => s.level === level).length;
                  const percentage = (count / sessions.length) * 100;
                  return (
                    <View key={level} className="gap-1">
                      <View className="flex-row justify-between">
                        <Text className="text-xs text-muted">Nivel {level}</Text>
                        <Text className="text-xs font-semibold text-foreground">
                          {count} sesiones
                        </Text>
                      </View>
                      <View
                        className="h-2 rounded-full overflow-hidden"
                        style={{ backgroundColor: colors.border }}
                      >
                        <View
                          style={{
                            height: '100%',
                            backgroundColor: colors.primary,
                            width: `${percentage}%`,
                          }}
                        />
                      </View>
                    </View>
                  );
                })}
              </View>
            </>
          )}

          {selectedTab === 'achievements' && (
            <View className="gap-3">
              {achievements.map((achievement) => (
                <View
                  key={achievement.id}
                  className="p-4 rounded-lg gap-3"
                  style={{
                    backgroundColor: achievement.unlocked
                      ? `${colors.primary}20`
                      : colors.surface,
                    borderColor: achievement.unlocked ? colors.primary : colors.border,
                    borderWidth: 1,
                  }}
                >
                  <View className="flex-row items-start gap-3">
                    <Text className="text-3xl">{achievement.icon}</Text>
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-foreground">
                        {achievement.name}
                      </Text>
                      <Text className="text-xs text-muted mt-1">
                        {achievement.description}
                      </Text>
                    </View>
                    {achievement.unlocked && (
                      <View className="bg-success px-2 py-1 rounded">
                        <Text className="text-xs font-bold text-white">✓</Text>
                      </View>
                    )}
                  </View>

                  {/* Barra de progreso */}
                  {!achievement.unlocked && achievement.progress > 0 && (
                    <View className="gap-1">
                      <View
                        className="h-2 rounded-full overflow-hidden"
                        style={{ backgroundColor: colors.border }}
                      >
                        <View
                          style={{
                            height: '100%',
                            backgroundColor: colors.primary,
                            width: `${achievement.progress}%`,
                          }}
                        />
                      </View>
                      <Text className="text-xs text-muted text-right">
                        {Math.round(achievement.progress)}%
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
