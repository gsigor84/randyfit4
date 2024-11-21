import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const { id, upperbody, lowerbody, fullbody } = await req.json();

    if (!id) {
      return new Response(JSON.stringify({ error: "Missing client ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("your_database_name"); // Replace with your database name
    const collection = db.collection("clients");

    // Update the training data for the client
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          upperbody: upperbody || [],
          lowerbody: lowerbody || [],
          fullbody: fullbody || [],
        },
      }
    );

    if (result.modifiedCount === 0) {
      return new Response(JSON.stringify({ error: "Failed to update training data" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ message: "Training data updated successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating training data:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
