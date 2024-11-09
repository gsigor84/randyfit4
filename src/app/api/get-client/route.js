import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new Response(
        JSON.stringify({ success: false, error: "Client ID is required" }),
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("your_database_name"); // Replace with your database name

    const clientData = await db.collection("clients").findOne({ _id: new ObjectId(id) });

    if (!clientData) {
      return new Response(
        JSON.stringify({ success: false, error: "Client not found" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(clientData), { status: 200 });
  } catch (error) {
    console.error("Error fetching client data:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
    });
  }
}
