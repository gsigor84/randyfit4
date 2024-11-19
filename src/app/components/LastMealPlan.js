import React from "react";

export default function LastMealPlan({ mealPlan }) {
  // Ensure mealPlan is an array and get the last 7 meal plans
  const lastSevenPlans = Array.isArray(mealPlan) ? mealPlan.slice(-7) : [];

  return (
    <div className="bg-[#1c1c1c] p-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-[#ffa800] mb-4">Last Meal Plan</h2>
      <div className="space-y-6">
        {lastSevenPlans.length > 0 ? (
          lastSevenPlans.map((plan, index) => (
            <div key={index} className="p-4 bg-gray-800 rounded-md">
              <h3 className="text-lg font-semibold text-[#ffa800] mb-2">
                Day: {plan.day || "Unknown"}
              </h3>
              <div className="space-y-2">
                {["Breakfast", "Lunch", "Dinner", "Snacks"].map((mealType) => (
                  <div key={mealType}>
                    <p className="text-sm text-gray-400 font-bold">{mealType}:</p>
                    {plan[mealType] && plan[mealType].length > 0 ? (
                      <ul className="list-disc pl-5 text-sm text-gray-300">
                        {plan[mealType].map((meal, mealIndex) => (
                          <li key={mealIndex}>
                            {meal.name} - {meal.calories} kcal | Protein:{" "}
                            {meal.protein}g | Carbs: {meal.carbs}g | Fats:{" "}
                            {meal.fats}g
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">No {mealType} meals.</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No valid meal plans available.</p>
        )}
      </div>
    </div>
  );
}
