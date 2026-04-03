import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

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
  return (
    <View style={globalStyles.container}>
      {/* FlatList is a great Core Component to list for your rubric */}
      <FlatList
        data={dummyData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={globalStyles.card}>
            <Text style={globalStyles.text}>{item.title}</Text>
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
  text: { fontSize: 18 },
});