"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function WorkoutPage() {
  const params = useParams();
  const { id } = params;

  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    if (!id) return;

    const fetchClientData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/get-client?id=${id}`);
        if (!res.ok) throw new Error("Failed to fetch client data");

        const data = await res.json();
        setClientData(data); // Save client data including workout data
      } catch (error) {
        console.error("Error fetching client data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow border border-gray-300">
        <h1 className="text-3xl font-semibold text-[#F2B138] mb-6">Loading...</h1>
      </div>
    );
  }

  if (!clientData) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow border border-gray-300">
        <h1 className="text-3xl font-semibold text-red-500 mb-6">Error</h1>
        <p className="text-red-500">No client data found.</p>
      </div>
    );
  }

  // Helper function to get the last workout for each day
  const getLastWorkoutByDay = (exercises) => {
    const lastWorkouts = daysOfWeek.reduce((acc, day) => {
      const workoutsForDay = exercises.filter((entry) => entry.day === day);
      acc[day] = workoutsForDay.length > 0 ? workoutsForDay[workoutsForDay.length - 1] : null;
      return acc;
    }, {});
    return lastWorkouts;
  };

  // Get the last workout for each day for each category
  const lastUpperBodyWorkouts = getLastWorkoutByDay(clientData.upperbody || []);
  const lastLowerBodyWorkouts = getLastWorkoutByDay(clientData.lowerbody || []);
  const lastFullBodyWorkouts = getLastWorkoutByDay(clientData.fullbody || []);

  // Render the last workout for a specific day
  const renderLastWorkoutForDay = (day, workout) => {
    if (!workout) {
      return (
        <p className="text-sm text-gray-500 mb-4">
          <strong>{day}:</strong> Off
        </p>
      );
    }

    return (
      <div key={day} className="mb-6">
        <p className="text-sm text-gray-700 mb-2">
          <strong>{day}:</strong>
        </p>
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-sm text-left border-collapse border border-gray-300">
            <thead>
              <tr className="bg-[#F2F2F2] text-[#010326]">
                <th className="px-2 sm:px-4 py-2 border border-gray-300">Exercise</th>
                <th className="px-2 sm:px-4 py-2 border border-gray-300">Sets</th>
                <th className="px-2 sm:px-4 py-2 border border-gray-300">Weight (kg)</th>
                <th className="px-2 sm:px-4 py-2 border border-gray-300">Reps</th>
              </tr>
            </thead>
            <tbody>
              {workout.exercises.map((exercise, index) => (
                <tr key={index} className="odd:bg-white even:bg-gray-100 hover:bg-gray-200">
                  <td className="px-2 sm:px-4 py-2 text-gray-800">{exercise.name}</td>
                  <td className="px-2 sm:px-4 py-2 text-gray-800">{exercise.sets}</td>
                  <td className="px-2 sm:px-4 py-2 text-gray-800">{exercise.weight}</td>
                  <td className="px-2 sm:px-4 py-2 text-gray-800">{exercise.reps}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderCategory = (title, lastWorkoutsByDay) => (
    <div className="bg-[#F2F2F2] p-6 rounded-lg shadow border border-gray-300 mb-8">
      <h2 className="text-lg sm:text-2xl font-semibold text-[#010326] mb-4">{title}</h2>
      {daysOfWeek.map((day) => renderLastWorkoutForDay(day, lastWorkoutsByDay[day]))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto sm:p-8">
      <h1 className="text-2xl sm:text-4xl font-bold text-[#010326] mb-6 text-center">
        Training Overview
      </h1>

      {/* Upper Body Section */}
      {renderCategory("Upper Body Exercises", lastUpperBodyWorkouts)}

      {/* Lower Body Section */}
      {renderCategory("Lower Body Exercises", lastLowerBodyWorkouts)}

      {/* Full Body Section */}
      {renderCategory("Full Body Exercises", lastFullBodyWorkouts)}
    </div>
  );
}
