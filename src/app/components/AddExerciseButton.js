"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function AddExerciseButton({ label, navigateTo }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(navigateTo);
  };

  return (
    <button
      onClick={handleClick}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
    >
      {label}
    </button>
  );
}
