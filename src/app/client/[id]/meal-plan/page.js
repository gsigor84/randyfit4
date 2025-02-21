"use client";

import { useClient } from "../ClientContext";
import { useState } from "react";
import {
  Button,
  Input,
  Select,
  SelectItem,
  Card,
  CardHeader,
  CardBody,
} from "@heroui/react";

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
    if (!newMeal.name || !newMeal.calories || !newMeal.protein || !newMeal.carbs || !newMeal.fats) {
      alert("Please fill out all fields before adding a meal.");
      return;
    }

    setMealPlan((prevPlan) => ({
      ...prevPlan,
      [newMeal.day]: {
        ...prevPlan[newMeal.day],
        [newMeal.category]: [...prevPlan[newMeal.day][newMeal.category], { ...newMeal }],
      },
    }));

    // Reset input fields
    setNewMeal({ day: "Monday", category: "Breakfast", name: "", calories: "", protein: "", carbs: "", fats: "" });
  };

  const handleSaveMealPlan = async () => {
    if (!client) {
      alert("Client data is not loaded.");
      return;
    }

    const formattedMealPlan = Object.keys(mealPlan).map((day) => ({
      day,
      ...mealPlan[day],
    }));

    try {
      const response = await fetch("/api/mealplan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: client._id, mealPlan: formattedMealPlan }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert("Failed to save the meal plan.");
        return;
      }

      alert("Meal plan saved successfully!");
    } catch (error) {
      alert("An error occurred while saving the meal plan.");
    }
  };

  if (!client) {
    return <p className="text-gray-500 text-center mt-6">No client data found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-[#010326] text-center mb-6">Meal Plan</h1>

      {/* Add Meal Section */}
      <Card className="mb-6 shadow-md">
        <CardHeader className="bg-[#07B0F2] text-white text-xl font-semibold p-4 rounded-t-md">
          Add a Meal
        </CardHeader>

        <CardBody className="p-6 space-y-4">
          {/* Select Inputs for Day & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Day Dropdown */}
            <div className="relative w-full">
              <label className="text-gray-600 text-sm mb-1">Day</label>
              <Select
                selectedKeys={[newMeal.day]}
                onChange={(e) => setNewMeal((prev) => ({ ...prev, day: e.target.value }))}
                className="w-full bg-white text-black border border-gray-300 rounded-lg p-3 shadow-md text-lg cursor-pointer"
              >
                {Object.keys(mealPlan).map((day) => (
                  <SelectItem key={day} value={day} className="p-4 text-black bg-white hover:bg-gray-100 text-lg">
                    {day}
                  </SelectItem>
                ))}
              </Select>
            </div>

            {/* Meal Category Dropdown */}
            <div className="relative w-full">
              <label className="text-gray-600 text-sm mb-1">Meal</label>
              <Select
                selectedKeys={[newMeal.category]}
                onChange={(e) => setNewMeal((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full bg-white text-black border border-gray-300 rounded-lg p-3 shadow-md text-lg cursor-pointer"
              >
                {["Breakfast", "Lunch", "Dinner", "Snacks"].map((category) => (
                  <SelectItem key={category} value={category} className="p-4 text-black bg-white hover:bg-gray-100 text-lg">
                    {category}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>

          {/* Meal Input Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {["name", "calories", "protein", "carbs", "fats"].map((field, index) => (
              <div key={index} className="flex flex-col">
                <label className="text-gray-600 text-sm">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <Input
                  type="text"
                  placeholder={`Enter ${field}`}
                  value={newMeal[field]}
                  onChange={(e) => setNewMeal((prev) => ({ ...prev, [field]: e.target.value }))}
                  className="bg-white text-black text-lg w-full h-12 mt-1"
                />
              </div>
            ))}
          </div>

          {/* Add Meal Button */}
          <Button
            onClick={handleAddMeal}
            className="bg-[#07B0F2] text-white w-full py-3 rounded-md hover:bg-[#005f9e] focus:ring-2 focus:ring-[#07B0F2]"
          >
            + Add Meal
          </Button>
        </CardBody>
      </Card>

      {/* Meal Plan Display */}
      <div className="space-y-6">
        {Object.keys(mealPlan).map((day) => (
          <Card key={day} className="shadow-md">
            <CardHeader className="bg-[#07B0F2] text-white text-xl font-semibold p-4 rounded-t-md">
              {day}
            </CardHeader>
            <CardBody className="p-6 space-y-4">
              {["Breakfast", "Lunch", "Dinner", "Snacks"].map((category) => (
                <div key={category} className="mb-4">
                  <h3 className="text-lg font-semibold text-[#010326]">{category}</h3>
                  {mealPlan[day][category].length > 0 ? (
                    mealPlan[day][category].map((meal, index) => (
                      <p key={index} className="text-sm text-gray-700">
                        {meal.name} - {meal.calories} kcal | Protein: {meal.protein}g | Carbs: {meal.carbs}g | Fats: {meal.fats}g
                      </p>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">No meals added yet.</p>
                  )}
                </div>
              ))}
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Save Button */}
      <Button
        onClick={handleSaveMealPlan}
        className="mt-6 w-full bg-[#0DA64F] text-white py-3 rounded-md hover:bg-[#097d3a]"
      >
        Save Meal Plan
      </Button>
    </div>
  );
}
