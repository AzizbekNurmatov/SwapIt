import { Tabs } from 'expo-router';

export default function TabLayout() {
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