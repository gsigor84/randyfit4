"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function EditMealPlanPage() {
  const params = useParams();
  const clientId = params?.id;

  const [mealPlan, setMealPlan] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clientId) return;

    const fetchMealPlan = async () => {
      try {
        const res = await fetch(`/api/get-client?id=${clientId}`);
        const data = await res.json();
        if (data?.mealPlan) {
          setMealPlan(data.mealPlan);
        }
      } catch (error) {
        console.error("Error fetching meal plan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMealPlan();
  }, [clientId]);

  const handleInputChange = (day, category, index, field, value) => {
    setMealPlan((prevMealPlan) =>
      prevMealPlan.map((dayPlan) =>
        dayPlan.day === day
          ? {
            ...dayPlan,
            [category]: dayPlan[category].map((meal, mealIndex) =>
              mealIndex === index ? { ...meal, [field]: value } : meal
            ),
          }
          : dayPlan
      )
    );
  };

  const handleDeleteMeal = (day, category, index) => {
    setMealPlan((prevMealPlan) =>
      prevMealPlan.map((dayPlan) =>
        dayPlan.day === day
          ? {
            ...dayPlan,
            [category]: dayPlan[category].filter((_, mealIndex) => mealIndex !== index),
          }
          : dayPlan
      )
    );
  };

  const handleAddMeal = (day, category) => {
    setMealPlan((prevMealPlan) =>
      prevMealPlan.map((dayPlan) =>
        dayPlan.day === day
          ? {
            ...dayPlan,
            [category]: [
              ...dayPlan[category],
              { name: "", calories: "", protein: "", carbs: "", fats: "" },
            ],
          }
          : dayPlan
      )
    );
  };

  const handleSave = async () => {
    try {
      const res = await fetch("/api/edit-meal-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ clientId, mealPlan }),
      });

      if (res.ok) {
        alert("Meal plan updated successfully!");
      } else {
        const errorData = await res.json();
        console.error("Error saving meal plan:", errorData.error);
        alert("Error saving meal plan.");
      }
    } catch (error) {
      console.error("Error saving meal plan:", error);
      alert("An error occurred while saving the meal plan.");
    }
  };

  if (loading) {
    return <p className="text-white">Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#1c1c1c] rounded-md shadow-md text-white">
      <h1 className="text-3xl font-bold text-[#ffa800] mb-6">Edit Meal Plan</h1>

      {mealPlan.map((dayPlan) => (
        <div key={dayPlan.day} className="mb-6">
          <h2 className="text-2xl font-bold text-[#ffa800]">{dayPlan.day}</h2>

          {["Breakfast", "Lunch", "Dinner", "Snacks"].map((category) => (
            <div key={category} className="mb-4">
              <h3 className="text-xl font-semibold text-gray-300">{category}</h3>

              {/* Existing Meals */}
              {dayPlan[category]?.length > 0 ? (
                dayPlan[category].map((meal, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 sm:grid-cols-6 gap-4 mb-2 items-center"
                  >
                    <input
                      type="text"
                      placeholder="Meal Name"
                      value={meal.name}
                      onChange={(e) =>
                        handleInputChange(dayPlan.day, category, index, "name", e.target.value)
                      }
                      className="p-2 rounded-md bg-gray-800 text-white border border-gray-600"
                    />
                    <input
                      type="number"
                      placeholder="Calories"
                      value={meal.calories}
                      onChange={(e) =>
                        handleInputChange(dayPlan.day, category, index, "calories", e.target.value)
                      }
                      className="p-2 rounded-md bg-gray-800 text-white border border-gray-600"
                    />
                    <input
                      type="number"
                      placeholder="Protein (g)"
                      value={meal.protein}
                      onChange={(e) =>
                        handleInputChange(dayPlan.day, category, index, "protein", e.target.value)
                      }
                      className="p-2 rounded-md bg-gray-800 text-white border border-gray-600"
                    />
                    <input
                      type="number"
                      placeholder="Carbs (g)"
                      value={meal.carbs}
                      onChange={(e) =>
                        handleInputChange(dayPlan.day, category, index, "carbs", e.target.value)
                      }
                      className="p-2 rounded-md bg-gray-800 text-white border border-gray-600"
                    />
                    <input
                      type="number"
                      placeholder="Fats (g)"
                      value={meal.fats}
                      onChange={(e) =>
                        handleInputChange(dayPlan.day, category, index, "fats", e.target.value)
                      }
                      className="p-2 rounded-md bg-gray-800 text-white border border-gray-600"
                    />
                    <button
                      onClick={() => handleDeleteMeal(dayPlan.day, category, index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      🗑️
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No meals for this category.</p>
              )}

              {/* Add Meal Button */}
              <button
                onClick={() => handleAddMeal(dayPlan.day, category)}
                className="text-sm text-[#ffa800] hover:underline mt-2"
              >
                + Add Meal
              </button>
            </div>
          ))}
        </div>
      ))}

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="mt-4 w-full bg-[#ffa800] text-black py-2 px-4 rounded hover:bg-[#cc8400] font-bold"
      >
        Save Meal Plan
      </button>
    </div>
  );
}
