import { useRouter } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../_context/AuthContext";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>User Profile</Text>

      <Text style={styles.emailText}>Welcome, {user?.email}</Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Create Listing"
          onPress={() => router.push("/create-listing")}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Sign Out" onPress={signOut} color="#ff3b30" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  emailText: {
    fontSize: 18,
    marginBottom: 30,
    color: "#fffbfb",
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 50,
    marginBottom: 15,
  },
});