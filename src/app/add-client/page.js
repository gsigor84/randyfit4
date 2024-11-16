"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddClientPage() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [experience, setExperience] = useState("Beginner");
  const [goal, setGoal] = useState("Losing Weight");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/add-client", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, age, gender, weight, height, experience, goal }),
      });

      if (response.ok) {
        alert("Client added successfully!");
        setName("");
        setAge("");
        setGender("Male");
        setWeight("");
        setHeight("");
        setExperience("Beginner");
        setGoal("Losing Weight");
        router.push("/"); // Redirect to the main page
      } else {
        alert("Failed to add client.");
      }
    } catch (error) {
      console.error("Error adding client:", error);
      alert("An error occurred while adding the client.");
    }
  };

  return (
    <div
      className="relative min-h-screen p-4"
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
      <div className="relative max-w-lg mx-auto mt-8 p-6 bg-[#1c1c1c] text-white bg-opacity-90 rounded-lg">
        <h1 className="text-3xl font-bold text-[#ffa800] mb-6 text-center">
          Add New Client
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full rounded-md bg-gray-800 text-white border-gray-600 focus:ring-[#ffa800] focus:border-[#ffa800] shadow-sm"
            />
          </div>

          {/* Age Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
              min="1"
              className="mt-1 block w-full rounded-md bg-gray-800 text-white border-gray-600 focus:ring-[#ffa800] focus:border-[#ffa800] shadow-sm"
            />
          </div>

          {/* Gender Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-800 text-white border-gray-600 focus:ring-[#ffa800] focus:border-[#ffa800] shadow-sm"
            >
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>

          {/* Weight Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Weight (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
              min="1"
              step="0.1"
              className="mt-1 block w-full rounded-md bg-gray-800 text-white border-gray-600 focus:ring-[#ffa800] focus:border-[#ffa800] shadow-sm"
            />
          </div>

          {/* Height Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Height (cm)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              required
              min="1"
              step="0.1"
              className="mt-1 block w-full rounded-md bg-gray-800 text-white border-gray-600 focus:ring-[#ffa800] focus:border-[#ffa800] shadow-sm"
            />
          </div>

          {/* Experience Level Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Experience Level</label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-800 text-white border-gray-600 focus:ring-[#ffa800] focus:border-[#ffa800] shadow-sm"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>

          {/* Training Goal Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Training Goal</label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-800 text-white border-gray-600 focus:ring-[#ffa800] focus:border-[#ffa800] shadow-sm"
            >
              <option>Losing Weight</option>
              <option>Gaining Muscle</option>
              <option>Competing</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#ffa800] text-black font-semibold py-2 px-4 rounded hover:bg-[#cc8400] focus:ring-2 focus:ring-[#ffa800]"
          >
            Add Client
          </button>
        </form>
      </div>
    </div>
  );
}
