import clientPromise from "../../../lib/mongodb";

export async function POST(req) {
  try {
    console.log("Request received for adding client...");

    // Parse the incoming request body
    const { name, experience, goal } = await req.json();
    console.log("Request body:", { name, experience, goal }); // Log the data

    // Connect to MongoDB
    const client = await clientPromise;
    console.log("Connected to MongoDB...");

    // Insert into the "clients" collection
    const db = client.db("your_database_name"); // Replace with your actual database name
    const result = await db.collection("clients").insertOne({ name, experience, goal });

    console.log("Client added:", result);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error in /api/add-client:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
