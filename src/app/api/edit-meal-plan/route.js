import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const { clientId, mealPlan } = await req.json();

    // Validate the data
    if (!clientId || !mealPlan || !Array.isArray(mealPlan)) {
      return new Response(
        JSON.stringify({ error: "Invalid input data" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const client = await clientPromise;
    const db = client.db("your_database_name"); // Replace with your database name
    const collection = db.collection("clients");

    // Convert clientId to MongoDB ObjectId
    const clientObjectId = new ObjectId(clientId);

    // Update the client's meal plan
    const result = await collection.updateOne(
      { _id: clientObjectId },
      { $set: { mealPlan } }
    );

    if (result.modifiedCount === 0) {
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
    console.error("Error updating meal plan:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
