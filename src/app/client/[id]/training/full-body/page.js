"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const fullBodyExercises = {
  "Strength-Focused Exercises": [
    "Deadlifts",
    "Clean and Jerk",
    "Snatch",
    "Front Squats to Press",
    "Kettlebell Swings",
    "Turkish Get-Ups",
    "Farmer’s Carry",
  ],
  "Cardio-Focused Exercises": [
    "Burpees",
    "Mountain Climbers",
    "Rowing",
    "Battle Ropes",
    "Jump Rope",
    "HIIT Circuits",
  ],
  "Functional Exercises": [
    "Medicine Ball Slams",
    "Sled Pushes",
    "Box Jumps",
    "Sandbag Carries",
    "Bear Crawls",
  ],
  "Bodyweight Exercises": [
    "Push-Up to Row",
    "Burpees with Push-Up",
    "Bodyweight Squats",
    "Pull-Ups",
    "Inchworms",
    "Lunge to Reach",
  ],
  "Weighted Exercises": [
    "Thrusters",
    "Man Makers",
    "Barbell Complex",
    "Dumbbell Clean and Press",
    "Weighted Step-Up",
  ],
  "Core-Focused Exercises": [
    "Plank to Row",
    "Hanging Knee Raises",
    "Medicine Ball Throws",
    "Bear Crawl to Push-Up",
    "Mountain Climbers with Twist",
  ],
};

export default function FullBodyPage({ params }) {
  const { id } = params; // Extract client ID
  const router = useRouter();
  const [selectedExercises, setSelectedExercises] = useState([]);

  const handleToggleExercise = (exerciseName) => {
    setSelectedExercises((prev) =>
      prev.includes(exerciseName)
        ? prev.filter((e) => e !== exerciseName)
        : [...prev, exerciseName]
    );
  };

  const handleAddSelected = async () => {
    try {
      const response = await fetch("/api/update-client-fullbody", {
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
      <h1 className="text-2xl font-semibold mb-4">Full Body Exercises</h1>
      <div className="bg-gray-100 p-4 rounded shadow mb-6">
        <h2 className="text-lg font-medium mb-4">Select Exercises</h2>
        {Object.entries(fullBodyExercises).map(([category, exercises]) => (
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
