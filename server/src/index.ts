import express, { Request, Response } from "express";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
import { Logger } from "tslog";
import { userJoin, getRoomUsers, getCurrentUser, userLeave } from "./users";
import "dotenv/config";

const log: Logger = new Logger();

const app = express();
const port = process.env.PORT || 5000;
const server = createServer(app);
const io = new Server(server);

app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Server is up and running!");
});

app.listen(port, () => {
  log.info(`Server started at http://localhost:${port}`);
});
