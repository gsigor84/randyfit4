"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import LastWorkoutPlan from "../../../components/LastWorkoutPlan";
import LastMealPlan from "../../../components/LastMealPlan";

export default function OverviewPage() {
  const params = useParams();
  const clientId = params?.id;

  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!clientId) return;

    const fetchClientData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/get-client?id=${clientId}`);
        if (!res.ok) throw new Error("Failed to fetch client data");

        const data = await res.json();
        setClient(data); // Save the client data
      } catch (error) {
        console.error("Error fetching client data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [clientId]);

  const handleSendEmail = async () => {
    if (!email) {
      alert("Please provide a valid email address.");
      return;
    }

    if (!client) {
      alert("No client data available to send.");
      return;
    }

    try {
      setMessage("Sending...");
      const response = await fetch("/api/send-overview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          workoutPlan: {
            upperbody: client.upperbody,
            lowerbody: client.lowerbody,
            fullbody: client.fullbody,
          },
          mealPlan: client.mealPlan,
        }),
      });

      if (response.ok) {
        setMessage("Email sent successfully!");
      } else {
        const errorData = await response.json();
        setMessage(`Error sending email: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setMessage("Failed to send email.");
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto mt-8 p-6 bg-[#1c1c1c] rounded-lg shadow">
        <p className="text-white text-lg">Loading client data...</p>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="max-w-7xl mx-auto mt-8 p-6 bg-[#1c1c1c] rounded-lg shadow">
        <p className="text-red-500 text-lg font-semibold">
          Error: No client data found!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-8 p-6 bg-[#1c1c1c] rounded-lg shadow">
      <h1 className="text-3xl font-bold text-[#FFA800] mb-6">Client Overview</h1>

      {/* Display Last Workout Plan */}
      <LastWorkoutPlan clientId={clientId} />

      {/* Display Last Meal Plan */}
      <LastMealPlan mealPlan={client.mealPlan} />

      {/* Email Input and Button */}
      <div className="mt-8 bg-[#2b2b2b] p-4 rounded-md shadow">
        <h2 className="text-xl font-semibold text-[#FFA800] mb-4">
          Send Overview to Email
        </h2>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter recipient's email"
            className="p-2 flex-1 rounded-md bg-gray-800 text-white border border-gray-600 w-full sm:w-auto focus:ring-2 focus:ring-[#ffa800]"
          />
          <button
            onClick={handleSendEmail}
            className="bg-[#ffa800] text-black font-semibold py-2 px-4 rounded hover:bg-[#cc8400] focus:ring-2 focus:ring-[#ffa800]"
          >
            Send Email
          </button>
        </div>
        {message && (
          <p className={`mt-4 ${message.includes("success") ? "text-green-400" : "text-red-400"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
