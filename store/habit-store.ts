// stores/habitStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Habit {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  categoryId: string;
  createdAt: Date;
  completedAt?: Date;
}

interface HabitStore {
  habits: Habit[];
  loading: boolean;
  
  // Actions
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt'>) => void;
  updateHabit: (habitId: string, updates: Partial<Habit>) => void;
  deleteHabit: (habitId: string) => void;
  toggleHabitCompletion: (habitId: string) => void;
  getHabitsByCategory: (categoryId: string) => Habit[];
  clearAllHabits: () => void;
  
  // Computed values
  getTotalHabits: () => number;
  getCompletedHabits: () => number;
  getCategoryProgress: (categoryId: string) => { completed: number; total: number; percentage: number };
}

export const useHabitStore = create<HabitStore>()(
  persist(
    (set, get) => ({
      habits: [],
      loading: false,

      // Add a new habit
      addHabit: (habitData) => {
        const newHabit: Habit = {
          ...habitData,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          createdAt: new Date(),
        };
        
        set((state) => ({
          habits: [...state.habits, newHabit],
        }));
      },

      // Update an existing habit
      updateHabit: (habitId, updates) => {
        set((state) => ({
          habits: state.habits.map((habit) =>
            habit.id === habitId ? { ...habit, ...updates } : habit
          ),
        }));
      },

      // Delete a habit
      deleteHabit: (habitId) => {
        set((state) => ({
          habits: state.habits.filter((habit) => habit.id !== habitId),
        }));
      },

      // Toggle habit completion status
      toggleHabitCompletion: (habitId) => {
        set((state) => ({
          habits: state.habits.map((habit) =>
            habit.id === habitId
              ? {
                  ...habit,
                  completed: !habit.completed,
                  completedAt: !habit.completed ? new Date() : undefined,
                }
              : habit
          ),
        }));
      },

      // Get habits filtered by category
      getHabitsByCategory: (categoryId) => {
        return get().habits.filter((habit) => habit.categoryId === categoryId);
      },

      // Clear all habits (useful for testing or reset functionality)
      clearAllHabits: () => {
        set({ habits: [] });
      },

      // Get total number of habits
      getTotalHabits: () => {
        return get().habits.length;
      },

      // Get total completed habits
      getCompletedHabits: () => {
        return get().habits.filter((habit) => habit.completed).length;
      },

      // Get progress for a specific category
      getCategoryProgress: (categoryId) => {
        const categoryHabits = get().getHabitsByCategory(categoryId);
        const completed = categoryHabits.filter((habit) => habit.completed).length;
        const total = categoryHabits.length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        return { completed, total, percentage };
      },
    }),
    {
      name: 'habit-storage', // Storage key
      storage: createJSONStorage(() => AsyncStorage),
      
      // Custom serialization to handle Date objects
      serialize: (state) => {
        return JSON.stringify({
          ...state,
          state: {
            ...state.state,
            habits: state.state.habits.map((habit: Habit) => ({
              ...habit,
              createdAt: habit.createdAt.toISOString(),
              completedAt: habit.completedAt?.toISOString(),
            })),
          },
        });
      },
      
      // Custom deserialization to convert date strings back to Date objects
      deserialize: (str) => {
        const parsed = JSON.parse(str);
        return {
          ...parsed,
          state: {
            ...parsed.state,
            habits: parsed.state.habits.map((habit: any) => ({
              ...habit,
              createdAt: new Date(habit.createdAt),
              completedAt: habit.completedAt ? new Date(habit.completedAt) : undefined,
            })),
          },
        };
      },
    }
  )
);