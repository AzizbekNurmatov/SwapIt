import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export interface Listing {
  id: string;
  title: string;
  description: string;
  image_uri: string;
  address?: string;
  latitude: number;
  longitude: number;
  user_email?: string;
}

interface ListingsContextType {
  listings: Listing[];
  addListing: (listing: Listing) => void;
  refreshListings: () => Promise<void>;
}

const ListingsContext = createContext<ListingsContextType | undefined>(
  undefined,
);

export const ListingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [listings, setListings] = useState<Listing[]>([]);

  const fetchListings = async () => {
    const { data, error } = await supabase.from("listings").select("*");

    if (error) {
      console.error("Error fetching listings:", error);
      return;
    }

    setListings((data as Listing[]) || []);
  };

  useEffect(() => {
    fetchListings();
  }, []);

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

export const useListings = () => {
  const context = useContext(ListingsContext);

  if (!context) {
    throw new Error("useListings must be used within ListingsProvider");
  }

  return context;
};
