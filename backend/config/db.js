import mongoose from "mongoose";

const connectDb = async() => {
  try {
    mongoose.connect(process.env.MONGODB_URL)
    console.log("MongoDb connected.")
  } catch (error) {
    console.log("db error")
  }
}

export default connectDb;