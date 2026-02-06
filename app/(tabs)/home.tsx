import { Screen } from '@/src/components/layout/Screen';
import { AppText } from '@/src/components/ui/AppText';
import { CustomButton } from '@/src/components/ui/CustomButton';
import { useAuth } from '@/src/contexts/AuthContextX';
import { ProtectedRoute } from '@/src/components/layout/ProtectedRoute';
import { use, useState } from 'react';
import { Alert } from 'react-native';
export default function Home() {
    const {user,logout}=useAuth();
    const [isLoading,setIsLoading]=useState(false);
    const handleLogout = async () => {
        
        try {
          setIsLoading(true);
          await logout(); // Assuming logout is a function in the auth context
          // Reset user state
        } catch (error: any) {
          console.error('Logout error:', error);
          Alert.alert(
            'Logout Failed',
            error.message || 'Failed to logout. Please try again.',
            [{ text: 'OK' }]
          );
        } finally {
          setIsLoading(false);
        }
      };
        
      
  return (
    <ProtectedRoute>
    <Screen>

      <AppText variant="heading">Home Screen</AppText>
      <AppText variant="caption">Current User: {user?.name}</AppText>
      <CustomButton onPress={handleLogout} loading={isLoading}>Logout</CustomButton>
    </Screen>
    </ProtectedRoute>
  );
}
