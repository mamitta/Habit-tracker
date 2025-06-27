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

const CategoryDetailScreen: React.FC = () => {
  const params = useLocalSearchParams();
  const { categoryId, categoryTitle, categoryColor, categoryBgColor } = params;
  
  // Zustand store hooks
  const { 
    getHabitsByCategory, 
    toggleHabitCompletion, 
    deleteHabit,
    getCategoryProgress 
  } = useHabitStore();

  // Get habits for current category
  const categoryHabits = getHabitsByCategory(categoryId as string);
  const progress = getCategoryProgress(categoryId as string);

  // Navigate to add habit screen with category context
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
                ? `${categoryColor?.toString().replace('text-', 'bg-')} border-transparent`
                : 'border-gray-400'
            }`}
          >
            {item.completed && (
              <Text className="text-white text-sm font-bold">✓</Text>
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
        
         {/* Category Title */}
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
                Your Habits
              </Text>
              <Text className="text-sm text-gray-500">
                {progress.total} {progress.total === 1 ? 'habit' : 'habits'}
              </Text>
            </View>
            
            {categoryHabits.length === 0 ? (
              <View className="items-center py-12 px-4">
                <View 
                  className={`w-16 h-16 rounded-full mb-4 items-center justify-center ${categoryBgColor}`}
                >
                  <Text className={`text-2xl ${categoryColor}`}>+</Text>
                </View>
                <Text className="text-gray-500 text-lg mb-2 text-center">
                  No {categoryTitle?.toString().toLowerCase()} habits yet
                </Text>
                <Text className="text-gray-400 text-center">
                  Add your first habit to start tracking your wins!
                </Text>
              </View>
            ) : (
              <FlatList
                data={categoryHabits}
                renderItem={renderHabitItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>

          {/* Add Habit Button */}
          <Button
            title={`Add ${categoryTitle} Habit`}
            onPress={handleAddHabit}
            className="mb-4"
          />

          {/* Motivational Section */}
          {progress.total > 0 && (
            <View className={`mt-6 p-4 rounded-xl border-2 ${categoryBgColor} border-current`}>
              <Text className={`text-lg font-semibold mb-2 ${categoryColor}`}>
                {progress.percentage === 100 ? 'Perfect! ' : 'Keep it up!'}
              </Text>
              <Text className="text-gray-600">
                {progress.percentage === 100
                  ? "Amazing! You've completed all your habits today!"
                  : `You're ${progress.percentage}% there! ${progress.total - progress.completed} more to go.`
                }
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default CategoryDetailScreen;