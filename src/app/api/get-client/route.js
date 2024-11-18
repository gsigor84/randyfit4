import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request) {
  try {
    // Extract `id` from the request's query parameters
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ error: "Client ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Connect to the database
    const client = await clientPromise;
    const db = client.db("your_database_name"); // Replace with your database name

    // Fetch the client document
    const clientData = await db
      .collection("clients")
      .findOne({ _id: new ObjectId(id) });

    if (!clientData) {
      return new Response(JSON.stringify({ error: "Client not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Ensure `upperbody` and `lowerbody` fields are arrays
    const formattedData = {
      ...clientData,
      upperbody: Array.isArray(clientData.upperbody) ? clientData.upperbody : [],
      lowerbody: Array.isArray(clientData.lowerbody) ? clientData.lowerbody : [],
    };

    // Return the formatted client data
    return new Response(JSON.stringify(formattedData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching client data:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
