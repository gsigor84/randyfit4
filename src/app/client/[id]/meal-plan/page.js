"use client";

import { useClient } from "../ClientContext";
import { useState } from "react";
import MacrosCalculator from "../../../components/MacrosCalculator";

export default function MealPlanPage() {
  const client = useClient();

  const [mealPlan, setMealPlan] = useState({
    Breakfast: [],
    Lunch: [],
    Dinner: [],
    Snacks: [],
  });

  const [newMeal, setNewMeal] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
  });

  const handleAddMeal = (category) => {
    if (!newMeal.name || !newMeal.calories || !newMeal.protein || !newMeal.carbs || !newMeal.fats) {
      alert("Please fill out all fields for the meal.");
      return;
    }

    setMealPlan((prevPlan) => ({
      ...prevPlan,
      [category]: [...prevPlan[category], { ...newMeal }],
    }));

    // Clear inputs
    setNewMeal({
      name: "",
      calories: "",
      protein: "",
      carbs: "",
      fats: "",
    });
  };

  const handleDeleteMeal = (category, index) => {
    setMealPlan((prevPlan) => ({
      ...prevPlan,
      [category]: prevPlan[category].filter((_, i) => i !== index),
    }));
  };

  if (!client) {
    return <p className="text-white">No client data found.</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-white mb-6">Meal Plan</h1>

      {/* Macros Calculator */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#ffa800] mb-4">Macro Calculator</h2>
        <MacrosCalculator
          age={client.age}
          weight={client.weight}
          height={client.height}
          gender={client.gender}
          goal={client.goal}
        />
      </div>

      {/* Meal Plan Section */}
      <div className="space-y-6">
        {Object.keys(mealPlan).map((category) => (
          <div key={category} className="p-4 bg-[#1c1c1c] rounded-md shadow-md">
            <h2 className="text-2xl font-bold text-[#ffa800] mb-4">{category}</h2>

            {/* Existing Meals */}
            <div className="space-y-2">
              {mealPlan[category].map((meal, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 bg-gray-800 rounded-md space-y-2 sm:space-y-0"
                >
                  <div>
                    <p className="text-sm text-white font-bold">{meal.name}</p>
                    <p className="text-sm text-white">
                      {meal.calories} kcal | Protein: {meal.protein}g | Carbs: {meal.carbs}g | Fats:{" "}
                      {meal.fats}g
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteMeal(category, index)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Meal */}
            <div className="mt-6 space-y-4">
              <h3 className="text-sm font-semibold text-gray-300">Add a new {category} meal</h3>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                <input
                  type="text"
                  placeholder="Meal Name"
                  value={newMeal.name}
                  onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                  className="col-span-1 sm:col-span-5 p-2 rounded-md bg-gray-800 text-white border border-gray-600 w-full"
                />
                <input
                  type="number"
                  placeholder="Calories"
                  value={newMeal.calories}
                  onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
                  className="p-2 rounded-md bg-gray-800 text-white border border-gray-600 w-full"
                />
                <input
                  type="number"
                  placeholder="Protein (g)"
                  value={newMeal.protein}
                  onChange={(e) => setNewMeal({ ...newMeal, protein: e.target.value })}
                  className="p-2 rounded-md bg-gray-800 text-white border border-gray-600 w-full"
                />
                <input
                  type="number"
                  placeholder="Carbs (g)"
                  value={newMeal.carbs}
                  onChange={(e) => setNewMeal({ ...newMeal, carbs: e.target.value })}
                  className="p-2 rounded-md bg-gray-800 text-white border border-gray-600 w-full"
                />
                <input
                  type="number"
                  placeholder="Fats (g)"
                  value={newMeal.fats}
                  onChange={(e) => setNewMeal({ ...newMeal, fats: e.target.value })}
                  className="p-2 rounded-md bg-gray-800 text-white border border-gray-600 w-full"
                />
              </div>
              <button
                onClick={() => handleAddMeal(category)}
                className="mt-2 bg-[#ffa800] text-black font-semibold py-2 px-4 rounded hover:bg-[#cc8400] focus:ring-2 focus:ring-[#ffa800]"
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
