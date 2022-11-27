import dotenv from "dotenv";

dotenv.config();

export const MONGO_URL = process.env.MONGO_URL;
export const PORT = process.env.PORT || 5000;
export const FRONT_URL = process.env.FRONT_URL || 3000;
