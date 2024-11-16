"use client";

export default function DeleteClientButton({ clientId }) {
  const handleDeleteClient = async () => {
    const confirmDelete = confirm("Are you sure you want to delete this client?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/delete-client?id=${clientId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Client deleted successfully!");
        window.location.href = "/"; // Redirect to the main page
      } else {
        const error = await response.json();
        alert(`Failed to delete client: ${error.message}`);
      }
    } catch (error) {
      console.error("Error deleting client:", error);
      alert("An error occurred while deleting the client.");
    }
  };

  return (
    <button
      onClick={handleDeleteClient}
      className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-700"
    >
      Delete Client
    </button>
  );
}
