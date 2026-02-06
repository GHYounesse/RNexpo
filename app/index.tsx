

import { CustomButton } from '@/src/components/ui/CustomButton';
import { AppText } from '@/src/components/ui/AppText';
import { View, ScrollView } from 'react-native';
import { Screen } from '@/src/components/layout/Screen';
import { useRouter } from 'expo-router';
export default function Index() {
  const router= useRouter();
  return (
    
    <Screen scrollable>

    
    <View style={{marginBottom: 20, alignItems: 'center',gap: 10}}>
      <AppText variant="heading">Welcome to the Auth App</AppText>
   
    <CustomButton onPress={() => router.push('/(auth)/login')} size='md' >
        Normal Login
      </CustomButton> 
    
    <CustomButton onPress={() => router.push('/(auth)/login-phone')} size='md' >
        Login with Phone
    </CustomButton>

    <CustomButton onPress={() => router.push('/(auth)/login-total')} size='md' >
        Login Total
    </CustomButton>
    
    </View>

    </Screen>
    
  );
}