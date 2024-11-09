import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function ClientPage({ params }) {
  const { id } = params;

  let client = null;

  try {
    const clientConnection = await clientPromise;
    const db = clientConnection.db("your_database_name"); // Replace with your actual database name

    // Fetch client data
    client = await db.collection("clients").findOne({ _id: new ObjectId(id) });
    console.log("Fetched Client:", client); // Debug log to verify fetched data
  } catch (error) {
    console.error("Error fetching client:", error);
  }

  // Handle case where client is not found
  if (!client) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-semibold">Client Not Found</h1>
        <p>We couldn't find the client you're looking for.</p>
      </div>
    );
  }

  // Render client information
  return (
    <div className="max-w-7xl mx-auto mt-8">
      <h1 className="text-2xl font-semibold mb-4">{client.name}</h1>
      <div className="bg-gray-100 p-4 rounded shadow mb-6">
        <p>
          <strong>Experience Level:</strong> {client.experience || "Not Specified"}
        </p>
        <p>
          <strong>Training Goal:</strong> {client.goal || "Not Specified"}
        </p>
      </div>
    </div>
  );
}
