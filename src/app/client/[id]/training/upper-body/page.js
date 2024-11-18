"use client";

import { useParams } from "next/navigation";
import UpperBodyExercises from "../../../../components/UpperBodyExercises";

export default function TrainingPage() {
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
    <div>
      <h1 className="text-xl font-bold mb-4">Training Page for Client {clientId}</h1>
      <UpperBodyExercises clientId={clientId} />
    </div>
  );
}
