import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Button, Image, StyleSheet, Text, View } from "react-native";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../_context/AuthContext";
import { useListings } from "../_context/ListingsContext";

interface Listing {
  id: string;
  title: string;
  description: string;
  image_uri: string;
  address?: string;
  latitude: number;
  longitude: number;
  user_email?: string;
}

export default function ListingDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { refreshListings } = useListings();
  const { user } = useAuth();

  const [item, setItem] = useState<Listing | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDelete = async () => {
    if (!item) return;

    if (user?.email !== item.user_email) {
      Alert.alert(
        "Not allowed",
        "You can only delete listings that you created.",
      );
      return;
    }

    Alert.alert(
      "Delete Listing",
      "Are you sure you want to delete this listing?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setIsDeleting(true);

            const { error } = await supabase
              .from("listings")
              .delete()
              .eq("id", item.id);

            if (error) {
              Alert.alert("Error", error.message);
              setIsDeleting(false);
              return;
            }

            await refreshListings();

            Alert.alert("Deleted", "Listing deleted successfully.");
            router.push("/");
          },
        },
      ],
    );
  };

  if (!item) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading item...</Text>
      </View>
    );
  }

  const isOwner = user?.email === item.user_email;

  return (
    <>
      <Stack.Screen
        options={{
          title: "Description",
          headerBackTitle: "Back",
          headerTitleAlign: "center",
        }}
      />

      <View style={styles.container}>
        <Text style={styles.title}>{item.title}</Text>

        {item.image_uri ? (
          <Image
            source={{ uri: item.image_uri }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.image, styles.placeholder]}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}

        <Text style={styles.text}>{item.description}</Text>

        {item.address ? (
          <Text style={styles.address}>Meetup Spot: {item.address}</Text>
        ) : null}

        {isOwner && (
          <View style={styles.deleteButton}>
            <Button
              title={isDeleting ? "Deleting..." : "Delete Listing"}
              color="red"
              onPress={handleDelete}
              disabled={isDeleting}
            />
          </View>
        )}
      </View>
    </>
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
  address: {
    fontSize: 15,
    color: "#555",
    marginTop: 10,
  },
  image: {
    width: "100%",
    height: 260,
    borderRadius: 8,
    marginVertical: 10,
    backgroundColor: "#ddd",
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
  deleteButton: {
    marginTop: 25,
  },
});
