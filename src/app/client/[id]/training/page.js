"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function TrainingPage({ params }) {
  const { id } = params; // Extract client ID
  const router = useRouter();
  const [upperbodyExercises, setUpperbodyExercises] = useState([]);
  const [lowerbodyExercises, setLowerbodyExercises] = useState([]);
  const [fullbodyExercises, setFullbodyExercises] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  const renderExerciseTable = (exercises) => {
    return (
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border border-gray-300 text-left">Exercise Name</th>
              <th className="px-4 py-2 border border-gray-300 text-left">Sets</th>
              <th className="px-4 py-2 border border-gray-300 text-left">Weight (kg)</th>
              <th className="px-4 py-2 border border-gray-300 text-left">Reps</th>
            </tr>
          </thead>
          <tbody>
            {exercises.map((exercise, idx) => (
              <tr key={idx} className="hover:bg-gray-100">
                <td className="px-4 py-2 border border-gray-300">{exercise.name || "Unnamed Exercise"}</td>
                <td className="px-4 py-2 border border-gray-300">{exercise.sets || "N/A"}</td>
                <td className="px-4 py-2 border border-gray-300">{exercise.weight || "N/A"}</td>
                <td className="px-4 py-2 border border-gray-300">{exercise.reps || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto mt-8 px-4">
      <h1 className="text-2xl font-semibold mb-4">Training</h1>

      {/* Buttons for Upper Body, Lower Body, Full Body */}
      <div className="flex flex-wrap sm:flex-nowrap gap-4 mb-6">
        <button
          onClick={() => router.push(`/client/${id}/training/upper-body`)}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 w-full sm:w-auto"
        >
          Upper Body
        </button>
        <button
          onClick={() => router.push(`/client/${id}/training/lower-body`)}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 w-full sm:w-auto"
        >
          Lower Body
        </button>
        <button
          onClick={() => router.push(`/client/${id}/training/full-body`)}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 w-full sm:w-auto"
        >
          Full Body
        </button>
      </div>

      {/* Dropdown Menu */}
      <div className="relative inline-block text-left mb-8">
        <button
          className="inline-flex justify-center w-full sm:w-auto rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-green-500 text-sm font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-300"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          Manage Exercises
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isDropdownOpen && (
          <div
            className="origin-top-right absolute left-0 sm:left-auto sm:right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
            role="menu"
          >
            <div className="py-1" role="none">
              <button
                onClick={() => {
                  router.push(`/client/${id}/training/upper-body/add`);
                  setIsDropdownOpen(false);
                }}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Upper Body Exercises
              </button>
              <button
                onClick={() => {
                  router.push(`/client/${id}/training/lower-body/add`);
                  setIsDropdownOpen(false);
                }}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Lower Body Exercises
              </button>
              <button
                onClick={() => {
                  router.push(`/client/${id}/training/full-body/add`);
                  setIsDropdownOpen(false);
                }}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Full Body Exercises
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Exercise Sections */}
      <div className="space-y-6">
        {/* Upper Body */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Upper Body Exercises</h2>
          {upperbodyExercises.length > 0 ? (
            upperbodyExercises.map((entry, index) => (
              <div key={index} className="mb-6">
                <h3 className="text-lg font-medium mb-2">
                  Saved on: {new Date(entry.date).toLocaleDateString()}
                </h3>
                {renderExerciseTable(entry.exercises)}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No upper body exercises added yet.</p>
          )}
        </div>

        {/* Lower Body */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Lower Body Exercises</h2>
          {lowerbodyExercises.length > 0 ? (
            lowerbodyExercises.map((entry, index) => (
              <div key={index} className="mb-6">
                <h3 className="text-lg font-medium mb-2">
                  Saved on: {new Date(entry.date).toLocaleDateString()}
                </h3>
                {renderExerciseTable(entry.exercises)}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No lower body exercises added yet.</p>
          )}
        </div>

        {/* Full Body */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Full Body Exercises</h2>
          {fullbodyExercises.length > 0 ? (
            fullbodyExercises.map((entry, index) => (
              <div key={index} className="mb-6">
                <h3 className="text-lg font-medium mb-2">
                  Saved on: {new Date(entry.date).toLocaleDateString()}
                </h3>
                {renderExerciseTable(entry.exercises)}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No full body exercises added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
