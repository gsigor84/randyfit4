import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
import DeleteClientButton from "./delete-client-button";

export default async function ClientLayout({ children, params }) {
  const { id } = params;
  let client = null;

  try {
    const clientConnection = await clientPromise;
    const db = clientConnection.db("your_database_name");

    // Fetch client details
    client = await db.collection("clients").findOne({ _id: new ObjectId(id) });
  } catch (error) {
    console.error("Error fetching client:", error);
  }

  if (!client) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-semibold">Client Not Found</h1>
        <p>We couldn't find the client you're looking for.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-8">
      <div className=" p-4 rounded shadow mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold uppercase">{client.name}</h1>
          <p>
            <strong>Experience Level:</strong> {client.experience || "Not Specified"}
          </p>
          <p>
            <strong>Training Goal:</strong> {client.goal || "Not Specified"}
          </p>
        </div>

        {/* Delete Button */}
        <DeleteClientButton clientId={id} />
      </div>

      <nav className="border-b mb-6">
        <ul className="flex space-x-4">
          <li>
            <a
              href={`/client/${id}/training`}
              className="pb-2 border-b-2 border-transparent hover:border-blue-500"
            >
              Training
            </a>
          </li>
          <li>
            <a
              href={`/client/${id}/overview`}
              className="pb-2 border-b-2 border-transparent hover:border-blue-500"
            >
              Overview
            </a>
          </li>
          <li>
            <a
              href={`/client/${id}/tasks`}
              className="pb-2 border-b-2 border-transparent hover:border-blue-500"
            >
              Tasks
            </a>
          </li>
          <li>
            <a
              href={`/client/${id}/meal-plan`}
              className="pb-2 border-b-2 border-transparent hover:border-blue-500"
            >
              Meal Plan
            </a>
          </li>
        </ul>
      </nav>

      <div>{children}</div>
    </div>
  );
}
