import '../../global.css';

import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false
      }}>
      <Stack.Screen name='index' options={{
          headerTitle: 'Home',
          // header
          // headerLeft
          // headerRight
          // headerShown
          
      }}/>
    </Stack>
  );
}
