import React, { createContext, useContext, useState } from "react";

export interface Listing {
  id: string;
  title: string;
  description: string;
  image: string;
}

interface ListingsContextType {
  listings: Listing[];
  addListing: (listing: Listing) => void;
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

  const addListing = (listing: Listing) => {
    setListings((prev) => [listing, ...prev]);
  };

  return (
    <ListingsContext.Provider value={{ listings, addListing }}>
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
