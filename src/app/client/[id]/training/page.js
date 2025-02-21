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
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow border border-gray-300">
        <h1 className="text-3xl font-semibold text-[#F2B138] mb-6">Loading...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow border border-gray-300">
        <h1 className="text-3xl font-semibold text-red-500 mb-6">Error</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const renderExerciseEntries = (entries) =>
    entries.map((entry, index) => (
      <div key={index} className="mb-6">
        <p className="text-sm text-gray-600">
          <strong>Saved on:</strong> {entry.day || "N/A"}
        </p>
        {entry.exercises?.map((exercise, idx) => (
          <div
            key={idx}
            className="bg-white p-4 "
          >
            <p className="text-lg font-semibold text-[#010326]">{exercise.name}</p>
            <p className="text-gray-700 mt-2">
              <strong>Sets:</strong> {exercise.sets || "-"} | <strong>Weight:</strong> {exercise.weight || "-"} kg |{" "}
              <strong>Reps:</strong> {exercise.reps || "-"}
            </p>
          </div>
        ))}
      </div>
    ));

  return (
    <div className="max-w-4xl mx-auto mt-8 bg-white ">
      <h1 className="text-3xl font-bold text-[#010326] mb-6">Training Overview</h1>

      {/* Upper Body Section */}
      <div >
        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-4">
          <h2 className="text-lg font-bold text-[#010326]">Upper Body Exercises</h2>
          <AddExerciseButton
            label="Add Upper Body Exercises"
            navigateTo={`/client/${id}/training/upper-body`}
            className="bg-[#07B0F2] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#005f99] w-full sm:w-auto"
          />
        </div>
        {upperBodyExercises.length > 0 ? (
          renderExerciseEntries(upperBodyExercises)
        ) : (
          <p className="text-gray-600">No upper body exercises recorded yet.</p>
        )}
      </div>

      {/* Lower Body Section */}
      <div className="bg-[#F2F2F2] p-6 rounded-lg shadow mb-8 border border-gray-300">
        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-4">
          <h2 className="text-lg font-bold text-[#010326]">Lower Body Exercises</h2>
          <AddExerciseButton
            label="Add Lower Body Exercises"
            navigateTo={`/client/${id}/training/lower-body`}
            className="bg-[#0DA64F] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#087f3a] w-full sm:w-auto"
          />
        </div>
        {lowerBodyExercises.length > 0 ? (
          renderExerciseEntries(lowerBodyExercises)
        ) : (
          <p className="text-gray-600">No lower body exercises recorded yet.</p>
        )}
      </div>

      {/* Full Body Section */}
      <div className="bg-[#F2F2F2] p-6 rounded-lg shadow mb-8 border border-gray-300">
        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-4">
          <h2 className="text-lg font-bold text-[#010326]">Full Body Exercises</h2>
          <AddExerciseButton
            label="Add Full Body Exercises"
            navigateTo={`/client/${id}/training/full-body`}
            className="bg-[#F25922] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#cc471a] w-full sm:w-auto"
          />
        </div>
        {fullBodyExercises.length > 0 ? (
          renderExerciseEntries(fullBodyExercises)
        ) : (
          <p className="text-gray-600">No full body exercises recorded yet.</p>
        )}
      </div>
    </div>
  );
}
