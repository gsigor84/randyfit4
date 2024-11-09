import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request) {
  try {
    // Parse request body
    const { id, exercises } = await request.json();

    if (!id || !exercises || !Array.isArray(exercises)) {
      return new Response(
        JSON.stringify({ error: "Invalid request data." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Connect to the database
    const client = await clientPromise;
    const db = client.db("your_database_name"); // Replace with your database name

    // Fetch the current client data
    const clientData = await db.collection("clients").findOne({ _id: new ObjectId(id) });

    if (!clientData || !clientData.fullbody || clientData.fullbody.length === 0) {
      return new Response(
        JSON.stringify({ error: "No existing full-body exercises to update." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Find the last full-body entry and update it
    const lastEntryIndex = clientData.fullbody.length - 1;
    const updatedFullbody = [...clientData.fullbody];
    updatedFullbody[lastEntryIndex] = {
      ...updatedFullbody[lastEntryIndex],
      exercises,
      date: new Date(), // Update the date as well
    };

    // Save the updated fullbody array back to the database
    const result = await db.collection("clients").updateOne(
      { _id: new ObjectId(id) },
      { $set: { fullbody: updatedFullbody } }
    );

    if (result.modifiedCount === 0) {
      return new Response(
        JSON.stringify({ error: "Failed to update client." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ message: "Full-body exercises updated successfully!" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error updating full-body exercises:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
