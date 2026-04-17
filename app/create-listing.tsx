import * as ImagePicker from "expo-image-picker";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import {
  Alert,
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
// import map components
import MapView, { Marker } from "react-native-maps";
import { supabase } from "../lib/supabase"; 

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
  // text description of the spot (optional now)
  const [addressDesc, setAddressDesc] = useState(""); 
  // precise coordinates from the map tap
  const [location, setLocation] = useState<{latitude: number, longitude: number} | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissions', 'Enable notifications to get updates on your listings.');
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

  const handleSubmit = async () => {
    // updated validation to require the pin drop
    if (!title || !description || !imageUri || !location) {
      Alert.alert("Missing info", "Please add a title, description, photo, and drop a pin on the map!");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('listings')
        .insert([
          {
            title: title,
            description: description,
            image_uri: imageUri,
            address: addressDesc, 
            latitude: location.latitude,   // pushing exact lat
            longitude: location.longitude, // pushing exact long
          }
        ]);

      if (error) throw error;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Listing Published! 🎉",
          body: `Your item "${title}" is now live on SwapIt.`,
        },
        trigger: null,
      });

      // reset form
      setTitle("");
      setDescription("");
      setImageUri("");
      setAddressDesc("");
      setLocation(null);
      
      router.push("/");

    } catch (error: any) {
      Alert.alert("Database Error", error.message || "Failed to push to Supabase.");
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
            placeholder="Meetup Spot Name (e.g., Campus Library)"
            placeholderTextColor="#888"
            value={addressDesc}
            onChangeText={setAddressDesc}
            style={styles.input}
          />

          <Text style={styles.mapInstruction}>Tap map to drop a meetup pin:</Text>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              // initialized over the local area
              initialRegion={{
                latitude: 32.7765, 
                longitude: -79.9311,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              // captures the coordinates where the user taps
              onPress={(e) => setLocation(e.nativeEvent.coordinate)}
            >
              {/* renders the pin if location state exists */}
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
    overflow: 'hidden',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#444',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  buttonSpacing: {
    marginBottom: 15,
  },
  previewImage: {
    width: "100%",
    height: 220,
    borderRadius: 8,
    marginBottom: 15,
  },
  noImageText: {
    color: "#aaa",
    marginBottom: 15,
  },
});