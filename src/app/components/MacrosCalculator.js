"use client";

import { useState, useEffect } from "react";

export default function MacrosCalculator({ age, weight, height, gender, goal }) {
  const [activityLevel, setActivityLevel] = useState(1.2); // Default: Sedentary
  const [calories, setCalories] = useState(0);
  const [macros, setMacros] = useState({ protein: 0, carbs: 0, fats: 0 });

  // Macronutrient ratios based on the goal
  const macroRatios = {
    "Muscle Gain": { protein: [0.25, 0.3], carbs: [0.45, 0.55], fats: [0.2, 0.25] },
    "Fat Loss": { protein: [0.3, 0.4], carbs: [0.3, 0.4], fats: [0.2, 0.3] },
  };

  // Calculate BMR
  const calculateBMR = () => {
    if (gender === "Male") {
      return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161;
    }
  };

  // Calculate TDEE and Adjust Calories
  const calculateCalories = () => {
    const bmr = calculateBMR();
    const tdee = bmr * activityLevel;

    if (goal === "Muscle Gain") {
      return tdee * 1.15; // Add 15% for muscle gain
    } else if (goal === "Fat Loss") {
      return tdee * 0.8; // Subtract 20% for fat loss
    }
    return tdee; // Maintenance
  };

  // Calculate Macronutrients
  const calculateMacros = () => {
    const totalCalories = calculateCalories();
    const ratios = macroRatios[goal] || macroRatios["Muscle Gain"];

    const proteinCalories = totalCalories * ((ratios.protein[0] + ratios.protein[1]) / 2);
    const carbsCalories = totalCalories * ((ratios.carbs[0] + ratios.carbs[1]) / 2);
    const fatsCalories = totalCalories * ((ratios.fats[0] + ratios.fats[1]) / 2);

    setMacros({
      protein: proteinCalories / 4, // 4 calories per gram of protein
      carbs: carbsCalories / 4, // 4 calories per gram of carbs
      fats: fatsCalories / 9, // 9 calories per gram of fats
    });
    setCalories(totalCalories);
  };

  useEffect(() => {
    calculateMacros();
  }, [activityLevel, age, weight, height, gender, goal]);

  return (
    <div className="bg-gray-800 p-4 rounded-lg text-white space-y-4">
      <h2 className="text-xl font-semibold text-[#ffa800]">Macro Calculator</h2>

      {/* Activity Level */}
      <div>
        <label className="block mb-1 text-sm">Activity Level</label>
        <select
          value={activityLevel}
          onChange={(e) => setActivityLevel(parseFloat(e.target.value))}
          className="w-full rounded-md bg-gray-700 text-white p-2 border border-gray-600"
        >
          <option value="1.2">Sedentary (little/no exercise)</option>
          <option value="1.375">Lightly Active (1-3 days/week)</option>
          <option value="1.55">Moderately Active (3-5 days/week)</option>
          <option value="1.725">Very Active (6-7 days/week)</option>
          <option value="1.9">Super Active (physical job, training twice daily)</option>
        </select>
      </div>

      {/* Results */}
      <div className="space-y-2">
        <p>Total Calories: {calories.toFixed(0)} kcal</p>
        <p>Protein: {macros.protein.toFixed(1)} g</p>
        <p>Carbs: {macros.carbs.toFixed(1)} g</p>
        <p>Fats: {macros.fats.toFixed(1)} g</p>
      </div>
    </div>
  );
}
