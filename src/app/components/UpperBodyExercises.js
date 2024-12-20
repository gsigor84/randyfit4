"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const upperBodyExercises = {
  Chest: ["Bench Press", "Incline Bench Press", "Push-Ups", "Chest Flys", "Dips", "Pec Deck", "Cable Crossovers"],
  Back: ["Pull-Ups", "Lat Pulldown", "Barbell Rows", "Deadlifts", "Cable Rows", "T-Bar Rows", "Face Pulls"],
  Shoulders: ["Overhead Press", "Lateral Raises", "Front Raises", "Arnold Press", "Upright Rows", "Rear Delt Flys", "Shrugs"],
  Biceps: ["Barbell Curls", "Dumbbell Curls", "Preacher Curls", "Cable Curls", "Incline Curls", "Chin-Ups"],
  Triceps: ["Tricep Dips", "Close-Grip Bench Press", "Overhead Extensions", "Tricep Pushdowns", "Skull Crushers", "Diamond Push-Ups"],
  Core: ["Plank Taps", "Hanging Leg Raises", "Cable Woodchoppers", "Ab Rollouts", "Sit-Ups"],
};

export default function UpperBodyExercises({ clientId }) {
  const [selectedExercises, setSelectedExercises] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState(""); // For storing the selected day of the week
  const router = useRouter();

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // Toggle exercise selection
  const toggleExercise = (exercise) => {
    setSelectedExercises((prev) => ({
      ...prev,
      [exercise]: prev[exercise] ? undefined : { reps: 0, sets: 0, weight: 0 },
    }));
  };

  // Handle input changes
  const handleInputChange = (exercise, field, value) => {
    setSelectedExercises((prev) => ({
      ...prev,
      [exercise]: {
        ...prev[exercise],
        [field]: Math.max(0, parseInt(value) || 0),
      },
    }));
  };

  // Handle Day of Week change
  const handleDayChange = (e) => {
    setSelectedDay(e.target.value);
  };

  // Submit selected exercises to the backend
  const handleSubmit = async () => {
    if (!clientId || Object.keys(selectedExercises).length === 0 || !selectedDay) {
      alert("Please select at least one exercise and a day of the week.");
      return;
    }

    const groupedExercises = {
      day: selectedDay, // Include the selected day here
      date: new Date().toISOString(),
      exercises: Object.entries(selectedExercises).map(([name, details]) => ({
        name,
        reps: details.reps,
        sets: details.sets,
        weight: details.weight,
      })),
    };

    setLoading(true);
    try {
      const response = await fetch("/api/update-client-upperbody", {
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
    <div className="bg-[#2B2B2B] p-6 rounded-lg shadow mb-8">
      <h2 className="text-xl font-bold text-[#FFA800] mb-4">Upper Body Exercises</h2>

      {/* Day of the Week Dropdown */}
      <div className="mb-4">
        <label className="block text-white mb-2">Select Day of the Week:</label>
        <select
          value={selectedDay}
          onChange={handleDayChange}
          className="w-full bg-gray-800 text-white border border-gray-600 rounded p-2"
        >
          <option value="">Select a Day</option>
          {daysOfWeek.map((day, index) => (
            <option key={index} value={day}>
              {day}
            </option>
          ))}
        </select>
      </div>

      {Object.entries(upperBodyExercises).map(([muscleGroup, exercises]) => (
        <div key={muscleGroup} className="mb-6">
          <h3 className="text-lg font-semibold text-[#FFA800] mb-2">{muscleGroup}</h3>
          <ul className="space-y-4">
            {exercises.map((exercise, index) => (
              <li key={index} className="flex flex-col space-y-2">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={!!selectedExercises[exercise]}
                    onChange={() => toggleExercise(exercise)}
                    className="h-4 w-4 text-[#FFA800] focus:ring-[#FFA800] border-gray-300 rounded"
                  />
                  <span className="text-white font-medium">{exercise}</span>
                </div>

                {/* Input fields for reps, weight, and sets */}
                {selectedExercises[exercise] && (
                  <div className="ml-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col">
                      <label className="block text-gray-300 text-sm mb-1">Reps</label>
                      <input
                        type="number"
                        placeholder="Reps"
                        value={selectedExercises[exercise].reps}
                        onChange={(e) => handleInputChange(exercise, "reps", e.target.value)}
                        className="border border-gray-600 text-white bg-gray-800 rounded p-2 w-full focus:ring-2 focus:ring-[#FFA800]"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="block text-gray-300 text-sm mb-1">Sets</label>
                      <input
                        type="number"
                        placeholder="Sets"
                        value={selectedExercises[exercise].sets}
                        onChange={(e) => handleInputChange(exercise, "sets", e.target.value)}
                        className="border border-gray-600 text-white bg-gray-800 rounded p-2 w-full focus:ring-2 focus:ring-[#FFA800]"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="block text-gray-300 text-sm mb-1">Weight (kg)</label>
                      <input
                        type="number"
                        placeholder="Weight"
                        value={selectedExercises[exercise].weight}
                        onChange={(e) => handleInputChange(exercise, "weight", e.target.value)}
                        className="border border-gray-600 text-white bg-gray-800 rounded p-2 w-full focus:ring-2 focus:ring-[#FFA800]"
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
        className={`mt-4 w-full bg-[#FFA800] text-black py-2 px-4 rounded hover:bg-[#cc8400] focus:ring-2 focus:ring-[#FFA800] transition-all ${loading && "opacity-50 cursor-not-allowed"}`}
      >
        {loading ? "Saving..." : "Save Exercises"}
      </button>
    </div>
  );
}
