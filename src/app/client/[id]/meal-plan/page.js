"use client";

export default function MealPlanPage() {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const categories = ["Breakfast", "Lunch", "Dinner", "Snacks"];

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-[#1c1c1c] text-white rounded-lg">
      <h1 className="text-3xl font-bold text-[#ffa800] mb-6">Meal Plan</h1>

      {/* Day Selector */}
      <div className="mb-6">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {days.map((day) => (
            <button
              key={day}
              className="flex-shrink-0 py-2 px-4 rounded bg-[#333] text-white hover:bg-[#ffa800] hover:text-black"
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Meal Categories */}
      {categories.map((category) => (
        <details key={category} className="mb-6 bg-[#2c2c2c] p-4 rounded-md">
          <summary className="text-xl font-semibold text-[#ffa800] cursor-pointer">
            {category}
          </summary>

          {/* Example Meal Items */}
          <ul className="mt-4 space-y-2">
            <li className="bg-[#333] p-2 rounded-md flex justify-between items-center">
              <div>
                <p>Example Meal 1</p>
                <p className="text-sm text-gray-400">500 kcal | Protein: 30g | Carbs: 50g | Fats: 20g</p>
              </div>
              <div className="flex gap-2">
                <button className="text-blue-500 hover:text-blue-700">Edit</button>
                <button className="text-red-500 hover:text-red-700">Delete</button>
              </div>
            </li>
            <li className="bg-[#333] p-2 rounded-md flex justify-between items-center">
              <div>
                <p>Example Meal 2</p>
                <p className="text-sm text-gray-400">300 kcal | Protein: 15g | Carbs: 20g | Fats: 10g</p>
              </div>
              <div className="flex gap-2">
                <button className="text-blue-500 hover:text-blue-700">Edit</button>
                <button className="text-red-500 hover:text-red-700">Delete</button>
              </div>
            </li>
          </ul>

          {/* Add Meal Form */}
          <form className="mt-4 flex flex-col gap-2">
            <input
              type="text"
              placeholder={`Add a new ${category} meal`}
              className="w-full p-2 bg-[#444] text-white rounded"
            />
            <div className="flex gap-2">
              <input type="number" placeholder="Calories" className="w-1/4 p-2 bg-[#444] text-white rounded" />
              <input type="number" placeholder="Protein" className="w-1/4 p-2 bg-[#444] text-white rounded" />
              <input type="number" placeholder="Carbs" className="w-1/4 p-2 bg-[#444] text-white rounded" />
              <input type="number" placeholder="Fats" className="w-1/4 p-2 bg-[#444] text-white rounded" />
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
    </div>
  );
}
