import { useRouter } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

interface ProfileProps {
  username?: string;
}

export default function ProfileScreen({ username = "Student" }: ProfileProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.avatarPlaceholder} />
      <Text style={styles.title}>{username}'s Profile</Text>
      <Text style={styles.subtitle}>Rating: ⭐⭐⭐⭐⭐</Text>

      <Button
        title="Create Listing"
        onPress={() => router.push("/create-listing")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ccc",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
  },
});
