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

    // Format Workouts as a Table
    const formatWorkouts = (category, workouts) => {
      const groupedByDay = workouts.reduce((acc, workout) => {
        const day = workout.day || "Unknown Day";
        if (!acc[day]) acc[day] = [];
        acc[day].push(workout);
        return acc;
      }, {});

      const daysOfWeek = [
        "Monday", "Tuesday", "Wednesday", "Thursday",
        "Friday", "Saturday", "Sunday"
      ];

      let formatted = "";
      daysOfWeek.forEach((day) => {
        const dayWorkouts = groupedByDay[day] || [];
        if (dayWorkouts.length === 0) {
          formatted += `<p style="font-size:14px; color:#555;"><strong>${day}:</strong> Rest Day</p>`;
        } else {
          formatted += `
            <p style="font-size:16px; font-weight:bold; color:#007BFF;">${day}</p>
            <table style="width:100%; border-collapse:collapse; font-size:14px; margin-bottom:10px;">
              <thead>
                <tr style="background-color:#007BFF; color:#fff;">
                  <th style="padding:8px; border:1px solid #ddd;">Exercise</th>
                  <th style="padding:8px; border:1px solid #ddd;">Sets</th>
                  <th style="padding:8px; border:1px solid #ddd;">Reps</th>
                  <th style="padding:8px; border:1px solid #ddd;">Weight (kg)</th>
                </tr>
              </thead>
              <tbody>
                ${dayWorkouts
              .map((workout) =>
                workout.exercises
                  .map(
                    (e) => `
                        <tr>
                          <td style="padding:8px; border:1px solid #ddd;">${e.name}</td>
                          <td style="padding:8px; border:1px solid #ddd;">${e.sets}</td>
                          <td style="padding:8px; border:1px solid #ddd;">${e.reps}</td>
                          <td style="padding:8px; border:1px solid #ddd;">${e.weight} kg</td>
                        </tr>
                        `
                  )
                  .join("")
              )
              .join("")}
              </tbody>
            </table>
          `;
        }
      });

      return `
        <h3 style="color:#333;">${category} Workouts</h3>
        ${formatted}
      `;
    };

    // Format Meal Plan as a Table
    const formatMealPlan = (mealPlan) => {
      return mealPlan
        .map(
          (dayPlan) => `
          <h3 style="color:#007BFF;">${dayPlan.day}</h3>
          <table style="width:100%; border-collapse:collapse; font-size:14px;">
            <thead>
              <tr style="background-color:#28A745; color:#fff;">
                <th style="padding:8px; border:1px solid #ddd;">Meal Type</th>
                <th style="padding:8px; border:1px solid #ddd;">Details</th>
              </tr>
            </thead>
            <tbody>
              ${["Breakfast", "Lunch", "Dinner", "Snacks"]
              .map(
                (mealType) => `
                  <tr>
                    <td style="padding:8px; border:1px solid #ddd; font-weight:bold;">${mealType}</td>
                    <td style="padding:8px; border:1px solid #ddd;">
                      ${dayPlan[mealType].length > 0
                    ? dayPlan[mealType]
                      .map(
                        (meal) =>
                          `${meal.name} - ${meal.calories} kcal | Protein: ${meal.protein}g | Carbs: ${meal.carbs}g | Fats: ${meal.fats}g`
                      )
                      .join("<br>")
                    : "No meals added"
                  }
                    </td>
                  </tr>
                `
              )
              .join("")}
            </tbody>
          </table>
          <br>
        `
        )
        .join("");
    };

    // Generate Email Content
    const emailContent = `
      <div style="font-family:Arial, sans-serif; padding:20px; max-width:600px; margin:auto;">
        <h1 style="color:#333; text-align:center;">Client Overview</h1>
        
        <h2 style="color:#333;">Workout Plan</h2>
        ${formatWorkouts("Upper Body", workoutPlan.upperbody)}
        ${formatWorkouts("Lower Body", workoutPlan.lowerbody)}
        ${formatWorkouts("Full Body", workoutPlan.fullbody)}

        <h2 style="color:#333;">Meal Plan</h2>
        ${formatMealPlan(mealPlan)}

        <p style="font-size:14px; color:#555; text-align:center;">
          <em>Thank you for using our fitness tracking system!</em>
        </p>
      </div>
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
