/**
 * Servicio de estadísticas y seguimiento de progreso
 */

export interface PracticeSession {
  id: string;
  rhythmId: string;
  rhythmName: string;
  date: Date;
  duration: number; // en segundos
  score: number; // 0-100
  accuracy: number; // 0-100
  timingAccuracy: number; // 0-100
  bpm: number;
  level: number;
}

export interface RhythmStatistics {
  rhythmId: string;
  rhythmName: string;
  totalSessions: number;
  averageScore: number;
  bestScore: number;
  lastPracticed: Date | null;
  totalPracticeTime: number; // en segundos
  trend: number; // -1, 0, 1 (mejorando, estable, empeorando)
  sessions: PracticeSession[];
}

export interface OverallStatistics {
  totalSessions: number;
  totalPracticeTime: number;
  averageScore: number;
  bestScore: number;
  rhythmsCount: number;
  lastPracticed: Date | null;
  rhythmStats: RhythmStatistics[];
}

/**
 * Calcula estadísticas de un ritmo específico
 */
export function calculateRhythmStatistics(
  sessions: PracticeSession[],
  rhythmId: string
): RhythmStatistics {
  const rhythmSessions = sessions.filter((s) => s.rhythmId === rhythmId);

  if (rhythmSessions.length === 0) {
    return {
      rhythmId,
      rhythmName: 'Desconocido',
      totalSessions: 0,
      averageScore: 0,
      bestScore: 0,
      lastPracticed: null,
      totalPracticeTime: 0,
      trend: 0,
      sessions: [],
    };
  }

  const scores = rhythmSessions.map((s) => s.score);
  const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  const bestScore = Math.max(...scores);
  const totalPracticeTime = rhythmSessions.reduce((sum, s) => sum + s.duration, 0);
  const lastPracticed = new Date(
    Math.max(...rhythmSessions.map((s) => new Date(s.date).getTime()))
  );

  // Calcular tendencia (últimas 5 sesiones)
  const recentSessions = rhythmSessions.slice(-5);
  let trend = 0;
  if (recentSessions.length >= 2) {
    const oldAvg = recentSessions.slice(0, Math.floor(recentSessions.length / 2))
      .reduce((sum, s) => sum + s.score, 0) / Math.floor(recentSessions.length / 2);
    const newAvg = recentSessions.slice(Math.floor(recentSessions.length / 2))
      .reduce((sum, s) => sum + s.score, 0) / Math.ceil(recentSessions.length / 2);

    if (newAvg > oldAvg + 5) trend = 1; // Mejorando
    else if (newAvg < oldAvg - 5) trend = -1; // Empeorando
  }

  return {
    rhythmId,
    rhythmName: rhythmSessions[0].rhythmName,
    totalSessions: rhythmSessions.length,
    averageScore,
    bestScore,
    lastPracticed,
    totalPracticeTime,
    trend,
    sessions: rhythmSessions,
  };
}

/**
 * Calcula estadísticas generales
 */
export function calculateOverallStatistics(
  sessions: PracticeSession[]
): OverallStatistics {
  if (sessions.length === 0) {
    return {
      totalSessions: 0,
      totalPracticeTime: 0,
      averageScore: 0,
      bestScore: 0,
      rhythmsCount: 0,
      lastPracticed: null,
      rhythmStats: [],
    };
  }

  const scores = sessions.map((s) => s.score);
  const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  const bestScore = Math.max(...scores);
  const totalPracticeTime = sessions.reduce((sum, s) => sum + s.duration, 0);
  const lastPracticed = new Date(
    Math.max(...sessions.map((s) => new Date(s.date).getTime()))
  );

  // Obtener ritmos únicos
  const uniqueRhythms = [...new Set(sessions.map((s) => s.rhythmId))];
  const rhythmStats = uniqueRhythms.map((rhythmId) =>
    calculateRhythmStatistics(sessions, rhythmId)
  );

  return {
    totalSessions: sessions.length,
    totalPracticeTime,
    averageScore,
    bestScore,
    rhythmsCount: uniqueRhythms.length,
    lastPracticed,
    rhythmStats,
  };
}

/**
 * Genera datos para gráfico de progreso en el tiempo
 */
export function generateProgressChartData(
  sessions: PracticeSession[],
  rhythmId?: string
) {
  let filteredSessions = sessions;
  if (rhythmId) {
    filteredSessions = sessions.filter((s) => s.rhythmId === rhythmId);
  }

  // Agrupar por fecha
  const grouped: { [key: string]: PracticeSession[] } = {};
  filteredSessions.forEach((session) => {
    const date = new Date(session.date).toISOString().split('T')[0];
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(session);
  });

  // Convertir a datos de gráfico
  const chartData = Object.entries(grouped)
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([date, daySessions]) => ({
      date,
      averageScore: daySessions.reduce((sum, s) => sum + s.score, 0) / daySessions.length,
      maxScore: Math.max(...daySessions.map((s) => s.score)),
      minScore: Math.min(...daySessions.map((s) => s.score)),
      sessionsCount: daySessions.length,
    }));

  return chartData;
}

/**
 * Genera datos para gráfico de comparación de ritmos
 */
export function generateRhythmComparisonData(
  sessions: PracticeSession[]
) {
  const stats = calculateOverallStatistics(sessions);

  return stats.rhythmStats
    .sort((a, b) => b.totalSessions - a.totalSessions)
    .map((stat) => ({
      name: stat.rhythmName,
      averageScore: stat.averageScore,
      bestScore: stat.bestScore,
      totalSessions: stat.totalSessions,
      trend: stat.trend,
    }));
}

/**
 * Genera datos para gráfico de distribución de niveles
 */
export function generateLevelDistributionData(
  sessions: PracticeSession[]
) {
  const distribution: { [key: number]: number } = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  sessions.forEach((session) => {
    distribution[session.level as keyof typeof distribution]++;
  });

  return [
    { level: 1, count: distribution[1], label: 'Nivel 1' },
    { level: 2, count: distribution[2], label: 'Nivel 2' },
    { level: 3, count: distribution[3], label: 'Nivel 3' },
    { level: 4, count: distribution[4], label: 'Nivel 4' },
    { level: 5, count: distribution[5], label: 'Nivel 5' },
  ];
}

/**
 * Calcula logros desbloqueables
 */
export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  progress: number; // 0-100
  icon: string;
}

export function calculateAchievements(
  sessions: PracticeSession[]
): Achievement[] {
  const stats = calculateOverallStatistics(sessions);

  return [
    {
      id: 'first-practice',
      name: 'Primer Paso',
      description: 'Completar tu primera sesión de práctica',
      unlocked: sessions.length >= 1,
      progress: sessions.length >= 1 ? 100 : 0,
      icon: '🎵',
    },
    {
      id: 'ten-sessions',
      name: 'Dedicado',
      description: 'Completar 10 sesiones de práctica',
      unlocked: sessions.length >= 10,
      progress: Math.min(100, (sessions.length / 10) * 100),
      icon: '🔥',
    },
    {
      id: 'perfect-score',
      name: 'Perfección',
      description: 'Lograr una puntuación de 100%',
      unlocked: stats.bestScore >= 100,
      progress: stats.bestScore,
      icon: '⭐',
    },
    {
      id: 'high-average',
      name: 'Maestría',
      description: 'Mantener un promedio de 80% o superior',
      unlocked: stats.averageScore >= 80,
      progress: Math.min(100, (stats.averageScore / 80) * 100),
      icon: '👑',
    },
    {
      id: 'all-rhythms',
      name: 'Polifacético',
      description: 'Practicar todos los ritmos disponibles',
      unlocked: stats.rhythmsCount >= 5,
      progress: Math.min(100, (stats.rhythmsCount / 5) * 100),
      icon: '🎭',
    },
    {
      id: 'hour-practice',
      name: 'Maratonista',
      description: 'Acumular 1 hora de práctica total',
      unlocked: stats.totalPracticeTime >= 3600,
      progress: Math.min(100, (stats.totalPracticeTime / 3600) * 100),
      icon: '⏱️',
    },
    {
      id: 'daily-streak',
      name: 'Consistencia',
      description: 'Practicar durante 7 días consecutivos',
      unlocked: false, // Requeriría más lógica
      progress: 0,
      icon: '📅',
    },
    {
      id: 'improvement',
      name: 'En Ascenso',
      description: 'Mejorar tu puntuación en 20 puntos',
      unlocked: sessions.length >= 2 &&
        sessions[sessions.length - 1].score - sessions[0].score >= 20,
      progress: sessions.length >= 2
        ? Math.min(
            100,
            ((sessions[sessions.length - 1].score - sessions[0].score) / 20) * 100
          )
        : 0,
      icon: '📈',
    },
  ];
}

/**
 * Genera resumen de sesión reciente
 */
export function getRecentSessionsSummary(
  sessions: PracticeSession[],
  days: number = 7
) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const recentSessions = sessions.filter(
    (s) => new Date(s.date) >= cutoffDate
  );

  if (recentSessions.length === 0) {
    return {
      sessionsCount: 0,
      totalTime: 0,
      averageScore: 0,
      bestScore: 0,
      message: `No hay sesiones en los últimos ${days} días`,
    };
  }

  const scores = recentSessions.map((s) => s.score);
  const totalTime = recentSessions.reduce((sum, s) => sum + s.duration, 0);

  return {
    sessionsCount: recentSessions.length,
    totalTime,
    averageScore: scores.reduce((a, b) => a + b, 0) / scores.length,
    bestScore: Math.max(...scores),
    message: `${recentSessions.length} sesiones en los últimos ${days} días`,
  };
}

/**
 * Formatea tiempo en segundos a string legible
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  if (seconds < 3600) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}m ${secs}s`;
  }
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${mins}m`;
}
