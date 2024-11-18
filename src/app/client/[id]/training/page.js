"use client";

import { useState, useEffect } from "react";
import AddExerciseButton from "../../../components/AddExerciseButton";
import { useParams } from "next/navigation";

export default function TrainingPage() {
  const params = useParams();
  const id = params?.id;

  const [upperBodyExercises, setUpperBodyExercises] = useState([]);
  const [lowerBodyExercises, setLowerBodyExercises] = useState([]);
  const [fullBodyExercises, setFullBodyExercises] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setError("No client ID provided.");
      return;
    }

    const fetchClientData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/get-client?id=${id}`);
        if (!res.ok) throw new Error("Failed to fetch client data");

        const data = await res.json();

        setUpperBodyExercises(data.upperbody || []);
        setLowerBodyExercises(data.lowerbody || []);
        setFullBodyExercises(data.fullbody || []);
      } catch (err) {
        console.error("Error fetching client data:", err);
        setError("Failed to fetch client data.");
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto mt-8">
        <h1 className="text-3xl font-semibold text-[#FFA800] mb-6">Loading...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto mt-8">
        <h1 className="text-3xl font-semibold text-red-500 mb-6">Error</h1>
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  const renderExerciseTable = (exercises) => (
    <table className="table-auto w-full text-sm text-left border-collapse border border-gray-700">
      <thead>
        <tr className="bg-gray-800 text-gray-300">
          <th className="border border-gray-600 px-2 py-1">Exercise Name</th>
          <th className="border border-gray-600 px-2 py-1">Sets</th>
          <th className="border border-gray-600 px-2 py-1">Weight (kg)</th>
          <th className="border border-gray-600 px-2 py-1">Reps</th>
        </tr>
      </thead>
      <tbody>
        {exercises.map((exercise, index) => (
          <tr key={index} className="odd:bg-gray-700 even:bg-gray-800">
            <td className="border border-gray-600 px-2 py-1 text-gray-300">{exercise.name}</td>
            <td className="border border-gray-600 px-2 py-1 text-gray-300">{exercise.sets}</td>
            <td className="border border-gray-600 px-2 py-1 text-gray-300">{exercise.weight}</td>
            <td className="border border-gray-600 px-2 py-1 text-gray-300">{exercise.reps}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderExerciseEntries = (entries) =>
    entries.map((entry, index) => (
      <div key={index} className="mb-6">
        <p className="text-sm text-gray-300">
          <strong>Saved on:</strong>{" "}
          {entry.date ? new Date(entry.date).toLocaleDateString() : "N/A"}
        </p>
        {renderExerciseTable(entry.exercises || [entry])}
      </div>
    ));

  return (
    <div className="max-w-7xl mx-auto mt-8">
      <h1 className="text-3xl font-semibold text-[#FFA800] mb-6">Training Overview</h1>

      {/* Upper Body Section */}
      <div className="bg-[#2B2B2B] p-6 rounded shadow mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#FFA800]">Upper Body Exercises</h2>
          <AddExerciseButton label="Add Upper Body Exercises" navigateTo={`/client/${id}/training/upper-body`} />
        </div>
        {upperBodyExercises.length > 0 ? (
          renderExerciseEntries(upperBodyExercises)
        ) : (
          <p className="text-gray-300">No upper body exercises recorded yet.</p>
        )}
      </div>

      {/* Lower Body Section */}
      <div className="bg-[#2B2B2B] p-6 rounded shadow mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#FFA800]">Lower Body Exercises</h2>
          <AddExerciseButton label="Add Lower Body Exercises" navigateTo={`/client/${id}/training/lower-body`} />
        </div>
        {lowerBodyExercises.length > 0 ? (
          renderExerciseEntries(lowerBodyExercises)
        ) : (
          <p className="text-gray-300">No lower body exercises recorded yet.</p>
        )}
      </div>

      {/* Full Body Section */}
      <div className="bg-[#2B2B2B] p-6 rounded shadow mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#FFA800]">Full Body Exercises</h2>
          <AddExerciseButton label="Add Full Body Exercises" navigateTo={`/client/${id}/training/full-body`} />
        </div>
        {fullBodyExercises.length > 0 ? (
          renderExerciseEntries(fullBodyExercises)
        ) : (
          <p className="text-gray-300">No full body exercises recorded yet.</p>
        )}
      </div>
    </div>
  );
}
