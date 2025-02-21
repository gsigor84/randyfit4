"use client";

import { useParams } from "next/navigation";
import LowerBodyExercises from "../../../../components/LowerBodyExercises";

export default function AddLowerBodyPage() {
  const params = useParams();
  const clientId = params?.id; // Dynamically fetch the client ID from the URL

  console.log("Client ID from URL:", clientId);

  if (!clientId) {
    return (
      <div className="max-w-7xl mx-auto mt-8 ">
        <p className="text-red-500 text-lg font-semibold">Error: Client ID is missing in the URL!</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-8 ">

      <LowerBodyExercises clientId={clientId} />
    </div>
  );
}
