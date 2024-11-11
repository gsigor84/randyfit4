import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function ClientDetailsPage({ params }) {
  const { id } = params;
  let client = null;
  let error = null;

  try {
    const clientConnection = await clientPromise;
    const db = clientConnection.db("your_database_name");
    client = await db.collection("clients").findOne({ _id: new ObjectId(id) });

    if (client) {
      client._id = client._id.toString();
    }
  } catch (err) {
    console.error("Error fetching client details:", err);
    error = err.message || "Failed to load client details.";
  }

  if (error) {
    return (
      <div className="relative min-h-screen p-4 bg-black text-white">
        <h1 className="text-3xl text-center mt-8">Error</h1>
        <p className="text-center mt-4">{error}</p>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="relative min-h-screen p-4 bg-black text-white">
        <h1 className="text-3xl text-center mt-8">Client Not Found</h1>
        <p className="text-center mt-4">
          The client you're looking for doesn't exist.
        </p>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen p-4"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-80"></div>

      {/* Content */}
      <div className="relative max-w-4xl mx-auto mt-8 p-6 bg-[#1c1c1c] text-white bg-opacity-90 rounded-lg">
        <h1 className="text-3xl font-bold text-[#ffa800] mb-4">
          Welcome, {client.name}!
        </h1>
        <p className="text-lg text-gray-300">
          We’re thrilled to have you here! Let's get started on achieving your
          goals.
        </p>
      </div>
    </div>
  );
}
