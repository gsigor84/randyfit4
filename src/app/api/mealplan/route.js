import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request) {
  try {
    const { id, mealPlan } = await request.json();

    // Ensure valid input
    if (!id || !Array.isArray(mealPlan)) {
      return new Response(
        JSON.stringify({ error: "Invalid input data" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const client = await clientPromise;
    const db = client.db("your_database_name");
    const collection = db.collection("clients");

    const clientObjectId = new ObjectId(id);

    // Update the client's meal plan in the database
    const updateResult = await collection.updateOne(
      { _id: clientObjectId },
      { $set: { mealPlan } }
    );

    if (updateResult.modifiedCount === 0) {
      return new Response(
        JSON.stringify({ error: "Failed to update meal plan" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ message: "Meal plan updated successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in POST /api/mealplan:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
