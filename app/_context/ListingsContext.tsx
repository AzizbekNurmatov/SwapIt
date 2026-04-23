import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export interface Listing {
  id: string;
  title: string;
  description: string;
  image: string;
  latitude: number;
  longitude: number;
}

interface ListingsContextType {
  listings: Listing[];
  addListing: (listing: Listing) => void;
  refreshListings: () => Promise<void>;
}

const ListingsContext = createContext<ListingsContextType | undefined>(
  undefined,
);

// Loads listings from Supabase once and shares them with child screens.
export const ListingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [listings, setListings] = useState<Listing[]>([]);

  // Pulls all rows from the Supabase "listings" table into local state.
  const fetchListings = async () => {
    const { data, error } = await supabase.from("listings").select("*");

    if (error) {
      console.error("Error fetching listings:", error);
      return;
    }

    setListings((data as Listing[]) || []);
  };

  // Load listings once when the provider mounts (app start).
  useEffect(() => {
    fetchListings();
  }, []);

  // Pushes a new listing into state after the user creates one (keeps UI in sync).
  const addListing = (listing: Listing) => {
    setListings((prev) => [listing, ...prev]);
  };

  return (
    <ListingsContext.Provider
      value={{ listings, addListing, refreshListings: fetchListings }}
    >
      {children}
    </ListingsContext.Provider>
  );
};

// Hook for screens that need the shared listings array (must sit under ListingsProvider).
export const useListings = () => {
  const context = useContext(ListingsContext);

  if (!context) {
    throw new Error("useListings must be used within ListingsProvider");
  }

  return context;
};
