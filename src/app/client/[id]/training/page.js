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
  const [isLoading, setIsLoading] = useState(true); // Loader state

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setIsLoading(true); // Start loader
        const response = await fetch(`/api/get-client?id=${id}`);
        const data = await response.json();

        console.log("Fetched client data:", data); // Debugging log

        setUpperbodyExercises(data.upperbody || []);
        setLowerbodyExercises(data.lowerbody || []);
        setFullbodyExercises(data.fullbody || []);
      } catch (error) {
        console.error("Error fetching client data:", error);
      } finally {
        setIsLoading(false); // Stop loader
      }
    };

    fetchClientData();
  }, [id]);

  const renderExerciseTable = (exercises) => (
    <div className="overflow-x-auto">
      <table className="hidden sm:table table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border border-gray-300 text-left text-black">Exercise Name</th>
            <th className="px-4 py-2 border border-gray-300 text-left text-black">Sets</th>
            <th className="px-4 py-2 border border-gray-300 text-left text-black">Weight (kg)</th>
            <th className="px-4 py-2 border border-gray-300 text-left text-black">Reps</th>
          </tr>
        </thead>
        <tbody>
          {exercises.map((exercise, idx) => (
            <tr
              key={idx}
              className="hover:bg-[#ffa800] hover:text-black even:bg-gray-100 odd:bg-white"
            >
              <td className="px-4 py-2 border border-gray-300 text-black">
                {exercise.name || "Unnamed Exercise"}
              </td>
              <td className="px-4 py-2 border border-gray-300 text-black">{exercise.sets || "N/A"}</td>
              <td className="px-4 py-2 border border-gray-300 text-black">{exercise.weight || "N/A"}</td>
              <td className="px-4 py-2 border border-gray-300 text-black">{exercise.reps || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile View */}
      <div className="sm:hidden mt-4">
        {exercises.map((exercise, idx) => (
          <div
            key={idx}
            className="border border-gray-300 rounded-lg p-4 mb-4 bg-white shadow-md"
          >
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">Exercise Name:</span>
              <span className="text-black">{exercise.name || "Unnamed Exercise"}</span>
            </div>
            <div className="flex justify-between mt-2">
              <span className="font-semibold text-gray-700">Sets:</span>
              <span className="text-black">{exercise.sets || "N/A"}</span>
            </div>
            <div className="flex justify-between mt-2">
              <span className="font-semibold text-gray-700">Weight (kg):</span>
              <span className="text-black">{exercise.weight || "N/A"}</span>
            </div>
            <div className="flex justify-between mt-2">
              <span className="font-semibold text-gray-700">Reps:</span>
              <span className="text-black">{exercise.reps || "N/A"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div
      className="relative min-h-screen"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-80"></div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto mt-8 bg-[#1c1c1c] text-white bg-opacity-90 rounded-lg">
        <h1 className="text-3xl font-bold text-[#ffa800] mb-4 px-6">Training</h1>

        {/* Navigation Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap gap-4 mb-6 px-6">
          <button
            onClick={() => router.push(`/client/${id}/training/upper-body`)}
            className="w-full sm:w-auto bg-[#ffa800] hover:bg-[#cc8800] text-black font-semibold py-2 px-4 rounded shadow-md focus:ring-2 focus:ring-offset-2 focus:ring-[#cc8800]"
          >
            Upper Body
          </button>
          <button
            onClick={() => router.push(`/client/${id}/training/lower-body`)}
            className="w-full sm:w-auto bg-[#ffa800] hover:bg-[#cc8800] text-black font-semibold py-2 px-4 rounded shadow-md focus:ring-2 focus:ring-offset-2 focus:ring-[#cc8800]"
          >
            Lower Body
          </button>
          <button
            onClick={() => router.push(`/client/${id}/training/full-body`)}
            className="w-full sm:w-auto bg-[#ffa800] hover:bg-[#cc8800] text-black font-semibold py-2 px-4 rounded shadow-md focus:ring-2 focus:ring-offset-2 focus:ring-[#cc8800]"
          >
            Full Body
          </button>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full sm:w-auto bg-[#ffa800] hover:bg-[#cc8800] text-black font-semibold py-2 px-4 rounded shadow-md focus:ring-2 focus:ring-offset-2 focus:ring-[#cc8800]"
          >
            Manage Exercises
          </button>
        </div>

        {/* Dropdown for Manage Exercises */}
        {isDropdownOpen && (
          <div className="relative px-6">
            <div className="absolute bg-white rounded-lg shadow-md z-10">
              <button
                onClick={() => router.push(`/client/${id}/training/upper-body/add`)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                Add Upper Body Exercise
              </button>
              <button
                onClick={() => router.push(`/client/${id}/training/lower-body/add`)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                Add Lower Body Exercise
              </button>
              <button
                onClick={() => router.push(`/client/${id}/training/full-body/add`)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                Add Full Body Exercise
              </button>
            </div>
          </div>
        )}

        {isLoading ? (
          // Loading Spinner
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#ffa800] border-solid"></div>
          </div>
        ) : (
          <div className="space-y-6 px-6 pb-6">
            {/* Upper Body */}
            <div>
              <h2 className="text-xl font-semibold text-[#ffa800] mb-4">
                Upper Body Exercises
              </h2>
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
              <h2 className="text-xl font-semibold text-[#ffa800] mb-4">
                Lower Body Exercises
              </h2>
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
              <h2 className="text-xl font-semibold text-[#ffa800] mb-4">
                Full Body Exercises
              </h2>
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
        )}
      </div>
    </div>
  );
}
