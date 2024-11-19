"use client";

import { createContext, useContext } from "react";

// Create the context
const ClientContext = createContext();

// Provider to wrap around components needing client data
export const ClientProvider = ({ value, children }) => {
  console.log("ClientProvider value:", value); // Debug log to inspect the value being passed
  return (
    <ClientContext.Provider value={value}>{children}</ClientContext.Provider>
  );
};

// Hook to use the context in components
export const useClient = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error("useClient must be used within a ClientProvider");
  }
  return context;
};
