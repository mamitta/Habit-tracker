import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  ScrollView 
} from 'react-native';

// Frequency types
export interface HabitFrequency {
  type: 'daily' | 'weekly' | 'custom';
  days?: number[]; // 0 = Sunday, 1 = Monday, etc.
  interval?: number; // For every X days
}

// Helper function to get frequency display text
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
};

// Frequency Picker Component
interface FrequencyPickerProps {
  frequency: HabitFrequency;
  onFrequencyChange: (frequency: HabitFrequency) => void;
}

export const FrequencyPicker: React.FC<FrequencyPickerProps> = ({ 
  frequency, 
  onFrequencyChange 
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tempFrequency, setTempFrequency] = useState<HabitFrequency>(frequency);

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayAbbr = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const quickPresets = [
    { label: 'Every day', frequency: { type: 'daily' as const } },
    { label: 'Weekdays', frequency: { type: 'weekly' as const, days: [1, 2, 3, 4, 5] } },
    { label: 'Weekends', frequency: { type: 'weekly' as const, days: [0, 6] } },
   
  ];

  const toggleDay = (dayIndex: number) => {
    const currentDays = tempFrequency.days || [];
    const newDays = currentDays.includes(dayIndex)
      ? currentDays.filter(d => d !== dayIndex)
      : [...currentDays, dayIndex].sort();
    
    setTempFrequency({
      type: 'weekly',
      days: newDays
    });
  };

  const handleSave = () => {
    onFrequencyChange(tempFrequency);
    setIsModalVisible(false);
  };

  const handlePresetSelect = (presetFrequency: HabitFrequency) => {
    setTempFrequency(presetFrequency);
  };

  return (
    <>
      <TouchableOpacity
        className="border border-gray-300 rounded-lg p-3 mb-4 bg-white"
        onPress={() => setIsModalVisible(true)}
      >
        <Text className="text-gray-600 text-m font-mediummb-1">Frequency:</Text>
        <Text className="text-gray-400 text-base">{getFrequencyText(frequency)}</Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View className="flex-1 bg-gray-100 ml-4 mr-4 mt-4 mb-4 rounded-lg">
          <View className="px-6 py-4 border-b border-gray-200">
            <View className="flex-row justify-between items-center">
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Text className="text-gray-600 text-base font-semibold">Cancel</Text>
              </TouchableOpacity>
              <Text className="text-lg font-semibold">Frequency</Text>
              <TouchableOpacity onPress={handleSave}>
                <Text className="text-gray-600 text-base font-semibold">Done</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView className="flex-1 px-6 py-4">

            {/* Quick Presets */}
            <Text className="text-lg font-semibold mb-3 text-gray-800">Quick Options</Text>
            {quickPresets.map((preset, index) => (
              <TouchableOpacity
                key={index}
                className="py-3 border-b border-gray-100"
                onPress={() => handlePresetSelect(preset.frequency)}
              >
                <Text className="text-base text-gray-800">{preset.label}</Text>
              </TouchableOpacity>
            ))}

            {/* Custom Weekly Selection */}
            <Text className="text-lg font-semibold mt-6 mb-3 text-gray-800">Custom Weekly Selection</Text>
            <Text className="text-sm text-gray-600 mb-3">Select specific days of the week:</Text>
            
            <View className="flex-row justify-between mb-6">
              {dayNames.map((day, index) => (
                <TouchableOpacity
                  key={index}
                  className={`w-12 h-12 rounded-full items-center justify-center border-2 ${
                    tempFrequency.type === 'weekly' && tempFrequency.days?.includes(index)
                      ? 'bg-gray-400 border-gray-500'
                      : 'bg-white border-gray-300'
                  }`}
                  onPress={() => toggleDay(index)}
                >
                  <Text
                    className={`text-sm font-medium ${
                      tempFrequency.type === 'weekly' && tempFrequency.days?.includes(index)
                        ? 'text-white'
                        : 'text-gray-700'
                    }`}
                  >
                    {dayAbbr[index]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Custom  skip Intervals */}
           
            <View className="flex-row items-center mb-4">
              <Text className="text-base text-gray-700 mr-2">Every</Text>
              <TouchableOpacity
                className="border border-gray-300 rounded px-3 py-2 mr-2"
                onPress={() => setTempFrequency({ type: 'custom', interval: 2 })}
              >
                <Text className="text-base">2</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="border border-gray-300 rounded px-3 py-2 mr-2"
                onPress={() => setTempFrequency({ type: 'custom', interval: 3 })}
              >
                <Text className="text-base">3</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="border border-gray-300 rounded px-3 py-2 mr-2"
                onPress={() => setTempFrequency({ type: 'custom', interval: 7 })}
              >
                <Text className="text-base">7</Text>
              </TouchableOpacity>
              <Text className="text-base text-gray-700">days</Text>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
};