import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDb = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Database Connected Success");
    } catch (err) {
        console.error("Database Connection Error", err.message);
        process.exit(1);
    }
}


export default connectDb;