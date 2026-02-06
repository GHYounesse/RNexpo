import { Redirect, Tabs } from 'expo-router';
import { tokens } from '@/src/theme';

export default function TabsLayout() {
    
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: tokens.colors.background },
        headerTintColor: tokens.colors.textPrimary,
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}