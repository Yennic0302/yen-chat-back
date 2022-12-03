import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import morgan from "morgan";
import serverSockets from "./serverSocktes.js";
import connectToMongoDB from "./dbConnections.js";
import { PORT, FRONT_URL } from "./config.js";
import userAuthRoutes from "../routes/userAuthRoutes.js";
import messagesRoutes from "../routes/messageRoutes.js";
import searchUserRoutes from "../routes/searchUserRoutes.js";
import friendsUserRoutes from "../routes/friendsUserRoutes.js";
import chatsUserRoutes from "../routes/chatsUserRoutes.js";

import bodyParser from "body-parser";

connectToMongoDB();

const app = express();
const httpServer = http.createServer(app);

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ limit: "30mb" }));

app.use("/api/auth", userAuthRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/search", searchUserRoutes);
app.use("/api/friends", friendsUserRoutes);
app.use("/api/chat", chatsUserRoutes);

httpServer.listen(PORT);
console.log("server on port ", PORT);

const io = new Server(httpServer, {
  cors: {
    origin: FRONT_URL,
    credentials: true,
  },
});
serverSockets(io);
