import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { winCategories } from '../data/win-categories';

const WelcomeScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('mental');

  // Get current date and generate 7-day calendar
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  const generateWeekDays = () => {
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Start from Sunday of current week
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      
      days.push({
        dayName: dayNames[i],
        date: date.getDate(),
        fullDate: date,
        isToday: date.toDateString() === today.toDateString()
      });
    }
    
    return days;
  };

  const weekDays = generateWeekDays();

  

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-6 pt-16 pb-8">
        {/* Welcome Message */}
        <Text className="text-3xl font-bold text-gray-800 text-center mb-8">
          Welcome User
        </Text>

        {/* 7-Day Calendar */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-gray-700 mb-4 text-center">
            This Week
          </Text>
          <View className="flex-row justify-between px-2">
            {weekDays.map((day, index) => (
              <TouchableOpacity
                key={index}
                className={`items-center justify-center w-12 h-16 rounded-lg ${
                  day.isToday 
                    ? 'bg-blue-500 shadow-lg' 
                    : 'bg-gray-100'
                }`}
              >
                <Text 
                  className={`text-xs font-medium mb-1 ${
                    day.isToday ? 'text-white' : 'text-gray-600'
                  }`}
                >
                  {day.dayName}
                </Text>
                <Text 
                  className={`text-lg font-bold ${
                    day.isToday ? 'text-white' : 'text-gray-800'
                  }`}
                >
                  {day.date}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Win Categories Tabs */}
        <View className="space-y-3">
          <Text className="text-lg font-semibold text-gray-700 mb-2">
            Track Your Wins
          </Text>
          
          {winCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => setSelectedCategory(category.id)}
              className={`p-4 rounded-xl border-2 ${
                selectedCategory === category.id
                  ? `${category.bgColor} border-current ${category.color}`
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <View className="flex-row items-center justify-between">
                <Text 
                  className={`text-lg font-semibold ${
                    selectedCategory === category.id
                      ? category.color
                      : 'text-gray-700'
                  }`}
                >
                  {category.title} Wins
                </Text>
                <View 
                  className={`w-6 h-6 rounded-full ${
                    selectedCategory === category.id
                      ? category.color.replace('text-', 'bg-')
                      : 'bg-gray-300'
                  }`}
                />
              </View>
              
              {selectedCategory === category.id && (
                <Text className="text-sm text-gray-600 mt-2">
                  Add your {category.title.toLowerCase()} achievements here
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Selected Category Content */}
        <View className="mt-6 p-4 bg-gray-50 rounded-xl">
          <Text className="text-base font-medium text-gray-700 mb-2">
            {winCategories.find(cat => cat.id === selectedCategory)?.title} Wins Today
          </Text>
          <Text className="text-sm text-gray-500">
            Start tracking your progress in this category!
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default WelcomeScreen;