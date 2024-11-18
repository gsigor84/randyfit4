"use client";

import { useParams } from "next/navigation";
import FullBodyExercises from "../../../../components/FullBodyExercises";

export default function FullBodyPage() {
  const params = useParams();
  const clientId = params?.id; // Dynamically fetch the client ID from the URL

  if (!clientId) {
    return (
      <div>
        <p className="text-red-500">Error: Client ID is missing in the URL!</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-6">Full Body Exercises</h1>
      <FullBodyExercises clientId={clientId} />
    </div>
  );
}
