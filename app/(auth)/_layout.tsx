import { Stack, Tabs } from 'expo-router';
import { tokens } from '@/src/theme';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'react-native';

export default function AuthLayout() {
  
  
  return (
    
    <Stack screenOptions={{headerShown: false}}
    >
      <Stack.Screen name="login" options={{ title: 'Login' }} />
      <Stack.Screen name="register" options={{ title: 'Register' }} />
    </Stack>
    
  );
}