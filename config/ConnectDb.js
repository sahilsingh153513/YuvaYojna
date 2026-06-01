import mongoose from "mongoose";

let cachedConnection = null;

const connectdb = async () => {
  const url = process.env.MONGODB_URI;

  if (!url) {
    throw new Error("MONGODB_URI is not set");
  }

  if (cachedConnection && [1, 2].includes(mongoose.connection.readyState)) {
    await cachedConnection;
    return cachedConnection;
  }

  cachedConnection = mongoose.connect(url, {
    serverSelectionTimeoutMS: 5000,
    bufferCommands: false,
  });

  try {
    await cachedConnection;
    console.log("Database connected");
    return cachedConnection;
  } catch (error) {
    cachedConnection = null;
    console.error("Database connection failed:", error.message);
    throw error;
  }
};

export default connectdb;
