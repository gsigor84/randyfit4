import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request) {
  try {
    // Parse the request body
    const { id, groupedExercises } = await request.json();

    // Validate the input
    if (!id || !groupedExercises || !groupedExercises.exercises || groupedExercises.exercises.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid data provided" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Connect to the database
    const client = await clientPromise;
    const db = client.db("your_database_name");
    const collection = db.collection("clients");

    const clientObjectId = new ObjectId(id);

    // Fetch the client document
    const clientDoc = await collection.findOne({ _id: clientObjectId });

    if (!clientDoc) {
      return new Response(
        JSON.stringify({ error: "Client not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Ensure the day is part of the grouped exercises
    const updatedFullbody = clientDoc.fullbody
      ? [...clientDoc.fullbody, groupedExercises]
      : [groupedExercises];

    // Update the document in the database
    const updateResult = await collection.updateOne(
      { _id: clientObjectId },
      { $set: { fullbody: updatedFullbody } }
    );

    if (updateResult.modifiedCount === 0) {
      return new Response(
        JSON.stringify({ error: "Failed to update exercises" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ message: "Exercises updated successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error updating full body exercises:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
