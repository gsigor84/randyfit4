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
    <div className="max-w-7xl mx-auto mt-8">
      <h1 className="text-2xl font-semibold mb-4">Clients</h1>
      {clients.length > 0 ? (
        <ul className="space-y-2">
          {clients.map((client) => (
            <li
              key={client._id}
              className="p-4 border rounded shadow-sm bg-gray-50"
            >
              <p>
                <Link
                  href={`/client/${client._id}`}
                  className="text-blue-500 hover:underline"
                >
                  {client.name}
                </Link>
              </p>
              <p>
                <strong>Experience:</strong> {client.experience}
              </p>
              <p>
                <strong>Goal:</strong> {client.goal}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No clients found.</p>
      )}
    </div>
  );
}
