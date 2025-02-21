"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button, Input, Card, CardBody, CardHeader } from "@nextui-org/react";

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
    return (
      <div className="flex min-h-screen items-center justify-center text-[#07B0F2]">
        <p>Loading meal plan...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-md shadow-md">
      <h1 className="text-3xl font-bold text-[#010326] text-center mb-6">Edit Meal Plan</h1>

      {mealPlan.map((dayPlan) => (
        <Card key={dayPlan.day} className="mb-6 shadow-md border border-gray-200">
          <CardHeader className="bg-[#07B0F2] text-white text-xl font-semibold p-4 rounded-t-md">
            {dayPlan.day}
          </CardHeader>
          <CardBody className="p-6 space-y-6">
            {["Breakfast", "Lunch", "Dinner", "Snacks"].map((category) => (
              <div key={category} className="mb-4">
                <h3 className="text-lg font-semibold text-[#010326] mb-2">{category}</h3>

                {/* Existing Meals */}
                {dayPlan[category]?.length > 0 ? (
                  dayPlan[category].map((meal, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-2 items-center">
                      <Input
                        type="text"
                        placeholder="Meal Name"
                        value={meal.name}
                        onChange={(e) => handleInputChange(dayPlan.day, category, index, "name", e.target.value)}
                        className="p-2 rounded-md border border-gray-300"
                      />
                      <Input
                        type="number"
                        placeholder="Calories"
                        value={meal.calories}
                        onChange={(e) => handleInputChange(dayPlan.day, category, index, "calories", e.target.value)}
                        className="p-2 rounded-md border border-gray-300"
                      />
                      <Input
                        type="number"
                        placeholder="Protein (g)"
                        value={meal.protein}
                        onChange={(e) => handleInputChange(dayPlan.day, category, index, "protein", e.target.value)}
                        className="p-2 rounded-md border border-gray-300"
                      />
                      <Input
                        type="number"
                        placeholder="Carbs (g)"
                        value={meal.carbs}
                        onChange={(e) => handleInputChange(dayPlan.day, category, index, "carbs", e.target.value)}
                        className="p-2 rounded-md border border-gray-300"
                      />
                      <Input
                        type="number"
                        placeholder="Fats (g)"
                        value={meal.fats}
                        onChange={(e) => handleInputChange(dayPlan.day, category, index, "fats", e.target.value)}
                        className="p-2 rounded-md border border-gray-300"
                      />
                      <Button
                        onClick={() => handleDeleteMeal(dayPlan.day, category, index)}
                        className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No meals added yet.</p>
                )}

                {/* Add Meal Button */}
                <Button
                  onClick={() => handleAddMeal(dayPlan.day, category)}
                  className="text-sm bg-[#07B0F2] text-white px-3 py-2 rounded-md hover:bg-[#005f9e] mt-2"
                >
                  + Add Meal
                </Button>
              </div>
            ))}
          </CardBody>
        </Card>
      ))}

      {/* Save Button */}
      <Button
        onClick={handleSave}
        className="mt-4 w-full bg-[#0DA64F] text-white py-3 px-4 rounded-md hover:bg-[#097d3a] font-bold"
      >
        Save Meal Plan
      </Button>
    </div>
  );
}
