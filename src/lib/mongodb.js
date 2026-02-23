import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://Surya-749:02bBIHo06X5og4Tj@initialcluster.xjwtzh4.mongodb.net/init-db?retryWrites=true&w=majority";

if (!MONGO_URI) {
  throw new Error(
    "Please define the MONGO_URI environment variable in .env.local"
  );
}

// Cache connection across hot reloads in development
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, { bufferCommands: false });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
