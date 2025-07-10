import React, { useState } from 'react';
import { View, Text, TextInput, Alert, ActivityIndicatorBase } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '../components/Button';
import { useHabitStore, useHabitStoreHydrated} from '../../store/habit-store';
import { FrequencyPicker, HabitFrequency } from '../components/frequency-picker';

const AddHabitScreen: React.FC = () => {
  const params = useLocalSearchParams();
  const { categoryId, categoryTitle, } = params;
  
  // Ensure the store is hydrated before using it
  const isHydrated = useHabitStoreHydrated();

  //Zustand hook to access the habit store
  const { addHabit } = useHabitStore();
  
  // Form state
  const [habitTitle, setHabitTitle] = useState('');
  const [habitDescription, setHabitDescription] = useState('');
  const [frequency, setFrequency] = useState<HabitFrequency>({type: 'daily'});
  
  
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
      frequency: frequency,
    });

    // Navigate back to category detail
    router.back();
  };
  if (!isHydrated) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicatorBase size="large" color="#6366f1" />
        <Text className="text-gray-600 mt-4">Loading...</Text>
      </View>
    );
  }
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
      
      <FrequencyPicker
        frequency={frequency}
        onFrequencyChange={setFrequency}
      />

      <Button
        title="Save Habit"
        onPress={handleSaveHabit}
        className="mb-4"
      />
      
      <Button
        variant="muted"
        title="Cancel"
        className='ml-auto'
        onPress={() => router.back()}
        
      />
    </View>
  );
};
export default AddHabitScreen;