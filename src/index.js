import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import morgan from "morgan";
import serverSockets from "./serverSocktes.js";
import connectToMongoDB from "./dbConnections.js";
import { PORT, FRONT_URL } from "./config.js";
import userAuthRoutes from "../routes/userAuthRoutes.js";
import messagesRoute from "../routes/messageRoutes.js";

connectToMongoDB();

const app = express();
const httpServer = http.createServer(app);

app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

app.use("/api/auth", userAuthRoutes);
app.use("/api/messages", messagesRoute);

httpServer.listen(PORT);
console.log("server on port ", PORT);

const io = new Server(httpServer, {
  cors: {
    origin: FRONT_URL,
    credentials: true,
  },
});
serverSockets(io);
