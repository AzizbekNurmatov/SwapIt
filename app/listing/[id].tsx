import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { supabase } from "../../lib/supabase";

interface Listing {
  id: string;
  title: string;
  description: string;
  image: string;
  latitude: number;
  longitude: number;
}

export default function ListingDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [item, setItem] = useState<Listing | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching listing:", error);
        return;
      }

      setItem(data as Listing);
    };

    if (id) {
      fetchListing();
    }
  }, [id]);

  if (!item) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading item...</Text>
      </View>
    );
  }

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
