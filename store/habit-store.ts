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
  frequency: HabitFrequency;
}
// Interface for habit frequency
export interface HabitFrequency {
  type: 'daily' | 'weekly' | 'custom';
  days?: number[]; 
  interval?: number;
}

interface HabitStore {
  habits: Habit[];
  loading: boolean;
  hydrated: boolean;
  
  // Internal action to set hydrated state
  setHydrated: (hydrated: boolean) => void;
  
  // Actions
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt'>) => void;
  updateHabit: (habitId: string, updates: Partial<Habit>) => void;
  deleteHabit: (habitId: string) => void;
  toggleHabitCompletion: (habitId: string) => void;
  getHabitsByCategory: (categoryId: string) => Habit[];
  clearAllHabits: () => void;
  
  getHabitsForToday: () => Habit[];
  isHabitDueToday: (habit: Habit) => boolean;

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
      hydrated: false,

      // Set hydrated state
      setHydrated: (hydrated) => {
        set({ hydrated });
      },

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

      // Check if a habit is due today based on its frequency

      isHabitDueToday: (habit) => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        
        switch (habit.frequency.type) {
          case 'daily':
            return true;
          case 'weekly':
            return habit.frequency.days?.includes(dayOfWeek) || false;
          case 'custom':
            if (!habit.frequency.interval) return false;
            const daysSinceCreated = Math.floor(
              (today.getTime() - habit.createdAt.getTime()) / (1000 * 60 * 60 * 24)
            );
            return daysSinceCreated % habit.frequency.interval === 0;
          default:
            return true;
        }
      },

      // Get habits that are due today
      getHabitsForToday: () => {
        return get().habits.filter((habit) => get().isHabitDueToday(habit));
      },


      // Get habits filtered by category
      getHabitsByCategory: (categoryId) => {
        return get().habits.filter((habit) => habit.categoryId === categoryId);
      },

      // Clear all habits 
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
      name: 'habit-storage',
      storage: createJSONStorage(() => AsyncStorage),
      
      // using merge instead to handle Date conversion during rehydration
      merge: (persistedState, currentState) => {
        // Check if persistedState exists and is an object
        if (!persistedState || typeof persistedState !== 'object') {
          return currentState;
        }

        const persisted = persistedState as any;
        
        // Convert date strings back to Date objects... if ignored, createdAt and completedAt will be strings which translates to errors.
        
        const convertedHabits = Array.isArray(persisted.habits) 
          ? persisted.habits.map((habit: any) => ({
              ...habit,
              createdAt: typeof habit.createdAt === 'string' 
                ? new Date(habit.createdAt) 
                : habit.createdAt || new Date(),
              completedAt: habit.completedAt && typeof habit.completedAt === 'string'
                ? new Date(habit.completedAt)
                : habit.completedAt,
            }))
          : [];

        return {
          ...currentState,
          habits: convertedHabits,
         
        };
      },

      

      // Handle rehydration
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.error('Failed to rehydrate habit store:', error);
          } else {
            
            // Set hydrated to true after successful rehydration
            state?.setHydrated(true);
          }
        };
      },

      
      partialize: (state) => ({
        habits: state.habits,
      }),
    }
  )
);

// Hook to check if store is hydrated (useful for conditional rendering)
export const useHabitStoreHydrated = () => {
  return useHabitStore((state) => state.hydrated);
};


export const getFrequencyText = (frequency: HabitFrequency): string => {
  switch (frequency.type) {
    case 'daily':
      return 'Every day';
    case 'weekly':
      if (frequency.days?.length === 1) {
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return `Every ${dayNames[frequency.days[0]]}`;
      } else if (frequency.days?.length) {
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const selectedDays = frequency.days.map(day => dayNames[day]).join(', ');
        return selectedDays;
      }
      return 'Weekly';
    case 'custom':
      return `Every ${frequency.interval} days`;
    default:
      return 'Daily';
  }



}


//REMINDER: what does not kill me just almost makes me stronger. damn