import { useLocalSearchParams } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";
import { useListings } from "../context/ListingsContext";

interface ListingProps {
  defaultMessage?: string;
}

export default function ListingDetailsScreen({
  defaultMessage = "Loading item...",
}: ListingProps) {
  const { id } = useLocalSearchParams();
  const { listings } = useListings();

  const item = listings.find((listing) => listing.id === id);

  if (!item) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Listing Details</Text>
        <Text style={styles.text}>Item not found</Text>
        <Text style={styles.text}>{defaultMessage}</Text>
      </View>
    );
  }

  // 2. State to track if the user saved this specific listing
  const [isSaved, setIsSaved] = useState(false);

  // 3. useEffect runs on mount to check if this item was previously saved
  useEffect(() => {
    const loadSavedStatus = async () => {
      try {
        const savedValue = await AsyncStorage.getItem(`saved_listing_${id}`);
        if (savedValue === 'true') {
          setIsSaved(true);
        }
      } catch (e) {
        console.error("Failed to load data", e);
      }
    };
    loadSavedStatus();
  }, [id]);

  // 4. Function to handle saving/removing the item from local storage
  const handleSaveToggle = async () => {
    try {
      if (isSaved) {
        await AsyncStorage.removeItem(`saved_listing_${id}`);
        setIsSaved(false);
      } else {
        await AsyncStorage.setItem(`saved_listing_${id}`, 'true');
        setIsSaved(true);
      }
    } catch (e) {
      console.error("Failed to save data", e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{item.title}</Text>

      <Image
        source={{ uri: item.image }}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.text}>{item.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  text: {
    fontSize: 16,
    color: "#333",
    marginTop: 10,
  },
  image: {
    width: "100%",
    height: 260,
    borderRadius: 8,
    marginVertical: 10,
    backgroundColor: "#fff",
  },
});
