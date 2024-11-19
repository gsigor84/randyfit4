"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import LastWorkoutPlan from "../../../components/LastWorkoutPlan";
import LastMealPlan from "../../../components/LastMealPlan";

export default function OverviewPage() {
  const params = useParams();
  const clientId = params?.id;

  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!clientId) {
      setError("Client ID is missing.");
      setLoading(false);
      return;
    }

    const fetchClient = async () => {
      try {
        const response = await fetch(`/api/get-client?id=${clientId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch client data.");
        }

        const data = await response.json();
        setClient(data); // Store the fetched client data
      } catch (err) {
        console.error("Error fetching client:", err);
        setError("Failed to fetch client data.");
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [clientId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto mt-8 p-6 bg-[#1c1c1c] rounded-lg shadow">
        <p className="text-[#FFA800] text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto mt-8 p-6 bg-[#1c1c1c] rounded-lg shadow">
        <p className="text-red-500 text-lg font-semibold">{error}</p>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="max-w-7xl mx-auto mt-8 p-6 bg-[#1c1c1c] rounded-lg shadow">
        <p className="text-red-500 text-lg font-semibold">No client data available.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-8 p-6 bg-[#1c1c1c] rounded-lg shadow">
      <h1 className="text-3xl font-bold text-[#FFA800] mb-6">Client Overview</h1>

      {/* Display Last Workout Plan */}
      <LastWorkoutPlan clientId={clientId} />

      {/* Display Last Meal Plan */}
      {client.mealPlan ? (
        <LastMealPlan mealPlan={client.mealPlan} />
      ) : (
        <p className="text-gray-400 text-lg">No meal plan data available.</p>
      )}
    </div>
  );
}
