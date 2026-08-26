import mongoose from "mongoose";

let connectionPromise: ReturnType<typeof mongoose.connect> | null = null;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) {
    throw new Error("Missing MONGODB_URL");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  connectionPromise ??= mongoose.connect(process.env.MONGODB_URL);

  try {
    return await connectionPromise;
  } catch (error) {
    connectionPromise = null;
    throw error;
  }
};


