import React, { createContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Song, Recording, ClassSession, Rhythm, AppSettings, PracticeSession, PracticeStats } from './types';
import { initializeSampleData } from './sample-data';

interface StorageState {
  songs: Song[];
  recordings: Recording[];
  classSessions: ClassSession[];
  rhythms: Rhythm[];
  practiceStats: PracticeStats[];
  settings: AppSettings;
  isLoading: boolean;
  error: string | null;
}

type StorageAction =
  | { type: 'SET_SONGS'; payload: Song[] }
  | { type: 'ADD_SONG'; payload: Song }
  | { type: 'UPDATE_SONG'; payload: Song }
  | { type: 'DELETE_SONG'; payload: string }
  | { type: 'SET_RECORDINGS'; payload: Recording[] }
  | { type: 'ADD_RECORDING'; payload: Recording }
  | { type: 'DELETE_RECORDING'; payload: string }
  | { type: 'SET_CLASS_SESSIONS'; payload: ClassSession[] }
  | { type: 'ADD_CLASS_SESSION'; payload: ClassSession }
  | { type: 'UPDATE_CLASS_SESSION'; payload: ClassSession }
  | { type: 'SET_RHYTHMS'; payload: Rhythm[] }
  | { type: 'SET_PRACTICE_STATS'; payload: PracticeStats[] }
  | { type: 'UPDATE_PRACTICE_STATS'; payload: PracticeStats }
  | { type: 'SET_SETTINGS'; payload: AppSettings }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const defaultSettings: AppSettings = {
  theme: 'auto',
  microphoneVolume: 1,
  recordingQuality: 'high',
  hapticFeedback: true,
  soundEnabled: true,
};

const initialState: StorageState = {
  songs: [],
  recordings: [],
  classSessions: [],
  rhythms: [],
  practiceStats: [],
  settings: defaultSettings,
  isLoading: true,
  error: null,
};

function storageReducer(state: StorageState, action: StorageAction): StorageState {
  switch (action.type) {
    case 'SET_SONGS':
      return { ...state, songs: action.payload };
    case 'ADD_SONG':
      return { ...state, songs: [...state.songs, action.payload] };
    case 'UPDATE_SONG':
      return {
        ...state,
        songs: state.songs.map(s => s.id === action.payload.id ? action.payload : s),
      };
    case 'DELETE_SONG':
      return { ...state, songs: state.songs.filter(s => s.id !== action.payload) };
    case 'SET_RECORDINGS':
      return { ...state, recordings: action.payload };
    case 'ADD_RECORDING':
      return { ...state, recordings: [...state.recordings, action.payload] };
    case 'DELETE_RECORDING':
      return { ...state, recordings: state.recordings.filter(r => r.id !== action.payload) };
    case 'SET_CLASS_SESSIONS':
      return { ...state, classSessions: action.payload };
    case 'ADD_CLASS_SESSION':
      return { ...state, classSessions: [...state.classSessions, action.payload] };
    case 'UPDATE_CLASS_SESSION':
      return {
        ...state,
        classSessions: state.classSessions.map(c => c.id === action.payload.id ? action.payload : c),
      };
    case 'SET_RHYTHMS':
      return { ...state, rhythms: action.payload };
    case 'SET_PRACTICE_STATS':
      return { ...state, practiceStats: action.payload };
    case 'UPDATE_PRACTICE_STATS':
      return {
        ...state,
        practiceStats: state.practiceStats.map(s => s.rhythmId === action.payload.rhythmId ? action.payload : s),
      };
    case 'SET_SETTINGS':
      return { ...state, settings: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

interface StorageContextType extends StorageState {
  addSong: (song: Song) => Promise<void>;
  updateSong: (song: Song) => Promise<void>;
  deleteSong: (id: string) => Promise<void>;
  addRecording: (recording: Recording) => Promise<void>;
  deleteRecording: (id: string) => Promise<void>;
  addClassSession: (session: ClassSession) => Promise<void>;
  updateClassSession: (session: ClassSession) => Promise<void>;
  updateSettings: (settings: AppSettings) => Promise<void>;
  updatePracticeStats: (stats: PracticeStats) => Promise<void>;
  loadAllData: () => Promise<void>;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

export function StorageProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(storageReducer, initialState);

  // Cargar datos al montar
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const [songs, recordings, classSessions, rhythms, practiceStats, settings] = await Promise.all([
        AsyncStorage.getItem('songs').then(data => {
          if (data) return JSON.parse(data);
          // Cargar datos de ejemplo si no hay datos guardados
          const sampleData = initializeSampleData();
          return sampleData.songs;
        }),
        AsyncStorage.getItem('recordings').then(data => {
          if (data) return JSON.parse(data);
          const sampleData = initializeSampleData();
          return sampleData.recordings;
        }),
        AsyncStorage.getItem('classSessions').then(data => {
          if (data) return JSON.parse(data);
          const sampleData = initializeSampleData();
          return sampleData.classSessions;
        }),
        AsyncStorage.getItem('rhythms').then(data => data ? JSON.parse(data) : []),
        AsyncStorage.getItem('practiceStats').then(data => data ? JSON.parse(data) : []),
        AsyncStorage.getItem('settings').then(data => data ? JSON.parse(data) : defaultSettings),
      ]);

      dispatch({ type: 'SET_SONGS', payload: songs });
      dispatch({ type: 'SET_RECORDINGS', payload: recordings });
      dispatch({ type: 'SET_CLASS_SESSIONS', payload: classSessions });
      dispatch({ type: 'SET_RHYTHMS', payload: rhythms });
      dispatch({ type: 'SET_PRACTICE_STATS', payload: practiceStats });
      dispatch({ type: 'SET_SETTINGS', payload: settings });
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Error al cargar datos' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addSong = async (song: Song) => {
    try {
      dispatch({ type: 'ADD_SONG', payload: song });
      const updated = [...state.songs, song];
      await AsyncStorage.setItem('songs', JSON.stringify(updated));
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Error al guardar canción' });
    }
  };

  const updateSong = async (song: Song) => {
    try {
      dispatch({ type: 'UPDATE_SONG', payload: song });
      const updated = state.songs.map(s => s.id === song.id ? song : s);
      await AsyncStorage.setItem('songs', JSON.stringify(updated));
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Error al actualizar canción' });
    }
  };

  const deleteSong = async (id: string) => {
    try {
      dispatch({ type: 'DELETE_SONG', payload: id });
      const updated = state.songs.filter(s => s.id !== id);
      await AsyncStorage.setItem('songs', JSON.stringify(updated));
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Error al eliminar canción' });
    }
  };

  const addRecording = async (recording: Recording) => {
    try {
      dispatch({ type: 'ADD_RECORDING', payload: recording });
      const updated = [...state.recordings, recording];
      await AsyncStorage.setItem('recordings', JSON.stringify(updated));
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Error al guardar grabación' });
    }
  };

  const deleteRecording = async (id: string) => {
    try {
      dispatch({ type: 'DELETE_RECORDING', payload: id });
      const updated = state.recordings.filter(r => r.id !== id);
      await AsyncStorage.setItem('recordings', JSON.stringify(updated));
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Error al eliminar grabación' });
    }
  };

  const addClassSession = async (session: ClassSession) => {
    try {
      dispatch({ type: 'ADD_CLASS_SESSION', payload: session });
      const updated = [...state.classSessions, session];
      await AsyncStorage.setItem('classSessions', JSON.stringify(updated));
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Error al guardar sesión de clase' });
    }
  };

  const updateClassSession = async (session: ClassSession) => {
    try {
      dispatch({ type: 'UPDATE_CLASS_SESSION', payload: session });
      const updated = state.classSessions.map(c => c.id === session.id ? session : c);
      await AsyncStorage.setItem('classSessions', JSON.stringify(updated));
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Error al actualizar sesión de clase' });
    }
  };

  const updateSettings = async (settings: AppSettings) => {
    try {
      dispatch({ type: 'SET_SETTINGS', payload: settings });
      await AsyncStorage.setItem('settings', JSON.stringify(settings));
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Error al guardar configuración' });
    }
  };

  const updatePracticeStats = async (stats: PracticeStats) => {
    try {
      dispatch({ type: 'UPDATE_PRACTICE_STATS', payload: stats });
      const updated = state.practiceStats.map(s => s.rhythmId === stats.rhythmId ? stats : s);
      await AsyncStorage.setItem('practiceStats', JSON.stringify(updated));
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Error al guardar estadísticas' });
    }
  };

  const value: StorageContextType = {
    ...state,
    addSong,
    updateSong,
    deleteSong,
    addRecording,
    deleteRecording,
    addClassSession,
    updateClassSession,
    updateSettings,
    updatePracticeStats,
    loadAllData,
  };

  return (
    <StorageContext.Provider value={value}>
      {children}
    </StorageContext.Provider>
  );
}

export function useStorage() {
  const context = React.useContext(StorageContext);
  if (!context) {
    throw new Error('useStorage debe ser usado dentro de StorageProvider');
  }
  return context;
}
