import express, { Request, Response } from "express";
import cors from "cors";
import { Logger } from "tslog";
import { addUser, getUser, removeUser, getUsersInRoom, users } from "./users";
import * as http from "http";
import * as socketio from "socket.io";
import crypto from "crypto";

import "dotenv/config";
import { populateSet } from "./util/letters";
import { generateNumbersSolutions } from "./util/numbers";
import { notDeepEqual } from "assert";

const log: Logger = new Logger();

const app = express();
const port = process.env.PORT || 5000;

const server: http.Server = http.createServer(app);
const io: socketio.Server = new socketio.Server();
io.attach(server);

app.use(cors());
app.use(express.urlencoded({ extended: true }));

io.on("connection", (socket: socketio.Socket) => {
  console.log("connected");
  socket.on("createRoom", ({ username }: { username: string }) => {
    const room = generateRoomId();

    let user;
    if (username) {
      user = addUser(socket.id, username, room, true);
    }
    log.info(users);

    if (!user) {
      return;
    }
    socket.join(user.room);
  });
  socket.on(
    "joinRoom",
    ({ username, room }: { username: string; room: string }) => {
      const user = addUser(socket.id, username, room, false);
      log.info(users);
      if (!user) {
        return;
      }

      socket.join(user.room);
      socket.emit("message", `${user.id} joined room ${user.room}`);
      log.info(`${user.id} joined room ${user.room}`);

      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  );

  socket.on("chatMessage", ({ msg }: { msg: string }) => {
    const user = getUser(socket.id);
    if (user) {
      io.to(user.room).emit("message", `${user.username}: ${msg}`);
      log.info(`${user.username}: ${msg}`);
    }
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (!user) {
      return;
    }

    io.to(user.room).emit("message", `${user.username} has left the chat`);
    log.info(`${user.username} has left the chat`);
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
  });
});

app.get("/", (_: Request, res: Response) => {
  res.send("Hello");
});

app.get("/wordsolutionrequest/:chars", (req: Request, res: Response) => {
  if (req.params.chars.length > 9) {
    res.status(400).send("Letters too long");
  }
  const perms = populateSet(req.params.chars);
  res.send(perms);
});

app.get(
  "/numbersolutionrequest/:nums/:target",
  (req: Request, res: Response) => {
    if (req.params.nums == undefined || req.params.target == undefined) {
      res.status(400).send("Fuck you bastard");
    }
    const nums = req.params.nums.split(",").map((a) => parseInt(a));
    const target = parseInt(req.params.target);
    const solutions = generateNumbersSolutions(nums, target);

    res.send(solutions);
  }
);

server.listen(port, () => {
  log.info(`Server started at http://localhost:${port}`);
});

const generateRoomId = () => {
  return crypto.randomBytes(16).toString("base64");
};
