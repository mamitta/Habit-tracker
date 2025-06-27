import React, { useState } from 'react';
import { View, Text, TextInput, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '../components/Button';
import { useHabitStore } from '../../store/habit-store';

const AddHabitScreen: React.FC = () => {
  const params = useLocalSearchParams();
  const { categoryId, categoryTitle, } = params;
  
  // Zustand store hook
  const { addHabit } = useHabitStore();
  
  // Form state
  const [habitTitle, setHabitTitle] = useState('');
  const [habitDescription, setHabitDescription] = useState('');

  const handleSaveHabit = () => {
    if (!habitTitle.trim()) {
      Alert.alert('Error', 'Please enter a habit title');
      return;
    }

    // Add habit to store
    addHabit({
      title: habitTitle.trim(),
      description: habitDescription.trim(),
      categoryId: categoryId as string,
      completed: false,
    });

    // Navigate back to category detail
    router.back();
  };

  return (
    <View className="flex-1 bg-gray-50 px-6 pt-16">
      <Text className="text-2xl font-bold text-gray-800 mb-2">
        Add {categoryTitle} Habit
      </Text>
      
      <Text className="text-gray-600 mb-8">
        Create a new habit for your {categoryTitle?.toString().toLowerCase()} routine
      </Text>

      <TextInput
        className="border border-gray-300 rounded-lg p-3 mb-4 text-gray-800 bg-white"
        placeholder="Habit title (e.g., Drink 8 glasses of water)"
        value={habitTitle}
        onChangeText={setHabitTitle}
        maxLength={50}
      />
      
      <TextInput
        className="border border-gray-300 rounded-lg p-3 mb-6 text-gray-800 bg-white"
        placeholder="Description (optional)"
        value={habitDescription}
        onChangeText={setHabitDescription}
        multiline
        numberOfLines={3}
        maxLength={200}
      />
      
      <Button
        title="Save Habit"
        onPress={handleSaveHabit}
        className="mb-4"
      />
      
      <Button
        title="Cancel"
        onPress={() => router.back()}
        className="bg-gray-200"
      />
    </View>
  );
};
export default AddHabitScreen;