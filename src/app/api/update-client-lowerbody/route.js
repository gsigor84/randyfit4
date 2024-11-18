import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request) {
  try {
    const { id, groupedExercises } = await request.json();

    if (!id || !groupedExercises || !groupedExercises.exercises || groupedExercises.exercises.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid data provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const client = await clientPromise;
    const db = client.db("your_database_name");
    const collection = db.collection("clients");

    const clientObjectId = new ObjectId(id);

    const clientDoc = await collection.findOne({ _id: clientObjectId });

    if (!clientDoc) {
      return new Response(JSON.stringify({ error: "Client not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const updatedLowerbody = clientDoc.lowerbody
      ? [...clientDoc.lowerbody, groupedExercises]
      : [groupedExercises];

    const updateResult = await collection.updateOne(
      { _id: clientObjectId },
      { $set: { lowerbody: updatedLowerbody } }
    );

    if (updateResult.modifiedCount === 0) {
      return new Response(JSON.stringify({ error: "Failed to update exercises" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ message: "Exercises updated successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error updating lower body exercises:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
