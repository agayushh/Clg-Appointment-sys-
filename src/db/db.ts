import mongoose from "mongoose";

export const connectToDb = async (): Promise<void> => {
  try {
    const connectionInstance = await mongoose.connect(
      process.env.MONGODB_URL as string
    );
    console.log(
      `database connected successfully ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log(`Error in connecting with database ${error}`);
    process.exit(1);
  }
};
