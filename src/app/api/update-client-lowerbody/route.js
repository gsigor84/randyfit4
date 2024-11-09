import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const { id, exercises } = await req.json();

    if (!id || !Array.isArray(exercises) || exercises.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid data" }),
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("your_database_name"); // Replace with your database name

    const validatedExercises = exercises.map((exercise) => ({
      name: exercise.name || "Unnamed Exercise",
      sets: exercise.sets || 1,
      weight: exercise.weight || 5,
      reps: exercise.reps || 1,
    }));

    const result = await db.collection("clients").updateOne(
      { _id: new ObjectId(id) },
      {
        $push: {
          lowerbody: {
            exercises: validatedExercises,
            date: new Date(),
          },
        },
      }
    );

    if (result.modifiedCount === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "No client updated" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error updating client:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
