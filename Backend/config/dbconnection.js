import mongoose from "mongoose";

export const dbConn = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'Medih'
    });

  } catch (error) {
    console.error("mongoDB connection failed", error);
  }
};