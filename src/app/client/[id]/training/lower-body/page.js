"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const lowerBodyExercises = {
  Quads: [
    "Squats",
    "Front Squats",
    "Leg Press",
    "Split Squats",
    "Walking Lunges",
    "Step-Ups",
    "Leg Extensions",
  ],
  Hamstrings: [
    "Romanian Deadlifts",
    "Deadlifts",
    "Hamstring Curls",
    "Good Mornings",
    "Glute-Ham Raises",
    "Cable Pull-Throughs",
  ],
  Glutes: [
    "Hip Thrusts",
    "Glute Bridges",
    "Sumo Deadlifts",
    "Split Squats",
    "Cable Kickbacks",
    "Step-Ups",
    "Frog Pumps",
  ],
  Calves: [
    "Standing Calf Raises",
    "Seated Calf Raises",
    "Donkey Calf Raises",
    "Single-Leg Calf Raises",
    "Jump Rope",
    "Farmer’s Walk",
  ],
  Adductors: [
    "Sumo Deadlifts",
    "Cossack Squats",
    "Side Lunges",
    "Adductor Machine",
    "Cable Leg Pulls",
  ],
  Abductors: [
    "Clamshells",
    "Lateral Band Walks",
    "Cable Side Kicks",
    "Side-Lying Leg Raises",
    "Hip Abduction Machine",
  ],
};


export default function LowerBodyPage({ params }) {
  const { id } = params; // Extract client ID
  const router = useRouter(); // For redirection after adding exercises
  const [selectedExercises, setSelectedExercises] = useState([]);

  const handleToggleExercise = (exerciseName) => {
    setSelectedExercises((prev) =>
      prev.includes(exerciseName)
        ? prev.filter((e) => e !== exerciseName)
        : [...prev, exerciseName]
    );
  };

  const handleAddSelected = async () => {
    if (selectedExercises.length === 0) {
      alert("Please select at least one exercise.");
      return;
    }

    try {
      const response = await fetch("/api/update-client-lowerbody", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          exercises: selectedExercises.map((name) => ({
            name,
            sets: 1, // Default sets
            weight: 5, // Default weight
            reps: 1, // Default reps
          })),
        }),
      });

      if (response.ok) {
        router.push(`/client/${id}/training`); // Redirect to training page
      } else {
        const errorData = await response.json();
        console.error("Error saving exercises:", errorData.error);
        alert("Failed to save exercises.");
      }
    } catch (error) {
      console.error("Error adding exercises:", error);
      alert("An error occurred while adding exercises.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-8">
      <h1 className="text-2xl font-semibold mb-4">Lower Body Exercises</h1>
      <div className="bg-gray-100 p-4 rounded shadow mb-6">
        <h2 className="text-lg font-medium mb-4">Select Exercises</h2>
        {Object.entries(lowerBodyExercises).map(([category, exercises]) => (
          <div key={category} className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800">{category}</h3>
            <ul className="space-y-2 mt-2">
              {exercises.map((exercise, index) => (
                <li key={index} className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    id={`${category}-${index}`}
                    checked={selectedExercises.includes(exercise)}
                    onChange={() => handleToggleExercise(exercise)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`${category}-${index}`}
                    className="text-gray-700"
                  >
                    {exercise}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {/* Add Selected Exercises Button */}
      <button
        onClick={handleAddSelected}
        className="mt-6 bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600 focus:ring-2 focus:ring-green-300"
      >
        Add Selected Exercises
      </button>
    </div>
  );
}
