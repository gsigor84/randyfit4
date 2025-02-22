import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request) {
  try {
    // Parse the request body
    const { id, groupedExercises } = await request.json();

    // Validate the input data
    if (!id || !groupedExercises || !groupedExercises.exercises || groupedExercises.exercises.length === 0 || !groupedExercises.day) {
      return new Response(JSON.stringify({ error: "Invalid data provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Connect to MongoDB database
    const client = await clientPromise;
    const db = client.db("your_database_name"); // Replace with your database name
    const collection = db.collection("clients"); // Replace with your collection name

    // Convert the client ID to ObjectId
    const clientObjectId = new ObjectId(id);

    // Fetch the client document
    const clientDoc = await collection.findOne({ _id: clientObjectId });

    if (!clientDoc) {
      return new Response(JSON.stringify({ error: "Client not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Append the new exercises with the selected day to the lowerbody array
    const updatedLowerbody = clientDoc.lowerbody
      ? [...clientDoc.lowerbody, groupedExercises]
      : [groupedExercises];

    // Update the document in the database
    const updateResult = await collection.updateOne(
      { _id: clientObjectId },
      { $set: { lowerbody: updatedLowerbody } }
    );

    // Check if the update was successful
    if (updateResult.modifiedCount === 0) {
      return new Response(JSON.stringify({ error: "Failed to update exercises" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Return a success message
    return new Response(
      JSON.stringify({ message: "Exercises updated successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error updating lower body exercises:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
