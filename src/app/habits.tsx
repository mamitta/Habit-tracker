import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  FlatList,
  Alert
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '../components/Button';
import { useHabitStore } from '../../store/habit-store';
import { HabitFrequency} from '../components/frequency-picker';


// Function to check if a habit is due today
const isHabitDueToday = (frequency: HabitFrequency, lastCompleted?: Date): boolean => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

  switch (frequency.type) {
    case 'daily':
      return true; // Daily habits are always due

    case 'weekly':
      if (!frequency.days || frequency.days.length === 0) {
        return false;
      }
      // Check if today is one of the selected days
      return frequency.days.includes(dayOfWeek);

    case 'custom':
      if (!frequency.interval || !lastCompleted) {
        return true; // If no last completed date, assume it's due
      }
      
      // Calculate days since last completion
      const timeDiff = today.getTime() - lastCompleted.getTime();
      const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      
      // Check if enough days have passed based on the interval
      return daysDiff >= frequency.interval;

    default:
      return true;
  }
};

// Function to filter habits that are due today
const getHabitsDueToday = (habits: any[]): any[] => {
  return habits.filter(habit => {
    if (!habit.frequency) {
      return true; // If no frequency is set, show the habit (for backward compatibility)
    }
    
    return isHabitDueToday(habit.frequency, habit.lastCompleted);
  });
};


const CategoryDetailScreen: React.FC = () => {
  const params = useLocalSearchParams();
  const { categoryId, categoryTitle, categoryColor, categoryBgColor } = params;
  
  // Zustand store hooks...
  const { 
    getHabitsByCategory, 
    toggleHabitCompletion, 
    deleteHabit,
    getCategoryProgress 
  } = useHabitStore();

  

  // Getting habits for current the category
  const categoryHabits = getHabitsByCategory(categoryId as string);
  const dueHabits = getHabitsDueToday(categoryHabits);
  const progress = getCategoryProgress(categoryId as string);

  // Navigate to add habit screen with the category details
  const handleAddHabit = () => {
    router.push({
      pathname: '/add-habit',
      params: {
        categoryId,
        categoryTitle,
        categoryColor,
        categoryBgColor
      }
    });
  };

  // Handle habit deletion with confirmation
  const handleDeleteHabit = (habitId: string, habitTitle: string) => {
    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${habitTitle}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteHabit(habitId)
        },
      ]
    );
  };

  //  individual habit items
  const renderHabitItem = ({ item }: { item: any }) => (
    <View className={`p-4 rounded-xl border-2 mb-4 ${categoryBgColor} border-current`}>
      <View className="flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => toggleHabitCompletion(item.id)}
          className="flex-1 mr-4"
          activeOpacity={0.7}
        >
          <Text 
            className={`text-lg font-semibold mb-1 ${categoryColor} ${
              item.completed ? 'line-through opacity-60' : ''
            }`}
          >
            {item.title}
          </Text>
          {item.description && (
            <Text 
              className={`text-sm text-gray-600 ${
                item.completed ? 'line-through opacity-60' : ''
              }`}
            >
              {item.description}
            </Text>
          )}
          <Text className="text-xs text-gray-400 mt-1">
            Added {item.createdAt.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
        
        <View className="flex-row items-center space-x-3">

          

          {/* Completion checkbox */}
          <TouchableOpacity
            onPress={() => toggleHabitCompletion(item.id)}
            className={`w-8 h-8 rounded-full border-2 items-center justify-center ${
              item.completed 
                ? `${categoryColor?.toString().replace('text-', 'bg-')} border-gray-400`
                : 'border-gray-400'
            }`}
          >
            {item.completed && (
              <Text className="text-gray text-sm font-bold">✓</Text>
            )}
          </TouchableOpacity>
          
          {/* Delete button */}
          <TouchableOpacity
            onPress={() => handleDeleteHabit(item.id, item.title)}
            className="w-8 h-8 rounded-lg bg-red-100 items-center justify-center"
          >
            <Text className="text-red-600 text-sm font-bold">Dlt</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="px-6 pt-16 pb-8">
    
          <Text className="text-3xl font-bold text-gray-800 mb-2">
            {categoryTitle} Wins
          </Text>
          
          <Text className="text-gray-600 mb-8">
            Track your daily {categoryTitle?.toString().toLowerCase()} achievements
          </Text>

          {/* Progress Summary */}
          {progress.total > 0 && (
            <View className="mb-6 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
              <Text className="text-lg font-semibold text-gray-800 mb-2">
                Todays Progress
              </Text>
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-gray-600">
                  {progress.completed} of {progress.total} completed
                </Text>
                <Text className={`font-bold text-xl ${categoryColor}`}>
                  {progress.percentage}%
                </Text>
              </View>
              
              {/* Progress Bar */}
              <View className="bg-gray-200 rounded-full h-3">
                <View 
                  className={`h-3 rounded-full ${categoryColor?.toString().replace('text-', 'bg-')}`}
                  style={{ width: `${progress.percentage}%` }}
                />
              </View>
            </View>
          )}

          {/* Habits List */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-bold text-gray-700">
                Habits Due Today
              </Text>
              <Text className="text-sm text-gray-500">
                {dueHabits.length} {dueHabits.length === 1 ? 'habit' : 'habits'}
                {categoryHabits.length !== dueHabits.length && (
                  <Text className="text-xs text-gray-400">
                    {' '}({categoryHabits.length - dueHabits.length} not due)
                  </Text>
                )}
              </Text>
            </View>


            {/* When habits creation is fresh and there are no habits yet*/}
            {categoryHabits.length === 0 ? (
              <View className="items-center py-12 px-4">
                
                <Text className="text-gray-500 text-lg mb-2 text-center">
                  No {categoryTitle?.toString().toLowerCase()} habits yet. 
                  Add your first habit to start tracking your wins!
                </Text>
                
              </View>
                
            ) : (
              <FlatList
                data={dueHabits}
                renderItem={renderHabitItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>

            {/* Motivational Section */}
          {progress.total > 0 && (
            <View className={`mt-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm${categoryBgColor} border-current`}>
              <Text className={`text-lg font-semibold mb-2 ${categoryColor}`}>
                {progress.percentage === 100 ? 'Perfect! ' : 'Keep it up!'}
              </Text>
              <Text className="text-gray-600">
                {progress.percentage === 100
                  ? "You've completed all your habits today!"
                  : `You're ${progress.percentage}% there! ${progress.total - progress.completed} more to go.`
                }
              </Text>
            </View>
          )}

          {/* Add Habit Button */}
          <Button
            title={`Add ${categoryTitle} Habit`}
            onPress={handleAddHabit}
            className="mb-4 mt-8"
          />

        
          
        </View>
      </ScrollView>
    </View>
  );
};

export default CategoryDetailScreen;

