"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Card, CardBody, CardHeader, Spinner } from "@heroui/react";

export default function Home() {
  const [clients, setClients] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/clients");
      if (!response.ok) {
        throw new Error(`Failed to fetch clients. Status: ${response.status}`);
      }
      const data = await response.json();
      setClients(data);
    } catch (err) {
      console.error("Error fetching clients:", err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-[#010326]">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-[#010326]">
        <Card className="w-full max-w-md bg-white shadow-lg border border-gray-200 rounded-lg">
          <CardHeader className="text-xl text-center text-[#F25922] font-semibold">
            Error
          </CardHeader>
          <CardBody>
            <p className="text-center text-gray-600">{error}</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white flex flex-col items-center py-20">
      {/* Title Section */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold text-[#010326]">
          Meet Your Clients
        </h1>
        <p className="text-gray-500 text-lg mt-2">
          View and manage your clients in one place.
        </p>
      </div>

      {/* Clients Grid */}
      {clients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl w-full px-6">
          {clients.map((client) => (
            <Card
              key={client._id}
              className="bg-white text-[#010326] shadow-md rounded-xl transition-all duration-300 transform hover:scale-105 border border-gray-300"
            >
              <CardHeader className="p-6 border-b border-gray-300">
                <h2 className="text-2xl font-semibold">{client.name}</h2>
              </CardHeader>
              <CardBody className="p-6">
                <p className="text-sm text-gray-600 font-semibold">
                  Experience:{" "}
                  <span className="font-normal text-[#010326]">{client.experience}</span>
                </p>
                <p className="text-sm text-gray-600 font-semibold mb-4">
                  Goal:{" "}
                  <span className="font-normal text-[#010326]">{client.goal}</span>
                </p>
                <Link href={`/client/${client._id}`} className="w-full">
                  <Button
                    color="primary"
                    variant="solid"
                    className="w-full rounded-lg text-lg py-3 bg-[#F25922] text-white hover:bg-[#cc4a1a]"
                  >
                    View Details
                  </Button>
                </Link>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center text-lg mt-10">
          No clients found. Start adding clients!
        </p>
      )}
    </div>
  );
}
