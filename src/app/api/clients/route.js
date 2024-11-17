import clientPromise from "../../../lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("your_database_name"); // Replace with your actual database name
    const clients = await db.collection("clients").find({}).toArray();

    // Convert MongoDB ObjectIDs to strings
    const clientsWithIds = clients.map((client) => ({
      ...client,
      _id: client._id.toString(),
    }));

    return new Response(JSON.stringify(clientsWithIds), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching clients:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch clients" }), {
      status: 500,
    });
  }
}
