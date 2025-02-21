import React from "react";
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
import DeleteClientButton from "../[id]/delete-client-button";
import { ClientProvider } from "../[id]/ClientContext";

export default async function ClientLayout({ children, params: rawParams }) {
  const params = await rawParams;
  const { id } = params;

  let client = null;

  try {
    const clientConnection = await clientPromise;
    const db = clientConnection.db("your_database_name");
    client = await db.collection("clients").findOne({ _id: new ObjectId(id) });
    client = { ...client, _id: client._id.toString() };
  } catch (error) {
    console.error("Error fetching client:", error);
  }

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-black px-6">
        <div className="max-w-md w-full bg-gray-100 shadow-lg rounded-lg p-6">
          <h1 className="text-2xl font-semibold text-center text-red-500">
            Error
          </h1>
          <p className="text-center text-gray-600 mt-4">
            Client not found. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Client Info */}
        <div className=" p-6 mb-6 ">
          <h1 className="text-3xl font-bold text-[#010326] mb-4">
            {client.name}'s Profile
          </h1>

          <div className="grid grid-cols-2 gap-6 text-black text-sm">
            <p>
              <span className="font-semibold text-[#D49123]">Age:</span>{" "}
              {client.age}
            </p>
            <p>
              <span className="font-semibold text-[#D49123]">Gender:</span>{" "}
              {client.gender}
            </p>
            <p>
              <span className="font-semibold text-[#D49123]">Weight:</span>{" "}
              {client.weight} kg
            </p>
            <p>
              <span className="font-semibold text-[#D49123]">Height:</span>{" "}
              {client.height} cm
            </p>
            <p>
              <span className="font-semibold text-[#D49123]">Experience:</span>{" "}
              {client.experience}
            </p>
            <p>
              <span className="font-semibold text-[#D49123]">Goal:</span>{" "}
              {client.goal}
            </p>
          </div>

          <div className="mt-6">
            <DeleteClientButton clientId={id} />
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="bg-gray-100 rounded-lg shadow p-4 mb-6">
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:flex lg:flex-wrap justify-center gap-3 text-sm font-semibold">
            {[
              { href: "training", label: "Training" },
              { href: "overview", label: "Overview" },
              { href: "edit-training", label: "Edit Training" },
              { href: "meal-plan", label: "Meal Plan" },
              { href: "edit-meal-plan", label: "Edit Meal Plan" },
              { href: "tasks", label: "Tasks" },
            ].map(({ href, label }) => (
              <li key={href} className="w-full sm:w-auto">
                <a
                  href={`/client/${id}/${href}`}
                  className="block w-full text-center bg-white text-[#07B0F2] border border-[#07B0F2] hover:bg-[#07B0F2] hover:text-white transition-all px-4 py-3 rounded-lg shadow-md"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>


        {/* Render Children */}
        <div className="bg-white">
          <ClientProvider value={client}>{children}</ClientProvider>
        </div>
      </div>
    </div>
  );
}
