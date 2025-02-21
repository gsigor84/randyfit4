"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const lowerBodyExercises = {
  Legs: ["Squats", "Lunges", "Leg Press", "Calf Raises", "Leg Extensions", "Hamstring Curls", "Bulgarian Split Squats"],
  Glutes: ["Hip Thrusts", "Glute Bridges", "Step-Ups", "Cable Kickbacks"],
};

export default function LowerBodyExercises({ clientId }) {
  const [selectedExercises, setSelectedExercises] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const router = useRouter();

  // Handle the change of day from the dropdown
  const handleDayChange = (e) => {
    setSelectedDay(e.target.value);
  };

  // Toggle exercise selection
  const toggleExercise = (exercise) => {
    setSelectedExercises((prev) => ({
      ...prev,
      [exercise]: prev[exercise]
        ? undefined // Deselect if already selected
        : { reps: "", sets: "", weight: "" }, // Now starts as an empty string
    }));
  };

  // Handle input changes
  const handleInputChange = (exercise, field, value) => {
    setSelectedExercises((prev) => ({
      ...prev,
      [exercise]: {
        ...prev[exercise],
        [field]: value.replace(/\D/g, ""), // Allows only numbers
      },
    }));
  };

  // Submit selected exercises to the backend
  const handleSubmit = async () => {
    if (!clientId || Object.keys(selectedExercises).length === 0 || !selectedDay) {
      alert("Please select at least one exercise and a day.");
      return;
    }

    const groupedExercises = {
      day: selectedDay,
      date: new Date().toISOString(),
      exercises: Object.entries(selectedExercises).map(([name, details]) => ({
        name,
        reps: details.reps || 0,
        sets: details.sets || 0,
        weight: details.weight || 0,
      })),
    };

    console.log("Payload being sent:", { id: clientId, groupedExercises });

    setLoading(true);
    try {
      const response = await fetch("/api/update-client-lowerbody", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: clientId,
          groupedExercises,
        }),
      });

      if (response.ok) {
        alert("Exercises added successfully!");
        router.push(`/client/${clientId}/training`);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error submitting exercises:", error);
      alert("An error occurred while adding exercises.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-[#010326] mb-4">Lower Body Exercises</h2>

      {/* Day Selection */}
      <div className="mb-4">
        <label htmlFor="day" className="text-gray-700 text-lg font-semibold">Select Day of the Week:</label>
        <select
          id="day"
          value={selectedDay}
          onChange={handleDayChange}
          className="w-full bg-white text-black border border-gray-300 rounded-lg p-3 h-12"
        >
          <option value="">Select a Day</option>
          <option value="Monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
          <option value="Saturday">Saturday</option>
          <option value="Sunday">Sunday</option>
        </select>
      </div>

      {Object.entries(lowerBodyExercises).map(([muscleGroup, exercises]) => (
        <div key={muscleGroup} className="mb-6">
          <h3 className="text-lg font-semibold text-[#F2B138] mb-2">{muscleGroup}</h3>
          <ul className="space-y-4">
            {exercises.map((exercise, index) => (
              <li key={index} className="flex flex-col space-y-2">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={!!selectedExercises[exercise]}
                    onChange={() => toggleExercise(exercise)}
                    className="w-5 h-5 text-[#07B0F2] focus:ring-[#07B0F2] border-gray-300 rounded"
                  />
                  <span className="text-black font-medium">{exercise}</span>
                </div>

                {/* Input fields for reps, weight, and sets */}
                {selectedExercises[exercise] && (
                  <div className="ml-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col">
                      <label className="block text-gray-600 text-sm mb-1">Reps</label>
                      <input
                        type="text"
                        placeholder="Reps"
                        value={selectedExercises[exercise].reps}
                        onChange={(e) => handleInputChange(exercise, "reps", e.target.value)}
                        className="border border-gray-300 text-black bg-white rounded-lg p-3 w-full h-12"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="block text-gray-600 text-sm mb-1">Sets</label>
                      <input
                        type="text"
                        placeholder="Sets"
                        value={selectedExercises[exercise].sets}
                        onChange={(e) => handleInputChange(exercise, "sets", e.target.value)}
                        className="border border-gray-300 text-black bg-white rounded-lg p-3 w-full h-12"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="block text-gray-600 text-sm mb-1">Weight (kg)</label>
                      <input
                        type="text"
                        placeholder="Weight"
                        value={selectedExercises[exercise].weight}
                        onChange={(e) => handleInputChange(exercise, "weight", e.target.value)}
                        className="border border-gray-300 text-black bg-white rounded-lg p-3 w-full h-12"
                      />
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-4 w-full bg-[#07B0F2] text-white py-3 px-4 rounded-lg hover:bg-[#005f99] focus:ring-2 focus:ring-[#07B0F2] transition-all"
      >
        {loading ? "Saving..." : "Save Exercises"}
      </button>
    </div>
  );
}
