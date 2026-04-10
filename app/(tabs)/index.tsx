import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
// 1. Import the router to handle navigation
import { useRouter } from 'expo-router';

// TypeScript Requirement
interface MarketItem {
  id: string;
  title: string;
}

const dummyData: MarketItem[] = [
  { id: '1', title: 'Calculus Textbook' },
  { id: '2', title: 'Desk Lamp' },
  { id: '3', title: 'Mini Fridge' },
];

export default function MarketFeedScreen() {
  // 2. Initialize the router
  const router = useRouter();

  return (
    <View style={globalStyles.container}>
      <FlatList
        data={dummyData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={globalStyles.card}
            // 3. Add the onPress event to trigger Dynamic Routing
            onPress={() => router.push(`/listing/${item.id}`)}
          >
            <Text style={globalStyles.text}>{item.title}</Text>
            <Text style={globalStyles.clickText}>Tap to view details →</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

// Global Styles Requirement
const globalStyles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  card: { padding: 20, marginVertical: 8, backgroundColor: 'white', borderRadius: 8 },
  text: { fontSize: 18, fontWeight: 'bold' },
  clickText: { fontSize: 14, color: '#007AFF', marginTop: 8 } // Added a small prompt text
});