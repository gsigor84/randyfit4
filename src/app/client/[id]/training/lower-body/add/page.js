"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AddLowerBodyExercise({ params }) {
  const { id } = params; // Extract client ID
  const router = useRouter(); // For navigation after saving changes

  const [lastExerciseEntry, setLastExerciseEntry] = useState(null);
  const [exercises, setExercises] = useState([]);

  // Fetch the last lower body exercise entry
  useEffect(() => {
    const fetchLastEntry = async () => {
      try {
        const response = await fetch(`/api/get-client?id=${id}`);
        const data = await response.json();
        const lowerbody = data.lowerbody || [];
        const lastEntry = lowerbody[lowerbody.length - 1] || null;
        setLastExerciseEntry(lastEntry);

        if (lastEntry) {
          setExercises(
            lastEntry.exercises.map((exercise) => ({
              name: exercise.name,
              sets: exercise.sets || 1,
              weight: exercise.weight || 5,
              reps: exercise.reps || 1,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching client data:", error);
      }
    };

    fetchLastEntry();
  }, [id]);

  const handleChange = (index, field, value) => {
    setExercises((prev) =>
      prev.map((exercise, idx) =>
        idx === index ? { ...exercise, [field]: value } : exercise
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/update-client-lowerbody", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          exercises: exercises.map((exercise) => ({
            ...exercise,
            sets: Number(exercise.sets),
            weight: Number(exercise.weight),
            reps: Number(exercise.reps),
          })),
        }),
      });

      if (response.ok) {
        router.push(`/client/${id}/training`);
      } else {
        const errorData = await response.json();
        alert(`Failed to update exercises: ${errorData.error}`);
      }
    } catch (error) {
      alert("An error occurred while updating exercises.");
    }
  };

  if (!lastExerciseEntry) {
    return (
      <div className="max-w-7xl mx-auto mt-8">
        <h1 className="text-2xl font-semibold mb-4">Add Lower Body Exercise</h1>
        <p className="text-gray-500">No previous exercises found. Start by adding a new one!</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-8">
      <h1 className="text-2xl font-semibold mb-4">Edit Last Lower Body Exercise</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {exercises.map((exercise, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row md:items-center justify-between mb-4 bg-gray-100 p-4 rounded shadow"
          >
            {/* Exercise Name */}
            <div className="mb-2 md:mb-0">
              <h2 className="text-sm md:text-md font-medium text-gray-800">{exercise.name}</h2>
            </div>

            {/* Inputs for Sets, Weight, Reps */}
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div>
                <label
                  htmlFor={`sets-${index}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Sets
                </label>
                <select
                  id={`sets-${index}`}
                  value={exercise.sets}
                  onChange={(e) =>
                    handleChange(index, "sets", Number(e.target.value))
                  }
                  className="border border-gray-300 rounded px-3 py-1 text-sm"
                >
                  {[...Array(6).keys()].map((num) => (
                    <option key={num + 1} value={num + 1}>
                      {num + 1}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor={`weight-${index}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Weight (kg)
                </label>
                <select
                  id={`weight-${index}`}
                  value={exercise.weight}
                  onChange={(e) =>
                    handleChange(index, "weight", Number(e.target.value))
                  }
                  className="border border-gray-300 rounded px-3 py-1 text-sm"
                >
                  {Array.from({ length: 40 }, (_, i) => (i + 1) * 5).map(
                    (weight) => (
                      <option key={weight} value={weight}>
                        {weight}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label
                  htmlFor={`reps-${index}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Reps
                </label>
                <select
                  id={`reps-${index}`}
                  value={exercise.reps}
                  onChange={(e) =>
                    handleChange(index, "reps", Number(e.target.value))
                  }
                  className="border border-gray-300 rounded px-3 py-1 text-sm"
                >
                  {Array.from({ length: 20 }, (_, i) => i + 1).map((rep) => (
                    <option key={rep} value={rep}>
                      {rep}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}

        <button
          type="submit"
          className="mt-6 bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
