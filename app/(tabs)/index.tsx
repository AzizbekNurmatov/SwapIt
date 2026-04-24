import { useRouter } from "expo-router";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useListings } from "../_context/ListingsContext";

export default function MarketFeedScreen() {
  const { listings } = useListings();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/listing/${item.id}`)}
          >
            {item.image_uri ? (
              <Image
                source={{ uri: item.image_uri }}
                style={styles.cardImage}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.cardImage, styles.placeholder]}>
                <Text style={styles.placeholderText}>No Image</Text>
              </View>
            )}

            <Text style={styles.text}>{item.title}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No listings yet. Go to User Profile and create one.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  card: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: "white",
    borderRadius: 8,
  },
  cardImage: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    marginBottom: 10,
    resizeMode: "contain",
    backgroundColor: "#fff",
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e5e5e5",
  },
  placeholderText: {
    color: "#666",
    fontSize: 16,
  },
  text: {
    fontSize: 18,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#666",
  },
});
