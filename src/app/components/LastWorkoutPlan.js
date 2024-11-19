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
    return <p className="text-white text-center p-4">Loading...</p>;
  }

  if (!clientData) {
    return <p className="text-white text-center p-4">No client data found.</p>;
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
        <p className="text-sm text-gray-400 mb-4">
          <strong>{day}:</strong> Off
        </p>
      );
    }

    return (
      <div key={day} className="mb-6">
        <p className="text-sm text-gray-300 mb-2">
          <strong>{day}:</strong>
        </p>
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-[#333] text-[#FFD700]">
                <th className="px-2 sm:px-4 py-2">Exercise Name</th>
                <th className="px-2 sm:px-4 py-2">Sets</th>
                <th className="px-2 sm:px-4 py-2">Weight (kg)</th>
                <th className="px-2 sm:px-4 py-2">Reps</th>
              </tr>
            </thead>
            <tbody>
              {workout.exercises.map((exercise, index) => (
                <tr
                  key={index}
                  className="odd:bg-[#444] even:bg-[#333] hover:bg-[#555]"
                >
                  <td className="px-2 sm:px-4 py-2 text-white">
                    {exercise.name}
                  </td>
                  <td className="px-2 sm:px-4 py-2 text-white">
                    {exercise.sets}
                  </td>
                  <td className="px-2 sm:px-4 py-2 text-white">
                    {exercise.weight}
                  </td>
                  <td className="px-2 sm:px-4 py-2 text-white">
                    {exercise.reps}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderCategory = (title, lastWorkoutsByDay) => (
    <div className="bg-[#333] p-4 sm:p-6 rounded-md shadow-lg mb-8">
      <h2 className="text-lg sm:text-2xl font-semibold text-[#FFD700] mb-4">
        {title}
      </h2>
      {daysOfWeek.map((day) => renderLastWorkoutForDay(day, lastWorkoutsByDay[day]))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto sm:p-8 ">
      <h1 className="text-2xl sm:text-4xl font-bold text-[#FFD700] mb-6 text-center">
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
