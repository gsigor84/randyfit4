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
  const [selectedDay, setSelectedDay] = useState("");
  const router = useRouter();

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const toggleExercise = (exercise) => {
    setSelectedExercises((prev) => ({
      ...prev,
      [exercise]: prev[exercise] ? undefined : { reps: 0, sets: 0, weight: 0 },
    }));
  };

  const handleInputChange = (exercise, field, value) => {
    setSelectedExercises((prev) => ({
      ...prev,
      [exercise]: {
        ...prev[exercise],
        [field]: Math.max(0, parseInt(value) || 0),
      },
    }));
  };

  const handleDayChange = (e) => {
    setSelectedDay(e.target.value);
  };

  const handleSubmit = async () => {
    if (!clientId || Object.keys(selectedExercises).length === 0 || !selectedDay) {
      alert("Please select at least one exercise and a day of the week.");
      return;
    }

    const groupedExercises = {
      day: selectedDay,
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: clientId, groupedExercises }),
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
      {/* Day of the Week Dropdown */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2 text-lg font-semibold">
          Select Day of the Week:
        </label>
        <select
          value={selectedDay}
          onChange={handleDayChange}
          className="w-full bg-white text-black border border-gray-300 rounded-lg p-3 h-12"
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
                        type="number"
                        placeholder="Reps"
                        value={selectedExercises[exercise].reps}
                        onChange={(e) => handleInputChange(exercise, "reps", e.target.value)}
                        className="border border-gray-300 text-black bg-white rounded-lg p-3 w-full h-12"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="block text-gray-600 text-sm mb-1">Sets</label>
                      <input
                        type="number"
                        placeholder="Sets"
                        value={selectedExercises[exercise].sets}
                        onChange={(e) => handleInputChange(exercise, "sets", e.target.value)}
                        className="border border-gray-300 text-black bg-white rounded-lg p-3 w-full h-12"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="block text-gray-600 text-sm mb-1">Weight (kg)</label>
                      <input
                        type="number"
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
