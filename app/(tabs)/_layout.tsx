import { Tabs, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '../_context/AuthContext';

// Main tabs only for logged-in users; checks Supabase session from AuthContext.
export default function TabLayout() {
  // Supabase session and whether the startup session check has finished.
  const { session, initialized } = useAuth();
  // Used to send logged-out users to the login screen.
  const router = useRouter();

  // Kicks unauthenticated users back to login once we know they are logged out.
  useEffect(() => {
    if (initialized && !session) {
      router.replace('/(auth)/login');
    }
  }, [session, initialized]);

  // Hides the tab bar until we know if someone is logged in.
  if (!initialized || !session) {
    return null;
  }

  // Feed, map, and profile tabs.
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#007AFF' }}>
      <Tabs.Screen 
        name="index" 
        options={{ title: 'Market Feed' }} 
      />
      <Tabs.Screen 
        name="map" 
        options={{ title: 'Map View' }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ title: 'User Profile' }} 
      />
    </Tabs>
  );
}