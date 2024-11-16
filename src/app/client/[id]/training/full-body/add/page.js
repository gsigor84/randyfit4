"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AddFullBodyExercise({ params }) {
  const { id } = params; // Extract client ID
  const router = useRouter(); // For navigation after saving changes

  const [lastExerciseEntry, setLastExerciseEntry] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state

  // Fetch the last full-body exercise entry
  useEffect(() => {
    const fetchLastEntry = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/get-client?id=${id}`);
        const data = await response.json();
        const fullbody = data.fullbody || [];
        const lastEntry = fullbody[fullbody.length - 1] || null;
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
      } finally {
        setIsLoading(false);
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

    // Validation: Check for empty fields
    if (exercises.some((exercise) => !exercise.name || !exercise.sets || !exercise.weight || !exercise.reps)) {
      alert("Please complete all exercise fields before submitting.");
      return;
    }

    try {
      const response = await fetch("/api/update-client-fullbody", {
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
        alert("Exercises saved successfully!");
        router.push(`/client/${id}/training`); // Redirect to training page
      } else {
        const errorData = await response.json();
        alert(`Failed to update exercises: ${errorData.error}`);
      }
    } catch (error) {
      alert("An error occurred while updating exercises.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#ffa800]"></div>
      </div>
    );
  }

  if (!lastExerciseEntry) {
    return (
      <div className="max-w-7xl mx-auto mt-8 text-center">
        <h1 className="text-2xl font-semibold text-[#ffa800] mb-4">Add Full Body Exercise</h1>
        <p className="text-gray-300">
          No previous exercises found. Start adding exercises to begin tracking!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-8">
      <h1 className="text-2xl font-semibold text-[#ffa800] mb-4">Edit Last Full Body Exercise</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {exercises.map((exercise, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row md:items-center justify-between mb-4 bg-[#2c2c2c] p-4 rounded-lg shadow"
          >
            {/* Exercise Name */}
            <div className="mb-2 md:mb-0">
              <label
                htmlFor={`name-${index}`}
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Exercise Name
              </label>
              <input
                id={`name-${index}`}
                type="text"
                value={exercise.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                className="border border-gray-600 rounded px-3 py-1 text-sm bg-[#1c1c1c] text-white focus:ring-[#ffa800] focus:border-[#ffa800]"
              />
            </div>

            {/* Inputs for Sets, Weight, Reps */}
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div>
                <label
                  htmlFor={`sets-${index}`}
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Sets
                </label>
                <select
                  id={`sets-${index}`}
                  value={exercise.sets}
                  onChange={(e) =>
                    handleChange(index, "sets", Number(e.target.value))
                  }
                  className="border border-gray-600 rounded px-3 py-1 text-sm bg-[#1c1c1c] text-white focus:ring-[#ffa800] focus:border-[#ffa800]"
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
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Weight (kg)
                </label>
                <select
                  id={`weight-${index}`}
                  value={exercise.weight}
                  onChange={(e) =>
                    handleChange(index, "weight", Number(e.target.value))
                  }
                  className="border border-gray-600 rounded px-3 py-1 text-sm bg-[#1c1c1c] text-white focus:ring-[#ffa800] focus:border-[#ffa800]"
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
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Reps
                </label>
                <select
                  id={`reps-${index}`}
                  value={exercise.reps}
                  onChange={(e) =>
                    handleChange(index, "reps", Number(e.target.value))
                  }
                  className="border border-gray-600 rounded px-3 py-1 text-sm bg-[#1c1c1c] text-white focus:ring-[#ffa800] focus:border-[#ffa800]"
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
          className="mt-6 bg-[#ffa800] text-black py-2 px-6 rounded hover:bg-[#cc8400] focus:ring-2 focus:ring-[#ffa800]"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
