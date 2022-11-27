import mongoose from "mongoose";
import { MONGO_URL } from "./config.js";

const connectToMongoDB = () => {
  mongoose
    .connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("connection to mongodb succesfull");
    })
    .catch((e) => {
      console.log(e.message);
    });
};

export default connectToMongoDB;
