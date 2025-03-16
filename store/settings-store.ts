import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'system';

interface SettingsState {
  themeMode: ThemeMode;
  showCompletedTasks: boolean;
  defaultView: 'list' | 'board' | 'calendar';
  defaultSortBy: 'dueDate' | 'priority' | 'createdAt' | 'title';
  defaultSortOrder: 'asc' | 'desc';
  userName: string;
  
  // Theme actions
  setThemeMode: (mode: ThemeMode) => void;
  
  // View preferences
  setShowCompletedTasks: (show: boolean) => void;
  setDefaultView: (view: 'list' | 'board' | 'calendar') => void;
  setDefaultSortBy: (sortBy: 'dueDate' | 'priority' | 'createdAt' | 'title') => void;
  setDefaultSortOrder: (order: 'asc' | 'desc') => void;
  
  // User preferences
  setUserName: (name: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      themeMode: 'light',
      showCompletedTasks: true,
      defaultView: 'list',
      defaultSortBy: 'dueDate',
      defaultSortOrder: 'asc',
      userName: '',
      
      // Theme actions
      setThemeMode: (mode) => set({ themeMode: mode }),
      
      // View preferences
      setShowCompletedTasks: (show) => set({ showCompletedTasks: show }),
      setDefaultView: (view) => set({ defaultView: view }),
      setDefaultSortBy: (sortBy) => set({ defaultSortBy: sortBy }),
      setDefaultSortOrder: (order) => set({ defaultSortOrder: order }),
      
      // User preferences
      setUserName: (name) => set({ userName: name }),
    }),
    {
      name: 'settings-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);