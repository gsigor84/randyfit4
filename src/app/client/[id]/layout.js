import React from "react";
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
import DeleteClientButton from "../[id]/delete-client-button";
import { ClientProvider } from "../[id]/ClientContext";

export default async function ClientLayout({ children, params: rawParams }) {
  // Await params to ensure it's fully resolved
  const params = await rawParams;
  const { id } = params;

  let client = null;

  try {
    const clientConnection = await clientPromise;
    const db = clientConnection.db("your_database_name"); // Replace with your database name

    // Fetch client details
    client = await db.collection("clients").findOne({ _id: new ObjectId(id) });
    client = { ...client, _id: client._id.toString() }; // Convert _id to string
  } catch (error) {
    console.error("Error fetching client:", error);
  }

  if (!client) {
    return (
      <div className="relative min-h-screen p-4 bg-black text-white">
        <h1 className="text-3xl text-center mt-8">Error</h1>
        <p className="text-center mt-4">Client not found.</p>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen p-2"
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
      <div className="relative max-w-7xl mx-auto mt-8 p-6 bg-[#1c1c1c] text-white bg-opacity-90 rounded-lg">
        <ClientProvider value={client}>
          {/* Client Info */}
          <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-[#ffa800]">
                {client.name}
              </h1>
              <p className="text-sm">
                <span className="font-semibold text-gray-300">Age:</span> {client.age || "N/A"}
              </p>
              <p className="text-sm">
                <span className="font-semibold text-gray-300">Gender:</span> {client.gender || "N/A"}
              </p>
              <p className="text-sm">
                <span className="font-semibold text-gray-300">Weight:</span> {client.weight || "N/A"} kg
              </p>
              <p className="text-sm">
                <span className="font-semibold text-gray-300">Height:</span> {client.height || "N/A"} cm
              </p>
              <p className="text-sm">
                <span className="font-semibold text-gray-300">Experience Level:</span>{" "}
                {client.experience}
              </p>
              <p className="text-sm">
                <span className="font-semibold text-gray-300">Training Goal:</span>{" "}
                {client.goal}
              </p>
            </div>

            {/* Delete Client Button */}
            <div className="w-full md:w-auto">
              <DeleteClientButton clientId={id} />
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="mb-6">
            <ul className="flex flex-wrap justify-center gap-4">
              <li>
                <a
                  href={`/client/${id}/training`}
                  className="text-[#ffa800] font-semibold hover:underline"
                >
                  Training
                </a>
              </li>
              <li>
                <a
                  href={`/client/${id}/overview`}
                  className="text-[#ffa800] font-semibold hover:underline"
                >
                  Overview
                </a>
              </li>
              <li>
                <a
                  href={`/client/${id}/edit-training`}
                  className="text-[#ffa800] font-semibold hover:underline"
                >
                  Edit Training
                </a>
              </li>
              <li>
                <a
                  href={`/client/${id}/meal-plan`}
                  className="text-[#ffa800] font-semibold hover:underline"
                >
                  Meal Plan
                </a>
              </li>
              <li>
                <a
                  href={`/client/${id}/edit-meal-plan`}
                  className="text-[#ffa800] font-semibold hover:underline"
                >
                  Edit Meal Plan
                </a>
              </li>
              <li>
                <a
                  href={`/client/${id}/tasks`}
                  className="text-[#ffa800] font-semibold hover:underline"
                >
                  Tasks
                </a>
              </li>
            </ul>
          </nav>

          {/* Render Children */}
          {children}
        </ClientProvider>
      </div>
    </div>
  );
}
