import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id"); // Get client ID from query params

    if (!id) {
      return new Response(JSON.stringify({ error: "Client ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const client = await clientPromise;
    const db = client.db("your_database_name");
    const collection = db.collection("clients");

    // Fetch client and return tasks
    const clientData = await collection.findOne({ _id: new ObjectId(id) });

    if (!clientData) {
      return new Response(JSON.stringify({ error: "Client not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(clientData.tasks || []), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(request) {
  try {
    const { id, task, date, priority } = await request.json();

    if (!id || !task || !date || !priority) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const client = await clientPromise;
    const db = client.db("your_database_name");
    const collection = db.collection("clients");

    const clientObjectId = new ObjectId(id);

    // Add task to client's tasks array
    const updateResult = await collection.updateOne(
      { _id: clientObjectId },
      { $push: { tasks: { task, date, priority } } }
    );

    if (updateResult.modifiedCount === 0) {
      return new Response(JSON.stringify({ error: "Failed to add task" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ message: "Task added successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error adding task:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE(request) {
  try {
    const { id, task } = await request.json();

    if (!id || !task) {
      return new Response(JSON.stringify({ error: "Client ID and Task are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const client = await clientPromise;
    const db = client.db("your_database_name");
    const collection = db.collection("clients");

    const clientObjectId = new ObjectId(id);

    // Remove task from tasks array
    const updateResult = await collection.updateOne(
      { _id: clientObjectId },
      { $pull: { tasks: { task } } }
    );

    if (updateResult.modifiedCount === 0) {
      return new Response(JSON.stringify({ error: "Failed to delete task" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ message: "Task deleted successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
