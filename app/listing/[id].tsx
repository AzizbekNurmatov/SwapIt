import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

interface ListingProps {
  defaultMessage?: string;
}

export default function ListingDetailsScreen({ defaultMessage = "Loading item..." }: ListingProps) {
  // This grabs the ID from the URL/Route
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Listing Details</Text>
      <Text style={styles.text}>Viewing item ID: {id}</Text>
      <Text style={styles.text}>{defaultMessage}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  text: { fontSize: 16, color: '#333' },
});