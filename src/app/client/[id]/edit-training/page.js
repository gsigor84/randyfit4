"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function EditTrainingPage() {
  const params = useParams();
  const { id } = params;

  const [trainingData, setTrainingData] = useState({
    upperbody: [],
    lowerbody: [],
    fullbody: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrainingData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/get-client?id=${id}`);
        if (!res.ok) throw new Error("Failed to fetch training data");

        const data = await res.json();
        setTrainingData({
          upperbody: data.upperbody || [],
          lowerbody: data.lowerbody || [],
          fullbody: data.fullbody || [],
        });
      } catch (err) {
        setError("Failed to load training data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainingData();
  }, [id]);

  const handleInputChange = (type, entryIndex, exerciseIndex, key, value) => {
    setTrainingData((prev) => ({
      ...prev,
      [type]: prev[type].map((entry, i) =>
        i === entryIndex
          ? {
            ...entry,
            exercises: entry.exercises.map((exercise, j) =>
              j === exerciseIndex ? { ...exercise, [key]: key === "name" ? value : parseInt(value) } : exercise
            ),
          }
          : entry
      ),
    }));
  };

  const handleSave = async () => {
    try {
      const res = await fetch("/api/edit-training", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          upperbody: trainingData.upperbody,
          lowerbody: trainingData.lowerbody,
          fullbody: trainingData.fullbody,
        }),
      });

      if (!res.ok) throw new Error("Failed to save training data");

      alert("Training data updated successfully!");
    } catch (err) {
      console.error("Error saving training data:", err);
      alert("An error occurred while saving the training data.");
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  const renderTrainingSection = (title, type) => (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-[#010326] mb-4">{title}</h2>
      {trainingData[type].map((entry, entryIndex) => (
        <div key={entryIndex} className="mb-4 ">
          <p className="text-sm font-semibold text-[#07B0F2] mb-2">
            <strong>Day:</strong> {entry.day || "N/A"}
          </p>
          <div className="space-y-4">
            {entry.exercises.map((exercise, exerciseIndex) => (
              <div key={exerciseIndex} className="bg-white p-4 rounded-lg shadow border border-gray-300">
                {/* Exercise Name Input */}
                <div className="mb-2">
                  <label className="text-sm font-bold text-gray-600">Exercise Name</label>
                  <input
                    type="text"
                    value={exercise.name}
                    onChange={(e) =>
                      handleInputChange(type, entryIndex, exerciseIndex, "name", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-md p-2 text-md"
                  />
                </div>

                {/* Exercise Details (Sets, Weight, Reps) */}
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-600 mb-1">Sets</label>
                    <input
                      type="number"
                      value={exercise.sets}
                      onChange={(e) =>
                        handleInputChange(type, entryIndex, exerciseIndex, "sets", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-md p-2 h-10 text-md text-center"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-600 mb-1 whitespace-nowrap">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      value={exercise.weight}
                      onChange={(e) =>
                        handleInputChange(type, entryIndex, exerciseIndex, "weight", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-md p-2 h-10 text-md text-center"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-600 mb-1">Reps</label>
                    <input
                      type="number"
                      value={exercise.reps}
                      onChange={(e) =>
                        handleInputChange(type, entryIndex, exerciseIndex, "reps", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-md p-2 h-10 text-md text-center"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-md shadow-md">
      <h1 className="text-3xl font-bold text-[#010326] mb-6 text-center">Edit Training</h1>
      {renderTrainingSection("Upper Body Exercises", "upperbody")}
      {renderTrainingSection("Lower Body Exercises", "lowerbody")}
      {renderTrainingSection("Full Body Exercises", "fullbody")}
      <button
        onClick={handleSave}
        className="mt-4 w-full bg-[#0DA64F] text-white font-semibold py-3 px-6 rounded-md hover:bg-[#087f3a]"
      >
        Save Changes
      </button>
    </div>
  );
}
