import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../_context/AuthContext';
import { useRouter } from 'expo-router'; // <-- Don't forget this new import!

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter(); // <-- Initialize the router

  return (
    <View style={styles.container}>
      <Text style={styles.header}>User Profile</Text>
      
      <Text style={styles.emailText}>Welcome, {user?.email}</Text>
      
      <View style={styles.buttonContainer}>
        {/* The restored Create Listing button */}
        <Button 
          title="Create New Listing" 
          onPress={() => router.push('/listing/create-listing')} 
          color="#007AFF" 
        />
        
        <View style={{ height: 20 }} /> {/* Spacer between the buttons */}
        
        <Button 
          title="Sign Out" 
          onPress={signOut} 
          color="#ff3b30" 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  emailText: {
    fontSize: 18,
    marginBottom: 40,
    color: '#333',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 50,
  }
});