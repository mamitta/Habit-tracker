import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { winCategories } from '../data/win-categories';


const WelcomeScreen: React.FC = () => {

  // Handle category press - navigate to the habits screen
  const handleCategoryPress = (category: any) => {
    router.push({
      pathname: '/habits',
      params: {
        categoryId: category.id,
        categoryTitle: category.title,
        categoryColor: category.color,
        categoryBgColor: category.bgColor,
      }
    });
  };

  // Get the date today and generate 7-day calendar
  const today = new Date();
  const currentDay = today.getDay(); 
  
  const generateWeekDays = () => {
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Start from sunday because it be first?
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
    <ScrollView className="flex-1 bg-gray-50">
      <View className="px-6 pt-16 pb-8">
  
        <Text className="text-3xl font-bold text-gray-800 text-left mb-8">
          Welcome
        </Text>

        {/*Calendar */}
        <View className="mb-8">
          <View className="flex-row justify-between px-2">
            {weekDays.map((day, index) => (
              <TouchableOpacity
                key={index}
                className={`items-center justify-center w-12 h-16 rounded-lg ${
                  day.isToday 
                    ? 'bg-gray-400 shadow-lg border border-gray-500' 
                    : 'bg-gray-300 border border-gray-400'
                }`}
              >
                <Text 
                  className={`text-xs font-medium mb-1 ${
                    day.isToday ? 'text-gray-600' : 'text-gray-600'
                  }`}
                >
                  {day.dayName}
                </Text>
                <Text 
                  className={`text-lg font-bold ${
                    day.isToday ? 'text-gray-600' : 'text-gray-800'
                  }`}
                >
                  {day.date}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Win Categories  */}
        <View className="space-y-3">
          <Text className="text-lg font-bold text-gray-700 mb-4">
            Daily Routine
          </Text>

         
          <View className="flex-col space-y-6 ">
            {winCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => handleCategoryPress(category)}
                className={`p-2 mb-4 rounded-xl border-2 ${category.bgColor} border-current ${category.color}`}
                activeOpacity={0.7}
              >
                <View className="flex-row items-center mb-2 justify-between">
                  <Text 
                    className={`text-xl font-semibold ${category.color}`}
                  >
                    {category.title} Wins
                  </Text>
                </View>
                
                <Text className="text-sm text-gray-600 mt-2">
                  Add your {category.title.toLowerCase()} achievements here
                </Text>

                <View className="flex-row justify-end mt-2">
                  <Text className="text-gray-400 text-lg">→</Text>
                </View>
              </TouchableOpacity>
            ))}
            
           
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default WelcomeScreen;