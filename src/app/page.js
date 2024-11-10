import clientPromise from "../lib/mongodb";
import Link from "next/link";

export default async function Home() {
  let clients = [];

  try {
    const client = await clientPromise;
    const db = client.db("your_database_name"); // Replace with your database name
    clients = await db.collection("clients").find({}).toArray();
  } catch (error) {
    console.error("Error fetching clients:", error);
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
      <div className="relative max-w-7xl mx-auto mt-8 p-6">
        <h1 className="text-3xl font-bold text-[#ffa800] mb-6 text-center">
          Clients
        </h1>
        {clients.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((client) => (
              <div
                key={client._id}
                className="p-6 border border-gray-700 rounded-lg shadow-md bg-[#1c1c1c] text-white bg-opacity-90"
              >
                <h2 className="text-xl font-semibold text-[#ffa800] mb-2">
                  {client.name}
                </h2>
                <p className="text-sm">
                  <span className="font-bold text-gray-300">Experience:</span>{" "}
                  {client.experience}
                </p>
                <p className="text-sm mb-4">
                  <span className="font-bold text-gray-300">Goal:</span>{" "}
                  {client.goal}
                </p>
                <Link
                  href={`/client/${client._id}`}
                  className="text-[#ffa800] hover:underline font-semibold"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center">
            No clients found. Start adding clients!
          </p>
        )}
      </div>
    </div>
  );
}
