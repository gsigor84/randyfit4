import { Resend } from "resend";

export async function POST(req) {
  try {
    const { email, workoutPlan, mealPlan } = await req.json();

    if (!email || !workoutPlan || !mealPlan) {
      return new Response(
        JSON.stringify({ error: "Invalid input data" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Format Workouts
    const formatWorkouts = (category, workouts) => {
      const groupedByDay = workouts.reduce((acc, workout) => {
        const day = workout.day || "Unknown Day";
        if (!acc[day]) acc[day] = [];
        acc[day].push(workout);
        return acc;
      }, {});

      const daysOfWeek = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];

      const formatted = daysOfWeek.map((day) => {
        const dayWorkouts = groupedByDay[day] || [];
        if (dayWorkouts.length === 0) return `<li><strong>${day}:</strong> Off</li>`;
        return `<li><strong>${day}:</strong> ${dayWorkouts
          .map(
            (workout) =>
              workout.exercises
                .map(
                  (e) =>
                    `${e.name} (${e.sets} sets, ${e.reps} reps, ${e.weight} kg)`
                )
                .join(", ")
          )
          .join(", ")}</li>`;
      });

      return `
        <h3>${category} Workouts</h3>
        <ul>${formatted.join("")}</ul>
      `;
    };

    // Format Meal Plan
    const formatMealPlan = (mealPlan) => {
      const formatted = mealPlan.map((dayPlan) => {
        return `
          <h3>${dayPlan.day}</h3>
          <ul>
            <li><strong>Breakfast:</strong> ${dayPlan.Breakfast.length > 0
            ? dayPlan.Breakfast.map(
              (meal) =>
                `${meal.name} - ${meal.calories} kcal | Protein: ${meal.protein}g | Carbs: ${meal.carbs}g | Fats: ${meal.fats}g`
            ).join(", ")
            : "No Breakfast meals."
          }</li>
            <li><strong>Lunch:</strong> ${dayPlan.Lunch.length > 0
            ? dayPlan.Lunch.map(
              (meal) =>
                `${meal.name} - ${meal.calories} kcal | Protein: ${meal.protein}g | Carbs: ${meal.carbs}g | Fats: ${meal.fats}g`
            ).join(", ")
            : "No Lunch meals."
          }</li>
            <li><strong>Dinner:</strong> ${dayPlan.Dinner.length > 0
            ? dayPlan.Dinner.map(
              (meal) =>
                `${meal.name} - ${meal.calories} kcal | Protein: ${meal.protein}g | Carbs: ${meal.carbs}g | Fats: ${meal.fats}g`
            ).join(", ")
            : "No Dinner meals."
          }</li>
            <li><strong>Snacks:</strong> ${dayPlan.Snacks.length > 0
            ? dayPlan.Snacks.map(
              (meal) =>
                `${meal.name} - ${meal.calories} kcal | Protein: ${meal.protein}g | Carbs: ${meal.carbs}g | Fats: ${meal.fats}g`
            ).join(", ")
            : "No Snacks meals."
          }</li>
          </ul>
        `;
      });

      return formatted.join("");
    };

    // Generate Email Content
    const emailContent = `
      <h1>Client Overview</h1>
      <h2>Workout Plan</h2>
      ${formatWorkouts("Upper Body", workoutPlan.upperbody)}
      ${formatWorkouts("Lower Body", workoutPlan.lowerbody)}
      ${formatWorkouts("Full Body", workoutPlan.fullbody)}
      <h2>Meal Plan</h2>
      ${formatMealPlan(mealPlan)}
    `;

    // Send Email via Resend
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: email,
      subject: "Client Overview",
      html: emailContent,
    });

    return new Response(
      JSON.stringify({ message: "Email sent successfully", result }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error sending email:", {
      message: error.message,
      stack: error.stack,
    });
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
