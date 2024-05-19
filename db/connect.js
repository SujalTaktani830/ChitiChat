import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (isConnected) {
    console.log("MongoDb is already connected");
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "ChitChat",
    });

    isConnected = true;

    console.log("Connected to Db!");
  } catch (error) {
    console.log("Error occured - ", error);
  }
};
