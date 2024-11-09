import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    // Parse the URL and get the 'id' query parameter
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ success: false, error: "Client ID is required" }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("your_database_name");

    // Delete the client from the database
    const result = await db.collection("clients").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ success: false, error: "Client not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error deleting client:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
