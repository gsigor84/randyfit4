"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function TrainingPage({ params }) {
  const { id } = params; // Extract client ID
  const router = useRouter();
  const [upperbodyExercises, setUpperbodyExercises] = useState([]);
  const [lowerbodyExercises, setLowerbodyExercises] = useState([]);
  const [fullbodyExercises, setFullbodyExercises] = useState([]);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await fetch(`/api/get-client?id=${id}`);
        const data = await response.json();
        setUpperbodyExercises(data.upperbody || []);
        setLowerbodyExercises(data.lowerbody || []);
        setFullbodyExercises(data.fullbody || []);
      } catch (error) {
        console.error("Error fetching client data:", error);
      }
    };

    fetchClientData();
  }, [id]);

  return (
    <div className="max-w-7xl mx-auto mt-8">
      <h1 className="text-2xl font-semibold mb-4">Training</h1>

      {/* Buttons for Upper Body, Lower Body, Full Body */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => router.push(`/client/${id}/training/upper-body`)}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
        >
          Upper Body
        </button>
        <button
          onClick={() => router.push(`/client/${id}/training/lower-body`)}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
        >
          Lower Body
        </button>
        <button
          onClick={() => router.push(`/client/${id}/training/full-body`)}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
        >
          Full Body
        </button>
      </div>

      {/* Edit Buttons for Adding Exercises */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => router.push(`/client/${id}/training/upper-body/add`)}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 focus:ring-2 focus:ring-green-300"
        >
          Edit Last Upper Body Exercise
        </button>
        <button
          onClick={() => router.push(`/client/${id}/training/lower-body/add`)}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 focus:ring-2 focus:ring-green-300"
        >
          Edit Last Lower Body Exercise
        </button>
        <button
          onClick={() => router.push(`/client/${id}/training/full-body/add`)}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 focus:ring-2 focus:ring-green-300"
        >
          Edit Last Full Body Exercise
        </button>
      </div>

      {/* Display Upper Body Exercises */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Upper Body Exercises</h2>
        {upperbodyExercises.length > 0 ? (
          upperbodyExercises.map((entry, index) => (
            <div key={index} className="mb-4 p-4 bg-gray-100 rounded shadow">
              <h3 className="text-lg font-medium">
                Saved on: {new Date(entry.date).toLocaleDateString()}
              </h3>
              <ul className="list-disc pl-5 mt-2">
                {entry.exercises.map((exercise, idx) => (
                  <li key={idx} className="text-gray-700">
                    {exercise.name || "Unnamed Exercise"} - Sets:{" "}
                    {exercise.sets || "N/A"}, Weight:{" "}
                    {exercise.weight || "N/A"} kg, Reps:{" "}
                    {exercise.reps || "N/A"}
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No upper body exercises added yet.</p>
        )}
      </div>

      {/* Display Lower Body Exercises */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Lower Body Exercises</h2>
        {lowerbodyExercises.length > 0 ? (
          lowerbodyExercises.map((entry, index) => (
            <div key={index} className="mb-4 p-4 bg-gray-100 rounded shadow">
              <h3 className="text-lg font-medium">
                Saved on: {new Date(entry.date).toLocaleDateString()}
              </h3>
              <ul className="list-disc pl-5 mt-2">
                {entry.exercises.map((exercise, idx) => (
                  <li key={idx} className="text-gray-700">
                    {exercise.name || "Unnamed Exercise"} - Sets:{" "}
                    {exercise.sets || "N/A"}, Weight:{" "}
                    {exercise.weight || "N/A"} kg, Reps:{" "}
                    {exercise.reps || "N/A"}
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No lower body exercises added yet.</p>
        )}
      </div>

      {/* Display Full Body Exercises */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Full Body Exercises</h2>
        {fullbodyExercises.length > 0 ? (
          fullbodyExercises.map((entry, index) => (
            <div key={index} className="mb-4 p-4 bg-gray-100 rounded shadow">
              <h3 className="text-lg font-medium">
                Saved on: {new Date(entry.date).toLocaleDateString()}
              </h3>
              <ul className="list-disc pl-5 mt-2">
                {entry.exercises.map((exercise, idx) => (
                  <li key={idx} className="text-gray-700">
                    {exercise.name || "Unnamed Exercise"} - Sets:{" "}
                    {exercise.sets || "N/A"}, Weight:{" "}
                    {exercise.weight || "N/A"} kg, Reps:{" "}
                    {exercise.reps || "N/A"}
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No full body exercises added yet.</p>
        )}
      </div>
    </div>
  );
}
