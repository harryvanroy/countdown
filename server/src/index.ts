import express, { Request, Response } from "express";
import cors from "cors";
import { Logger } from "tslog";
import { addUser, getUser, removeUser, getUsersInRoom, users } from "./users";
import * as http from "http";
import * as socketio from "socket.io";

import "dotenv/config";

const log: Logger = new Logger();

const app = express();
const port = process.env.PORT || 5000;

const server: http.Server = http.createServer(app);
const io: socketio.Server = new socketio.Server();
io.attach(server);

app.use(cors());

io.on("connection", (socket: socketio.Socket) => {
  socket.on(
    "joinRoom",
    ({ username, room }: { username: string; room: string }) => {
      const user = addUser(socket.id, username, room);
      log.info(users);
      if (!user) {
        return;
      }

      socket.join(user.room);
      socket.emit("message", `${user.id} joined room ${user.room}`);
      log.info(`${user.id} joined room ${user.room}`);

      socket.broadcast
        .to(user.room)
        .emit("message", `${user.username} has joined the chat`);
      log.info(`${user.username} has joined the chat`);

      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  );

  socket.on("chatMessage", (msg: string) => {
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
  res.sendFile(__dirname + "/index.html");
});

server.listen(port, () => {
  log.info(`Server started at http://localhost:${port}`);
});
