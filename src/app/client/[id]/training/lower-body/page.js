"use client";

import { useParams } from "next/navigation";
import LowerBodyExercises from "../../../../components/LowerBodyExercises";

export default function AddLowerBodyPage() {
  const params = useParams();
  const clientId = params?.id; // Dynamically fetch the client ID from the URL

  console.log("Client ID from URL:", clientId);

  if (!clientId) {
    return (
      <div>
        <p className="text-red-500">Error: Client ID is missing in the URL!</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-6">Add Lower Body Exercises</h1>
      <LowerBodyExercises clientId={clientId} />
    </div>
  );
}
