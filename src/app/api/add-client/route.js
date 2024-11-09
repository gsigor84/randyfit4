import clientPromise from "../../../lib/mongodb";

export async function POST(req) {
  try {
    const { name, experience, goal } = await req.json();

    const client = await clientPromise;
    const db = client.db("your_database_name"); // Replace with your database name
    await db.collection("clients").insertOne({ name, experience, goal });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error adding client:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
