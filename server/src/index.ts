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

const log: Logger = new Logger();

const app = express();
const port = process.env.PORT || 5000;

const server: http.Server = http.createServer(app);
const io: socketio.Server = new socketio.Server();
io.attach(server);

app.use(cors());
app.use(express.urlencoded({ extended: true }));

io.on("connection", (socket: socketio.Socket) => {
  console.log(`${socket.id} connected`);
  socket.on("createRoom", (data, callback) => {
    console.log("createRoom called");
    const room = generateRoomID();

    if (data.username) {
      const user = addUser(socket.id, data.username, room, true);
      if (user) {
        socket.join(user.roomID);
        callback({
          user,
        });
        return;
      }
    }
    callback({
      error: "Room not created",
    });
  });

  socket.on(
    "joinRoom",
    ({ username, room }: { username: string; room: string }) => {
      const user = addUser(socket.id, username, room, false);

      if (!user) {
        return;
      }

      socket.join(user.roomID);
      io.to(user.roomID).emit(
        "message",
        `${user.username} joined room ${user.roomID}`
      );
      log.info(`${user.username} joined room ${user.roomID}`);

      io.to(user.roomID).emit("roomUsers", {
        room: user.roomID,
        users: getUsersInRoom(user.roomID),
      });
    }
  );

  socket.on("chatMessage", ({ msg }: { msg: string }) => {
    const user = getUser(socket.id);
    if (user) {
      io.to(user.roomID).emit("message", `${user.username}: ${msg}`);
      log.info(`${user.username}: ${msg}`);
    }
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (!user) {
      return;
    }

    io.to(user.roomID).emit("message", `${user.username} has left the chat`);
    log.info(`${user.username} has left the chat`);
    io.to(user.roomID).emit("roomUsers", {
      room: user.roomID,
      users: getUsersInRoom(user.roomID),
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

const generateRoomID = () => {
  return crypto.randomBytes(16).toString("base64");
};
