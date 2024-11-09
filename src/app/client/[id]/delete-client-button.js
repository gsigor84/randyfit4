"use client";

export default function DeleteClientButton({ clientId }) {
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this client?")) {
      return;
    }

    const response = await fetch(`/api/delete-client?id=${clientId}`, {
      method: "POST",
    });

    if (response.ok) {
      alert("Client deleted successfully!");
      window.location.href = "/"; // Redirect to main page
    } else {
      alert("Failed to delete the client.");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="text-red-500 hover:text-red-700"
      aria-label="Delete Client"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 9l-.867 10.142A2.25 2.25 0 0116.392 21H7.608a2.25 2.25 0 01-2.241-1.858L4.5 9m5.25 3v6m5.25-6v6M10.5 6.75V5.25a2.25 2.25 0 012.25-2.25h3a2.25 2.25 0 012.25 2.25v1.5M6 9h12"
        />
      </svg>
    </button>
  );
}
