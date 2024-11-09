"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddClient() {
  const [name, setName] = useState("");
  const [experience, setExperience] = useState("Beginner");
  const [goal, setGoal] = useState("Losing Weight");
  const router = useRouter(); // Initialize the router

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/add-client", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, experience, goal }),
    });

    if (response.ok) {
      alert("Client added successfully!");
      setName("");
      setExperience("Beginner");
      setGoal("Losing Weight");
      router.push("/"); // Redirect to the main page
    } else {
      alert("Failed to add client.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-semibold mb-4">Add Client</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Experience Level Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Experience Level</label>
          <select
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>

        {/* Training Goal Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Training Goal</label>
          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option>Losing Weight</option>
            <option>Gaining Muscle</option>
            <option>Competing</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Add Client
        </button>
      </form>
    </div>
  );
}
