import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("your_database_name"); // Replace with your database name

    const clients = await db.collection("clients").find({}).toArray();
    res.status(200).json({ clients });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch data from MongoDB" });
  }
}
