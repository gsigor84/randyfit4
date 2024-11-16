import clientPromise from "../../../lib/mongodb";

export async function POST(req) {
  try {
    console.log("Request received for adding client...");

    // Parse the incoming request body
    const { name, age, gender, weight, height, experience, goal } = await req.json();
    console.log("Request body:", { name, age, gender, weight, height, experience, goal }); // Log the data

    // Validate the input data (basic validation)
    if (!name || !age || !gender || !weight || !height || !experience || !goal) {
      return new Response(
        JSON.stringify({ error: "All fields are required." }),
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    console.log("Connected to MongoDB...");

    // Insert into the "clients" collection
    const db = client.db("your_database_name"); // Replace with your actual database name
    const result = await db.collection("clients").insertOne({
      name,
      age: parseInt(age, 10), // Ensure age is stored as a number
      gender,
      weight: parseFloat(weight), // Ensure weight is stored as a number
      height: parseFloat(height), // Ensure height is stored as a number
      experience,
      goal,
      createdAt: new Date(), // Optional: add a timestamp for when the client was added
    });

    console.log("Client added:", result);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error in /api/add-client:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
