import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Button,
    Image,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { useListings } from "./context/ListingsContext";

export default function CreateListingScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState("");

  const { addListing } = useListings();
  const router = useRouter();

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

  const handleSubmit = () => {
    if (!title || !description || !imageUri) {
      Alert.alert("Missing info", "Please add a title, description, and photo");
      return;
    }

    addListing({
      id: Date.now().toString(),
      title,
      description,
      image: imageUri,
    });

    setTitle("");
    setDescription("");
    setImageUri("");

    router.push("/");
  };

  return (
    <View style={styles.container}>
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

      <View style={styles.buttonSpacing}>
        <Button title="Choose Photo" onPress={pickImage} />
      </View>

      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.previewImage} />
      ) : (
        <Text style={styles.noImageText}>No image selected yet</Text>
      )}

      <Button title="Post Listing" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#000",
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
