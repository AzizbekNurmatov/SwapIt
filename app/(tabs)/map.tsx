import { View, Text, StyleSheet } from 'react-native';

interface MapProps {
  locationStatus?: string;
}

export default function MapScreen({ locationStatus = "Loading map..." }: MapProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{locationStatus}</Text>
      <Text style={styles.subtext}>(Brett: Map)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#e0f7fa' },
  text: { fontSize: 20, fontWeight: 'bold' },
  subtext: { fontSize: 14, color: '#555', marginTop: 10 },
});