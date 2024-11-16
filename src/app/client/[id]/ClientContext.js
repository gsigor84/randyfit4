"use client";

import { createContext, useContext } from "react";

const ClientContext = createContext();

export const ClientProvider = ({ value, children }) => {
  return (
    <ClientContext.Provider value={value}>{children}</ClientContext.Provider>
  );
};

export const useClient = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error("useClient must be used within a ClientProvider");
  }
  return context;
};
