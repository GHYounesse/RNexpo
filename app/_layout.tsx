
import { Stack } from "expo-router";
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
//import { AuthProvider, useAuth } from "@/src/contexts/AuthContext";
import { AuthProvider } from "@/src/contexts/AuthContextX";


export default function RootLayout() {
  
  return (
    <AuthProvider>
      <GluestackUIProvider mode="dark" >
        <Stack screenOptions={{ headerShown: false }}> 
          
          
        </Stack >   
      </GluestackUIProvider>
    </AuthProvider>
  
    
  );
}
