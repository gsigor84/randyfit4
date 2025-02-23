"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
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

  const groupExercisesByDay = (workoutCategory) => {
    if (!client || !client[workoutCategory]) return {};

    return client[workoutCategory].reduce((acc, session) => {
      if (!acc[session.day]) {
        acc[session.day] = [];
      }
      acc[session.day].push(...session.exercises);
      return acc;
    }, {});
  };

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
      <div className="max-w-4xl mx-auto mt-6 p-4 bg-white rounded-lg shadow border border-gray-300">
        <p className="text-gray-700 text-lg">Loading client data...</p>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="max-w-4xl mx-auto mt-6 p-4 bg-white rounded-lg shadow border border-gray-300">
        <p className="text-red-500 text-lg font-semibold">
          ❌ Error: No client data found!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <h1 className="text-2xl font-bold text-[#010326] mb-4">Client Overview</h1>

      {/* Weekly Training Overview */}
      <div className="bg-white mb-4 ">
        <h2 className="text-xl font-semibold text-[#010326] mb-3">Weekly Training Schedule</h2>
        <div className="grid grid-cols-1 gap-6"> {/* Increased spacing */}
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
            (day) => (
              <div key={day} className="p-4 border rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-[#F2B138]">{day}</h3>
                {/* More spacing between day & exercises */}
                <div className="mt-3 space-y-6"> {/* Increased space between exercise groups */}
                  {["upperbody", "lowerbody", "fullbody"].map((category) => {
                    const exercises = groupExercisesByDay(category)[day] || [];
                    return exercises.length > 0 ? (
                      <div key={category} className="mt-4"> {/* Extra top margin */}
                        <p className="font-semibold text-[#07B0F2] text-lg mb-2">
                          {category.toUpperCase()}
                        </p>
                        <div className="space-y-2"> {/* Increased vertical space between exercises */}
                          {exercises.map((exercise, index) => (
                            <p key={index} className="text-md text-gray-700 leading-6">
                              {exercise.name} - {exercise.sets} sets | {exercise.reps} reps | {exercise.weight} kg
                            </p>
                          ))}
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Last Meal Plan */}
      <LastMealPlan mealPlan={client.mealPlan} />

      {/* Email Input & Send Button */}
      <div className="mt-6 bg-[#F2F2F2] p-3 rounded-lg shadow border border-gray-300">
        <h2 className="text-lg font-semibold text-[#010326] mb-3">Send Overview to Email</h2>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter recipient's email"
            className="p-2 text-md flex-1 rounded-lg border border-gray-300 w-full sm:w-auto focus:ring-2 focus:ring-[#07B0F2]"
          />
          <button
            onClick={handleSendEmail}
            className="bg-[#07B0F2] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#005f99] focus:ring-2 focus:ring-[#07B0F2] transition-all"
          >
            {message === "Sending..." ? "Sending..." : "Send Email"}
          </button>
        </div>
        {message && (
          <p className={`mt-2 ${message.includes("✅") ? "text-green-600" : "text-red-500"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
