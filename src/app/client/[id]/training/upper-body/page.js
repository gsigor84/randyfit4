"use client";

import { useParams } from "next/navigation";
import UpperBodyExercises from "../../../../components/UpperBodyExercises";

export default function TrainingPage() {
  const params = useParams();
  const clientId = params?.id; // Dynamically fetch the client ID from the URL

  console.log("Client ID from URL:", clientId);

  if (!clientId) {
    return (
      <div className="max-w-4xl mx-auto mt-8  bg-white rounded-lg shadow border border-gray-300">
        <p className="text-red-500 text-lg font-semibold">
          Error: Client ID is missing in the URL!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h1 className="text-3xl font-bold text-[#010326] mb-6">Upper Body Exercises</h1>

      {/* Upper Body Exercises Section */}
      <div className="bg-[#F2F2F2] ">
        <UpperBodyExercises clientId={clientId} />
      </div>
    </div>
  );
}
