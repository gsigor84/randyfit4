"use client";

import { useState, useEffect } from "react";

export default function MealPlanPage({ params }) {
  const { id } = params; // Client ID
  const [mealPlan, setMealPlan] = useState([]);
  const [newMeal, setNewMeal] = useState({ name: "", calories: 0, protein: 0, carbs: 0, fats: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  const [selectedDay, setSelectedDay] = useState("Monday");

  useEffect(() => {
    const fetchMealPlan = async () => {
      try {
        const response = await fetch(`/api/get-meal-plan?id=${id}`);
        if (response.ok) {
          const data = await response.json();
          setMealPlan(data.meals || []);
        } else {
          console.error("Failed to fetch meal plan");
        }
      } catch (error) {
        console.error("Error fetching meal plan:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMealPlan();
  }, [id]);

  const handleAddMeal = async (e, category) => {
    e.preventDefault();
    if (!newMeal.name.trim()) return;

    try {
      const response = await fetch(`/api/add-meal-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          meal: { ...newMeal, category, day: selectedDay },
        }),
      });

      if (response.ok) {
        const updatedMealPlan = await response.json();
        setMealPlan(updatedMealPlan.meals);
        setNewMeal({ name: "", calories: 0, protein: 0, carbs: 0, fats: 0 });
      } else {
        console.error("Failed to add meal");
      }
    } catch (error) {
      console.error("Error adding meal:", error);
    }
  };

  const handleDeleteMeal = async (meal) => {
    try {
      const response = await fetch(`/api/delete-meal`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, meal }),
      });

      if (response.ok) {
        const updatedMealPlan = await response.json();
        setMealPlan(updatedMealPlan.meals);
      } else {
        console.error("Failed to delete meal");
      }
    } catch (error) {
      console.error("Error deleting meal:", error);
    }
  };

  const handleEditMeal = (meal) => {
    setEditingMeal(meal);
    setIsEditing(true);
  };

  const handleUpdateMeal = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/update-meal`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, meal: editingMeal }),
      });

      if (response.ok) {
        const updatedMealPlan = await response.json();
        setMealPlan(updatedMealPlan.meals);
        setIsEditing(false);
        setEditingMeal(null);
      } else {
        console.error("Failed to update meal");
      }
    } catch (error) {
      console.error("Error updating meal:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-[#1c1c1c] text-white rounded-lg">
      <h1 className="text-3xl font-bold text-[#ffa800] mb-4">Meal Plan</h1>

      {/* Select Day */}
      <div className="mb-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
            <button
              key={day}
              className={`flex-shrink-0 py-2 px-4 rounded ${selectedDay === day ? "bg-[#ffa800] text-black" : "bg-[#333] text-white"
                }`}
              onClick={() => setSelectedDay(day)}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Meal Categories */}
      {["Breakfast", "Lunch", "Dinner", "Snacks"].map((category) => (
        <details key={category} className="mb-6 bg-[#2c2c2c] p-4 rounded-md">
          <summary className="text-xl font-semibold text-[#ffa800] cursor-pointer">
            {category}
          </summary>
          <ul className="mt-4 space-y-2">
            {mealPlan
              .filter((meal) => meal.category === category && meal.day === selectedDay)
              .map((meal, index) => (
                <li
                  key={index}
                  className="bg-[#333] p-2 rounded-md flex justify-between items-center"
                >
                  <div>
                    <p>{meal.name}</p>
                    <p className="text-sm text-gray-400">
                      {meal.calories} kcal | Protein: {meal.protein}g | Carbs: {meal.carbs}g |
                      Fats: {meal.fats}g
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => handleEditMeal(meal)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteMeal(meal)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
          </ul>
          {/* Add Meal */}
          <form
            onSubmit={(e) => handleAddMeal(e, category)}
            className="mt-4 flex flex-col gap-2"
          >
            <input
              type="text"
              placeholder={`Add a new ${category} meal`}
              value={newMeal.name}
              onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
              className="w-full p-2 bg-[#444] text-white rounded"
            />
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Calories"
                value={newMeal.calories}
                onChange={(e) => setNewMeal({ ...newMeal, calories: Number(e.target.value) })}
                className="w-1/4 p-2 bg-[#444] text-white rounded"
              />
              <input
                type="number"
                placeholder="Protein"
                value={newMeal.protein}
                onChange={(e) => setNewMeal({ ...newMeal, protein: Number(e.target.value) })}
                className="w-1/4 p-2 bg-[#444] text-white rounded"
              />
              <input
                type="number"
                placeholder="Carbs"
                value={newMeal.carbs}
                onChange={(e) => setNewMeal({ ...newMeal, carbs: Number(e.target.value) })}
                className="w-1/4 p-2 bg-[#444] text-white rounded"
              />
              <input
                type="number"
                placeholder="Fats"
                value={newMeal.fats}
                onChange={(e) => setNewMeal({ ...newMeal, fats: Number(e.target.value) })}
                className="w-1/4 p-2 bg-[#444] text-white rounded"
              />
            </div>
            <button
              type="submit"
              className="bg-[#ffa800] text-black py-2 px-4 rounded hover:bg-[#cc8800]"
            >
              Add
            </button>
          </form>
        </details>
      ))}

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-[#1c1c1c] p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-[#ffa800] mb-4">Edit Meal</h2>
            <form onSubmit={handleUpdateMeal}>
              <input
                type="text"
                value={editingMeal.name}
                onChange={(e) =>
                  setEditingMeal({ ...editingMeal, name: e.target.value })
                }
                className="w-full mb-2 p-2 bg-[#333] text-white rounded"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Calories"
                  value={editingMeal.calories}
                  onChange={(e) =>
                    setEditingMeal({ ...editingMeal, calories: Number(e.target.value) })
                  }
                  className="w-1/4 p-2 bg-[#333] text-white rounded"
                />
                <input
                  type="number"
                  placeholder="Protein"
                  value={editingMeal.protein}
                  onChange={(e) =>
                    setEditingMeal({ ...editingMeal, protein: Number(e.target.value) })
                  }
                  className="w-1/4 p-2 bg-[#333] text-white rounded"
                />
                <input
                  type="number"
                  placeholder="Carbs"
                  value={editingMeal.carbs}
                  onChange={(e) =>
                    setEditingMeal({ ...editingMeal, carbs: Number(e.target.value) })
                  }
                  className="w-1/4 p-2 bg-[#333] text-white rounded"
                />
                <input
                  type="number"
                  placeholder="Fats"
                  value={editingMeal.fats}
                  onChange={(e) =>
                    setEditingMeal({ ...editingMeal, fats: Number(e.target.value) })
                  }
                  className="w-1/4 p-2 bg-[#333] text-white rounded"
                />
              </div>
              <button
                type="submit"
                className="bg-[#ffa800] text-black py-2 px-4 rounded hover:bg-[#cc8800]"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
