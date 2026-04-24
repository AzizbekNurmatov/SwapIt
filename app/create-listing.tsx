import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { supabase } from "../lib/supabase";
import { useAuth } from "./_context/AuthContext";
import { useListings } from "./_context/ListingsContext";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function CreateListingScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState("");
  const [addressDesc, setAddressDesc] = useState("");
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { refreshListings } = useListings();
  const { user } = useAuth();

  useEffect(() => {
    const requestPermissions = async () => {
      const notificationPermission =
        await Notifications.requestPermissionsAsync();

      if (notificationPermission.status !== "granted") {
        Alert.alert(
          "Notifications",
          "Enable notifications to get updates on your listings.",
        );
      }

      const locationPermission =
        await Location.requestForegroundPermissionsAsync();

      if (locationPermission.status === "granted") {
        const currentLocation = await Location.getCurrentPositionAsync({});

        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
      }
    };

    requestPermissions();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadImageToSupabase = async () => {
    const fileExt = imageUri.split(".").pop()?.toLowerCase() || "jpg";
    const fileName = `${Date.now()}.${fileExt}`;

    const response = await fetch(imageUri);
    const arrayBuffer = await response.arrayBuffer();

    const { error } = await supabase.storage
      .from("listing-images")
      .upload(fileName, arrayBuffer, {
        contentType: `image/${fileExt}`,
        upsert: false,
      });

    if (error) {
      throw error;
    }

    const { data } = supabase.storage
      .from("listing-images")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleSubmit = async () => {
    if (!title || !description || !imageUri) {
      Alert.alert(
        "Missing info",
        "Please add a title, description, and photo.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const finalLocation = location || {
        latitude: 32.7831,
        longitude: -79.9372,
      };

      const publicImageUrl = await uploadImageToSupabase();

      const { error } = await supabase.from("listings").insert([
        {
          title,
          description,
          image_uri: publicImageUrl,
          address: addressDesc,
          latitude: finalLocation.latitude,
          longitude: finalLocation.longitude,
          user_email: user?.email,
        },
      ]);

      if (error) throw error;

      await refreshListings();

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Listing Published! 🎉",
          body: `Your item "${title}" is now live on SwapIt.`,
        },
        trigger: null,
      });

      setTitle("");
      setDescription("");
      setImageUri("");
      setAddressDesc("");
      setLocation(null);

      router.push("/");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to create listing.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#000" }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Create Listing</Text>

          <TextInput
            placeholder="Item Title"
            placeholderTextColor="#888"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />

          <TextInput
            placeholder="Description"
            placeholderTextColor="#888"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
            multiline
          />

          <TextInput
            placeholder="Meetup Spot Name"
            placeholderTextColor="#888"
            value={addressDesc}
            onChangeText={setAddressDesc}
            style={styles.input}
          />

          <Text style={styles.mapInstruction}>
            Tap map to drop a meetup pin:
          </Text>

          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: location?.latitude || 32.7831,
                longitude: location?.longitude || -79.9372,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              showsUserLocation={true}
              onPress={(e) => setLocation(e.nativeEvent.coordinate)}
            >
              {location && <Marker coordinate={location} />}
            </MapView>
          </View>

          <View style={styles.buttonSpacing}>
            <Button title="Choose Photo" onPress={pickImage} />
          </View>

          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
          ) : (
            <Text style={styles.noImageText}>No image selected yet</Text>
          )}

          <Button
            title={isSubmitting ? "Posting..." : "Post Listing"}
            onPress={handleSubmit}
            disabled={isSubmitting}
          />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    color: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#444",
    padding: 10,
    marginBottom: 15,
    borderRadius: 6,
    backgroundColor: "#111",
    color: "#fff",
    minHeight: 50,
    textAlignVertical: "top",
  },
  mapInstruction: {
    color: "#aaa",
    marginBottom: 8,
    fontSize: 14,
  },
  mapContainer: {
    height: 200,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#444",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  buttonSpacing: {
    marginBottom: 15,
  },
  previewImage: {
    width: "100%",
    height: 220,
    borderRadius: 8,
    marginBottom: 15,
    resizeMode: "contain",
    backgroundColor: "#111",
  },
  noImageText: {
    color: "#aaa",
    marginBottom: 15,
  },
});
