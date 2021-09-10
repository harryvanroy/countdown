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

io.on("connection", (socket: Socket) => {
  socket.on(
    "joinRoom",
    ({ username, room }: { username: string; room: string }) => {
      const user = userJoin(socket.id, username, room);

      socket.join(user.room);

      // Welcome current user
      socket.emit("message", "welcome");

      // Broadcast when a user connects
      socket.broadcast
        .to(user.room)
        .emit("message", `${user.username} has joined the chat`);

      // Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  );

  // Listen for chatMessage
  socket.on("chatMessage", (msg: string) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("message", user.username, msg);
  });

  // Runs when client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit("message", `${user.username} has left the chat`);

      // Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

app.get("/", (req: Request, res: Response) => {
  res.send("Server is up and running!");
});

app.listen(port, () => {
  log.info(`Server started at http://localhost:${port}`);
});
