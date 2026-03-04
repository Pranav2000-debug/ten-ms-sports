import express from "express";
import cookieParser from "cookie-parser";
import http from "http";
import dotenv from "dotenv";

// Routes Imports
import matchRouter from "./routes/matches.routes.js";
import { attachWebSocketServer } from "./websocket/ws-server.js";

dotenv.config({ path: "./.env" });
const app = express();
const server = http.createServer(app)
const PORT = Number(process.env.PORT) || 8000;
const HOST = process.env.HOST || "0.0.0.0"



app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }))
app.use(cookieParser())

// Routes
app.use('/api/matches', matchRouter);

const { broadcastMatchCreated } = attachWebSocketServer(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated;

server.listen(PORT, HOST, () => {
  const BASE_URL = HOST === "0.0.0.0" ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;
  console.log(`Server runnin on ${BASE_URL}`);
  console.log(`Websocket server is running on ${BASE_URL.replace('http', 'ws')}/ws`)
});
