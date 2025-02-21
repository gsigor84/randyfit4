"use client";

import { HeroUIProvider } from "@heroui/react";

export default function Providers({ children }) {
  return (
    <HeroUIProvider
      theme={{
        className: "dark",
        colors: {
          primary: "#010326", // Dark Blue
          secondary: "#07B0F2", // Light Blue
          success: "#0DA64F", // Green
          warning: "#F2B138", // Yellow
          danger: "#F25922", // Orange
        },
      }}
    >
      {children}
    </HeroUIProvider>
  );
}
