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
        setClient(data);
      } catch (error) {
        console.error("Error fetching client data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [clientId]);

  const handleSendEmail = async () => {
    if (!email.trim()) {
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
            upperbody: client.upperbody || [],
            lowerbody: client.lowerbody || [],
            fullbody: client.fullbody || [],
          },
          mealPlan: client.mealPlan || [],
        }),
      });

      if (response.ok) {
        setMessage("✅ Email sent successfully!");
      } else {
        const errorData = await response.json();
        setMessage(`❌ Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setMessage("❌ Failed to send email.");
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow border border-gray-300">
        <p className="text-gray-700 text-lg">Loading client data...</p>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow border border-gray-300">
        <p className="text-red-500 text-lg font-semibold">
          ❌ Error: No client data found!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h1 className="text-3xl font-bold text-[#010326] mb-6">Client Overview</h1>

      {/* Last Workout Plan */}
      <LastWorkoutPlan clientId={clientId} />

      {/* Last Meal Plan */}
      <LastMealPlan mealPlan={client.mealPlan} />

      {/* Email Input & Send Button */}
      <div className="mt-8 bg-[#F2F2F2] p-4 rounded-lg shadow border border-gray-300">
        <h2 className="text-xl font-semibold text-[#010326] mb-4">Send Overview to Email</h2>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter recipient's email"
            className="p-3 text-lg flex-1 rounded-lg border border-gray-300 w-full sm:w-auto focus:ring-2 focus:ring-[#07B0F2]"
          />
          <button
            onClick={handleSendEmail}
            className="bg-[#07B0F2] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#005f99] focus:ring-2 focus:ring-[#07B0F2] transition-all"
          >
            {message === "Sending..." ? "Sending..." : "Send Email"}
          </button>
        </div>
        {message && (
          <p className={`mt-4 ${message.includes("✅") ? "text-green-600" : "text-red-500"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
