"use client";

import { useClient } from "../ClientContext";
import { useState } from "react";

export default function MealPlanPage() {
  const client = useClient();

  const [mealPlan, setMealPlan] = useState({
    Monday: { Breakfast: [], Lunch: [], Dinner: [], Snacks: [] },
    Tuesday: { Breakfast: [], Lunch: [], Dinner: [], Snacks: [] },
    Wednesday: { Breakfast: [], Lunch: [], Dinner: [], Snacks: [] },
    Thursday: { Breakfast: [], Lunch: [], Dinner: [], Snacks: [] },
    Friday: { Breakfast: [], Lunch: [], Dinner: [], Snacks: [] },
    Saturday: { Breakfast: [], Lunch: [], Dinner: [], Snacks: [] },
    Sunday: { Breakfast: [], Lunch: [], Dinner: [], Snacks: [] },
  });

  const [newMeal, setNewMeal] = useState({
    day: "Monday",
    category: "Breakfast",
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
  });

  const handleAddMeal = () => {
    if (
      !newMeal.name ||
      !newMeal.calories ||
      !newMeal.protein ||
      !newMeal.carbs ||
      !newMeal.fats
    ) {
      alert("Please fill out all fields for the meal.");
      return;
    }

    setMealPlan((prevPlan) => ({
      ...prevPlan,
      [newMeal.day]: {
        ...prevPlan[newMeal.day],
        [newMeal.category]: [
          ...prevPlan[newMeal.day][newMeal.category],
          { ...newMeal },
        ],
      },
    }));

    // Clear inputs
    setNewMeal({
      day: "Monday",
      category: "Breakfast",
      name: "",
      calories: "",
      protein: "",
      carbs: "",
      fats: "",
    });
  };

  const handleSaveMealPlan = async () => {
    if (!client) {
      alert("Client data is not loaded.");
      return;
    }

    // Transform the mealPlan state into an array of day objects
    const formattedMealPlan = Object.keys(mealPlan).map((day) => ({
      day,
      ...mealPlan[day], // Include Breakfast, Lunch, Dinner, Snacks
    }));

    console.log("Formatted mealPlan being sent:", formattedMealPlan);

    try {
      const response = await fetch("/api/mealplan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: client._id,
          mealPlan: formattedMealPlan,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error saving meal plan:", errorData.error);
        alert("Failed to save the meal plan: " + errorData.error);
        return;
      }

      alert("Meal plan saved successfully!");
    } catch (error) {
      console.error("Error saving meal plan:", error);
      alert("An error occurred while saving the meal plan.");
    }
  };

  if (!client) {
    return <p className="text-white">No client data found.</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-white mb-6">Meal Plan</h1>

      {/* Add Meal Section */}
      <div className="p-4 bg-[#1c1c1c] rounded-md shadow-md mb-6">
        <h2 className="text-2xl font-bold text-[#ffa800] mb-4">Add a Meal</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <select
            value={newMeal.day}
            onChange={(e) =>
              setNewMeal((prev) => ({ ...prev, day: e.target.value }))
            }
            className="p-2 rounded-md bg-gray-800 text-white border border-gray-600 w-full"
          >
            {Object.keys(mealPlan).map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          <select
            value={newMeal.category}
            onChange={(e) =>
              setNewMeal((prev) => ({ ...prev, category: e.target.value }))
            }
            className="p-2 rounded-md bg-gray-800 text-white border border-gray-600 w-full"
          >
            {["Breakfast", "Lunch", "Dinner", "Snacks"].map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Meal Name"
            value={newMeal.name}
            onChange={(e) =>
              setNewMeal((prev) => ({ ...prev, name: e.target.value }))
            }
            className="p-2 rounded-md bg-gray-800 text-white border border-gray-600 w-full"
          />
          <input
            type="number"
            placeholder="Calories"
            value={newMeal.calories}
            onChange={(e) =>
              setNewMeal((prev) => ({ ...prev, calories: e.target.value }))
            }
            className="p-2 rounded-md bg-gray-800 text-white border border-gray-600 w-full"
          />
          <input
            type="number"
            placeholder="Protein (g)"
            value={newMeal.protein}
            onChange={(e) =>
              setNewMeal((prev) => ({ ...prev, protein: e.target.value }))
            }
            className="p-2 rounded-md bg-gray-800 text-white border border-gray-600 w-full"
          />
          <input
            type="number"
            placeholder="Carbs (g)"
            value={newMeal.carbs}
            onChange={(e) =>
              setNewMeal((prev) => ({ ...prev, carbs: e.target.value }))
            }
            className="p-2 rounded-md bg-gray-800 text-white border border-gray-600 w-full"
          />
          <input
            type="number"
            placeholder="Fats (g)"
            value={newMeal.fats}
            onChange={(e) =>
              setNewMeal((prev) => ({ ...prev, fats: e.target.value }))
            }
            className="p-2 rounded-md bg-gray-800 text-white border border-gray-600 w-full"
          />
        </div>
        <button
          onClick={handleAddMeal}
          className="mt-4 bg-[#ffa800] text-black font-semibold py-2 px-4 rounded hover:bg-[#cc8400] focus:ring-2 focus:ring-[#ffa800]"
        >
          Add Meal
        </button>
      </div>

      {/* Display Meal Plan */}
      <div className="space-y-6">
        {Object.keys(mealPlan).map((day) => (
          <div key={day} className="p-4 bg-[#1c1c1c] rounded-md shadow-md">
            <h2 className="text-2xl font-bold text-[#ffa800] mb-4">{day}</h2>
            {["Breakfast", "Lunch", "Dinner", "Snacks"].map((category) => (
              <div key={category} className="mb-4">
                <h3 className="text-xl font-semibold text-white">{category}</h3>
                {mealPlan[day][category].length > 0 ? (
                  mealPlan[day][category].map((meal, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 bg-gray-800 rounded-md space-y-2 sm:space-y-0"
                    >
                      <div>
                        <p className="text-sm text-white font-bold">
                          {meal.name}
                        </p>
                        <p className="text-sm text-white">
                          {meal.calories} kcal | Protein: {meal.protein}g | Carbs:{" "}
                          {meal.carbs}g | Fats: {meal.fats}g
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No meals added yet.</p>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Save Meal Plan Button */}
      <button
        onClick={handleSaveMealPlan}
        className="mt-6 bg-[#ffa800] text-black py-2 px-6 rounded hover:bg-[#cc8400] focus:ring-2 focus:ring-[#ffa800]"
      >
        Save Meal Plan
      </button>
    </div>
  );
}
