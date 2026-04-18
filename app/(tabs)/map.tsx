import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";
import { useListings } from "../context/ListingsContext";

type UserCoords = {
  latitude: number;
  longitude: number;
};

export default function MapScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView | null>(null);
  const { listings } = useListings();

  const [userCoords, setUserCoords] = useState<UserCoords | null>(null);

  const handleFitAllLocations = () => {
    const coordinatesToFit = listings
      .filter(
        (spot) =>
          typeof spot.latitude === "number" &&
          typeof spot.longitude === "number",
      )
      .map((spot) => ({
        latitude: Number(spot.latitude),
        longitude: Number(spot.longitude),
      }));

    if (userCoords) {
      coordinatesToFit.push({
        latitude: userCoords.latitude,
        longitude: userCoords.longitude,
      });
    }

    if (coordinatesToFit.length > 0) {
      mapRef.current?.fitToCoordinates(coordinatesToFit, {
        edgePadding: {
          top: 100,
          right: 60,
          bottom: 100,
          left: 60,
        },
        animated: true,
      });
    }
  };

  const handleMarkerPress = (spot: {
    id: string;
    title: string;
    description: string;
    latitude: number;
    longitude: number;
  }) => {
    router.push({
      pathname: "/marker-details",
      params: {
        id: spot.id,
        name: spot.title,
        description: spot.description,
        address: "",
        latitude: String(spot.latitude),
        longitude: String(spot.longitude),
        userLatitude: userCoords ? String(userCoords.latitude) : "",
        userLongitude: userCoords ? String(userCoords.longitude) : "",
      },
    });
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 32.7831,
          longitude: -79.9372,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        onUserLocationChange={(event) => {
          const nativeEvent = event?.nativeEvent;

          const latitude =
            nativeEvent?.coordinate?.latitude ?? nativeEvent?.latitude;
          const longitude =
            nativeEvent?.coordinate?.longitude ?? nativeEvent?.longitude;

          if (typeof latitude === "number" && typeof longitude === "number") {
            setUserCoords({ latitude, longitude });
          }
        }}
      >
        {listings.map((spot) => (
          <Marker
            key={spot.id}
            coordinate={{
              latitude: Number(spot.latitude),
              longitude: Number(spot.longitude),
            }}
            pinColor="red"
          >
            <Callout tooltip={true} onPress={() => handleMarkerPress(spot)}>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{spot.title}</Text>
                <Text style={styles.calloutDescription}>
                  {spot.description}
                </Text>
                <Text style={styles.calloutTap}>Tap for details</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <TouchableOpacity
        style={styles.fitButton}
        onPress={handleFitAllLocations}
      >
        <Text style={styles.fitButtonText}>Fit All Locations</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => router.push("/")}
      >
        <Text style={styles.homeButtonText}>Back Home</Text>
      </TouchableOpacity>

      {!userCoords && (
        <View style={styles.statusBanner}>
          <Text style={styles.statusText}>
            Waiting for your live location...
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  calloutContainer: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    width: 240,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  calloutDescription: {
    fontSize: 14,
    marginBottom: 6,
  },
  calloutTap: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1f6feb",
  },
  fitButton: {
    position: "absolute",
    bottom: 90,
    alignSelf: "center",
    backgroundColor: "#1f6feb",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 24,
  },
  fitButtonText: {
    color: "white",
    fontWeight: "700",
  },
  homeButton: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    backgroundColor: "#333",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 24,
  },
  homeButtonText: {
    color: "white",
    fontWeight: "700",
  },
  statusBanner: {
    position: "absolute",
    top: 50,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.65)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  statusText: {
    color: "white",
    fontSize: 13,
    fontWeight: "600",
  },
});
