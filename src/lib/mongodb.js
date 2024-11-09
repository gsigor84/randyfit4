import { MongoClient } from "mongodb";

// Get the MongoDB URI from the environment variables
const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Please add your Mongo URI to .env.local");
}

// Log MongoDB URI and environment for debugging (optional, remove for production)
console.log("MongoDB URI:", uri);
console.log("Running in environment:", process.env.VERCEL_ENV || process.env.NODE_ENV);

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // Use a global variable to preserve the MongoDB client across hot-reloads in development
  if (!global._mongoClientPromise) {
    const options = { connectTimeoutMS: 10000 }; // Set a timeout of 10 seconds
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, always create a new client with a timeout
  const options = { connectTimeoutMS: 10000 }; // Set a timeout of 10 seconds
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
