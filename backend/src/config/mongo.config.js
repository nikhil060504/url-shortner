import mongoose from "mongoose";
console.log(process.env.MONGO_URI);
const connectDB = async () => {
  try {
    // console.log(process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (err) {
    console.log(`Error: ${err.message}`);
    process.exit(1);
  }
};
export default connectDB;
