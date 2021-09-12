import express, { Request, Response } from "express";
import cors from "cors";
import { Logger } from "tslog";
import {
  addUser,
  getUser,
  removeUser,
  getUsersInRoom,
  addRoom,
  getRoom,
  rooms,
} from "./users";
import * as http from "http";
import * as socketio from "socket.io";
import crypto from "crypto";

import "dotenv/config";
import { populateSet } from "./util/letters";
import { generateNumbersSolutions } from "./util/numbers";
import { sampleLetters } from "./util/sampleLetters";

import {
  ServerListenEvents,
  ServerEmitEvents,
  ServerSideEvents,
} from "./util/socket";

const log: Logger = new Logger();

const app = express();
const port = process.env.PORT || 5000;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const server: http.Server = http.createServer(app);
const io: socketio.Server = new socketio.Server();

io.attach(server);

app.use(cors());
app.use(express.urlencoded({ extended: true }));

io.on(
  "connection",
  (
    socket: socketio.Socket<
      ServerListenEvents,
      ServerEmitEvents,
      ServerSideEvents
    >
  ) => {
    socket.on("chatMessage", (message, callback) => {
      const user = getUser(socket.id);

      io.to(user.roomID).emit("chatMessage", {
        username: user.username,
        message,
      });
    });

    socket.on("createRoom", ({ username }, callback) => {
      const room = generateRoomID();

      if (username) {
        const user = addUser(socket.id, username, room, true);
        if (user) {
          socket.join(user.roomID);
          callback({
            user,
          });

          const room = {
            gameStarted: false,
            gameMode: null,
            solutions: null,
            selection: null,
            targetNum: null,
            leaderboard: {},
          };
          addRoom(user.roomID, room);

          io.to(user.roomID).emit("roomUsers", {
            users: getUsersInRoom(user.roomID),
          });

          return;
        }
      }

      callback({
        error: "Room not created",
      });
    });

    socket.on("guess", (guess, callback) => {
      const user = getUser(socket.id);
      const room = getRoom(user.roomID);

      if (room.gameMode == "letters") {
        if (
          guess.length <= 9 &&
          /^[a-zA-Z]+$/.test(guess) &&
          room.solutions?.includes(guess)
        ) {
          room.leaderboard[user.username] = {
            guess: guess,
            score: guess.length,
          };
        }
      } else if (room.gameMode == "numbers") {
        const answerSafe = guess.replace(/[^-()\d/*+.]/g, "");
        console.log(answerSafe);
        // eslint-disable-next-line no-useless-escape
        const numb = guess.match(/(\d[\d\.]*)/g)?.map((a) => parseInt(a));
        const selection = room.selection as number[];
        if (
          answerSafe &&
          room.targetNum &&
          numb !== undefined &&
          numb.every((val) => selection.includes(val))
        ) {
          room.leaderboard[user.username] = {
            guess: guess,
            score: Math.abs(eval(answerSafe) - room.targetNum),
          };

          io.to(user.roomID).emit("chatMessage", {
            username: "server",
            message: `${user.username}'s guess scores ${
              room.leaderboard[user.username]["score"]
            }`,
          });
        } else {
          callback({
            error: "Invalid expression",
          });
        }
      }
      // io.to(user.roomID).emit("chatMessage", {
      //   username: "server",
      //   message: `${user.username}'s guess scores ${room.leaderboard[user.username]["score"]}`,
      // });

      io.to(user.roomID).emit("userBestGuess", {
        username: user.username,
        guessLength: room.leaderboard[user.username]["score"]
      })
    });

    socket.on("joinRoom", ({ username, room }, callback) => {
      const user = addUser(socket.id, username, room, false);

      if (!user) {
        callback({
          error: "Couldn't join room.",
        });
        return;
      }

      socket.join(user.roomID);
      callback({
        user,
      });

      log.info(`${user.username} joined the lobby`);

      io.to(user.roomID).emit("roomUsers", {
        users: getUsersInRoom(user.roomID),
      });
    });

    socket.on("startGame", async (body, callback) => {
      const mode = body.mode;
      const time = body.time;
      const user = getUser(socket.id);
      if (!user || !user.isHost) {
        callback({
          error: "Invalid user: can't start game.",
        });
        return;
      }

      if (mode === "numbers") {
        const options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 25, 50, 75, 100];
        const selection = [];
        for (let i = 0; i < 6; i++) {
          selection.push(options[Math.floor(Math.random() * options.length)]);
        }

        const target = Math.floor(Math.random() * 1000);
        const solutions = generateNumbersSolutions(selection, target).slice(
          0,
          1
        );
        const room = getRoom(user.roomID);
        addRoom(user.roomID, {
          ...room,
          gameMode: "numbers",
          gameStarted: true,
          solutions,
          selection,
          targetNum: target,
        });

        io.to(user.roomID).emit("startGame", {
          mode,
          selection,
          target,
          solutions,
          time,
        });

        log.info(`${user.username} started a game.`);
      } else if (mode === "letters") {
        const selection = sampleLetters(3, 6);
        const solutions = populateSet(selection);

        const room = getRoom(user.roomID);
        addRoom(user.roomID, {
          ...room,
          gameMode: "letters",
          gameStarted: true,
          solutions,
          selection,
        });

        io.to(user.roomID).emit("startGame", {
          mode,
          selection: [...selection],
          solutions,
          time,
        });
        log.info(`${user.username} started a game.`);
      }

      await delay(parseInt(time) * 1000);

      const leaderboard = getRoom(user.roomID).leaderboard;
      io.to(user.roomID).emit("startPodium", {
        leaderboard,
      });
    });

    // socket.on("tickGuess", () => {

    // });

    socket.on("disconnect", () => {
      const user = removeUser(socket.id);
      if (!user) {
        return;
      }

      io.to(user.roomID).emit("message", `${user.username} has left the lobby`);
      log.info(`${user.username} has left the lobby`);
      io.to(user.roomID).emit("roomUsers", {
        users: getUsersInRoom(user.roomID),
      });
    });
  }
);

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
      res.status(400).send("Bad request");
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
  return crypto.randomBytes(8).toString("hex");
};
