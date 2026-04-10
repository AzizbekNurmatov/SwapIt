import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
// 1. Import AsyncStorage for local data persistence
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ListingProps {
  defaultMessage?: string;
}

export default function ListingDetailsScreen({ defaultMessage = "Loading item details..." }: ListingProps) {
  // This grabs the ID from the URL/Route
  const { id } = useLocalSearchParams();

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
      <Text style={styles.title}>Listing Details</Text>
      <Text style={styles.text}>Viewing item ID: {id}</Text>
      <Text style={styles.text}>{defaultMessage}</Text>

      {/* 5. Button to trigger the persistence logic */}
      <TouchableOpacity 
        style={[styles.saveButton, isSaved ? styles.buttonSaved : styles.buttonUnsaved]} 
        onPress={handleSaveToggle}
      >
        <Text style={styles.buttonText}>
          {isSaved ? "Remove from Saved" : "Save this Listing"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  text: { fontSize: 16, color: '#333', marginBottom: 10 },
  saveButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonUnsaved: { backgroundColor: '#007AFF' },
  buttonSaved: { backgroundColor: '#34C759' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});