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

  const handleInputChange = (type, index, field, value) => {
    setTrainingData((prev) => ({
      ...prev,
      [type]: prev[type].map((entry, i) =>
        i === index
          ? {
            ...entry,
            exercises: entry.exercises.map((exercise, j) =>
              j === field.index
                ? { ...exercise, [field.key]: field.key === "name" ? value : parseInt(value) }
                : exercise
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
    return <p className="text-center text-white">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  const renderTrainingSection = (title, type) => (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-[#ffa800] mb-4">{title}</h2>
      {trainingData[type].map((entry, entryIndex) => (
        <div key={entryIndex} className="mb-4">
          <p className="text-sm text-gray-300 mb-2">
            <strong>Day:</strong> {entry.day || "N/A"}
          </p>
          <table className="table-auto w-full text-sm border-collapse border border-gray-700">
            <thead>
              <tr className="bg-gray-800 text-gray-300">
                <th className="border border-gray-600 px-2 py-1">Exercise Name</th>
                <th className="border border-gray-600 px-2 py-1">Sets</th>
                <th className="border border-gray-600 px-2 py-1">Weight (kg)</th>
                <th className="border border-gray-600 px-2 py-1">Reps</th>
              </tr>
            </thead>
            <tbody>
              {entry.exercises.map((exercise, exerciseIndex) => (
                <tr key={exerciseIndex} className="odd:bg-gray-700 even:bg-gray-800">
                  <td className="border border-gray-600 px-2 py-1">
                    <input
                      type="text"
                      value={exercise.name}
                      onChange={(e) =>
                        handleInputChange(type, entryIndex, { index: exerciseIndex, key: "name" }, e.target.value)
                      }
                      className="w-full bg-gray-900 text-white p-1 rounded"
                    />
                  </td>
                  <td className="border border-gray-600 px-2 py-1">
                    <input
                      type="number"
                      value={exercise.sets}
                      onChange={(e) =>
                        handleInputChange(type, entryIndex, { index: exerciseIndex, key: "sets" }, e.target.value)
                      }
                      className="w-full bg-gray-900 text-white p-1 rounded"
                    />
                  </td>
                  <td className="border border-gray-600 px-2 py-1">
                    <input
                      type="number"
                      value={exercise.weight}
                      onChange={(e) =>
                        handleInputChange(type, entryIndex, { index: exerciseIndex, key: "weight" }, e.target.value)
                      }
                      className="w-full bg-gray-900 text-white p-1 rounded"
                    />
                  </td>
                  <td className="border border-gray-600 px-2 py-1">
                    <input
                      type="number"
                      value={exercise.reps}
                      onChange={(e) =>
                        handleInputChange(type, entryIndex, { index: exerciseIndex, key: "reps" }, e.target.value)
                      }
                      className="w-full bg-gray-900 text-white p-1 rounded"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 bg-[#1c1c1c] rounded-md shadow-md">
      <h1 className="text-3xl font-bold text-[#ffa800] mb-6">Edit Training</h1>
      {renderTrainingSection("Upper Body Exercises", "upperbody")}
      {renderTrainingSection("Lower Body Exercises", "lowerbody")}
      {renderTrainingSection("Full Body Exercises", "fullbody")}
      <button
        onClick={handleSave}
        className="mt-4 bg-[#ffa800] text-black font-semibold py-2 px-6 rounded hover:bg-[#cc8400]"
      >
        Save Changes
      </button>
    </div>
  );
}
