import { Stack, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

function haversineDistanceMiles(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const earthRadiusMiles = 3958.8;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusMiles * c;
}

// Pin detail view; the map passed these fields through the router params.
export default function MarkerDetailsScreen() {
  const {
    name,
    description,
    address,
    latitude,
    longitude,
    userLatitude,
    userLongitude,
  } = useLocalSearchParams();

  const markerLat = parseFloat(latitude as string);
  const markerLng = parseFloat(longitude as string);
  const startLat = parseFloat(userLatitude as string);
  const startLng = parseFloat(userLongitude as string);

  let estimatedTravelTime = "User location not available yet";
  let distanceText = "User location not available yet";

  if (
    !isNaN(markerLat) &&
    !isNaN(markerLng) &&
    !isNaN(startLat) &&
    !isNaN(startLng)
  ) {
    const miles = haversineDistanceMiles(
      startLat,
      startLng,
      markerLat,
      markerLng,
    );

    const estimatedMinutes = Math.max(1, Math.round((miles / 3) * 60));

    distanceText = `${miles.toFixed(2)} miles`;
    estimatedTravelTime = `${estimatedMinutes} minutes`;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Pickup Details",
          headerBackTitle: "Back",
        }}
      />

      <View style={styles.container}>
        <Text style={styles.title}>{name}</Text>

        <Text style={styles.label}>Description</Text>
        <Text style={styles.value}>{description}</Text>

        <Text style={styles.label}>Address</Text>
        <Text style={styles.value}>{address}</Text>

        <Text style={styles.label}>Estimated Travel Time</Text>
        <Text style={styles.value}>{estimatedTravelTime}</Text>

        <Text style={styles.label}>Distance From Your Location</Text>
        <Text style={styles.value}>{distanceText}</Text>

        <Text style={styles.note}>
          Travel time is currently estimated based on the live map location when
          available
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 24,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 14,
    marginBottom: 6,
  },
  value: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
  },
  note: {
    marginTop: 24,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});
