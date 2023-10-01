import config from "./config";
import mongoose from "mongoose";

async function connectDatabase() {
	try {
		await mongoose.connect(config.MONGO_URI);

		console.log("Connected to MongoDB");
	} catch (error) {
		console.error("Error connecting to MongoDB:", error);
		process.exit(1); // Exit the process if there's an error
	}
}

export default connectDatabase;
