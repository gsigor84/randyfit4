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
      className="bg-[#ffa800] text-black font-semibold py-2 px-4 rounded hover:bg-[#cc8400] focus:ring-2 focus:ring-[#ffa800] transition-all"
    >
      {label}
    </button>
  );
}
