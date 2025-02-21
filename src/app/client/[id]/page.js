"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardBody, CardHeader, Spinner } from "@nextui-org/react";

export default function ClientDetailsPage() {
  const { id } = useParams(); // Fix: Use useParams() instead of accessing params synchronously
  const [client, setClient] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setError("No client ID provided.");
      setLoading(false);
      return;
    }

    const fetchClient = async () => {
      try {
        const response = await fetch(`/api/get-client?id=${id}`);
        if (!response.ok) throw new Error("Failed to fetch client data.");

        const data = await response.json();
        setClient(data);
      } catch (err) {
        setError(err.message || "Failed to load client details.");
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-black">
        <Spinner size="lg" color="warning" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-black px-6">
        <Card className="w-full max-w-md shadow-lg border border-gray-300 rounded-xl p-6">
          <CardHeader className="text-xl font-semibold text-[#F25922] text-center border-b border-gray-200 pb-5 px-6">
            Error
          </CardHeader>
          <CardBody className="px-6 py-5">
            <p className="text-center text-gray-600">{error}</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-black px-6">
        <Card className="w-full max-w-md shadow-lg border border-gray-300 rounded-xl p-6">
          <CardHeader className="text-xl font-semibold text-[#F25922] text-center border-b border-gray-200 pb-5 px-6">
            Client Not Found
          </CardHeader>
          <CardBody className="px-6 py-5">
            <p className="text-center text-gray-600">
              The client you're looking for doesn't exist.
            </p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-10 px-4 sm:px-6">
      {/* Client Info Card */}
      <Card className="max-w-2xl w-full shadow-lg border border-gray-300 rounded-xl">
        <CardHeader className="text-2xl font-bold text-[#010326] text-center border-b border-gray-200 px-6 py-6">
          Welcome, {client.name}!
        </CardHeader>

        <CardBody className="p-6 space-y-6">
          <p className="text-lg text-[#010326] font-medium text-center leading-relaxed">
            We’re thrilled to have you here! Let's get started on achieving your goals.
          </p>

          {/* Responsive Grid for Client Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-black text-lg">
            <p>
              <span className="font-semibold text-[#0DA64F]">Age:</span> {client.age}
            </p>
            <p>
              <span className="font-semibold text-[#0DA64F]">Gender:</span> {client.gender}
            </p>
            <p>
              <span className="font-semibold text-[#0DA64F]">Weight:</span> {client.weight} kg
            </p>
            <p>
              <span className="font-semibold text-[#0DA64F]">Height:</span> {client.height} cm
            </p>
            <p>
              <span className="font-semibold text-[#0DA64F]">Experience:</span> {client.experience}
            </p>
            <p>
              <span className="font-semibold text-[#0DA64F]">Goal:</span> {client.goal}
            </p>
          </div>

          {/* Delete Button with Better Tap Area */}
          <div className="mt-6 flex justify-center">
            <button className="w-full sm:w-auto bg-[#F25922] text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-[#cc4a1a] transition-all text-lg">
              Delete Client
            </button>
          </div>
        </CardBody>
      </Card>
    </div>

  );
}
