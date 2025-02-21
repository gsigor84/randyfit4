import React from "react";

export default function LastMealPlan({ mealPlan }) {
  // Ensure mealPlan is an array and get the last 7 meal plans
  const lastSevenPlans = Array.isArray(mealPlan) ? mealPlan.slice(-7) : [];

  return (
    <div className="bg-white  ">
      <h2 className="text-2xl font-bold text-[#010326] mb-4 text-center">Last Meal Plan</h2>


      <div className="space-y-6">
        {lastSevenPlans.length > 0 ? (
          lastSevenPlans.map((plan, index) => (
            <div key={index} className="p-4 bg-[#F2F2F2] rounded-md border border-gray-300">
              <h3 className="text-lg font-semibold text-[#07B0F2] mb-2">
                {plan.day || "Unknown"}
              </h3>

              <div className="space-y-2">
                {["Breakfast", "Lunch", "Dinner", "Snacks"].map((mealType) => (
                  <div key={mealType} className="mb-2">
                    <p className="text-md font-semibold text-[#010326]">{mealType}:</p>
                    {plan[mealType] && plan[mealType].length > 0 ? (
                      <ul className="list-disc pl-5 text-sm text-gray-700">
                        {plan[mealType].map((meal, mealIndex) => (
                          <li key={mealIndex} className="py-1">
                            <span className="font-semibold">{meal.name}</span> - {meal.calories} kcal |
                            Protein: {meal.protein}g | Carbs: {meal.carbs}g | Fats: {meal.fats}g
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
          <p className="text-gray-500 text-center">No meal plans available.</p>
        )}
      </div>
    </div>
  );
}
